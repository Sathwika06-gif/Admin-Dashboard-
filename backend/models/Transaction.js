const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'INR'
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    status: {
      type: String,
      enum: ['created', 'paid', 'failed'],
      default: 'created'
    },
    paymentDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Transaction', transactionSchema);