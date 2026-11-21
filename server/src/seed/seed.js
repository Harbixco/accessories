require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const seedProducts = require('./seedData');

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bc_accessories';
    console.log(`[Seed] Connecting to MongoDB at ${mongoUri}...`);
    
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('[Seed] Database connection successful.');

    // 1. Clear existing products and demo users
    console.log('[Seed] Cleaning existing data...');
    await Product.deleteMany({});
    await User.deleteMany({ email: { $in: ['admin@bc-accessories.de', 'dealer@smartrepair-gmbh.de', 'pending@phonehub-retail.de'] } });

    // 2. Insert Admin Account
    console.log('[Seed] Creating Administrator account...');
    await User.create({
      companyName: 'BC Accessories GmbH',
      legalForm: 'GmbH',
      vatId: 'DE345892101',
      contactName: 'Alexander Schmidt',
      email: 'admin@bc-accessories.de',
      password: 'admin123Password!',
      phone: '+49 69 98765432',
      role: 'admin',
      b2bStatus: 'approved',
      billingAddress: {
        street: 'Mainzer Landstraße 180',
        postalCode: '60327',
        city: 'Frankfurt am Main',
        country: 'Germany',
      },
    });

    // 3. Insert Approved B2B Wholesale Dealer
    console.log('[Seed] Creating Approved B2B Dealer account...');
    await User.create({
      companyName: 'SmartRepair Solutions GmbH',
      legalForm: 'GmbH',
      vatId: 'DE814529341',
      contactName: 'Marcus Weber',
      email: 'dealer@smartrepair-gmbh.de',
      password: 'dealer123Password!',
      phone: '+49 89 12345678',
      role: 'dealer',
      b2bStatus: 'approved',
      billingAddress: {
        street: 'Leopoldstraße 45',
        postalCode: '80802',
        city: 'München',
        country: 'Germany',
      },
      shippingAddress: {
        street: 'Leopoldstraße 45',
        postalCode: '80802',
        city: 'München',
        country: 'Germany',
      },
      paymentTerms: 'Invoice 14 Days',
      creditLimit: 5000,
    });

    // 4. Insert Pending B2B Dealer
    console.log('[Seed] Creating Pending Verification Dealer account...');
    await User.create({
      companyName: 'PhoneHub Retail UG',
      legalForm: 'UG',
      vatId: 'DE992813401',
      contactName: 'Elena Meyer',
      email: 'pending@phonehub-retail.de',
      password: 'pending123Password!',
      phone: '+49 30 87654321',
      role: 'dealer',
      b2bStatus: 'pending',
      billingAddress: {
        street: 'Friedrichstraße 12',
        postalCode: '10117',
        city: 'Berlin',
        country: 'Germany',
      },
    });

    // 5. Insert Products
    console.log(`[Seed] Inserting ${seedProducts.length} wholesale catalog products...`);
    const created = await Product.insertMany(seedProducts);
    console.log(`[Seed] Successfully inserted ${created.length} products!`);

    console.log('\n=============================================');
    console.log(' SEED COMPLETED SUCCESSFULLY! ');
    console.log('=============================================');
    console.log('Demo Accounts:');
    console.log('1. Admin: admin@bc-accessories.de / admin123Password!');
    console.log('2. Approved Dealer: dealer@smartrepair-gmbh.de / dealer123Password!');
    console.log('3. Pending Dealer: pending@phonehub-retail.de / pending123Password!');
    console.log('=============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error.message);
    process.exit(1);
  }
};

seedDB();
