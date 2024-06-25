import prisma from '../db.js';

const getByCategoryId = async (req, res) => {
  const categoryId = req.params.categoryId;
  const currentPage = +req.query.page;
  const pageSize = +req.query.pagesize;

  try {
    const [todos, total] = await Promise.all([
      prisma.todo.findMany({
        skip: pageSize * (currentPage - 1),
        take: pageSize,
        where: {
          categoryId: parseInt(categoryId),
          userId: req.user.id,
        },
      }),
      prisma.todo.count({
        where: {
          categoryId: parseInt(categoryId),
          userId: req.user.id,
        },
      }),
    ]);

    res.status(200).json({ todos, total });
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ error: 'Internal Server Error' });
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
