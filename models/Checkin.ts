import mongoose from 'mongoose';

const checkinSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'Project is required']
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Employee is required']
  },
  weekStartDate: {
    type: Date,
    required: [true, 'Week start date is required'],
    default: () => {
      const now = new Date();
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday
      return new Date(now.setDate(diff));
    }
  },
  progressSummary: {
    type: String,
    required: [true, 'Progress summary is required'],
    maxlength: [1000, 'Summary cannot exceed 1000 characters']
  },
  blockers: {
    type: String,
    default: '',
    maxlength: [500, 'Blockers cannot exceed 500 characters']
  },
  confidenceLevel: {
    type: Number,
    required: [true, 'Confidence level is required'],
    min: 1,
    max: 5
  },
  completionPercentage: {
    type: Number,
    required: [true, 'Completion percentage is required'],
    min: 0,
    max: 100
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent duplicate checkins for same week
checkinSchema.index({ project: 1, employee: 1, weekStartDate: 1 }, { unique: true });

const Checkin = mongoose.models.Checkin || mongoose.model('Checkin', checkinSchema);
export default Checkin;