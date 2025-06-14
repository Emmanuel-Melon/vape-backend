-- CreateEnum
CREATE TYPE "HeatingMethod" AS ENUM ('HYBRID', 'CONVECTION', 'CONDUCTION');

-- CreateEnum
CREATE TYPE "TempControl" AS ENUM ('DIGITAL', 'ANALOG', 'APP', 'PRESET');

-- CreateTable
CREATE TABLE "vaporizers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "manufacturer" TEXT,
    "msrp" DECIMAL(65,30),
    "release_date" DATE,
    "heating_method" "HeatingMethod",
    "temp_control" "TempControl",
    "expert_score" DECIMAL(3,1),
    "user_rating" DECIMAL(2,1),
    "best_for" TEXT[],

    CONSTRAINT "vaporizers_pkey" PRIMARY KEY ("id")
);
