// Input Validation Middleware
const validator = require('validator');

// Sanitize string input
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return validator.escape(str.trim());
};

// Validate product data
const validateProduct = (req, res, next) => {
  const { name, description, price, category } = req.body;
  const errors = [];

  if (!name || name.trim().length < 3) {
    errors.push('Product name must be at least 3 characters');
  }

  if (!description || description.trim().length < 10) {
    errors.push('Description must be at least 10 characters');
  }

  if (!price || isNaN(price) || parseFloat(price) <= 0) {
    errors.push('Price must be a positive number');
  }

  if (!category || category.trim().length === 0) {
    errors.push('Category is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }

  // Sanitize inputs
  req.body.name = sanitizeString(name);
  req.body.description = sanitizeString(description);
  req.body.category = sanitizeString(category);

  next();
};

// Validate order data
const validateOrder = (req, res, next) => {
  const { customer, email, phone, address, items } = req.body;
  const errors = [];

  if (!customer || customer.trim().length < 2) {
    errors.push('Customer name must be at least 2 characters');
  }

  if (!email || !validator.isEmail(email)) {
    errors.push('Valid email is required');
  }

  if (!phone || !validator.isMobilePhone(phone, 'any')) {
    errors.push('Valid phone number is required');
  }

  if (!address || address.trim().length < 10) {
    errors.push('Address must be at least 10 characters');
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    errors.push('At least one item is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }

  // Sanitize inputs
  req.body.customer = sanitizeString(customer);
  req.body.address = sanitizeString(address);

  next();
};

// Validate email for contact form
const validateContactEmail = (req, res, next) => {
  const { name, email, message } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }

  if (!email || !validator.isEmail(email)) {
    errors.push('Valid email is required');
  }

  if (!message || message.trim().length < 10) {
    errors.push('Message must be at least 10 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }

  // Sanitize inputs
  req.body.name = sanitizeString(name);
  req.body.message = sanitizeString(message);

  next();
};

module.exports = {
  validateProduct,
  validateOrder,
  validateContactEmail,
  sanitizeString
};
