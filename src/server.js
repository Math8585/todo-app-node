import express from 'express';
import 'dotenv/config'
import cors from 'cors';
import prisma from './db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authenticateToken from './middleware.js';
import passport from 'passport';

const PORT = process.env.PORT || 5005;
const app = express();

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: false
}
));

app.use(passport.initialize())
authenticateToken(passport)

app.post('/register', async (req, res) => {
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

    const token = jwt.sign({email: user.email, userId: user.id}, secret, { expiresIn: '1h' });

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const secret = process.env.SECRET_KEY

    const token = jwt.sign({email: user.email, userId: user.id}, secret, { expiresIn: '1h' });

    res.status(200).json({ token: `Bearer ${token}` });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

app.get('/todos', authenticateToken, async (req, res) => {
  try {
    const todos = await prisma.todo.findMany();
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/todos/:categoryId', passport.authenticate('jwt', {session: false}), async(req, res) => {
  const categoryId = req.params.categoryId;
  
  try {
    const category = await prisma.category.findFirst({
        where: {
            id: parseInt(categoryId)
        },
        include: {
            todos: true 
        }
    });

    if (!category) {
        throw new Error(`Category '${categoryId}' not found.`);
    }

    const todos = category.todos;
    res.status(200).json(todos);
} catch (error) {
    console.error('Error fetching todos by category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
});

// app.post('/todos')
// app.patch('/todos/:id')
// app.delete('/todos/:id')

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
