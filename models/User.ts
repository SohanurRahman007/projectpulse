import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'employee', 'client'],
    default: 'employee'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Model 
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;