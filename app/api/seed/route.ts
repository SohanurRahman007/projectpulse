import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Project from '@/models/Project';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    await connectDB();
    
    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    
    // Hash passwords
    const hashedPasswords = await Promise.all([
      bcrypt.hash('admin123', 10),
      bcrypt.hash('employee123', 10),
      bcrypt.hash('client123', 10)
    ]);
    
    // Create users
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@projectpulse.com',
      password: hashedPasswords[0],
      role: 'admin'
    });
    
    const employee = await User.create({
      name: 'John Developer',
      email: 'john@projectpulse.com',
      password: hashedPasswords[1],
      role: 'employee'
    });
    
    const client = await User.create({
      name: 'Sarah Client',
      email: 'sarah@clientco.com',
      password: hashedPasswords[2],
      role: 'client'
    });
    
    // Create sample project
    const project = await Project.create({
      name: 'E-commerce Website',
      description: 'Build a full-featured e-commerce platform with payment integration and inventory management',
      status: 'on_track',
      healthScore: 85,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-06-30'),
      client: client._id,
      employees: [employee._id]
    });
    
    return NextResponse.json({
      success: true,
      message: 'Demo data created successfully!',
      users: [
        { email: 'admin@projectpulse.com', password: 'admin123', role: 'admin' },
        { email: 'john@projectpulse.com', password: 'employee123', role: 'employee' },
        { email: 'sarah@clientco.com', password: 'client123', role: 'client' }
      ],
      project: {
        name: project.name,
        status: project.status,
        healthScore: project.healthScore
      }
    });
    
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { success: false, error: 'Seed failed' },
      { status: 500 }
    );
  }
}