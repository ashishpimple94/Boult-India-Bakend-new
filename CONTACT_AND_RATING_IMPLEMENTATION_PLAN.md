# Contact Us Email & Product Rating Implementation Plan

## Features to Implement

### 1. Contact Us Email System ✉️
**Requirements:**
- Send email when someone submits contact form
- Add enquiry type dropdown:
  - "Enquiry for Distributorship"
  - "Contact for Orders Query"
  - "General Inquiry"
  - "Technical Support"
  - "Bulk Orders"

**Email Details:**
- To: vtechmultisolutions@gmail.com
- From: contact@boultindia.com (or orders@boultindia.com)
- Subject: [Enquiry Type] - Contact Form Submission
- Content: Name, Email, Phone, Subject, Message, Enquiry Type

### 2. Product Rating System ⭐
**Requirements:**
- Customers can rate products (1-5 stars)
- Show average rating on product cards
- Show rating count
- Store ratings in MongoDB
- Display ratings on product detail page

## Implementation Steps

### Backend Changes:

#### 1. Contact Email API
```javascript
// POST /api/contact
// Send email using Hostinger SMTP
```

#### 2. Rating Schema & API
```javascript
// Rating Schema
{
  productId: String,
  userId: String (optional),
  rating: Number (1-5),
  review: String (optional),
  userName: String,
  date: Date
}

// POST /api/ratings - Add rating
// GET /api/ratings/:productId - Get product ratings
```

### Frontend Changes:

#### 1. Contact Page
- Add "Enquiry Type" dropdown
- Connect to backend API
- Show success/error messages
- Send email on form submit

#### 2. Product Rating Component
- Star rating input
- Show average rating
- Rating count display
- Submit rating functionality

#### 3. Product Cards
- Show star rating
- Show rating count
- Click to see reviews

## Files to Modify/Create

### Backend:
1. `boult-backend/models/Rating.js` (NEW)
2. `boult-backend/services/emailService.js` (UPDATE - add contact email)
3. `boult-backend/server.js` (UPDATE - add contact & rating APIs)

### Frontend:
1. `boult-react-ecommerce/src/pages/Contact.tsx` (UPDATE)
2. `boult-react-ecommerce/src/components/ProductRating.tsx` (NEW)
3. `boult-react-ecommerce/src/pages/ProductDetail.tsx` (UPDATE)
4. `boult-react-ecommerce/src/pages/Products.tsx` (UPDATE)
5. `boult-react-ecommerce/src/pages/Home.tsx` (UPDATE)
6. `boult-react-ecommerce/src/services/api.ts` (UPDATE)

## Priority Implementation

Due to message length constraints, I'll implement in this order:
1. Contact Us Email (simpler, immediate value)
2. Product Rating System (more complex)

Let me start with Contact Us Email first, then Product Rating.
