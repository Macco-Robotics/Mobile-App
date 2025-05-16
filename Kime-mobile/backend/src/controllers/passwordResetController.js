import User from '../models/user.js';
import { createPasswordResetToken, validateAndUseToken } from '../services/passwordResetTokenService.js';
import { sendResetEmail } from '../utils/emailSender.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const DESPLIEGUE = process.env.REACT_APP_DESPLIEGUE;
const RESET_LINK = `http://${DESPLIEGUE}:9000`;

export const passwordResetRequest = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const token = await createPasswordResetToken(user._id, user.email);
        const resetLink = RESET_LINK + `/reset-password/${token}`;

        const { error, message } = await sendResetEmail(user.email, resetLink);

        if (!error) {
            res.status(200).json({ message, token });
        } else {
            res.status(500).json({ message });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export const passwordResest = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const userId = await validateAndUseToken(token);

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await User.findByIdAndUpdate(userId, { password: hashedPassword});

        res.json({message: "Password successfully updated"});
    } catch (error) {
        res.status(400).json({ message: error.message});
    }
}