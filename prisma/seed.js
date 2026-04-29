const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting deep seeding for analytics...');

  // 1. Create Categories
  const categories = [
    { name: 'Infrastructure', desc: 'Roads, bridges, public buildings', priority: 3 },
    { name: 'Sanitation', desc: 'Garbage, toilets, drains', priority: 2 },
    { name: 'Utilities', desc: 'Water, electricity supply', priority: 3 },
    { name: 'Environment', desc: 'Parks, pollution, trees', priority: 1 },
    { name: 'Safety', desc: 'Street lights, emergency services', priority: 3 },
  ];

  const createdCats = [];
  for (const cat of categories) {
    const c = await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: { name: cat.name, description: cat.desc, priorityLevel: cat.priority },
    });
    createdCats.push(c);
  }

  // 2. Create Users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@citypulse.com' },
    update: {},
    create: { email: 'admin@citypulse.com', password: adminPassword, name: 'Super Admin', role: 'ADMIN' },
  });

  const userPassword = await bcrypt.hash('user123', 10);
  const citizen = await prisma.user.upsert({
    where: { email: 'citizen@example.com' },
    update: {},
    create: { email: 'citizen@example.com', password: userPassword, name: 'John Citizen', role: 'USER' },
  });

  // 3. Create a lot of complaints for diverse analytics
  const statuses = ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];
  const locations = [
    { addr: 'Kothrud, Pune', lat: 18.5074, lng: 73.8077 },
    { addr: 'Shivajinagar, Pune', lat: 18.5308, lng: 73.8475 },
    { addr: 'Hinjewadi IT Park', lat: 18.5913, lng: 73.7389 },
    { addr: 'Viman Nagar', lat: 18.5679, lng: 73.9143 },
    { addr: 'Hadapsar', lat: 18.5089, lng: 73.9259 },
    { addr: 'Baner Road', lat: 18.5590, lng: 73.8031 },
  ];

  const titles = [
    'Street light not working', 'Leaking water pipe', 'Garbage overflow', 
    'Road pothole', 'Illegal parking', 'Noise pollution from factory',
    'Park bench broken', 'Drainage blockage', 'Tree fallen on road'
  ];

  console.log('Generating 20+ complaints...');
  for (let i = 0; i < 25; i++) {
    const loc = locations[i % locations.length];
    const cat = createdCats[i % createdCats.length];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const date = new Date();
    date.setMonth(date.getMonth() - Math.floor(Math.random() * 6)); // Random month in last 6 months

    await prisma.complaint.create({
      data: {
        title: titles[i % titles.length] + ' #' + (i + 1),
        description: 'Automated report for ' + titles[i % titles.length] + '. Requires immediate attention from municipal authorities.',
        status: status,
        lat: loc.lat + (Math.random() - 0.5) * 0.01,
        lng: loc.lng + (Math.random() - 0.5) * 0.01,
        address: loc.addr,
        userId: citizen.id, // Assign most to citizen to see data on dashboard
        categoryId: cat.id,
        createdAt: date,
      }
    });
  }

  // Also give 1-2 to the admin so they don't see "0"
  await prisma.complaint.create({
    data: {
      title: 'Admin Test Report',
      description: 'System verification report.',
      status: 'RESOLVED',
      lat: 18.5204,
      lng: 73.8567,
      address: 'Main Command Center',
      userId: admin.id,
      categoryId: createdCats[0].id,
    }
  });

  console.log('Deep seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
