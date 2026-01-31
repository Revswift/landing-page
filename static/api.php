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
    $email = strtolower(trim($input['email'] ?? ''));
    $referred_by = trim($input['referred_by'] ?? '');
    
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
    
    $stmt = $conn->prepare("INSERT INTO waitlist (email, referral_code, referred_by, position) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("sssi", $email, $referral_code, $referred_by_value, $position);
    
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
            'referral_count' => 0
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Database error']);
    }
    
    $stmt->close();
}

$conn->close();
?>
