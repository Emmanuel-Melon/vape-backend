import { PrismaClient, HeatingMethod, TempControl } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to generate a slug from a name
function generateSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

async function main() {
  console.log(`Start seeding ...`);

  const vaporizerData = [
    {
      name: 'Venty',
      manufacturer: 'Storz & Bickel',
      msrp: 449,
      heatingMethod: HeatingMethod.HYBRID, // Assuming 'hybrid' maps to HYBRID
      // tempControl: null, // result.json doesn't specify tempControl for Venty directly, need to decide default or map
      bestFor: ['Heavy users', 'Vapor quality enthusiasts', 'Tech-savvy users'],
    },
    {
      name: 'Mighty+',
      manufacturer: 'Storz & Bickel',
      msrp: 399,
      heatingMethod: HeatingMethod.HYBRID,
      // tempControl: null, // Similarly, decide for Mighty+
      bestFor: ['Medical users', 'Reliability seekers', 'Smooth vapor preference'],
    },
    {
      name: 'Lobo',
      manufacturer: 'Planet of the Vapes',
      msrp: 159,
      heatingMethod: HeatingMethod.CONVECTION,
      // tempControl: null, // Similarly, decide for Lobo
      bestFor: ['Flavor chasers', 'Value seekers', 'Moderate users'],
    },
    {
      name: 'TinyMight 2',
      manufacturer: 'TinyMight',
      msrp: 349,
      heatingMethod: HeatingMethod.CONVECTION,
      // tempControl: null, // Similarly, decide for TinyMight 2
      bestFor: ['Power users', 'On-demand preference', 'Experienced users'],
    },
    // Add more vaporizers from result.json's alternatives if needed
  ];

  for (const vape of vaporizerData) {
    const slug = generateSlug(vape.name);
    const createdVaporizer = await prisma.vaporizer.upsert({
      where: { slug },
      update: { ...vape, slug }, // Ensure slug is included in update if record exists
      create: { ...vape, slug },
    });
    console.log(`Created/updated vaporizer with id: ${createdVaporizer.id} and slug: ${createdVaporizer.slug}`);
  }

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
