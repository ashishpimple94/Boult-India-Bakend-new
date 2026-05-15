const nodemailer = require('nodemailer');

const SITE_URL = 'https://boultindia.com';
const LOGO_URL = `${SITE_URL}/logos/logo1.png`;
const SUPPORT_EMAIL = 'support@boultindia.com';
const ADMIN_CC = 'vtechmultisolutions@gmail.com';

function escapeHtml(value) {
  if (value === undefined || value === null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const createTransporter = () => {
  const hasGmailCredentials =
    process.env.GMAIL_USER &&
    process.env.GMAIL_APP_PASSWORD &&
    process.env.GMAIL_USER.trim() !== '' &&
    process.env.GMAIL_APP_PASSWORD.trim() !== '';

  if (hasGmailCredentials) {
    console.log('📧 Using Gmail SMTP');
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }

  const hasHostingerCredentials =
    process.env.HOSTINGER_EMAIL &&
    process.env.HOSTINGER_PASSWORD &&
    process.env.HOSTINGER_EMAIL.trim() !== '' &&
    process.env.HOSTINGER_PASSWORD.trim() !== '';

  if (!hasHostingerCredentials) {
    throw new Error(
      'No email credentials configured. Please set either Gmail or Hostinger SMTP credentials in .env file'
    );
  }

  console.log('📧 Using Hostinger SMTP');
  return nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.HOSTINGER_EMAIL,
      pass: process.env.HOSTINGER_PASSWORD,
    },
  });
};

function buildOrderItemsRows(items, accentHex = '#4f46e5') {
  if (!items || !items.length) {
    return `<tr><td colspan="4" style="padding:20px;text-align:center;color:#64748b;font-size:14px;">No line items</td></tr>`;
  }
  let html = '';
  items.forEach((item, index) => {
    const itemName = escapeHtml(item.name || '');
    const itemVariant = escapeHtml(item.variant || 'Default');
    const itemQty = item.quantity || 1;
    const itemPrice = (item.price || 0).toFixed(2);
    const itemTotal = ((item.price || 0) * itemQty).toFixed(2);
    const bg = index % 2 === 0 ? '#ffffff' : '#f8fafc';
    html += `
        <tr style="background-color:${bg};">
          <td style="padding:14px 14px;border-bottom:1px solid #e2e8f0;">
            <strong style="color:#0f172a;font-size:14px;">${itemName}</strong><br>
            <span style="color:#64748b;font-size:12px;">Variant</span>
            <span style="display:inline-block;margin-top:4px;padding:2px 10px;background:#eef2ff;color:#3730a3;border-radius:6px;font-size:11px;font-weight:600;">${itemVariant}</span>
          </td>
          <td style="padding:14px 14px;border-bottom:1px solid #e2e8f0;text-align:center;color:#0f172a;font-weight:600;font-size:14px;">${itemQty}</td>
          <td style="padding:14px 14px;border-bottom:1px solid #e2e8f0;text-align:right;color:#64748b;font-size:14px;">₹${itemPrice}</td>
          <td style="padding:14px 14px;border-bottom:1px solid #e2e8f0;text-align:right;color:${accentHex};font-weight:700;font-size:15px;">₹${itemTotal}</td>
        </tr>`;
  });
  return html;
}

