<?php
header('Content-Type: application/json');

$clientName = filter_var($_POST['clientName'], FILTER_SANITIZE_STRING);
$phone = filter_var($_POST['phone'], FILTER_SANITIZE_STRING);
$email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
$order = $_POST['order'];
$total = number_format($_POST['total'], 2);

$to = 'm0504471533@gmail.com';
$subject = 'New Order from Restaurant Menu';

$message = "New order received:\n\n";
$message .= "Customer Details:\n";
$message .= "Name: $clientName\n";
$message .= "Phone: $phone\n";
$message .= "Email: $email\n\n";
$message .= "Order Details:\n";
$message .= $order;
$message .= "\n\nTotal: $$total";

$headers = "From: $email\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

try {
    $mailSent = mail($to, $subject, $message, $headers);
    
    if ($mailSent) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to send email']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?> 