import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

// Helper para JWT
const generateToken = id =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// @desc    Registrar nuevo usuario
// @route   POST /api/users/register
export const registerUser = async (req, res) => {
  const { user, password, name, surname, email, postal_code, phone_number, image, questionnaire } = req.body;
  try {
    const exists = await User.findOne({ $or: [{ user }, { email }] });
    if (exists) return res.status(400).json({ message: 'Usuario o email ya registrado' });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      user,
      password: hash,
      name,
      surname,
      email,
      postal_code,
      phone_number,
      image,
      questionnaire
    });

    res.status(201).json({
      token: generateToken(newUser._id),
      user: {
        _id: newUser._id,
        user: newUser.user,
        name: newUser.name,
        surname: newUser.surname,
        email: newUser.email,
        postal_code: newUser.postal_code,
        phone_number: newUser.phone_number,
        image: newUser.image,
        role: newUser.role,
        description: newUser.description,
        questionnaire: newUser.questionnaire
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// @desc    Login de usuario
// @route   POST /api/users/login
export const loginUser = async (req, res) => {
  const { user, password } = req.body;
  try {
    const found = await User.findOne({ user });
    if (!found) return res.status(400).json({ message: 'Usuario no encontrado' });

    const isMatch = await bcrypt.compare(password, found.password);
    if (!isMatch) return res.status(400).json({ message: 'Contraseña incorrecta' });

    res.json({
      token: generateToken(found._id),
      user: {
        _id: found._id,
        user: found.user,
        name: found.name,
        surname: found.surname,
        email: found.email,
        postal_code: found.postal_code,
        phone_number: found.phone_number,
        image: found.image,
        role: found.role,
        description: found.description,
        questionnaire: found.questionnaire
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// @desc    Obtener perfil
// @route   GET /api/users/profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// @desc    Actualizar perfil
// @route   PUT /api/users/profile
export const updateProfile = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true, context: 'query' }
    ).select('-password');
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Datos inválidos', error: err.message });
  }
};
