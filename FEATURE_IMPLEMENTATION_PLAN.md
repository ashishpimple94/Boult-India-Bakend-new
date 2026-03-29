# Feature Implementation Plan

## Features to Implement

### 1. ✅ Guest Checkout
- Allow customers to checkout without creating an account
- Add "Continue as Guest" option on checkout page
- Store guest orders with email for tracking

### 2. ✅ Shipment Tracking
- Add tracking number field in admin panel
- Create shipment details page for customers
- Show shipment status timeline

### 3. ✅ Order Cancellation
- Add cancellation option with timeline restrictions
- Allow cancellation before shipment
- Add cancellation reason field

### 4. ✅ Enquiry Forms
- Distributor enquiry form
- Marketing agency enquiry form
- Logistics enquiry form
- General contact form (already exists)

### 5. ✅ Order Confirmation SMS
- SMS notification to customer on order placement
- SMS notification to admin on new order
- (Email notifications skipped as requested)

### 6. ✅ Review Platform
- Product review form
- Star rating system
- Display reviews on product pages

### 7. ✅ Mobile Notification to Admin
- SMS alert to admin on new order
- Push notification system

### 8. ✅ Distributor Ordering
- Special distributor portal
- Bulk order placement
- Distributor pricing

### 9. ✅ Discount/Offer Section
- Promotional banner on homepage
- Discount codes at checkout
- Special offers display

### 10. ✅ WhatsApp Icon
- Floating WhatsApp button
- Direct chat link

### 11. ✅ E-commerce Platform Links
- Amazon, Flipkart, Meesho links
- Platform icons in footer

## Implementation Order

1. WhatsApp Icon (Quick win)
2. E-commerce Platform Links (Quick win)
3. Discount/Offer Section
4. Guest Checkout
5. Enquiry Forms
6. Review Platform
7. Shipment Tracking
8. Order Cancellation
9. SMS Notifications
10. Distributor Portal

## Files to Create/Modify

### New Components
- `WhatsAppButton.tsx` - Floating WhatsApp button
- `DiscountBanner.tsx` - Promotional banner
- `EnquiryForm.tsx` - Multi-purpose enquiry form
- `ReviewForm.tsx` - Product review form
- `ReviewList.tsx` - Display reviews
- `ShipmentTracking.tsx` - Track order shipment
- `OrderCancellation.tsx` - Cancel order interface
- `DistributorPortal.tsx` - Distributor ordering

### Modified Components
- `Footer.tsx` - Add e-commerce platform links
- `Checkout.tsx` - Add guest checkout option
- `ProductDetail.tsx` - Add review section
- `Home.tsx` - Add discount banner
- `Account.tsx` - Add order tracking and cancellation

### Backend Updates
- Add enquiry endpoints
- Add review endpoints
- Add SMS notification integration
- Add shipment tracking endpoints
- Add cancellation endpoints
