import express from 'express';
import 'dotenv/config'
import cors from 'cors';
import prisma  from './db';


const PORT = process.env.PORT || 5005;
const app = express();

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}
));

app.get('/todos', async (req, res) => {
  try {
    const todos = await prisma.todo.findMany();
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/todos/:category', async (req, res) => {
  const categoryName = req.params.category;
  
  try {
    const category = await prisma.category.findFirst({
        where: {
            name: categoryName
        },
        include: {
            todos: true 
        }
    });

    if (!category) {
        throw new Error(`Category '${categoryName}' not found.`);
    }

    const todos = category.todos;
    res.status(200).json(todos);
} catch (error) {
    console.error('Error fetching todos by category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



