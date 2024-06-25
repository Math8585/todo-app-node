import prisma from '../db.js';

const getAll = async (req, res) => {

  try {
    const categories = await prisma.category.findMany({
      where: {
        userId: req.user.id,
      },
    });
    res.status(200).json(categories);
  } catch (error) {
    console.log(error);
  }
};

const getById = async (req, res) => {
  const categoryId = req.params.id;
 
  try {
    const category = await prisma.category.findFirst({
      where: {
        id: parseInt(categoryId),
      },
    });
    res.status(200).json(category);
  } catch (error) {
    console.log(error);
  }
};

const create = async (req, res) => {
  const { name } = req.body;
  try {
    const newCategory = await prisma.category.create({
      data: {
        name,
        userId: req.user.id,
      },
    });

    res.status(201).json(newCategory);
  } catch (error) {
    console.log(error);
  }
};

const remove = async (req, res) => {
  const categoryId = req.params.id;
  try {

    await prisma.todo.deleteMany({
      where: {
        categoryId: parseInt(categoryId),
      },
    })

    await prisma.category.delete({
      where: {
        id: parseInt(categoryId),
      },
    });
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.log(error);
  }
};

const update = async (req, res) => {
  const categoryId = req.params.id;
  const { name } = req.body;
  try {
    const newCategory = await prisma.category.update({
      where: {
        id: parseInt(categoryId),
      },

      data: {
        name,
      },
     });
     res.status(201).json(newCategory);
  } catch (error) {
    console.log(error);
  }
};

export const caregoryController = {
  getAll,
  getById,
  create,
  remove,
  update,
};
