const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

// Setup transporter with Gmail service
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,  // Gmail user from .env
        pass: process.env.EMAIL_PASS  // App password from .env
    }
});
console.log('Process from dotEnv',process.env.EMAIL_USER, process.env.EMAIL_PASS);
// Send email function
exports.sendEmail = async (emailOptions) => {
    try {
        const templatePath = path.join(__dirname, '..', 'templates', `${emailOptions.template}.html`);
        const htmlContent = await ejs.renderFile(templatePath, emailOptions.context);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: emailOptions.to,
            subject: emailOptions.subject,
            html: htmlContent,
            attachments: emailOptions.attachments || []
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to: ${emailOptions.to}`);
        return { success: true };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error: error.message };
    }
};
