import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Verifica si el header existe y tiene formato correcto
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no proporcionado o mal formado.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifica token
    req.user = decoded; // Lo guarda en la request
    next(); // Continúa a la siguiente función
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido o expirado.' });
  }
};