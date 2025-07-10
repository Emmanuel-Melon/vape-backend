/*
  Warnings:

  - You are about to drop the column `best_for` on the `vaporizers` table. All the data in the column will be lost.
  - You are about to drop the column `contexts` on the `vaporizers` table. All the data in the column will be lost.
  - You are about to drop the column `moods` on the `vaporizers` table. All the data in the column will be lost.
  - You are about to drop the column `scenarios` on the `vaporizers` table. All the data in the column will be lost.
  - You are about to alter the column `msrp` on the `vaporizers` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.

*/
-- CreateEnum
CREATE TYPE "TagCategory" AS ENUM ('HEATING', 'POWER', 'DELIVERY', 'FEATURES', 'MATERIALS', 'TYPE');

-- AlterEnum
ALTER TYPE "AnnotationType" ADD VALUE 'FEATURE';

-- AlterTable
ALTER TABLE "vaporizers" DROP COLUMN "best_for",
DROP COLUMN "contexts",
DROP COLUMN "moods",
DROP COLUMN "scenarios",
ADD COLUMN     "bowl_size_grams" TEXT,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "community_feedback" TEXT,
ADD COLUMN     "current_price" DECIMAL(10,2),
ADD COLUMN     "ease_of_use_summary" TEXT,
ADD COLUMN     "efficiency_summary" TEXT,
ADD COLUMN     "enthusiastRating" INTEGER,
ADD COLUMN     "heat_up_time_seconds" TEXT,
ADD COLUMN     "maintenance_summary" TEXT,
ADD COLUMN     "power_source" TEXT,
ADD COLUMN     "regular_price" DECIMAL(10,2),
ADD COLUMN     "sale_price" DECIMAL(10,2),
ADD COLUMN     "sub_category" TEXT,
ADD COLUMN     "vapor_quality_summary" TEXT,
ALTER COLUMN "msrp" SET DATA TYPE DECIMAL(10,2);

-- CreateTable
CREATE TABLE "moods" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "moods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contexts" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contexts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scenarios" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scenarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "best_for_tags" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "best_for_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delivery_methods" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "delivery_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accessories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "is_official" BOOLEAN NOT NULL DEFAULT true,
    "vaporizerId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accessories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comparisons" (
    "id" SERIAL NOT NULL,
    "vaporizerId" INTEGER NOT NULL,
    "compared_to_name" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comparisons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ball_vape_details" (
    "id" SERIAL NOT NULL,
    "vaporizerId" INTEGER NOT NULL,
    "ball_material" TEXT,
    "ball_size_mm" DOUBLE PRECISION,
    "ballCount" INTEGER,
    "coil_size_mm" DOUBLE PRECISION,
    "recommended_temp_f" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ball_vape_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mood_to_vaporizer" (
    "moodId" INTEGER NOT NULL,
    "vaporizerId" INTEGER NOT NULL,

    CONSTRAINT "mood_to_vaporizer_pkey" PRIMARY KEY ("moodId","vaporizerId")
);

-- CreateTable
CREATE TABLE "context_to_vaporizer" (
    "contextId" INTEGER NOT NULL,
    "vaporizerId" INTEGER NOT NULL,

    CONSTRAINT "context_to_vaporizer_pkey" PRIMARY KEY ("contextId","vaporizerId")
);

-- CreateTable
CREATE TABLE "scenario_to_vaporizer" (
    "scenarioId" INTEGER NOT NULL,
    "vaporizerId" INTEGER NOT NULL,

    CONSTRAINT "scenario_to_vaporizer_pkey" PRIMARY KEY ("scenarioId","vaporizerId")
);

-- CreateTable
CREATE TABLE "best_for_to_vaporizer" (
    "bestForId" INTEGER NOT NULL,
    "vaporizerId" INTEGER NOT NULL,

    CONSTRAINT "best_for_to_vaporizer_pkey" PRIMARY KEY ("bestForId","vaporizerId")
);

