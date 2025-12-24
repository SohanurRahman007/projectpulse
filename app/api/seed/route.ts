import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

// GET request এর জন্য
export async function GET() {
  try {
    await connectDB();
    
    // আগের সব ডেটা ডিলিট করবো
    await User.deleteMany({});
    
    // Password hash করবো
    const hashedPasswords = await Promise.all([
      bcrypt.hash('admin123', 10),
      bcrypt.hash('employee123', 10),
      bcrypt.hash('client123', 10)
    ]);
    
    // ডেমো ইউজার তৈরি করবো
    const demoUsers = [
      {
        name: 'Admin User',
        email: 'admin@projectpulse.com',
        password: hashedPasswords[0],
        role: 'admin'
      },
      {
        name: 'John Employee',
        email: 'john@projectpulse.com',
        password: hashedPasswords[1],
        role: 'employee'
      },
      {
        name: 'Sarah Client',
        email: 'sarah@clientco.com',
        password: hashedPasswords[2],
        role: 'client'
      }
    ];
    
    // ইউজারগুলো সেভ করবো
    await User.insertMany(demoUsers);
    
    return NextResponse.json({
      success: true,
      message: 'Demo users created successfully!',
      users: [
        { email: 'admin@projectpulse.com', password: 'admin123', role: 'admin' },
        { email: 'john@projectpulse.com', password: 'employee123', role: 'employee' },
        { email: 'sarah@clientco.com', password: 'client123', role: 'client' }
      ]
    });
    
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { success: false, error: 'Seed failed' },
      { status: 500 }
    );
  }
}