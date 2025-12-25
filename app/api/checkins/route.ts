import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Checkin from '@/models/Checkin';

interface CheckinQuery {
  project?: string;
  employee?: string;
}

interface CheckinFormData {
  projectId: string;
  employeeId?: string;
  progressSummary: string;
  blockers?: string;
  confidenceLevel: number;
  completionPercentage: number;
}

// GET: Get checkins
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const employeeId = searchParams.get('employeeId');
    
    const query: CheckinQuery = {};
    if (projectId) query.project = projectId;
    if (employeeId) query.employee = employeeId;
    
    const checkins = await Checkin.find(query)
      .populate('project', 'name')
      .populate('employee', 'name email')
      .sort({ weekStartDate: -1 });
    
    return NextResponse.json({ success: true, checkins });
  } catch (error) {
    console.error('GET checkins error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch checkins' },
      { status: 500 }
    );
  }
}

// POST: Submit new checkin
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const data: CheckinFormData = await request.json();
    
    // Validation
    const requiredFields = ['projectId', 'progressSummary', 'confidenceLevel', 'completionPercentage'];
    for (const field of requiredFields) {
      if (!data[field as keyof CheckinFormData]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }
    
    // Get current week's Monday
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const weekStart = new Date(now.setDate(diff));
    weekStart.setHours(0, 0, 0, 0);
    
    // Check for existing checkin this week
    const existingCheckin = await Checkin.findOne({
      project: data.projectId,
      employee: data.employeeId,
      weekStartDate: weekStart
    });
    
    if (existingCheckin) {
      return NextResponse.json(
        { success: false, error: 'Checkin already submitted for this week' },
        { status: 400 }
      );
    }
    
    // Create checkin
    const checkin = await Checkin.create({
      project: data.projectId,
      employee: data.employeeId,
      weekStartDate: weekStart,
      progressSummary: data.progressSummary,
      blockers: data.blockers || '',
      confidenceLevel: data.confidenceLevel,
      completionPercentage: data.completionPercentage
    });
    
    return NextResponse.json({
      success: true,
      message: 'Checkin submitted successfully',
      checkin
    });
  } catch (error) {
    console.error('POST checkin error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit checkin' },
      { status: 500 }
    );
  }
}