/*
  Warnings:

  - Made the column `priceAmount` on table `ProductParameter` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ProductParameter" ALTER COLUMN "priceAmount" SET NOT NULL;

-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "theme" TEXT;
