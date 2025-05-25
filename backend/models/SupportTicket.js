import mongoose from 'mongoose';

const supportTicketSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    subject: {
      type: String,
      required: [true, 'Please add a subject'],
      maxlength: [100, 'Subject can not be more than 100 characters']
    },
    message: {
      type: String,
      required: [true, 'Please add a message'],
      maxlength: [5000, 'Message can not be more than 5000 characters']
    },
    status: {
      type: String,
      enum: ['open', 'pending', 'resolved', 'closed'],
      default: 'open'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    category: {
      type: String,
      enum: [
        'general',
        'account',
        'digital-id',
        'security',
        'payments',
        'technical'
      ],
      required: true
    },
    aiResponse: {
      type: String
    },
    aiConfidence: {
      type: Number,
      min: 0,
      max: 1
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    resolutionNotes: {
      type: String,
      maxlength: [5000, 'Notes can not be more than 5000 characters']
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('SupportTicket', supportTicketSchema);