/**
 * This script seeds the database with initial product data.
 * It reads product data from a JSON file and inserts each product into the database using Prisma.
 * After seeding, it disconnects the PrismaClient.
 */

const { PrismaClient } = require('@prisma/client');
const products = require('./products.json');
const prisma = new PrismaClient();

async function main() {
  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }
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
