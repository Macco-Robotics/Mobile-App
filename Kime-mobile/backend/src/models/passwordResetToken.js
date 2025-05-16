import mongoose from "mongoose";

const Schema = mongoose.Schema;

const passwordResetTokenSchema = new Schema({
    user_id: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'user'
    }, 
    token: {
        type: String, 
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
      },
      used: {
        type: Boolean,
        default: false
      }
});

passwordResetTokenSchema.index({expiresAt: 1}, {expireAfterSeconds: 0})

const PasswordResetToken = mongoose.model('PasswordResetToken', passwordResetTokenSchema);

export default PasswordResetToken; 