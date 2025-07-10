import { PrismaClient } from '@prisma/client';
import { moods, contexts, scenarios, bestFors, deliveryMethods, vaporizerData } from './data';
import { generateSlug, findIdsByNames } from './utils';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  await prisma.annotation.deleteMany({});
  await prisma.vaporizer.deleteMany({});
  await prisma.mood.deleteMany({});
  await prisma.context.deleteMany({});
  await prisma.scenario.deleteMany({});
  await prisma.bestFor.deleteMany({});
  await prisma.deliveryMethod.deleteMany({});
  
  console.log('Cleared existing data.');

  
  await prisma.mood.createMany({
    data: moods
  });

  await prisma.context.createMany({
    data: contexts
  });
  
  await prisma.scenario.createMany({
    data: scenarios
  });

  await prisma.bestFor.createMany({
    data: bestFors
  });
  
  await prisma.deliveryMethod.createMany({
    data: deliveryMethods
  });


  const allMoods = await prisma.mood.findMany({ select: { id: true, name: true } });
  const allContexts = await prisma.context.findMany({ select: { id: true, name: true } });
  const allScenarios = await prisma.scenario.findMany({ select: { id: true, name: true } });
  const allBestFors = await prisma.bestFor.findMany({ select: { id: true, name: true } });
  const allDeliveryMethods = await prisma.deliveryMethod.findMany({ select: { id: true, name: true } });
  


  for (const vape of vaporizerData) {
    const slug = generateSlug(vape.name);
    const { annotations, moods, contexts, scenarios, bestFor, deliveryMethods, ...vapeData } = vape;

    const createdVaporizer = await prisma.vaporizer.create({
      data: {
        ...vapeData,
        slug: slug,
      },
    });

    if (annotations && annotations.length > 0) {
      await prisma.annotation.createMany({
        data: annotations.map((anno) => ({
          ...anno,
          vaporizerId: createdVaporizer.id,
        })),
      });
    }
    
    if (moods && moods.length > 0) {
      const moodIds = findIdsByNames(allMoods as any[], moods);
      for (const moodId of moodIds) {
        await prisma.moodToVaporizer.create({ data: { moodId, vaporizerId: createdVaporizer.id } });
      }
    }
    
    if (contexts && contexts.length > 0) {
      const contextIds = findIdsByNames(allContexts as any[], contexts);
      for (const contextId of contextIds) {
        await prisma.contextToVaporizer.create({ data: { contextId, vaporizerId: createdVaporizer.id } });
      }
    }
    
    if (scenarios && scenarios.length > 0) {
      const scenarioIds = findIdsByNames(allScenarios as any[], scenarios);
      for (const scenarioId of scenarioIds) {
        await prisma.scenarioToVaporizer.create({ data: { scenarioId, vaporizerId: createdVaporizer.id } });
      }
    }
    
    if (bestFor && bestFor.length > 0) {
      const bestForIds = findIdsByNames(allBestFors as any[], bestFor);
      for (const bestForId of bestForIds) {
        await prisma.bestForToVaporizer.create({ data: { bestForId, vaporizerId: createdVaporizer.id } });
      }
    }

    if (deliveryMethods && deliveryMethods.length > 0) {
      const deliveryIds = findIdsByNames(allDeliveryMethods as any[], deliveryMethods);
      for (const deliveryId of deliveryIds) {
        await prisma.deliveryMethodToVaporizer.create({ data: { deliveryMethodId: deliveryId, vaporizerId: createdVaporizer.id } });
      }
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
