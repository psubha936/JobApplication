const mongoose = require('mongoose');
const jobSchema = new mongoose.Schema({
    recruiterEmail: String,
    position: String,
    companyName: String,
    experienceYears: Number,
    resumeLink: String,
    status: {
        type: String,
        enum: ['in-progress', 'selected', 'rejected'],
        default: 'in-progress'
    },
    appliedDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', jobSchema);
