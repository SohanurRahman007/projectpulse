import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // আগের সব ডেটা ডিলিট করবো
    await User.deleteMany({});
    
    // ডেমো ইউজার তৈরি করবো
    const demoUsers = [
      {
        name: 'Admin User',
        email: 'admin@projectpulse.com',
        password: 'admin123',
        role: 'admin'
      },
      {
        name: 'John Employee',
        email: 'john@projectpulse.com',
        password: 'employee123',
        role: 'employee'
      },
      {
        name: 'Sarah Client',
        email: 'sarah@clientco.com',
        password: 'client123',
        role: 'client'
      }
    ];
    
    // ইউজারগুলো সেভ করবো
    await User.insertMany(demoUsers);
    
    return NextResponse.json({
      success: true,
      message: 'Demo users created successfully!',
      users: demoUsers.map(u => ({ email: u.email, password: u.password, role: u.role }))
    });
    
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Seed failed' },
      { status: 500 }
    );
  }
}