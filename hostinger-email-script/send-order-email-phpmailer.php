<?php
// Hostinger Email Script with PHPMailer
// Upload to: public_html/send-order-email.php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit();
}

// Get POST data
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Validate
if (!isset($data['orderId']) || !isset($data['customerEmail']) || !isset($data['customerName'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    exit();
}

$orderId = $data['orderId'];
$customerEmail = $data['customerEmail'];
$customerName = $data['customerName'];
$amount = $data['amount'] ?? 0;
$items = $data['items'] ?? [];
$address = $data['address'] ?? '';
$city = $data['city'] ?? '';
$state = $data['state'] ?? '';
$pincode = $data['pincode'] ?? '';
$phone = $data['phone'] ?? '';

// Build items HTML
$itemsHTML = '';
foreach ($items as $item) {
    $itemName = htmlspecialchars($item['name'] ?? '');
    $itemVariant = htmlspecialchars($item['variant'] ?? 'Default');
    $itemQty = $item['quantity'] ?? 1;
    $itemPrice = number_format($item['price'] ?? 0, 2);
    $itemTotal = number_format(($item['price'] ?? 0) * $itemQty, 2);
    
    $itemsHTML .= "<tr>
        <td style='padding: 10px; border-bottom: 1px solid #eee;'>
            <strong>{$itemName}</strong><br>
            <small style='color: #666;'>Variant: {$itemVariant}</small>
        </td>
        <td style='padding: 10px; border-bottom: 1px solid #eee; text-align: center;'>{$itemQty}</td>
        <td style='padding: 10px; border-bottom: 1px solid #eee; text-align: right;'>₹{$itemPrice}</td>
        <td style='padding: 10px; border-bottom: 1px solid #eee; text-align: right;'><strong>₹{$itemTotal}</strong></td>
    </tr>";
}

$formattedAmount = number_format($amount, 2);

// Email HTML
$emailHTML = "
<!DOCTYPE html>
<html>
<head><meta charset='UTF-8'></head>
<body style='margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;'>
    <table width='100%' cellpadding='0' cellspacing='0' style='background-color: #f5f5f5; padding: 20px;'>
        <tr><td align='center'>
            <table width='600' cellpadding='0' cellspacing='0' style='background-color: #ffffff; border-radius: 10px;'>
                <tr>
                    <td style='background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;'>
                        <h1 style='color: #ffffff; margin: 0; font-size: 28px;'>Order Confirmed! 🎉</h1>
                        <p style='color: #ffffff; margin: 10px 0 0 0;'>Thank you for your order</p>
                    </td>
                </tr>
                <tr>
                    <td style='padding: 30px;'>
                        <p style='font-size: 16px; color: #333; margin: 0 0 20px 0;'>Hi <strong>{$customerName}</strong>,</p>
                        <p style='font-size: 14px; color: #666; margin: 0 0 20px 0;'>Your order has been successfully placed.</p>
                        
                        <table width='100%' cellpadding='10' style='background-color: #f9f9f9; border-radius: 8px; margin-bottom: 20px;'>
                            <tr>
                                <td style='padding: 15px;'>
                                    <p style='margin: 0; color: #666; font-size: 12px;'>ORDER ID</p>
                                    <p style='margin: 5px 0 0 0; color: #333; font-size: 18px; font-weight: bold;'>{$orderId}</p>
                                </td>
                                <td style='padding: 15px; text-align: right;'>
                                    <p style='margin: 0; color: #666; font-size: 12px;'>TOTAL AMOUNT</p>
                                    <p style='margin: 5px 0 0 0; color: #ff6b35; font-size: 24px; font-weight: bold;'>₹{$formattedAmount}</p>
                                </td>
                            </tr>
                        </table>

                        <h3 style='color: #333; margin: 30px 0 15px 0;'>Order Items</h3>
                        <table width='100%' cellpadding='0' cellspacing='0' style='border: 1px solid #eee;'>
                            <thead>
                                <tr style='background-color: #f9f9f9;'>
                                    <th style='padding: 12px; text-align: left; font-size: 12px;'>PRODUCT</th>
                                    <th style='padding: 12px; text-align: center; font-size: 12px;'>QTY</th>
                                    <th style='padding: 12px; text-align: right; font-size: 12px;'>PRICE</th>
                                    <th style='padding: 12px; text-align: right; font-size: 12px;'>TOTAL</th>
                                </tr>
                            </thead>
                            <tbody>{$itemsHTML}</tbody>
                        </table>

                        <h3 style='color: #333; margin: 30px 0 15px 0;'>Delivery Address</h3>
                        <div style='background-color: #f9f9f9; padding: 15px; border-radius: 8px; border-left: 4px solid #ff6b35;'>
                            <p style='margin: 0; color: #333; font-size: 14px; line-height: 1.6;'>
                                <strong>{$customerName}</strong><br>
                                {$address}<br>
                                {$city}, {$state} - {$pincode}<br>
                                Phone: {$phone}
                            </p>
                        </div>

                        <div style='margin-top: 30px; text-align: center;'>
                            <a href='https://boultindia.com/track-order' style='display: inline-block; background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%); color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-right: 10px;'>Track Order</a>
                            <a href='https://boultindia.com/order-confirmation?orderId={$orderId}' style='display: inline-block; background-color: #333; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;'>Download Invoice</a>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td style='background-color: #f9f9f9; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;'>
                        <p style='margin: 0; color: #999; font-size: 12px;'>© 2024 Boult India. All rights reserved.</p>
                    </td>
                </tr>
            </table>
        </td></tr>
    </table>
</body>
</html>
";

// Try PHPMailer first (if available)
if (file_exists('/usr/share/php/libphp-phpmailer/PHPMailerAutoload.php')) {
    require '/usr/share/php/libphp-phpmailer/PHPMailerAutoload.php';
    
    try {
        $mail = new PHPMailer(true);
        
        // SMTP Configuration
        $mail->isSMTP();
        $mail->Host = 'mail.hostinger.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'orders@boultindia.com';
        $mail->Password = 'Hrishi@123*';
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;
        
        // Email settings
        $mail->setFrom('orders@boultindia.com', 'Boult India Orders');
        $mail->addAddress($customerEmail, $customerName);
        $mail->addCC('vtechmultisolutions@gmail.com');
        $mail->addReplyTo('orders@boultindia.com', 'Boult India');
        
        // Content
        $mail->isHTML(true);
        $mail->Subject = "Order Confirmation - {$orderId} | Boult India";
        $mail->Body = $emailHTML;
        $mail->CharSet = 'UTF-8';
        
        // Send
        $mail->send();
        
        echo json_encode([
            'success' => true,
            'message' => 'Email sent successfully via PHPMailer',
            'orderId' => $orderId,
            'method' => 'PHPMailer'
        ]);
        exit();
        
    } catch (Exception $e) {
        // PHPMailer failed, try regular mail()
    }
}

// Fallback to regular mail() function
$to = $customerEmail;
$subject = "Order Confirmation - {$orderId} | Boult India";
$headers = "From: Boult India Orders <orders@boultindia.com>\r\n";
$headers .= "Reply-To: orders@boultindia.com\r\n";
$headers .= "Cc: vtechmultisolutions@gmail.com\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";

$sent = @mail($to, $subject, $emailHTML, $headers);

if ($sent) {
    echo json_encode([
        'success' => true,
        'message' => 'Email sent successfully via mail()',
        'orderId' => $orderId,
        'method' => 'mail()'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to send email. Please contact support.',
        'debug' => [
            'orderId' => $orderId,
            'phpmailer' => file_exists('/usr/share/php/libphp-phpmailer/PHPMailerAutoload.php') ? 'available' : 'not found',
            'mail_function' => function_exists('mail') ? 'available' : 'not found'
        ]
    ]);
}
?>
