import mongoose from 'mongoose';

const digitalIdSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    idNumber: {
      type: String,
      required: true,
      unique: true
    },
    qrCode: {
      type: String,
      required: true
    },
    issuedDate: {
      type: Date,
      default: Date.now
    },
    expiryDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'revoked'],
      default: 'active'
    },
    verificationLevel: {
      type: Number,
      min: 0,
      max: 100,
      default: 100
    },
    metadata: {
      type: Object,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('DigitalId', digitalIdSchema);