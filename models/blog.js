const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String },
    body: { type: String, required: true },
    tags: [{ type: String }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    state: { type: String, enum: ['draft', 'published'], default: 'draft' },
    read_count: { type: Number, default: 0 },
    reading_time: { type: Number }, // in minutes
    timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Blog', BlogSchema);