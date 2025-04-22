import User from '../models/User.js';
import { createHash, isValidPassword } from '../utils/hash.js';
import { generateToken } from '../utils/jwt.js';



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
  
      const token = generateToken(user);
  
      res.status(200).json({ message: 'Login exitoso.', token });
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