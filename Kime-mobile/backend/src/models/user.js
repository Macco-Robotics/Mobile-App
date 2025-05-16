import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    user: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    postal_code: { type: String, required: true },
    phone_number: { type: String, required: true },
    image: { type: String, default: '' },
    role: { type: String, enum: ['owner', 'user'], default: 'user' },
    description: { type: String, default: '' }
  }, { collection: "user"});

  const User = mongoose.model("User", userSchema);

  export default User;