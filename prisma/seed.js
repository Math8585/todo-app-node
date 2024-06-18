const { PrismaClient } = require('@prisma/client');

const todos = [
  { title: 'write book', completed: false, category: 'work' },
  { title: 'learn something', completed: true, category: 'work'},
  { title: 'read article', completed: true, category: 'work' },
  { title: 'buy flower', completed: false, category: 'grocery' },
]

const categories = [
  { name: 'work' },
  { name: 'grocery' },
];


const prisma = new PrismaClient();

async function main() {
  await prisma.todo.deleteMany();
  await prisma.category.deleteMany();

  const createdCategories = {};

  for (const category of categories) {
    const createdCategory = await prisma.category.create({
      data: category,
    });
    createdCategories[category.name] = createdCategory.id;
  }

  for (const todo of todos) {
    await prisma.todo.create({
      data: {
        title: todo.title,
        completed: todo.completed,
        category: {
          connect: { id: createdCategories[todo.category] },
        },
      },
    });
  }

  console.log('Database seeded!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
