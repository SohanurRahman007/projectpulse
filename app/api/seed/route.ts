import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Project from '@/models/Project';
import Checkin from '@/models/Checkin';  // Add this import
import Feedback from '@/models/Feedback'; // Add this import
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    await connectDB();
    
    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Checkin.deleteMany({});    // Add this line
    await Feedback.deleteMany({});   // Add this line
    
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
    
    // Create sample checkin (Add this section)
    const checkin = await Checkin.create({
      project: project._id,
      employee: employee._id,
      weekStartDate: new Date('2024-01-08'), // A Monday
      progressSummary: 'Completed user authentication module and started on dashboard UI. Implemented JWT token system and protected routes.',
      blockers: 'Waiting for API documentation from backend team for payment integration. Need clarification on some requirements.',
      confidenceLevel: 4,
      completionPercentage: 30,
      submittedAt: new Date('2024-01-12')
    });
    
    // Create sample feedback (Add this section)
    const feedback = await Feedback.create({
      project: project._id,
      client: client._id,
      weekStartDate: new Date('2024-01-08'),
      satisfactionRating: 4,
      communicationRating: 5,
      comments: 'Good progress so far. The team is responsive and communicates well. Looking forward to seeing the dashboard next week.',
      flagIssue: false,
      submittedAt: new Date('2024-01-13')
    });
    
    // Create additional checkins for different weeks (Optional)
    const checkin2 = await Checkin.create({
      project: project._id,
      employee: employee._id,
      weekStartDate: new Date('2024-01-01'),
      progressSummary: 'Set up project repository, created initial project structure, and planned the architecture.',
      blockers: 'None',
      confidenceLevel: 5,
      completionPercentage: 10,
      submittedAt: new Date('2024-01-05')
    });
    
    const feedback2 = await Feedback.create({
      project: project._id,
      client: client._id,
      weekStartDate: new Date('2024-01-01'),
      satisfactionRating: 5,
      communicationRating: 4,
      comments: 'Great kickoff meeting. Clear understanding of requirements.',
      flagIssue: false,
      submittedAt: new Date('2024-01-06')
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
      },
      checkins: [
        { 
          date: checkin.weekStartDate.toLocaleDateString(),
          confidence: checkin.confidenceLevel,
          progress: `${checkin.completionPercentage}%`
        },
        { 
          date: checkin2.weekStartDate.toLocaleDateString(),
          confidence: checkin2.confidenceLevel,
          progress: `${checkin2.completionPercentage}%`
        }
      ],
      feedbacks: [
        {
          date: feedback.weekStartDate.toLocaleDateString(),
          satisfaction: feedback.satisfactionRating,
          communication: feedback.communicationRating
        },
        {
          date: feedback2.weekStartDate.toLocaleDateString(),
          satisfaction: feedback2.satisfactionRating,
          communication: feedback2.communicationRating
        }
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