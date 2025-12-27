import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['checkin', 'feedback', 'risk', 'health_updated', 'status_change'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  metadata: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true
});

export default mongoose.models.Activity || mongoose.model('Activity', activitySchema);