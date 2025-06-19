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
      heatingMethod: HeatingMethod.HYBRID,
      tempControl: TempControl.DIGITAL,
      expertScore: 9.5,
      userRating: 4.8,
      bestFor: ['Heavy users', 'Vapor quality enthusiasts', 'Tech-savvy users'],
    },
    {
      name: 'Mighty+',
      manufacturer: 'Storz & Bickel',
      msrp: 399,
      heatingMethod: HeatingMethod.HYBRID,
      tempControl: TempControl.DIGITAL,
      expertScore: 9.2,
      userRating: 4.7,
      bestFor: ['Medical users', 'Reliability seekers', 'Smooth vapor preference'],
    },
    {
      name: 'Lobo',
      manufacturer: 'Planet of the Vapes',
      msrp: 159,
      heatingMethod: HeatingMethod.CONVECTION,
      tempControl: TempControl.DIGITAL,
      expertScore: 8.5,
      userRating: 4.5,
      bestFor: ['Flavor chasers', 'Value seekers', 'Moderate users'],
    },
    {
      name: 'TinyMight 2',
      manufacturer: 'TinyMight',
      msrp: 349,
      heatingMethod: HeatingMethod.CONVECTION,
      tempControl: TempControl.DIGITAL,
      expertScore: 9.0,
      userRating: 4.6,
      bestFor: ['Power users', 'On-demand preference', 'Experienced users'],
    },
    // Add more vaporizers from result.json's alternatives if needed
  ];

  for (const vape of vaporizerData) {
    const slug = generateSlug(vape.name);
    // Prisma expects Decimal fields (msrp, expertScore, userRating) to be numbers or string representations of numbers.
    // The current data uses numbers, which is fine.
    // Ensure all data types match the schema (e.g., heatingMethod and tempControl are enums).
    const dataToUpsert = {
      name: vape.name,
      manufacturer: vape.manufacturer,
      msrp: vape.msrp,
      heatingMethod: vape.heatingMethod,
      tempControl: vape.tempControl,
      expertScore: vape.expertScore,
      userRating: vape.userRating,
      bestFor: vape.bestFor,
      slug: slug,
    };

    const createdVaporizer = await prisma.vaporizer.upsert({
      where: { slug },
      update: dataToUpsert,
      create: dataToUpsert,
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
