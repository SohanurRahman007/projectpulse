import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Risk from '@/models/Risk';

type RiskQuery = {
  project?: string;
  status?: string;
  severity?: string;
};

type RiskRequestBody = {
  projectId: string;
  title: string;
  description: string;
  severity: string;
  impact: string;
  mitigationPlan?: string;
  reportedBy: string;
  assignedTo?: string;
  dueDate?: string;
};

// GET: Get risks
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const status = searchParams.get('status');
    const severity = searchParams.get('severity');
    
    const query: RiskQuery = {};
    if (projectId) query.project = projectId;
    if (status) query.status = status;
    if (severity) query.severity = severity;
    
    const risks = await Risk.find(query)
      .populate('project', 'name')
      .populate('reportedBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ 
      success: true, 
      risks 
    });
    
  } catch (error) {
    console.error('GET risks error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch risks' 
      },
      { status: 500 }
    );
  }
}

// POST: Create new risk
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const data: RiskRequestBody = await request.json();
    
    // Validation
    if (!data.projectId || !data.title || !data.description || !data.reportedBy) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields' 
        },
        { status: 400 }
      );
    }
    
    // Create risk
    const risk = await Risk.create({
      project: data.projectId,
      title: data.title,
      description: data.description,
      severity: data.severity || 'medium',
      impact: data.impact || 'medium',
      mitigationPlan: data.mitigationPlan || '',
      reportedBy: data.reportedBy,
      assignedTo: data.assignedTo,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      status: 'open'
    });
    
    return NextResponse.json({
      success: true,
      message: 'Risk reported successfully',
      risk
    });
    
  } catch (error) {
    console.error('POST risk error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create risk' 
      },
      { status: 500 }
    );
  }
}