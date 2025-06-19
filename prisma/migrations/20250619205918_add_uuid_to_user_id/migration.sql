/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `vaporizers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `vaporizers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "vaporizers" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "vaporizers_slug_key" ON "vaporizers"("slug");
