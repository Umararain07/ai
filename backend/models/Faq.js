import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Please add a question'],
      trim: true,
      maxlength: [500, 'Question can not be more than 500 characters']
    },
    answer: {
      type: String,
      required: [true, 'Please add an answer'],
      maxlength: [5000, 'Answer can not be more than 5000 characters']
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: [
        'general',
        'account',
        'digital-id',
        'security',
        'payments',
        'technical'
      ]
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    helpfulCount: {
      type: Number,
      default: 0
    },
    unhelpfulCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Faq', faqSchema);