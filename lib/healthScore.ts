import Project from '@/models/Project';
import Checkin from '@/models/Checkin';
import Feedback from '@/models/Feedback';

export async function calculateHealthScore(projectId: string): Promise<number> {
  try {
    const project = await Project.findById(projectId);
    if (!project) return 0;

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
      : 3; // Default neutral rating

    // 2. Employee Confidence (30%)
    const recentCheckins = await Checkin.find({
      project: projectId,
      weekStartDate: { $gte: fourWeeksAgo }
    }).sort({ weekStartDate: -1 }).limit(4);

    const avgConfidence = recentCheckins.length > 0
      ? recentCheckins.reduce((acc, c) => acc + c.confidenceLevel, 0) / recentCheckins.length
      : 3; // Default neutral

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

    // Determine status based on score
    let status: 'on_track' | 'at_risk' | 'critical' | 'completed' = 'on_track';
    if (finalScore >= 80) status = 'on_track';
    else if (finalScore >= 60) status = 'at_risk';
    else status = 'critical';

    // Update project
    await Project.findByIdAndUpdate(projectId, {
      healthScore: finalScore,
      status
    });

    return finalScore;
  } catch (error) {
    console.error('Health score calculation error:', error);
    return 0;
  }
}