import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'Project is required']
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Client is required']
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
  satisfactionRating: {
    type: Number,
    required: [true, 'Satisfaction rating is required'],
    min: 1,
    max: 5
  },
  communicationRating: {
    type: Number,
    required: [true, 'Communication rating is required'],
    min: 1,
    max: 5
  },
  comments: {
    type: String,
    default: '',
    maxlength: [500, 'Comments cannot exceed 500 characters']
  },
  flagIssue: {
    type: Boolean,
    default: false
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent duplicate feedback for same week
feedbackSchema.index({ project: 1, client: 1, weekStartDate: 1 }, { unique: true });

const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);
export default Feedback;