const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bc_accessories', {
      serverSelectionTimeoutMS: 4000,
    });
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`[MongoDB Warning] Could not connect to MongoDB Atlas / Local MongoDB: ${error.message}`);
    console.warn(`[MongoDB Notice] The server will continue running. Ensure you add your MongoDB Atlas connection string to server/.env (MONGO_URI=mongodb+srv://...) for persistent data.`);
    return false;
  }
};

module.exports = connectDB;
