const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { verifyToken, isApprovedB2B, isAdmin } = require('../middleware/auth');

// Helper to calculate tiered price for an item quantity
const getTieredUnitPrice = (product, quantity) => {
  let price = product.basePrice;
  if (product.tieredPricing && product.tieredPricing.length > 0) {
    // Sort descending by minQty
    const tiers = [...product.tieredPricing].sort((a, b) => b.minQty - a.minQty);
    for (const tier of tiers) {
      if (quantity >= tier.minQty) {
        price = tier.price;
        break;
      }
    }
  }
  return price;
};

// @route   POST /api/orders
// @desc    Create a B2B wholesale order
// @access  Private (Approved B2B only)
router.post('/', verifyToken, isApprovedB2B, async (req, res) => {
  try {
    const { items, poNumber, shippingAddress, paymentMethod, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must contain at least one item.' });
    }

    let calculatedNet = 0;
    const processedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.sku || ''} not found.` });
      }

      if (item.quantity < product.moq) {
        return res.status(400).json({
          success: false,
          message: `Minimum order quantity for SKU ${product.sku} is ${product.moq} units.`,
        });
      }

      const unitPrice = getTieredUnitPrice(product, item.quantity);
      const itemNet = unitPrice * item.quantity;
      calculatedNet += itemNet;

      processedItems.push({
        product: product._id,
        sku: product.sku,
        name: product.name,
        quantity: item.quantity,
        unitPriceNet: unitPrice,
        totalPriceNet: itemNet,
      });
    }

    const minOrderVal = Number(process.env.MINIMUM_ORDER_VALUE || 0);
    if (minOrderVal > 0 && calculatedNet < minOrderVal) {
      return res.status(400).json({
        success: false,
        message: `Minimum Order Value (MOV) is €${minOrderVal.toFixed(2)} net. Your cart value is €${calculatedNet.toFixed(2)} net.`,
      });
    }

    const vatAmount = calculatedNet * 0.19; // 19% German VAT
    const shippingCostNet = calculatedNet >= 500 ? 0 : 9.90; // Free shipping above €500 net
    const totalGross = calculatedNet + vatAmount + shippingCostNet;

    const orderNumber = `BCA-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const order = await Order.create({
      orderNumber,
      dealer: req.user._id,
      poNumber: poNumber || '',
      items: processedItems,
      totalNet: Number(calculatedNet.toFixed(2)),
      vatRate: 19,
      vatAmount: Number(vatAmount.toFixed(2)),
      shippingCostNet,
      totalGross: Number(totalGross.toFixed(2)),
      shippingAddress: shippingAddress || req.user.shippingAddress,
      paymentMethod: paymentMethod || 'Prepayment (Vorkasse)',
      notes: notes || '',
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! A pro-forma order confirmation has been created.',
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/orders/my-orders
// @desc    Get logged in dealer orders
router.get('/my-orders', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ dealer: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order details
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('dealer', 'companyName email vatId contactName phone');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.dealer._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
