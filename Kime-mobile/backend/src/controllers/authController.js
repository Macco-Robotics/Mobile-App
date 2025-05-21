import bcrypt from 'bcryptjs';
import dotenv from "dotenv";
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
dotenv.config();

export const register = async (req, res) => {
  const {
    user,
    password,
    name,
    surname,
    email,
    postal_code,
    phone_number,
    image,
    role,
    description,
    questionnaire
  } = req.body;

  try {
    const existingUser = await User.findOne({ user });
    if (existingUser) return res.status(400).json({ message: 'Username already exists' });

    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const sanitizedQuestionnaire = questionnaire || {};
    if (sanitizedQuestionnaire.wantsNotifications === false) {
      sanitizedQuestionnaire.notificationTypes = [];
    }

    const newUser = new User({
      user,
      password: hashedPassword,
      name,
      surname,
      email,
      postal_code,
      phone_number,
      image,
      role: role || 'user',
      description,
      questionnaire: sanitizedQuestionnaire
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}

export const login = async (req, res) => {
  const { user, password } = req.body;

  try {
    const existingUser = await User.findOne({ user });
    if (!existingUser) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: existingUser._id, role: existingUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: existingUser._id,
        username: existingUser.user,
        email: existingUser.email,
        role: existingUser.role
      }
    });

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server error', error });
  }
}