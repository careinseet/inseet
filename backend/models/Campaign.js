const mongoose = require('mongoose')

const campaignRecipientSchema = new mongoose.Schema(
  {
    name: { type: String, default: '', trim: true },
    email: { type: String, default: '', trim: true, lowercase: true },
    phone: { type: String, default: '', trim: true },
    status: { type: String, enum: ['Pending', 'Sent', 'Opened', 'Failed', 'Replied', 'Follow-up Due'], default: 'Pending' },
    sourceStatus: { type: String, default: '', trim: true },
    lastSentAt: { type: Date, default: null },
    firstOpenedAt: { type: Date, default: null },
    lastOpenedAt: { type: Date, default: null },
    openCount: { type: Number, default: 0 },
    repliedAt: { type: Date, default: null },
    followUpDueAt: { type: Date, default: null },
    error: { type: String, default: '', trim: true },
  },
  { timestamps: true },
)

const campaignSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    channel: { type: String, enum: ['Email Marketing', 'Mobile Message Marketing'], default: 'Email Marketing' },
    subject: { type: String, default: '', trim: true },
    message: { type: String, required: true, trim: true },
    ctaLabel: { type: String, default: '', trim: true },
    ctaUrl: { type: String, default: '', trim: true },
    googleSheetUrl: { type: String, default: '', trim: true },
    status: { type: String, enum: ['Draft', 'Ready', 'Sending', 'Sent', 'Failed'], default: 'Draft' },
    recipientCount: { type: Number, default: 0 },
    sentCount: { type: Number, default: 0 },
    failedCount: { type: Number, default: 0 },
    openedCount: { type: Number, default: 0 },
    repliedCount: { type: Number, default: 0 },
    followUpDueCount: { type: Number, default: 0 },
    recipients: [campaignRecipientSchema],
    createdByName: { type: String, default: '' },
    createdByEmail: { type: String, default: '' },
    lastSentAt: { type: Date, default: null },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Campaign', campaignSchema)
