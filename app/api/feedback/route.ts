import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Feedback from '@/models/Feedback';

// Type for query parameters
type FeedbackQuery = {
  project?: string;
  client?: string;
};

// Type for POST request body
type FeedbackRequestBody = {
  projectId: string;
  clientId: string;
  satisfactionRating: number;
  communicationRating: number;
  comments?: string;
  flagIssue?: boolean;
};

// GET: Get feedback
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const clientId = searchParams.get('clientId');
    
    const query: FeedbackQuery = {};
    if (projectId) query.project = projectId;
    if (clientId) query.client = clientId;
    
    const feedback = await Feedback.find(query)
      .populate('project', 'name')
      .populate('client', 'name email')
      .sort({ weekStartDate: -1 });
    
    return NextResponse.json({ 
      success: true, 
      feedback 
    });
    
  } catch (error) {
    console.error('GET feedback error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch feedback' 
      },
      { status: 500 }
    );
  }
}

// POST: Submit new feedback
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const data: FeedbackRequestBody = await request.json();
    
    // Validation
    if (!data.projectId || !data.satisfactionRating || !data.communicationRating) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'projectId, satisfactionRating, and communicationRating are required' 
        },
        { status: 400 }
      );
    }
    
    // Get current week's Monday
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const weekStart = new Date(now.setDate(diff));
    weekStart.setHours(0, 0, 0, 0);
    
    // Check for existing feedback this week
    const existingFeedback = await Feedback.findOne({
      project: data.projectId,
      client: data.clientId,
      weekStartDate: weekStart
    });
    
    if (existingFeedback) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Feedback already submitted for this week' 
        },
        { status: 400 }
      );
    }
    
    // Create feedback
    const feedback = await Feedback.create({
      project: data.projectId,
      client: data.clientId,
      weekStartDate: weekStart,
      satisfactionRating: data.satisfactionRating,
      communicationRating: data.communicationRating,
      comments: data.comments || '',
      flagIssue: data.flagIssue || false
    });
    
    return NextResponse.json({
      success: true,
      message: 'Feedback submitted successfully',
      feedback
    });
    
  } catch (error) {
    console.error('POST feedback error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to submit feedback' 
      },
      { status: 500 }
    );
  }
}