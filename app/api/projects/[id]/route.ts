import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    // Check if the ID is "create" - return 404 or empty response
    if (params.id === 'create') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Project not found',
          message: 'Invalid project ID' 
        },
        { status: 404 }
      );
    }
    
    // Validate if it's a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid project ID format',
          message: 'The provided ID is not valid' 
        },
        { status: 400 }
      );
    }
    
    const project = await Project.findById(params.id)
      .populate('client', 'name email role')
      .populate('employees', 'name email role');
    
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      project 
    });
    
  } catch (error) {
    console.error('GET project error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

// Optional: Add PUT, DELETE methods if needed
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    if (params.id === 'create' || !mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid project ID' },
        { status: 400 }
      );
    }
    
    const data = await request.json();
    const project = await Project.findByIdAndUpdate(
      params.id,
      { $set: data },
      { new: true, runValidators: true }
    ).populate('client', 'name email role')
     .populate('employees', 'name email role');
    
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Project updated successfully',
      project
    });
    
  } catch (error) {
    console.error('PUT project error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    if (params.id === 'create' || !mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid project ID' },
        { status: 400 }
      );
    }
    
    const project = await Project.findByIdAndDelete(params.id);
    
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    });
    
  } catch (error) {
    console.error('DELETE project error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}