-- CreateTable
CREATE TABLE "delivery_method_to_vaporizer" (
    "deliveryMethodId" INTEGER NOT NULL,
    "vaporizerId" INTEGER NOT NULL,

    CONSTRAINT "delivery_method_to_vaporizer_pkey" PRIMARY KEY ("deliveryMethodId","vaporizerId")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" "TagCategory" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tag_to_vaporizer" (
    "tagId" INTEGER NOT NULL,
    "vaporizerId" INTEGER NOT NULL,

    CONSTRAINT "tag_to_vaporizer_pkey" PRIMARY KEY ("tagId","vaporizerId")
);

-- CreateIndex
CREATE UNIQUE INDEX "moods_name_key" ON "moods"("name");

-- CreateIndex
CREATE UNIQUE INDEX "contexts_name_key" ON "contexts"("name");

-- CreateIndex
CREATE UNIQUE INDEX "scenarios_name_key" ON "scenarios"("name");

-- CreateIndex
CREATE UNIQUE INDEX "best_for_tags_name_key" ON "best_for_tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "delivery_methods_name_key" ON "delivery_methods"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ball_vape_details_vaporizerId_key" ON "ball_vape_details"("vaporizerId");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- AddForeignKey
ALTER TABLE "accessories" ADD CONSTRAINT "accessories_vaporizerId_fkey" FOREIGN KEY ("vaporizerId") REFERENCES "vaporizers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comparisons" ADD CONSTRAINT "comparisons_vaporizerId_fkey" FOREIGN KEY ("vaporizerId") REFERENCES "vaporizers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ball_vape_details" ADD CONSTRAINT "ball_vape_details_vaporizerId_fkey" FOREIGN KEY ("vaporizerId") REFERENCES "vaporizers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mood_to_vaporizer" ADD CONSTRAINT "mood_to_vaporizer_moodId_fkey" FOREIGN KEY ("moodId") REFERENCES "moods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mood_to_vaporizer" ADD CONSTRAINT "mood_to_vaporizer_vaporizerId_fkey" FOREIGN KEY ("vaporizerId") REFERENCES "vaporizers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "context_to_vaporizer" ADD CONSTRAINT "context_to_vaporizer_contextId_fkey" FOREIGN KEY ("contextId") REFERENCES "contexts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "context_to_vaporizer" ADD CONSTRAINT "context_to_vaporizer_vaporizerId_fkey" FOREIGN KEY ("vaporizerId") REFERENCES "vaporizers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scenario_to_vaporizer" ADD CONSTRAINT "scenario_to_vaporizer_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "scenarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scenario_to_vaporizer" ADD CONSTRAINT "scenario_to_vaporizer_vaporizerId_fkey" FOREIGN KEY ("vaporizerId") REFERENCES "vaporizers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "best_for_to_vaporizer" ADD CONSTRAINT "best_for_to_vaporizer_bestForId_fkey" FOREIGN KEY ("bestForId") REFERENCES "best_for_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "best_for_to_vaporizer" ADD CONSTRAINT "best_for_to_vaporizer_vaporizerId_fkey" FOREIGN KEY ("vaporizerId") REFERENCES "vaporizers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery_method_to_vaporizer" ADD CONSTRAINT "delivery_method_to_vaporizer_deliveryMethodId_fkey" FOREIGN KEY ("deliveryMethodId") REFERENCES "delivery_methods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery_method_to_vaporizer" ADD CONSTRAINT "delivery_method_to_vaporizer_vaporizerId_fkey" FOREIGN KEY ("vaporizerId") REFERENCES "vaporizers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tag_to_vaporizer" ADD CONSTRAINT "tag_to_vaporizer_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tag_to_vaporizer" ADD CONSTRAINT "tag_to_vaporizer_vaporizerId_fkey" FOREIGN KEY ("vaporizerId") REFERENCES "vaporizers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
