import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import User from '@/models/User';

// GET all projects
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const projects = await Project.find()
      .populate('client', 'name email role')
      .populate('employees', 'name email role')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ 
      success: true, 
      projects 
    });
    
  } catch (error) {
    console.error('GET projects error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST create new project
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'description', 'startDate', 'endDate', 'client', 'employees'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }
    
    // Check if client exists
    const client = await User.findById(data.client);
    if (!client || client.role !== 'client') {
      return NextResponse.json(
        { success: false, error: 'Invalid client selected' },
        { status: 400 }
      );
    }
    
    // Check if employees exist
    const employees = await User.find({ _id: { $in: data.employees } });
    if (employees.length !== data.employees.length) {
      return NextResponse.json(
        { success: false, error: 'One or more employees not found' },
        { status: 400 }
      );
    }
    
    // Create project
    const project = await Project.create({
      name: data.name,
      description: data.description,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      client: data.client,
      employees: data.employees,
      healthScore: 100,
      status: 'on_track'
    });
    
    // Populate the created project
    const populatedProject = await Project.findById(project._id)
      .populate('client', 'name email role')
      .populate('employees', 'name email role');
    
    return NextResponse.json({
      success: true,
      message: 'Project created successfully',
      project: populatedProject
    });
    
  } catch (error) {
    console.error('POST project error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    );
  }
}