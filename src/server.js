import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import authenticateToken from './middleware.js';
import passport from 'passport';

import { todosRouter } from './routes/todos.routes.js';
import { categoryRouter } from './routes/category.routes.js';
import { authRouter } from './routes/auth.routes.js';

const PORT = process.env.PORT || 5005;
const app = express();

app.use(express.json());

app.use(cors({ origins: ['http://localhost:4200', 'https://math8585.github.io'] }));

app.use(passport.initialize());
authenticateToken(passport);

app.use('/api/auth', authRouter);

app.use('/api/todos', todosRouter);

app.use('/api/category', categoryRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
