const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  sku: { type: String, required: true },
  name: {
    de: String,
    en: String,
  },
  quantity: { type: Number, required: true },
  unitPriceNet: { type: Number, required: true },
  totalPriceNet: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  dealer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  poNumber: {
    type: String,
    trim: true, // Commission / Purchase Order reference from dealer
  },
  items: [orderItemSchema],
  totalNet: {
    type: Number,
    required: true,
  },
  vatRate: {
    type: Number,
    default: 19, // German 19% VAT standard
  },
  vatAmount: {
    type: Number,
    required: true,
  },
  shippingCostNet: {
    type: Number,
    default: 0, // Free above threshold
  },
  totalGross: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Received', 'Processing', 'Dispatched', 'Delivered', 'Cancelled'],
    default: 'Received',
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Invoice Issued', 'Overdue'],
    default: 'Pending',
  },
  paymentMethod: {
    type: String,
    default: 'Prepayment (Vorkasse)',
  },
  shippingAddress: {
    companyName: String,
    contactName: String,
    street: String,
    postalCode: String,
    city: String,
    country: String,
  },
  trackingCode: String,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', orderSchema);
