import User from '../models/User.js';
import { createHash, isValidPassword } from '../utils/hash.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();



export const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El email ya está registrado.' });
    }

    // Hashear la contraseña
    const hashedPassword = await createHash(password);

    // Crear y guardar el nuevo usuario
    const newUser = new User({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'Usuario registrado exitosamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar usuario.', error: error.message });
  }
};



export const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'Usuario no encontrado.' });
  
      const validPassword = await isValidPassword(password, user.password);
      if (!validPassword) return res.status(401).json({ message: 'Contraseña incorrecta.' });
  
      const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.cookie('jwt', token, {
        httpOnly: true,
        secure: false,
        sameSite:"strict",
        maxAge: 3600000, // 1 hour
      });
  
      res.status(200).json({ message: 'Login exitoso.', user:{email:user.email}});
    } catch (error) {
      res.status(500).json({ message: 'Error en login.', error: error.message });
    }
  };

  export const getProfile = (req, res) => {
    res.status(200).json({
      message: 'Perfil del usuario',
      user: req.user,
    });
  };


export const updateUser = async (req, res) => {
  try {
    const { email } = req.params;

    if (req.user.role !== 'admin' && req.user.email !== email) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    const updatedUser = await User.findOneAndUpdate({ email }, req.body, { new: true }).select('-password');
    if (!updatedUser) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { email } = req.params;

    if (req.user.role !== 'admin' && req.user.email !== email) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    await User.findOneAndDelete({ email });
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
  }
};