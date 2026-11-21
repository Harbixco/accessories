const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  ean: {
    type: String,
    trim: true,
  },
  name: {
    de: { type: String, required: true },
    en: { type: String, required: true },
  },
  description: {
    de: { type: String, required: true },
    en: { type: String, required: true },
  },
  brand: {
    type: String,
    required: true, // e.g. "Apple", "Samsung", "Xiaomi", "BC Pro Series"
    index: true,
  },
  category: {
    type: String,
    required: true, // e.g. "Cases & Covers", "Screen Protection", "Power & Cables", "Audio & Mounts"
    index: true,
  },
  compatibleDevices: [{
    type: String, // e.g. ["iPhone 15 Pro", "iPhone 15 Pro Max", "Galaxy S24"]
    index: true,
  }],
  color: {
    de: String,
    en: String,
  },
  material: {
    type: String, // e.g. "9H Tempered Glass", "TPU Silicone + Acrylic", "Braided Nylon"
  },
  images: [{
    type: String, // Cloudinary URLs or CDN URLs
  }],
  stock: {
    type: Number,
    required: true,
    default: 100,
  },
  moq: {
    type: Number,
    required: true,
    default: 5, // Minimum Order Quantity per unit pack
  },
  basePrice: {
    type: Number,
    required: true, // Net wholesale price for 1 pack (excl. VAT)
  },
  tieredPricing: [{
    minQty: { type: Number, required: true }, // e.g. 10, 50, 100
    price: { type: Number, required: true },  // Discounted price per unit
  }],
  isPopular: {
    type: Boolean,
    default: false,
  },
  isNewArrival: {
    type: Boolean,
    default: false,
  },
  isSpecialDeal: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Product', productSchema);
