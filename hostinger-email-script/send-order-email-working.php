<?php
// Hostinger Email Script - Working Version
// Upload to: public_html/send-order-email.php

error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

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

// Simple email HTML (no complex styling that might break)
$emailHTML = "
<html>
<body style='font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;'>
    <div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden;'>
        <div style='background-color: #ff6b35; padding: 30px; text-align: center;'>
            <h1 style='color: #ffffff; margin: 0;'>Order Confirmed!</h1>
            <p style='color: #ffffff; margin: 10px 0 0 0;'>Thank you for your order</p>
        </div>
        
        <div style='padding: 30px;'>
            <p>Hi <strong>{$customerName}</strong>,</p>
            <p>Your order has been successfully placed.</p>
            
            <div style='background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;'>
                <p style='margin: 0;'><strong>Order ID:</strong> {$orderId}</p>
                <p style='margin: 10px 0 0 0;'><strong>Total Amount:</strong> <span style='color: #ff6b35; font-size: 20px;'>₹{$formattedAmount}</span></p>
            </div>

            <h3>Order Items</h3>
            <table width='100%' cellpadding='10' style='border: 1px solid #eee;'>
                <thead>
                    <tr style='background-color: #f9f9f9;'>
                        <th style='text-align: left;'>Product</th>
                        <th style='text-align: center;'>Qty</th>
                        <th style='text-align: right;'>Price</th>
                        <th style='text-align: right;'>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {$itemsHTML}
                </tbody>
            </table>

            <h3>Delivery Address</h3>
            <div style='background-color: #f9f9f9; padding: 15px; border-radius: 8px; border-left: 4px solid #ff6b35;'>
                <p style='margin: 0; line-height: 1.6;'>
                    <strong>{$customerName}</strong><br>
                    {$address}<br>
                    {$city}, {$state} - {$pincode}<br>
                    Phone: {$phone}
                </p>
            </div>

            <div style='margin-top: 30px; text-align: center;'>
                <a href='https://boultindia.com/track-order' style='display: inline-block; background-color: #ff6b35; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-right: 10px;'>Track Order</a>
                <a href='https://boultindia.com/order-confirmation?orderId={$orderId}' style='display: inline-block; background-color: #333; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px;'>Download Invoice</a>
            </div>
        </div>
        
        <div style='background-color: #f9f9f9; padding: 20px; text-align: center;'>
            <p style='margin: 0; color: #999; font-size: 12px;'>© 2024 Boult India. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
";

// Email settings
$to = $customerEmail;
$subject = "Order Confirmation - {$orderId} | Boult India";

// Headers - Simple and compatible
$headers = array();
$headers[] = "From: Boult India <orders@boultindia.com>";
$headers[] = "Reply-To: orders@boultindia.com";
$headers[] = "Cc: vtechmultisolutions@gmail.com";
$headers[] = "MIME-Version: 1.0";
$headers[] = "Content-Type: text/html; charset=UTF-8";

// Try to send
$sent = @mail($to, $subject, $emailHTML, implode("\r\n", $headers));

if ($sent) {
    echo json_encode([
        'success' => true,
        'message' => 'Email sent successfully',
        'orderId' => $orderId,
        'sentTo' => $to
    ]);
} else {
    // Get error details
    $error = error_get_last();
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to send email',
        'debug' => [
            'to' => $to,
            'orderId' => $orderId,
            'phpVersion' => phpversion(),
            'mailFunction' => function_exists('mail') ? 'exists' : 'missing',
            'lastError' => $error ? $error['message'] : 'No error details'
        ]
    ]);
}
?>
