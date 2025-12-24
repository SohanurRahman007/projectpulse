import mongoose from 'mongoose';

// MongoDB connection
const connectDB = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      console.log("Already connected to MongoDB");
      return;
    }
    
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

export default connectDB;