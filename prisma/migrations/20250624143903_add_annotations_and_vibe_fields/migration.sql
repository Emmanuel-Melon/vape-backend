-- CreateEnum
CREATE TYPE "AnnotationType" AS ENUM ('PRO', 'CON', 'TIP', 'NOTE');

-- AlterTable
ALTER TABLE "vaporizers" ADD COLUMN     "contexts" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "discreetness_score" DECIMAL(3,1),
ADD COLUMN     "ease_of_use_score" DECIMAL(3,1),
ADD COLUMN     "moods" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "portability_score" DECIMAL(3,1),
ADD COLUMN     "scenarios" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "annotations" (
    "id" SERIAL NOT NULL,
    "vaporizerId" INTEGER NOT NULL,
    "type" "AnnotationType" NOT NULL,
    "text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "annotations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "annotations" ADD CONSTRAINT "annotations_vaporizerId_fkey" FOREIGN KEY ("vaporizerId") REFERENCES "vaporizers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
