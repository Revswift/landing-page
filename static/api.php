<?php
session_start();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'config.php';

function rateLimitCheck() {
    $ip = $_SERVER['REMOTE_ADDR'];
    $key = "rate_limit_$ip";
    $limit = 5;
    $window = 60;
    
    if (!isset($_SESSION[$key])) {
        $_SESSION[$key] = ['count' => 0, 'start' => time()];
    }
    
    $data = $_SESSION[$key];
    
    if (time() - $data['start'] > $window) {
        $_SESSION[$key] = ['count' => 1, 'start' => time()];
        return true;
    }
    
    if ($data['count'] >= $limit) {
        return false;
    }
    
    $_SESSION[$key]['count']++;
    return true;
}

function validateCSRF($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

if (!rateLimitCheck()) {
    http_response_code(429);
    echo json_encode(['success' => false, 'message' => 'Too many requests. Please try again later.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? '';

if ($action === 'get_csrf') {
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    echo json_encode(['csrf_token' => $_SESSION['csrf_token']]);
    exit;
}

if ($action === 'admin_login') {
    $username = $input['username'] ?? '';
    $password = $input['password'] ?? '';
    
    // Check database first
    $stmt = $conn->prepare("SELECT id, username, password FROM admin_users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $authenticated = false;
    
    if ($result->num_rows === 1) {
        $admin = $result->fetch_assoc();
        if ($admin['password'] === $password) {
            $authenticated = true;
            $_SESSION['admin_username'] = $username;
        }
    } else if ($username === 'admin' && $password === 'revswift2024') {
        // Fallback to default credentials
        $authenticated = true;
        $_SESSION['admin_username'] = 'admin';
    }
    
    if ($authenticated) {
        $token = bin2hex(random_bytes(32));
        $_SESSION['admin_token'] = $token;
        $_SESSION['admin_authenticated'] = true;
        echo json_encode(['success' => true, 'token' => $token]);
        exit;
    }
    
    echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
    exit;
}

function verifyAdminToken($token) {
    return isset($_SESSION['admin_token']) && 
           isset($_SESSION['admin_authenticated']) && 
           $_SESSION['admin_authenticated'] === true &&
           hash_equals($_SESSION['admin_token'], $token);
}

if (in_array($action, ['admin_get_waitlist', 'admin_toggle_test', 'admin_change_password', 'admin_add_user'])) {
    $token = $input['token'] ?? '';
    if (!verifyAdminToken($token)) {
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        exit;
    }
    
    if ($action === 'admin_get_waitlist') {
        $result = $conn->query("SELECT * FROM waitlist ORDER BY position ASC");
        $waitlist = [];
        while ($row = $result->fetch_assoc()) {
            $waitlist[] = $row;
        }
        
        $total = count($waitlist);
        $test = count(array_filter($waitlist, fn($e) => isset($e['is_test']) && $e['is_test']));
        $real = $total - $test;
        
        $today = date('Y-m-d');
        $today_count = count(array_filter($waitlist, fn($e) => strpos($e['created_at'], $today) === 0));
        
        echo json_encode([
            'success' => true, 
            'waitlist' => $waitlist,
            'stats' => [
                'total' => $total,
                'real' => $real,
                'test' => $test,
                'today' => $today_count
            ]
        ]);
        exit;
    }
    
    if ($action === 'admin_toggle_test') {
        $id = intval($input['id'] ?? 0);
        $is_test = $input['is_test'] ? 1 : 0;
        
        $stmt = $conn->prepare("UPDATE waitlist SET is_test = ? WHERE id = ?");
        $stmt->bind_param("ii", $is_test, $id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Update failed']);
        }
        exit;
    }
    
    if ($action === 'admin_change_password') {
        $current_password = $input['current_password'] ?? '';
        $new_password = $input['new_password'] ?? '';
        $username = $_SESSION['admin_username'] ?? 'admin';
        
        if (strlen($new_password) < 8) {
            echo json_encode(['success' => false, 'message' => 'Password must be at least 8 characters']);
            exit;
        }
        
        // Check if user exists in database
        $stmt = $conn->prepare("SELECT id, password FROM admin_users WHERE username = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 1) {
            $admin = $result->fetch_assoc();
            if ($admin['password'] !== $current_password) {
                echo json_encode(['success' => false, 'message' => 'Current password is incorrect']);
                exit;
            }
            
            // Update password
            $update_stmt = $conn->prepare("UPDATE admin_users SET password = ? WHERE username = ?");
            $update_stmt->bind_param("ss", $new_password, $username);
            $update_stmt->execute();
        } else {
            // Default admin - verify and insert
            if ($current_password !== 'revswift2024') {
                echo json_encode(['success' => false, 'message' => 'Current password is incorrect']);
                exit;
            }
            
            $insert_stmt = $conn->prepare("INSERT INTO admin_users (username, password) VALUES (?, ?)");
            $insert_stmt->bind_param("ss", $username, $new_password);
            $insert_stmt->execute();
        }
        
        echo json_encode(['success' => true]);
        exit;
    }
    
    if ($action === 'admin_add_user') {
        $username = trim($input['username'] ?? '');
        $password = $input['password'] ?? '';
        
        if (empty($username) || strlen($password) < 8) {
            echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
            exit;
        }
        
        // Check if username exists
        $check_stmt = $conn->prepare("SELECT id FROM admin_users WHERE username = ?");
        $check_stmt->bind_param("s", $username);
        $check_stmt->execute();
        $result = $check_stmt->get_result();
        
        if ($result->num_rows > 0) {
            echo json_encode(['success' => false, 'message' => 'Username already exists']);
            exit;
        }
        
        // Insert new admin
        $stmt = $conn->prepare("INSERT INTO admin_users (username, password) VALUES (?, ?)");
        $stmt->bind_param("ss", $username, $password);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to add admin']);
        }
        exit;
    }
}

$csrf_token = $input['csrf_token'] ?? '';
if (!validateCSRF($csrf_token)) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Invalid security token']);
    exit;
}

function generateReferralCode() {
    return strtoupper(substr(md5(uniqid(rand(), true)), 0, 6));
}

function getNextPosition($conn) {
    $result = $conn->query("SELECT COALESCE(MAX(position), 2400) + 1 as next_pos FROM waitlist");
    $row = $result->fetch_assoc();
    return $row['next_pos'];
}

if ($action === 'join') {
    $first_name = trim($input['first_name'] ?? '');
    $last_name = trim($input['last_name'] ?? '');
    $email = strtolower(trim($input['email'] ?? ''));
    $job_title = trim($input['job_title'] ?? '');
    $phone_number = trim($input['phone_number'] ?? '');
    $country = trim($input['country'] ?? '');
    $referred_by = trim($input['referred_by'] ?? '');
    
    if (empty($first_name) || empty($last_name) || empty($job_title) || empty($phone_number) || empty($country)) {
        echo json_encode(['success' => false, 'message' => 'All fields are required']);
        exit;
    }
    
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Invalid email address']);
        exit;
    }
    
    if (!empty($referred_by) && !preg_match('/^[A-Z0-9]{6}$/', $referred_by)) {
        $referred_by = null;
    }
    
    $stmt = $conn->prepare("SELECT id FROM waitlist WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'This email is already registered']);
        exit;
    }
    
    $position = getNextPosition($conn);
    $referral_code = generateReferralCode();
    
    $referred_by_value = !empty($referred_by) ? $referred_by : null;
    
    $stmt = $conn->prepare("INSERT INTO waitlist (first_name, last_name, email, job_title, phone_number, country, referral_code, referred_by, position) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssssssi", $first_name, $last_name, $email, $job_title, $phone_number, $country, $referral_code, $referred_by_value, $position);
    
    if ($stmt->execute()) {
        if ($referred_by_value) {
            $update_stmt = $conn->prepare("UPDATE waitlist SET referral_count = referral_count + 1 WHERE referral_code = ?");
            $update_stmt->bind_param("s", $referred_by_value);
            $update_stmt->execute();
            $update_stmt->close();
        }
        
        echo json_encode([
            'success' => true,
            'position' => $position,
            'referral_code' => $referral_code,
            'referral_count' => 0,
            'first_name' => $first_name
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Database error']);
    }
    
    $stmt->close();
}

$conn->close();
?>
