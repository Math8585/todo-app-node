import prisma from '../db.js';

const getByCategoryId = async (req, res) => {
  const categoryId = req.params.categoryId;
  const search = req.query.search || '';

  try {
    const todos = await prisma.todo.findMany({
      skip: parseInt(req.query.skip) || 0,
      take: parseInt(req.query.take) || 10,
      where: {
        categoryId: parseInt(categoryId),
        userId: req.user.id,
        title: {
          contains: search,
          mode: 'insensitive',
        },
      },
    });
    res.status(200).json(todos);
  } catch (error) {
    console.log(error);
  }
};

const create = async (req, res) => {
  const { title, categoryId } = req.body;
  try {
    const newTodo = await prisma.todo.create({
      data: {
        title,
        completed: false,
        categoryId: parseInt(categoryId),
        userId: req.user.id,
      },
    });

    res.status(201).json(newTodo);
  } catch (error) {
    console.log(error);
  }
};

const remove = async (req, res) => {
  const todoId = req.params.id;
  try {
    await prisma.todo.delete({
      where: {
        id: parseInt(todoId),
      },
    });
    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.log(error);
  }
};

const update = async (req, res) => {
  const todoId = req.params.id;
  const { title, completed } = req.body;
  try {
    const newTodo = await prisma.todo.update({
      where: {
        id: parseInt(todoId),
      },

      data: {
        title,
        completed,
      },
   });
   res.status(201).json(newTodo);
  } catch (error) {
    console.log(error);
  }
};

export const todosController = {
  getByCategoryId,
  create,
  remove,
  update,
};
