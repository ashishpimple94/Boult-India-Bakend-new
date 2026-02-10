const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  variant: String,
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  image: String
});

const orderSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Please enter a valid email'
    }
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^[\+]?[1-9][\d]{0,15}$/.test(v);
      },
      message: 'Please enter a valid phone number'
    }
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^[1-9][0-9]{5}$/.test(v);
      },
      message: 'Please enter a valid pincode'
    }
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  shippingCharges: {
    type: Number,
    default: 0,
    min: 0
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['cod', 'card', 'upi', 'netbanking'],
    lowercase: true
  },
  paymentId: {
    type: String,
    default: null
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  items: [orderItemSchema],
  notes: String,
  trackingNumber: String,
  orderDate: {
    type: Date,
    default: Date.now
  },
  processingDate: Date,
  shippedDate: Date,
  deliveredDate: Date,
  cancelledDate: Date,
  deliveredAt: Date,
  cancelledAt: Date,
  cancelReason: String
}, {
  timestamps: true
});

// Indexes for better performance
orderSchema.index({ email: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentMethod: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ id: 1 });

// Virtual for order total calculation
orderSchema.virtual('orderTotal').get(function() {
  return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
});

module.exports = mongoose.model('Order', orderSchema);