function emailDocumentWrapper(preheader, innerTableRows) {
  const safePre = escapeHtml(preheader);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${safePre}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 40px rgba(15,23,42,0.08);border:1px solid #e2e8f0;">
          ${innerTableRows}
        </table>
        <p style="font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:11px;color:#94a3b8;margin:16px 0 0 0;max-width:600px;">
          Boult India · ${SITE_URL.replace('https://', '')}
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function blockHeaderGradient(title, subtitle, badgeHtml = '') {
  const t = escapeHtml(title);
  const s = escapeHtml(subtitle);
  return `
          <tr>
            <td style="background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 45%,#c026d3 100%);padding:36px 28px;text-align:center;">
              <img src="${LOGO_URL}" alt="Boult India" width="140" height="auto" style="height:56px;width:auto;margin:0 auto 20px auto;display:block;border:0;background:#ffffff;border-radius:8px;padding:6px 10px;" />
              ${badgeHtml}
              <h1 style="margin:0;color:#ffffff;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:26px;font-weight:700;letter-spacing:-0.02em;line-height:1.25;">${t}</h1>
              <p style="margin:12px 0 0 0;color:rgba(255,255,255,0.92);font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:15px;line-height:1.5;">${s}</p>
            </td>
          </tr>`;
}

function blockGreeting(leadHtml) {
  return `
          <tr>
            <td style="padding:28px 28px 8px 28px;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
              ${leadHtml}
            </td>
          </tr>`;
}

function blockOrderSummaryCard(orderId, labelRight, valueRight, accentBorder = '#4f46e5') {
  return `
          <tr>
            <td style="padding:8px 28px 20px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(180deg,#f8fafc 0%,#f1f5f9 100%);border-radius:12px;border:1px solid #e2e8f0;border-left:4px solid ${accentBorder};">
                <tr>
                  <td style="padding:20px 22px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="vertical-align:top;width:50%;">
                          <p style="margin:0;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;font-weight:700;">Order reference</p>
                          <p style="margin:6px 0 0 0;color:#0f172a;font-size:18px;font-weight:700;font-family:ui-monospace,monospace;">#${escapeHtml(orderId)}</p>
                        </td>
                        <td style="vertical-align:top;width:50%;text-align:right;">
                          <p style="margin:0;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;font-weight:700;">${escapeHtml(labelRight)}</p>
                          <p style="margin:6px 0 0 0;color:${accentBorder};font-size:26px;font-weight:800;letter-spacing:-0.02em;">${valueRight}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`;
}

function blockSectionTitle(text, accent = '#4f46e5') {
  return escapeHtml(text);
}

function blockItemsTable(itemsHTML) {
  return `
          <tr>
            <td style="padding:0 28px 24px 28px;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
              <p style="margin:0 0 12px 0;color:#0f172a;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;border-bottom:2px solid #e0e7ff;padding-bottom:8px;">${blockSectionTitle('Order items')}</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
                <thead>
                  <tr style="background:linear-gradient(135deg,#312e81 0%,#4c1d95 100%);">
                    <th style="padding:12px 14px;text-align:left;font-size:11px;color:#e0e7ff;text-transform:uppercase;letter-spacing:0.06em;font-weight:700;">Product</th>
                    <th style="padding:12px 14px;text-align:center;font-size:11px;color:#e0e7ff;text-transform:uppercase;letter-spacing:0.06em;font-weight:700;">Qty</th>
                    <th style="padding:12px 14px;text-align:right;font-size:11px;color:#e0e7ff;text-transform:uppercase;letter-spacing:0.06em;font-weight:700;">Price</th>
                    <th style="padding:12px 14px;text-align:right;font-size:11px;color:#e0e7ff;text-transform:uppercase;letter-spacing:0.06em;font-weight:700;">Total</th>
                  </tr>
                </thead>
                <tbody>${itemsHTML}</tbody>
              </table>
            </td>
          </tr>`;
}

function blockDeliveryAddress(customer, address, city, state, pincode, phone) {
  return `
          <tr>
            <td style="padding:0 28px 24px 28px;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
              <p style="margin:0 0 12px 0;color:#0f172a;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;border-bottom:2px solid #e0e7ff;padding-bottom:8px;">${blockSectionTitle('Delivery address')}</p>
              <div style="background:linear-gradient(135deg,#eff6ff 0%,#f8fafc 100%);padding:20px 22px;border-radius:12px;border:1px solid #bfdbfe;border-left:4px solid #3b82f6;">
                <p style="margin:0;color:#0f172a;font-size:15px;line-height:1.7;">
                  <strong style="color:#1d4ed8;">${escapeHtml(customer)}</strong><br>
                  ${escapeHtml(address)}<br>
                  ${escapeHtml(city)}, ${escapeHtml(state)} — ${escapeHtml(pincode)}<br>
                  <span style="color:#64748b;font-size:14px;">Phone</span> <strong>${escapeHtml(phone)}</strong>
                </p>
              </div>
            </td>
          </tr>`;
}

function blockNoticeShippingPending() {
  return `
          <tr>
            <td style="padding:0 28px 24px 28px;">
              <div style="background:#fffbeb;border:1px solid #fcd34d;border-left:4px solid #f59e0b;border-radius:12px;padding:18px 20px;">
                <p style="margin:0;color:#78350f;font-size:14px;line-height:1.6;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
                  <strong style="display:block;margin-bottom:6px;font-size:15px;">Shipping charges</strong>
                  Final delivery charges may be added based on your location. You will receive an updated invoice by email once your order is verified.
                </p>
              </div>
            </td>
          </tr>`;
}

function blockDualCtas(trackUrl, accountUrl, primaryLabel, secondaryLabel) {
  return `
          <tr>
            <td style="padding:0 28px 28px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:6px;width:50%;vertical-align:top;">
                    <a href="${trackUrl}" style="display:block;text-align:center;background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%);color:#ffffff !important;padding:14px 16px;text-decoration:none;border-radius:10px;font-weight:700;font-size:14px;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;box-shadow:0 4px 14px rgba(79,70,229,0.35);">${escapeHtml(primaryLabel)}</a>
                  </td>
                  <td style="padding:6px;width:50%;vertical-align:top;">
                    <a href="${accountUrl}" style="display:block;text-align:center;background:#0f172a;color:#ffffff !important;padding:14px 16px;text-decoration:none;border-radius:10px;font-weight:700;font-size:14px;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">${escapeHtml(secondaryLabel)}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`;
}

function blockSupport(accent = '#4f46e5') {
  return `
          <tr>
            <td style="padding:0 28px 28px 28px;">
              <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;text-align:center;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
                <p style="margin:0 0 8px 0;color:#475569;font-size:14px;font-weight:600;">Need help with your order?</p>
                <p style="margin:0;color:#0f172a;font-size:14px;line-height:1.6;">
                  <a href="mailto:${SUPPORT_EMAIL}" style="color:${accent};text-decoration:none;font-weight:600;">${SUPPORT_EMAIL}</a>
                </p>
              </div>
            </td>
          </tr>`;
}

function blockFooterLegal() {
  return `
          <tr>
            <td style="background:linear-gradient(180deg,#0f172a 0%,#1e293b 100%);padding:28px 24px;text-align:center;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
              <img src="${LOGO_URL}" alt="" width="120" style="height:44px;width:auto;opacity:0.9;margin:0 auto 12px auto;display:block;border:0;" />
              <p style="margin:0 0 6px 0;color:#e2e8f0;font-size:13px;font-weight:600;">Boult India</p>
              <p style="margin:0 0 16px 0;color:#94a3b8;font-size:12px;line-height:1.5;">Premium vehicle care products</p>
              <p style="margin:0 0 10px 0;">
                <a href="${SITE_URL}" style="color:#a5b4fc;text-decoration:none;font-size:12px;font-weight:600;margin:0 8px;">Website</a>
                <span style="color:#475569;">·</span>
                <a href="${SITE_URL}/contact" style="color:#a5b4fc;text-decoration:none;font-size:12px;font-weight:600;margin:0 8px;">Contact</a>
                <span style="color:#475569;">·</span>
                <a href="${SITE_URL}/return-refund-policy" style="color:#a5b4fc;text-decoration:none;font-size:12px;font-weight:600;margin:0 8px;">Returns</a>
              </p>
              <p style="margin:16px 0 0 0;color:#64748b;font-size:11px;">© ${new Date().getFullYear()} Boult India. All rights reserved.</p>
              <p style="margin:8px 0 0 0;color:#475569;font-size:10px;line-height:1.4;">This is an automated message. Please do not reply directly to this email.</p>
            </td>
          </tr>`;
}

const sendOrderConfirmation = async (orderData) => {
  try {
    const {
      customer,
      email,
      id,
      amount,
      items,
      address,
      city,
      state,
      pincode,
      phone,
      shippingCharges = 0,
    } = orderData;

    console.log('📧 Attempting to send order confirmation email...');
    console.log('📦 Order ID:', id);
    console.log('📧 To:', email);

    const itemsHTML = buildOrderItemsRows(items, '#ea580c');
    const formattedAmount = Number(amount).toFixed(2);
    const badge =
      '<span style="display:inline-block;margin-bottom:14px;padding:6px 14px;background:rgba(255,255,255,0.2);border-radius:999px;color:#fff;font-size:12px;font-weight:700;letter-spacing:0.04em;">ORDER CONFIRMED</span>';

    const inner =
      blockHeaderGradient('Thank you for your order', 'We have received your purchase and will keep you updated.', badge) +
      blockGreeting(
        `<p style="margin:0 0 8px 0;font-size:17px;color:#0f172a;">Hi <strong style="color:#4f46e5;">${escapeHtml(customer)}</strong>,</p>
         <p style="margin:0;color:#475569;font-size:15px;line-height:1.65;">Your order is confirmed and is being processed. You can track progress anytime from your account.</p>`
      ) +
      blockOrderSummaryCard(id, 'Order total', `₹${formattedAmount}`, '#ea580c') +
      blockItemsTable(itemsHTML) +
      blockDeliveryAddress(customer, address, city, state, pincode, phone) +
      (shippingCharges === 0 ? blockNoticeShippingPending() : '') +
      blockDualCtas(
        `${SITE_URL}/track-order`,
        `${SITE_URL}/account`,
        'Track order',
        'View in account'
      ) +
      blockSupport('#4f46e5') +
      blockFooterLegal();

    const emailHTML = emailDocumentWrapper(`Order ${id} confirmed · Boult India`, inner);

    const transporter = createTransporter();
    const fromEmail = process.env.GMAIL_USER || process.env.HOSTINGER_EMAIL || 'orders@boultindia.com';
    const mailOptions = {
      from: `"Boult India" <${fromEmail}>`,
      to: email,
      cc: ADMIN_CC,
      replyTo: fromEmail,
      subject: `Order confirmed · ${id} · Boult India`,
      html: emailHTML,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending order confirmation email:');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    return { success: false, error: error.message };
  }
};

const sendInvoiceWithShippingCharges = async (orderData) => {
  try {
    const { customer, email, id, amount, shippingCharges, items, address, city, state, pincode, phone } =
      orderData;

    console.log('📧 Sending invoice email with shipping charges...');
    console.log('📦 Order ID:', id);
    console.log('💰 Shipping Charges:', shippingCharges);

    const itemsHTML = buildOrderItemsRows(items, '#059669');
    const subtotal = Number(amount);
    const ship = Number(shippingCharges || 0);
    const grandTotal = subtotal + ship;

    const badge =
      '<span style="display:inline-block;margin-bottom:14px;padding:6px 14px;background:rgba(255,255,255,0.22);border-radius:999px;color:#fff;font-size:12px;font-weight:700;letter-spacing:0.04em;">INVOICE UPDATED</span>';

    const inner =
      blockHeaderGradient(
        'Your invoice has been updated',
        'Shipping charges are now included. Please review the summary below.',
        badge
      ) +
      blockGreeting(
        `<p style="margin:0 0 8px 0;font-size:17px;color:#0f172a;">Hi <strong style="color:#059669;">${escapeHtml(customer)}</strong>,</p>
         <p style="margin:0;color:#475569;font-size:15px;line-height:1.65;">Your order <strong style="color:#0f172a;">#${escapeHtml(id)}</strong> has been verified. The amount below includes delivery charges.</p>`
      ) +
      blockOrderSummaryCard(id, 'Amount payable', `₹${grandTotal.toFixed(2)}`, '#059669') +
      blockItemsTable(itemsHTML) +
      blockDeliveryAddress(customer, address, city, state, pincode, phone) +
      `
          <tr>
            <td style="padding:0 28px 24px 28px;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
              <p style="margin:0 0 12px 0;color:#0f172a;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;border-bottom:2px solid #d1fae5;padding-bottom:8px;">Payment summary</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;background:#ffffff;">
                <tr>
                  <td style="padding:14px 18px;color:#64748b;font-size:14px;font-weight:600;border-bottom:1px solid #f1f5f9;">Subtotal</td>
                  <td style="padding:14px 18px;text-align:right;color:#0f172a;font-size:14px;font-weight:700;border-bottom:1px solid #f1f5f9;">₹${subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding:14px 18px;color:#64748b;font-size:14px;font-weight:600;border-bottom:1px solid #f1f5f9;">Shipping</td>
                  <td style="padding:14px 18px;text-align:right;color:#059669;font-size:14px;font-weight:700;border-bottom:1px solid #f1f5f9;">₹${ship.toFixed(2)}</td>
                </tr>
                <tr style="background:linear-gradient(90deg,#ecfdf5 0%,#f0fdf4 100%);">
                  <td style="padding:18px 18px;color:#064e3b;font-size:16px;font-weight:800;">Total payable</td>
                  <td style="padding:18px 18px;text-align:right;color:#047857;font-size:22px;font-weight:800;">₹${grandTotal.toFixed(2)}</td>
                </tr>
              </table>
              <p style="margin:12px 0 0 0;color:#64748b;font-size:12px;line-height:1.5;">If anything looks incorrect, contact us at <a href="mailto:${SUPPORT_EMAIL}" style="color:#4f46e5;font-weight:600;text-decoration:none;">${SUPPORT_EMAIL}</a>.</p>
            </td>
          </tr>` +
      blockDualCtas(
        `${SITE_URL}/track-order`,
        `${SITE_URL}/account`,
        'Track shipment',
        'Open invoice in account'
      ) +
      blockSupport('#059669') +
      blockFooterLegal();

    const emailHTML = emailDocumentWrapper(`Updated invoice ${id} · Boult India`, inner);

    const transporter = createTransporter();
    const fromEmail = process.env.GMAIL_USER || process.env.HOSTINGER_EMAIL || 'orders@boultindia.com';
    const mailOptions = {
      from: `"Boult India" <${fromEmail}>`,
      to: email,
      cc: ADMIN_CC,
      replyTo: fromEmail,
      subject: `Invoice updated · ${id} · Boult India`,
      html: emailHTML,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Invoice email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending invoice email:');
    console.error('Error message:', error.message);
    return { success: false, error: error.message };
  }
};

async function sendContactEmail(contactData) {
  const { name, email, phone, enquiryType, subject, message } = contactData;

  const enquiryTypeLabels = {
    general: 'General inquiry',
    distributorship: 'Distributorship',
    orders: 'Orders',
    technical: 'Technical support',
    bulk: 'Bulk orders',
  };

  const transporter = createTransporter();
  const fromAddr = process.env.GMAIL_USER || process.env.HOSTINGER_EMAIL || 'orders@boultindia.com';

  const inner =
    blockHeaderGradient(
      'New website enquiry',
      enquiryTypeLabels[enquiryType] || 'Contact form',
      '<span style="display:inline-block;margin-bottom:14px;padding:6px 14px;background:rgba(255,255,255,0.2);border-radius:999px;color:#fff;font-size:12px;font-weight:700;">CONTACT</span>'
    ) +
    `
          <tr>
            <td style="padding:24px 28px;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;border-spacing:0 10px;">
                <tr>
                  <td style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px 16px;border-left:4px solid #4f46e5;">
                    <p style="margin:0 0 4px 0;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.06em;">Name</p>
                    <p style="margin:0;color:#0f172a;font-size:15px;font-weight:600;">${escapeHtml(name)}</p>
                  </td>
                </tr>
                <tr>
                  <td style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px 16px;border-left:4px solid #4f46e5;">
                    <p style="margin:0 0 4px 0;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.06em;">Email</p>
                    <p style="margin:0;"><a href="mailto:${escapeHtml(email)}" style="color:#4f46e5;font-size:15px;font-weight:600;text-decoration:none;">${escapeHtml(email)}</a></p>
                  </td>
                </tr>
                ${
                  phone
                    ? `<tr>
                  <td style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px 16px;border-left:4px solid #4f46e5;">
                    <p style="margin:0 0 4px 0;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.06em;">Phone</p>
                    <p style="margin:0;"><a href="tel:${escapeHtml(phone)}" style="color:#0f172a;font-size:15px;font-weight:600;text-decoration:none;">${escapeHtml(phone)}</a></p>
                  </td>
                </tr>`
                    : ''
                }
                <tr>
                  <td style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px 16px;border-left:4px solid #4f46e5;">
                    <p style="margin:0 0 4px 0;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.06em;">Subject</p>
                    <p style="margin:0;color:#0f172a;font-size:15px;font-weight:600;">${escapeHtml(subject)}</p>
                  </td>
                </tr>
                <tr>
                  <td style="background:#ffffff;border:1px solid #e2e8f0;border-radius:10px;padding:18px 16px;">
                    <p style="margin:0 0 8px 0;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.06em;">Message</p>
                    <p style="margin:0;color:#334155;font-size:14px;line-height:1.65;white-space:pre-wrap;">${escapeHtml(message)}</p>
                  </td>
                </tr>
              </table>
              <p style="margin:20px 0 0 0;text-align:center;color:#94a3b8;font-size:12px;">Received ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} (IST)</p>
            </td>
          </tr>` +
    blockFooterLegal();

  const subjectClean = String(subject || '')
    .replace(/[\r\n]+/g, ' ')
    .trim()
    .slice(0, 120);

  const mailOptions = {
    from: `"Boult India Website" <${fromAddr}>`,
    to: ADMIN_CC,
    cc: fromAddr,
    replyTo: email,
    subject: `[${enquiryTypeLabels[enquiryType] || 'Contact'}] ${subjectClean}`,
    html: emailDocumentWrapper(`Enquiry: ${subjectClean}`, inner),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Contact email sent to ${ADMIN_CC}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending contact email:', error);
    return { success: false, error: error.message };
  }
}

async function sendStatusUpdateEmail(order) {
  const { status, customer, email, id, items, amount, shippingCharges, courierPartner, trackingNumber, dispatchDateTime, deliveredDateTime } = order;

  const statusConfig = {
    processing: {
      subject: `Your Order #${id} is Being Processed 📦`,
      color: '#2563eb',
      icon: '⚙️',
      title: 'Order is Being Processed',
      message: 'Great news! Your order is now being processed by our team. We\'ll notify you once it\'s dispatched.',
    },
    shipped: {
      subject: `Your Order #${id} Has Been Shipped 🚚`,
      color: '#0ea5e9',
      icon: '🚚',
      title: 'Order Shipped!',
      message: `Your order is on its way! ${courierPartner ? `Shipped via <strong>${courierPartner}</strong>.` : ''} ${trackingNumber ? `Tracking ID: <strong>${trackingNumber}</strong>` : ''}`,
    },
    delivered: {
      subject: `Your Order #${id} Has Been Delivered ✅`,
      color: '#16a34a',
      icon: '✅',
      title: 'Order Delivered!',
      message: 'Your order has been successfully delivered. We hope you love your Boult India products! Please leave a review.',
    },
    cancelled: {
      subject: `Your Order #${id} Has Been Cancelled ❌`,
      color: '#ef4444',
      icon: '❌',
      title: 'Order Cancelled',
      message: 'Your order has been cancelled. If you have any questions, please contact our support team.',
    },
  };

  const config = statusConfig[status];
  if (!config) return { success: false, error: 'No email template for this status' };

  const grandTotal = (amount || 0) + (shippingCharges || 0);

  const itemsHtml = items && items.length > 0
    ? items.map((item, i) => `
      <tr style="background:${i % 2 === 0 ? '#fff' : '#f8fafc'}">
        <td style="padding:12px 14px;border-bottom:1px solid #e2e8f0;font-size:13px;color:#0f172a;">${escapeHtml(item.name)}</td>
        <td style="padding:12px 14px;border-bottom:1px solid #e2e8f0;text-align:center;font-size:13px;color:#64748b;">${item.quantity}</td>
        <td style="padding:12px 14px;border-bottom:1px solid #e2e8f0;text-align:right;font-size:13px;font-weight:700;color:${config.color};">₹${((item.price || 0) * item.quantity).toLocaleString('en-IN')}</td>
      </tr>`).join('')
    : `<tr><td colspan="3" style="padding:16px;text-align:center;color:#94a3b8;">No items</td></tr>`;

  const trackingSection = status === 'shipped' && (courierPartner || trackingNumber || dispatchDateTime) ? `
    <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:16px;margin:16px 0;">
      <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#0369a1;">📦 Shipment Details</p>
      ${courierPartner ? `<p style="margin:4px 0;font-size:13px;color:#0f172a;">Courier: <strong>${escapeHtml(courierPartner)}</strong></p>` : ''}
      ${trackingNumber ? `<p style="margin:4px 0;font-size:13px;color:#0f172a;">Tracking ID: <strong>${escapeHtml(trackingNumber)}</strong></p>` : ''}
      ${dispatchDateTime ? `<p style="margin:4px 0;font-size:13px;color:#0f172a;">Dispatched: <strong>${new Date(dispatchDateTime).toLocaleString('en-IN')}</strong></p>` : ''}
    </div>` : '';

  const deliveredSection = status === 'delivered' && deliveredDateTime ? `
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin:16px 0;">
      <p style="margin:0;font-size:13px;color:#15803d;">Delivered on: <strong>${new Date(deliveredDateTime).toLocaleString('en-IN')}</strong></p>
    </div>` : '';

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Inter,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">
        
        <!-- Header -->
        <tr><td style="background:${config.color};padding:32px 40px;text-align:center;">
          <p style="margin:0 0 8px;font-size:40px;">${config.icon}</p>
          <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">${config.title}</h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,.8);font-size:14px;">Order #${escapeHtml(id)}</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:32px 40px;">
          <p style="margin:0 0 16px;font-size:15px;color:#0f172a;">Hi <strong>${escapeHtml(customer)}</strong>,</p>
          <p style="margin:0 0 20px;font-size:14px;color:#475569;line-height:1.6;">${config.message}</p>

          ${trackingSection}
          ${deliveredSection}

          <!-- Items Table -->
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;margin-bottom:20px;">
            <thead>
              <tr style="background:#f8fafc;">
                <th style="padding:10px 14px;text-align:left;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:.5px;border-bottom:1px solid #e2e8f0;">Product</th>
                <th style="padding:10px 14px;text-align:center;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:.5px;border-bottom:1px solid #e2e8f0;">Qty</th>
                <th style="padding:10px 14px;text-align:right;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:.5px;border-bottom:1px solid #e2e8f0;">Total</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>

          <!-- Totals -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            ${shippingCharges > 0 ? `<tr><td style="padding:6px 0;font-size:13px;color:#64748b;">Shipping Charges</td><td style="padding:6px 0;text-align:right;font-size:13px;color:#64748b;">₹${(shippingCharges).toLocaleString('en-IN')}</td></tr>` : ''}
            <tr><td style="padding:10px 0;font-size:16px;font-weight:700;color:#0f172a;border-top:2px solid #e2e8f0;">Grand Total</td>
            <td style="padding:10px 0;text-align:right;font-size:16px;font-weight:700;color:${config.color};border-top:2px solid #e2e8f0;">₹${grandTotal.toLocaleString('en-IN')}</td></tr>
          </table>

          <p style="margin:0;font-size:13px;color:#94a3b8;">Questions? Contact us at <a href="mailto:support@boultindia.com" style="color:${config.color};">support@boultindia.com</a></p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0;">
          <p style="margin:0;font-size:12px;color:#94a3b8;">© 2026 Boult India · V Tech Multi Solutions · <a href="https://boultindia.com" style="color:#94a3b8;">boultindia.com</a></p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    const transporter = createTransporter();
    const fromEmail = process.env.GMAIL_USER || process.env.HOSTINGER_EMAIL;
    await transporter.sendMail({
      from: `"Boult India" <${fromEmail}>`,
      to: email,
      bcc: ADMIN_CC,
      subject: config.subject,
      html,
    });
    console.log(`✅ Status email sent to ${email} for status: ${status}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Status email error:', error.message);
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendOrderConfirmation,
  sendInvoiceWithShippingCharges,
  sendContactEmail,
  sendStatusUpdateEmail,
};
