import { PrismaClient, HeatingMethod, TempControl, AnnotationType } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to generate a slug from a name
function generateSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

async function main() {
  console.log(`Start seeding ...`);

  // Clear existing data to make the script idempotent
  await prisma.annotation.deleteMany({});
  await prisma.vaporizer.deleteMany({});
  console.log('Cleared existing vaporizers and annotations.');

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
      moods: ['Uplifting', 'Focused', 'Energetic', 'Creative'],
      contexts: ['Home', 'Outdoors', 'At-home office'],
      scenarios: ['Productivity session', 'Hiking', 'Brainstorming', 'Deep work'],
      portabilityScore: 7.0,
      easeOfUseScore: 8.5,
      discreetnessScore: 6.0,
      annotations: [
        { type: AnnotationType.PRO, text: 'Unmatched airflow and vapor quality.' },
        { type: AnnotationType.PRO, text: 'Heats up in a record-breaking 20 seconds.' },
        { type: AnnotationType.CON, text: 'Premium price tag makes it a significant investment.' },
        { type: AnnotationType.TIP, text: 'Use the companion app to fine-tune the airflow to your exact preference.' }
      ]
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
      moods: ['Relaxing', 'Calm', 'Peaceful', 'Soothed'],
      contexts: ['Home', 'Medical use', 'Therapeutic use', 'Bedtime'],
      scenarios: ['Evening wind-down', 'Pain relief', 'Stress relief', 'Unwinding after work'],
      portabilityScore: 6.5,
      easeOfUseScore: 9.0,
      discreetnessScore: 5.0,
      annotations: [
        { type: AnnotationType.PRO, text: 'Extremely reliable and consistent performance.' },
        { type: AnnotationType.PRO, text: 'Produces cool, smooth, and high-quality vapor.' },
        { type: AnnotationType.CON, text: 'Bulky form factor compared to other portables.' },
      ]
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
      moods: ['Creative', 'Social', 'Happy', 'Playful'],
      contexts: ['Home', 'With friends', 'Casual use', 'Weekend afternoons'],
      scenarios: ['Art project', 'Gaming session', 'Listening to music', 'Social gatherings'],
      portabilityScore: 8.0,
      easeOfUseScore: 8.0,
      discreetnessScore: 7.5,
      annotations: [
        { type: AnnotationType.PRO, text: 'Excellent value for a convection vaporizer.' },
        { type: AnnotationType.PRO, text: 'Replaceable battery is a major plus.' },
        { type: AnnotationType.CON, text: 'Bowl size is best suited for solo sessions.' },
      ]
    },
    {
      name: 'Pax Plus',
      manufacturer: 'Pax Labs',
      msrp: 250,
      heatingMethod: HeatingMethod.CONDUCTION,
      tempControl: TempControl.PRESET,
      expertScore: 8.2,
      userRating: 4.4,
      bestFor: ['Discreet users', 'Beginners', 'Style-conscious users'],
      moods: ['Social', 'Active', 'Confident', 'Spontaneous'],
      contexts: ['On the go', 'Concerts', 'Urban exploration', 'City life', 'Traveling'],
      scenarios: ['Night out', 'Commuting', 'Running errands', 'Attending events'],
      portabilityScore: 9.5,
      easeOfUseScore: 9.5,
      discreetnessScore: 9.8,
      annotations: [
        { type: AnnotationType.PRO, text: 'Incredibly sleek, pocketable, and discreet.' },
        { type: AnnotationType.PRO, text: 'Very easy to use with simple one-button operation.' },
        { type: AnnotationType.CON, text: 'Conduction heating requires a finer grind and occasional stirring.' },
        { type: AnnotationType.TIP, text: 'Use the half-pack oven lid for efficient solo sessions.' }
      ]
    },
    {
      name: 'Arizer Solo II',
      manufacturer: 'Arizer',
      msrp: 165,
      heatingMethod: HeatingMethod.HYBRID,
      tempControl: TempControl.DIGITAL,
      expertScore: 8.8,
      userRating: 4.6,
      bestFor: ['Flavor purists', 'Home use', 'Long sessions'],
      moods: ['Relaxing', 'Mindful', 'Contemplative', 'Mellow'],
      contexts: ['At home', 'Watching a movie', 'Solo sessions', 'Flavor tasting'],
      scenarios: ['Meditation', 'Casual evening use', 'Reading a book', 'Enjoying a hobby'],
      portabilityScore: 5.0,
      easeOfUseScore: 9.0,
      discreetnessScore: 4.0,
      annotations: [
        { type: AnnotationType.PRO, text: 'All-glass vapor path provides exceptional flavor.' },
        { type: AnnotationType.PRO, text: 'Incredible battery life, lasts for hours.' },
        { type: AnnotationType.CON, text: 'Not very portable or discreet due to its size and glass stems.' },
        { type: AnnotationType.TIP, text: 'Use a coarse grind and don’t pack the stem too tightly for best airflow.' }
      ]
    },
    {
      name: 'DaVinci IQC',
      manufacturer: 'DaVinci',
      msrp: 199,
      heatingMethod: HeatingMethod.CONDUCTION,
      tempControl: TempControl.DIGITAL,
      expertScore: 8.4,
      userRating: 4.3,
      bestFor: ['Flavor explorers', 'Tech users', 'Cleanliness-focused users'],
      moods: ['Creative', 'Contemplative', 'Inspired', 'Curious'],
      contexts: ['On the go', 'Personal use', 'Personal indulgence', 'Nature walks'],
      scenarios: ['Journaling', 'Listening to music', 'Museum visit'],
      portabilityScore: 9.0,
      easeOfUseScore: 8.0,
      discreetnessScore: 9.0,
      annotations: [
        { type: AnnotationType.PRO, text: 'Zirconia ceramic vapor path and flavor chamber for pure taste.' },
        { type: AnnotationType.PRO, text: 'Replaceable 18650 battery.' },
        { type: AnnotationType.CON, text: 'Can get hot to the touch during longer sessions.' },
        { type: AnnotationType.TIP, text: 'Load the flavor chamber with a different herb for a unique blended taste experience.' }
      ]
    },
    {
      name: 'Volcano Hybrid',
      manufacturer: 'Storz & Bickel',
      msrp: 699,
      heatingMethod: HeatingMethod.CONVECTION,
      tempControl: TempControl.DIGITAL,
      expertScore: 9.8,
      userRating: 4.9,
      bestFor: ['Group sessions', 'Ultimate vapor quality', 'At-home connoisseurs'],
      moods: ['Social', 'Euphoric', 'Celebratory', 'Communal'],
      contexts: ['Party', 'With friends', 'Medical use at home', 'Hosting guests', 'Special occasions'],
      scenarios: ['Sharing with friends', 'Heavy-duty medication', 'Movie night', 'Deep conversations'],
      portabilityScore: 1.0,
      easeOfUseScore: 9.5,
      discreetnessScore: 1.0,
      annotations: [
        { type: AnnotationType.PRO, text: 'The undisputed king of vapor quality and efficiency.' },
        { type: AnnotationType.PRO, text: 'Can fill bags or be used with a whip for direct draw.' },
        { type: AnnotationType.CON, text: 'Extremely expensive and requires a dedicated space.' },
        { type: AnnotationType.TIP, text: 'The bag system is perfect for sharing and allows vapor to cool before inhalation.' }
      ]
    },
    {
      name: 'DynaVap M Plus',
      manufacturer: 'DynaVap',
      msrp: 89,
      heatingMethod: HeatingMethod.HYBRID,
      tempControl: TempControl.DIGITAL,
      expertScore: 8.9,
      userRating: 4.8,
      bestFor: ['Microdosers', 'Tinkerers', 'Outdoor adventurers'],
      moods: ['Focused', 'Efficient', 'Intentional', 'Grounded'],
      contexts: ['Camping', 'Quick breaks', 'Off-grid', 'Mindful consumption'],
      scenarios: ['Conservation', 'Ritualistic use', 'Morning ritual', 'Quick potent hits'],
      portabilityScore: 10.0,
      easeOfUseScore: 7.0,
      discreetnessScore: 8.5,
      annotations: [
        { type: AnnotationType.PRO, text: 'Incredibly efficient, uses a tiny amount of material.' },
        { type: AnnotationType.PRO, text: 'Battery-free operation makes it perfect for off-grid use.' },
        { type: AnnotationType.CON, text: 'Requires a butane torch or induction heater, which has a learning curve.' },
        { type: AnnotationType.TIP, text: 'Respect the click! Heating past the audible click can lead to combustion.' }
      ]
    }
  ];

  for (const vape of vaporizerData) {
    const slug = generateSlug(vape.name);
    const { annotations, ...vapeData } = vape;

    const createdVaporizer = await prisma.vaporizer.create({
      data: {
        ...vapeData,
        slug: slug,
      },
    });

    console.log(`Created vaporizer: ${createdVaporizer.name}`);

    if (annotations && annotations.length > 0) {
      await prisma.annotation.createMany({
        data: annotations.map((anno) => ({
          ...anno,
          vaporizerId: createdVaporizer.id,
        })),
      });
      console.log(` -> Created ${annotations.length} annotations for ${createdVaporizer.name}.`);
    }
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
