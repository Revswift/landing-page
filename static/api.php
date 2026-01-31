<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'config.php';

$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? '';

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
    $referred_by = $input['referred_by'] ?? null;
    
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Invalid email address']);
        exit;
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
    
    $stmt = $conn->prepare("INSERT INTO waitlist (email, referral_code, referred_by, position) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("sssi", $email, $referral_code, $referred_by, $position);
    
    if ($stmt->execute()) {
        if ($referred_by) {
            $conn->query("UPDATE waitlist SET referral_count = referral_count + 1 WHERE referral_code = '$referred_by'");
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
