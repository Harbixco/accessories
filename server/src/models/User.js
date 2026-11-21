const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    trim: true,
  },
  legalForm: {
    type: String,
    enum: ['GmbH', 'UG', 'Gbr', 'AG', 'Einzelunternehmen', 'Ltd', 'Other'],
    default: 'GmbH',
  },
  vatId: {
    type: String,
    trim: true,
    required: true, // e.g. DE123456789
  },
  contactName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  phone: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['dealer', 'admin'],
    default: 'dealer',
  },
  b2bStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending', // Requires admin approval for wholesale access
  },
  billingAddress: {
    street: String,
    postalCode: String,
    city: String,
    country: { type: String, default: 'Germany' },
  },
  shippingAddress: {
    street: String,
    postalCode: String,
    city: String,
    country: { type: String, default: 'Germany' },
  },
  creditLimit: {
    type: Number,
    default: 0,
  },
  paymentTerms: {
    type: String,
    enum: ['Prepayment (Vorkasse)', 'Invoice 14 Days', 'Invoice 30 Days', 'Credit Card'],
    default: 'Prepayment (Vorkasse)',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
