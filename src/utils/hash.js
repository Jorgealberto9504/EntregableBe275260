import bcrypt from 'bcrypt';

// Crea un hash a partir de una contraseña
export const createHash = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

// Compara una contraseña con su hash para verificar si es válida
export const isValidPassword = (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};