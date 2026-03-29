# Contact Email 500 Error - Fix Guide

## Problem
Contact form submit karne pe **500 Internal Server Error** aa raha hai.

## Root Cause
Render pe email environment variables set nahi hain:
- `HOSTINGER_EMAIL`
- `HOSTINGER_PASSWORD`

Backend code email bhejne ki koshish kar raha hai but credentials nahi mil rahe.

## Solution - Render Environment Variables

### Step 1: Render Dashboard
1. Go to: https://dashboard.render.com
2. Login karo
3. **"boult-india-bakend-new"** service select karo

### Step 2: Add Environment Variables
1. Left sidebar mein **"Environment"** tab click karo
2. **"Add Environment Variable"** button click karo
3. Ye 2 variables add karo:

```
Variable 1:
Key: HOSTINGER_EMAIL
Value: orders@boultindia.com

Variable 2:
Key: HOSTINGER_PASSWORD
Value: Hrishi@123*
```

4. **"Save Changes"** button click karo

### Step 3: Wait for Redeploy
- Render automatically redeploy karega
- 2-3 minutes wait karo
- Backend restart hoga with new variables

### Step 4: Test Contact Form
1. Go to: https://boultindia.com/contact
2. Fill form:
   - Name: Test User
   - Email: test@example.com
   - Phone: 9876543210
   - Enquiry Type: General Inquiry
   - Subject: Test Message
   - Message: Testing contact form
3. Click "Send Message"
4. Should show success message
5. Check email: vtechmultisolutions@gmail.com

## What's Implemented

### Contact Form Features:
✅ Name, Email, Phone fields
✅ **Enquiry Type dropdown:**
   - General Inquiry
   - Enquiry for Distributorship
   - Contact for Orders Query
   - Technical Support
   - Bulk Orders
✅ Subject and Message
✅ Email sent to: vtechmultisolutions@gmail.com
✅ CC to: orders@boultindia.com
✅ Professional HTML email template
✅ Loading state while sending
✅ Success/Error messages

### Email Template Includes:
- 📧 Contact form submission header
- 👤 Name
- 📧 Email (clickable)
- 📱 Phone (clickable)
- 📋 Enquiry Type
- 📌 Subject
- 💬 Message
- 🕐 Timestamp

## Files Modified

### Backend:
- ✅ `boult-backend/services/emailService.js` - Added sendContactEmail function
- ✅ `boult-backend/server.js` - Added POST /api/contact endpoint

### Frontend:
- ✅ `boult-react-ecommerce/src/pages/Contact.tsx` - Added enquiry type & API integration
- ✅ `boult-react-ecommerce/src/services/api.ts` - Added sendContactEmail method

### Deployed:
- ✅ Backend pushed to GitHub (commit: 80d07b9)
- ✅ Render auto-deployed
- ✅ Ecommerce build ready: `ecommerce-WITH-CONTACT-EMAIL.zip`

## Current Status

### Backend:
- ✅ Code deployed on Render
- ❌ Environment variables NOT set (causing 500 error)
- ⏳ Waiting for you to add variables

### Frontend:
- ✅ Contact form updated with enquiry types
- ✅ API integration complete
- ✅ Build ready for upload

## After Adding Variables

### Expected Behavior:
1. User fills contact form
2. Clicks "Send Message"
3. Shows loading spinner
4. Backend sends email via Hostinger SMTP
5. Success message: "Message sent successfully!"
6. Email received at vtechmultisolutions@gmail.com

### Email Recipients:
- **To:** vtechmultisolutions@gmail.com
- **CC:** orders@boultindia.com
- **From:** orders@boultindia.com

## Troubleshooting

### If Still Getting 500 Error:
1. Check Render logs:
   - Go to Render dashboard
   - Click on service
   - Click "Logs" tab
   - Look for error messages

2. Verify variables are set:
   - Go to "Environment" tab
   - Check both variables are there
   - Values should match exactly

3. Check backend is running:
   - Visit: https://boult-india-bakend-new.onrender.com/
   - Should show: "Boult India Backend Running with MongoDB!"

### If Email Not Received:
1. Check spam folder
2. Verify Hostinger email credentials are correct
3. Check Render logs for email errors

## Next Steps

1. **Immediate:** Add environment variables on Render
2. **After variables added:** Test contact form
3. **If working:** Upload ecommerce build to Hostinger
4. **Then:** Implement Product Rating system (next feature)

---

**Status:** ⏳ WAITING FOR RENDER ENVIRONMENT VARIABLES

**Action Required:** Add HOSTINGER_EMAIL and HOSTINGER_PASSWORD on Render

**Build Ready:** `boult-react-ecommerce/ecommerce-WITH-CONTACT-EMAIL.zip`
