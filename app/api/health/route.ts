import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import Checkin from '@/models/Checkin';
import Feedback from '@/models/Feedback';

// GET: Calculate health score for a project
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    
    if (!projectId) {
      return NextResponse.json(
        { success: false, error: 'projectId is required' },
        { status: 400 }
      );
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    // Get last 4 weeks of data
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

    // 1. Client Satisfaction (40%)
    const recentFeedback = await Feedback.find({
      project: projectId,
      weekStartDate: { $gte: fourWeeksAgo }
    }).sort({ weekStartDate: -1 }).limit(4);

    const avgSatisfaction = recentFeedback.length > 0
      ? recentFeedback.reduce((acc, f) => acc + f.satisfactionRating, 0) / recentFeedback.length
      : 3;

    // 2. Employee Confidence (30%)
    const recentCheckins = await Checkin.find({
      project: projectId,
      weekStartDate: { $gte: fourWeeksAgo }
    }).sort({ weekStartDate: -1 }).limit(4);

    const avgConfidence = recentCheckins.length > 0
      ? recentCheckins.reduce((acc, c) => acc + c.confidenceLevel, 0) / recentCheckins.length
      : 3;

    // 3. Timeline Progress (20%)
    const totalDays = Math.ceil((project.endDate.getTime() - project.startDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysPassed = Math.ceil((new Date().getTime() - project.startDate.getTime()) / (1000 * 60 * 60 * 24));
    const expectedProgress = Math.min(100, (daysPassed / totalDays) * 100);
    
    const actualProgress = recentCheckins.length > 0
      ? recentCheckins[0].completionPercentage
      : 0;

    const progressDeviation = Math.abs(expectedProgress - actualProgress);
    const timelineScore = Math.max(0, 100 - progressDeviation * 2);

    // 4. Flagged Issues (10%)
    const flaggedIssues = recentFeedback.filter(f => f.flagIssue).length;
    const issuePenalty = flaggedIssues * 10;

    // Calculate final score
    let score = 0;
    score += avgSatisfaction * 8; // 1-5 stars × 8 = 0-40 points
    score += avgConfidence * 6;   // 1-5 confidence × 6 = 0-30 points
    score += timelineScore * 0.2; // 0-100 × 0.2 = 0-20 points
    score -= issuePenalty;        // -10 per flagged issue

    // Clamp between 0-100
    const finalScore = Math.max(0, Math.min(100, Math.round(score)));

    // Determine status
    let status: 'on_track' | 'at_risk' | 'critical' | 'completed' = 'on_track';
    if (finalScore >= 80) status = 'on_track';
    else if (finalScore >= 60) status = 'at_risk';
    else status = 'critical';

    // Update project
    await Project.findByIdAndUpdate(projectId, {
      healthScore: finalScore,
      status
    });

    return NextResponse.json({
      success: true,
      healthScore: finalScore,
      status,
      breakdown: {
        satisfactionScore: Math.round(avgSatisfaction * 8),
        confidenceScore: Math.round(avgConfidence * 6),
        timelineScore: Math.round(timelineScore * 0.2),
        issuePenalty: -issuePenalty
      }
    });

  } catch (error) {
    console.error('Health score error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to calculate health score' },
      { status: 500 }
    );
  }
}

// POST: Trigger health score update for all projects
export async function POST() {
  try {
    await connectDB();
    
    const projects = await Project.find();
    const results = [];
    
    for (const project of projects) {
      const response = await fetch(`http://localhost:3000/api/health?projectId=${project._id}`);
      const data = await response.json();
      results.push({
        project: project.name,
        success: data.success,
        healthScore: data.healthScore
      });
    }
    
    return NextResponse.json({
      success: true,
      message: `Updated health scores for ${results.length} projects`,
      results
    });
    
  } catch (error) {
    console.error('Batch update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update health scores' },
      { status: 500 }
    );
  }
}