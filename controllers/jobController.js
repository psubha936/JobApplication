const Job = require('../models/jobModel');
const { paginateResults } = require('../utils/paginationHelper');
const path = require('path');
const { sendEmail } = require('../services/emailService'); // Import email service

// Apply Job Page
exports.showApplyJobPage = (req, res) => {
    res.render('applyJob');
};

// Apply Job (Form Submission)
exports.applyJob = async (req, res) => {
    try {
        const { recruiterEmails, position, companyName, experienceYears, resumeLink } = req.body;
        let resumePath = null;

        if (req.file) {
            resumePath = path.join('uploads', req.file.filename);
        }

        // Save job details to MongoDB
        const job = new Job({
            recruiterEmails: recruiterEmails.split(','), // Support multiple emails
            position,
            companyName,
            experienceYears,
            resumeLink: resumePath || resumeLink
        });
        await job.save();

        // Prepare email details for recruiter
        const recruiterMailOptions = {
            to: recruiterEmails.split(','),
            subject: `Application for ${position} at ${companyName}`,
            template: 'recruiterTemplate',
            context: {
                position,
                companyName,
                experienceYears,
                resumeLink: resumePath ? `https://your-domain.com/${resumePath}` : resumeLink
            },
            attachments: resumePath ? [{ path: path.join(__dirname, '..', 'public', resumePath) }] : []
        };

        // Prepare email details for user
        const userMailOptions = {
            to: 'psubha936@gmail.com', // User email
            subject: 'Job Application Submitted',
            template: 'userTemplate',
            context: {
                position,
                companyName
            }
        };

        // Send emails to recruiter and user
        await sendEmail(recruiterMailOptions);
        await sendEmail(userMailOptions);

        res.redirect('/jobs/applied'); // Redirect to applied jobs page after success
    } catch (error) {
        res.status(500).send('Failed to apply for job');
    }
};

// Show Applied Jobs (with pagination)
exports.getAppliedJobs = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const jobs = await paginateResults(Job, page, limit);
        const total = await Job.countDocuments();

        res.render('appliedJobs', {
            jobs,
            page: parseInt(page),
            limit: parseInt(limit),
            total
        });
    } catch (error) {
        res.status(500).send('Failed to fetch applied jobs');
    }
};

// Status update handler
exports.updateJobStatus = async (req, res) => {
    try {
        const { jobId, status } = req.body;

        // Update the job's status in MongoDB
        await Job.findByIdAndUpdate(jobId, { status: status });

        // Redirect or send a success response
        res.redirect('/jobs/applied');
    } catch (error) {
        res.status(500).send('Failed to update job status');
    }
};
