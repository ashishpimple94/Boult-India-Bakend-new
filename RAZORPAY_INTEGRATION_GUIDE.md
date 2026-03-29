# Razorpay Payment Integration - Complete Guide

## Overview
Integrated Razorpay payment gateway for Card, UPI, and Net Banking payments. Cash on Delivery (COD) remains as a non-payment option.

## Setup

### 1. Backend Configuration

**File:** `boult-backend/.env`
```
RAZORPAY_KEY_ID=rzp_live_S9KdjLbjrue2F0
RAZORPAY_KEY_SECRET=sKJSmRJ7peYBxdkYIebeyXaV
```

**Dependencies:** `boult-backend/package.json`
```json
{
  "razorpay": "^2.9.1",
  "crypto": "^1.0.1"
}
```

### 2. Frontend Configuration

**File:** `boult-react-ecommerce/src/pages/Checkout.tsx`
- Razorpay script loaded on component mount
- Payment handler integrated
- Signature verification

## Payment Flow

### Cash on Delivery (COD)
1. User selects COD
2. Fills checkout form
3. Clicks "Place Order"
4. Order saved with status: "pending"
5. Redirected to order confirmation

### Card/UPI/Net Banking
1. User selects payment method
2. Fills checkout form
3. Clicks "Place Order"
4. Backend creates Razorpay order
5. Razorpay checkout modal opens
6. User completes payment
7. Payment verified
8. Order saved with status: "paid"
9. Redirected to order confirmation

## Backend Endpoints

### 1. Create Razorpay Order
**POST** `/api/razorpay/create-order`

Request:
```json
{
  "amount": 1800,
  "orderId": "ORDER_1234567890",
  "customer": "John Doe"
}
```

Response:
```json
{
  "success": true,
  "order": {
    "id": "order_1234567890",
    "amount": 180000,
    "currency": "INR",
    "receipt": "ORDER_1234567890"
  }
}
```

### 2. Verify Payment
**POST** `/api/razorpay/verify-payment`

Request:
```json
{
  "razorpay_order_id": "order_1234567890",
  "razorpay_payment_id": "pay_1234567890",
  "razorpay_signature": "signature_hash"
}
```

Response:
```json
{
  "success": true,
  "message": "Payment verified successfully"
}
```

### 3. Get Payment Details
**GET** `/api/razorpay/payment/:paymentId`

Response:
```json
{
  "success": true,
  "payment": {
    "id": "pay_1234567890",
    "amount": 180000,
    "currency": "INR",
    "status": "captured",
    "method": "card"
  }
}
```

## Frontend Integration

### Razorpay Script
```javascript
useEffect(() => {
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.async = true;
  document.body.appendChild(script);
}, []);
```

### Payment Handler
```javascript
const options = {
  key: 'rzp_live_S9KdjLbjrue2F0',
  amount: Math.round(total * 100),
  currency: 'INR',
  name: 'Boult India',
  description: 'Order Payment',
  order_id: orderData.order.id,
  handler: async (response) => {
    // Verify and save order
  },
  prefill: {
    name: `${formData.firstName} ${formData.lastName}`,
    email: formData.email,
    contact: formData.phone,
  },
  theme: {
    color: '#ff6b35',
  },
};

const rzp = new window.Razorpay(options);
rzp.open();
```

## Payment Methods Supported

### 1. Credit/Debit Card
- Visa
- Mastercard
- American Express
- RuPay

### 2. UPI
- Google Pay
- PhonePe
- Paytm
- BHIM
- WhatsApp Pay

### 3. Net Banking
- All major Indian banks
- ICICI, HDFC, SBI, Axis, etc.

### 4. Cash on Delivery
- No payment required
- Order status: "pending"
- Payment collected at delivery

## Order Status

### After Payment
- **Card/UPI/Net Banking:** Status = "paid"
- **Cash on Delivery:** Status = "pending"

### Payment Details Stored
```json
{
  "id": "ORDER_1234567890",
  "paymentMethod": "card",
  "paymentId": "pay_1234567890",
  "status": "paid",
  "amount": 1800,
  "date": "2026-01-30T10:30:00Z"
}
```

## Security

### Signature Verification
```javascript
const body = razorpay_order_id + '|' + razorpay_payment_id;
const expectedSignature = crypto
  .createHmac('sha256', RAZORPAY_KEY_SECRET)
  .update(body.toString())
  .digest('hex');

if (expectedSignature === razorpay_signature) {
  // Payment is valid
}
```

### Best Practices
- ✓ Verify signature on backend
- ✓ Use HTTPS only
- ✓ Never expose secret key
- ✓ Validate amount on backend
- ✓ Store payment ID with order

## Testing

### Test Cards
- **Visa:** 4111 1111 1111 1111
- **Mastercard:** 5555 5555 5555 4444
- **Amex:** 3782 822463 10005

### Test UPI
- Any UPI ID works in test mode
- Example: test@razorpay

### Test Net Banking
- Select any bank
- Use test credentials

### Test Mode
- Use `rzp_test_*` keys for testing
- Switch to live keys for production

## Error Handling

### Payment Failed
```javascript
handler: (response) => {
  // Payment successful
},
modal: {
  ondismiss: () => {
    // User closed payment modal
    setError('Payment cancelled');
  }
}
```

### Verification Failed
```javascript
if (!verifyData.success) {
  setError('Payment verification failed');
  // Don't save order
}
```

## Admin Panel

### View Payment Details
- Order details modal shows payment method
- Payment ID stored with order
- Status shows "paid" or "pending"

### Invoice
- Shows payment method
- Shows payment status
- Includes order amount

## Troubleshooting

### Payment Modal Not Opening
- Check Razorpay script loaded
- Verify key ID is correct
- Check browser console for errors

### Signature Verification Failed
- Verify secret key is correct
- Check order ID format
- Verify payment ID format

### Order Not Saving
- Check backend is running
- Verify API endpoint
- Check network connection

## Configuration

### Change Theme Color
```javascript
theme: {
  color: '#ff6b35', // Orange for Boult
}
```

### Change Company Name
```javascript
name: 'Boult India',
description: 'Order Payment',
```

### Add Custom Notes
```javascript
notes: {
  orderId: orderId,
  customer: customer,
  customField: 'value'
}
```

## Production Checklist

- [ ] Update to live Razorpay keys
- [ ] Test with real payments
- [ ] Verify signature verification
- [ ] Test all payment methods
- [ ] Test error scenarios
- [ ] Monitor payment logs
- [ ] Set up webhooks (optional)
- [ ] Enable 3D Secure (optional)

## Webhooks (Optional)

For real-time payment updates:
```javascript
// Configure in Razorpay dashboard
POST /api/razorpay/webhook
{
  "event": "payment.authorized",
  "payload": {
    "payment": {
      "id": "pay_1234567890",
      "status": "captured"
    }
  }
}
```

## Support

- **Razorpay Docs:** https://razorpay.com/docs/
- **Test Credentials:** https://razorpay.com/docs/payments/test-mode/
- **Support:** support@razorpay.com

## Notes

- All amounts in INR
- Amounts converted to paise (multiply by 100)
- Payment ID stored for reference
- Order status updated after verification
- Invoice shows payment method
- Admin can view payment details
