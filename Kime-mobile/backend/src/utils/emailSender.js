import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true', 
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

export const sendResetEmail = async (to, resetLink) => {
    const mailOptions = {
        from: process.env.SMTP_USER,
        to: to,
        subject: 'Reset your password',
        html: `
            <p>Hello,</p>
            <p>We received a request to reset your password.</p>
            <p>Click the link below to set a new password:</p>
            <a href="${resetLink}">${resetLink}</a>
            <p>This link will expire in 1 hour.</p>
            <p>If you did not request a password reset, please ignore this email.</p>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        return {
            error: false,
            message: `Email sent: ${info.response}`
        };
    } catch (error) {
        return {
            error: true,
            message: `Error sending email: ${error.message}`
        };
    }
};



