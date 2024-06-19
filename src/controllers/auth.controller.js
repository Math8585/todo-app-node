import prisma from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    });
    const secret = process.env.SECRET_KEY

    const token = jwt.sign({ email: user.email, userId: user.id }, secret, { expiresIn: '1h' });

    res.status(201).json({ message: 'User registered successfully', token: `Bearer ${token}` });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const secret = process.env.SECRET_KEY

    const token = jwt.sign({email: user.email, userId: user.id}, secret, { expiresIn: '1h' });

    res.status(200).json({ token: `Bearer ${token}` });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
}


export const authController = {
  register,
  login,
};
