import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Checkin from '@/models/Checkin';
import Feedback from '@/models/Feedback';
import Risk from '@/models/Risk';
import Project from '@/models/Project';

type ActivityQuery = {
  project?: string;
  limit?: number;
};

// GET: Get activity timeline
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    const query: ActivityQuery = {};
    if (projectId) query.project = projectId;
    
    // Fetch checkins
    const checkins = await Checkin.find(query)
      .populate('project', 'name')
      .populate('employee', 'name')
      .sort({ submittedAt: -1 })
      .limit(limit);
    
    // Fetch feedback
    const feedbacks = await Feedback.find(query)
      .populate('project', 'name')
      .populate('client', 'name')
      .sort({ submittedAt: -1 })
      .limit(limit);
    
    // Fetch risks
    const risks = await Risk.find(query)
      .populate('project', 'name')
      .populate('reportedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limit);
    
    // Combine and sort all activities
    const activities = [
      ...checkins.map(c => ({
        _id: c._id,
        project: c.project,
        type: 'checkin' as const,
        title: `Weekly Check-in by ${c.employee?.name || 'Employee'}`,
        description: `Progress: ${c.completionPercentage}% | Confidence: ${c.confidenceLevel}/5`,
        user: c.employee,
        createdAt: c.submittedAt
      })),
      ...feedbacks.map(f => ({
        _id: f._id,
        project: f.project,
        type: 'feedback' as const,
        title: `Client Feedback from ${f.client?.name || 'Client'}`,
        description: `Satisfaction: ${f.satisfactionRating}/5 | Communication: ${f.communicationRating}/5`,
        user: f.client,
        createdAt: f.submittedAt
      })),
      ...risks.map(r => ({
        _id: r._id,
        project: r.project,
        type: 'risk' as const,
        title: `Risk Reported: ${r.title}`,
        description: `Severity: ${r.severity} | Status: ${r.status}`,
        user: r.reportedBy,
        createdAt: r.createdAt
      }))
    ];
    
    // Sort by date (newest first)
    activities.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return NextResponse.json({ 
      success: true, 
      activities: activities.slice(0, limit)
    });
    
  } catch (error) {
    console.error('GET activity error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch activity' 
      },
      { status: 500 }
    );
  }
}