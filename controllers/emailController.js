const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Setup transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Send email with template
exports.sendEmail = async (to, position, companyName, resumeLink) => {
    try {
        const template = fs.readFileSync(path.join(__dirname, '../templates/recruiterTemplate.html'), 'utf8');

        const emailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject: `Application for ${position}`,
            html: template.replace('{{companyName}}', companyName).replace('{{position}}', position).replace('{{resumeLink}}', resumeLink)
        };

        await transporter.sendMail(emailOptions);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
