import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const users = await User.find()
      .select('name email role')
      .sort({ role: 1, name: 1 });
    
    return NextResponse.json({
      success: true,
      users
    });
    
  } catch (error) {
    console.error('GET users error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch users',
        users: []
      },
      { status: 500 }
    );
  }
}