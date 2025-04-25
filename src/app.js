import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './routes/users.routes.js';
import passport from 'passport';
import './config/passport.js';
import sessionRoutes from './routes/sessions.routes.js';
import cookieParser from 'cookie-parser';




dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cookieParser());
app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error al conectar a MongoDB:', err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})