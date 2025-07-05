/*
  Warnings:

  - You are about to drop the column `condition` on the `StorePaymentMethod` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[storeId,type]` on the table `StorePaymentMethod` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "StorePaymentMethod_storeId_type_condition_key";

-- AlterTable
ALTER TABLE "StorePaymentMethod" DROP COLUMN "condition";

-- CreateTable
CREATE TABLE "StorePaymentCondition" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "condition" "PaymentCondition" NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "StorePaymentCondition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StorePaymentCondition_storeId_idx" ON "StorePaymentCondition"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "StorePaymentCondition_storeId_condition_key" ON "StorePaymentCondition"("storeId", "condition");

-- CreateIndex
CREATE UNIQUE INDEX "StorePaymentMethod_storeId_type_key" ON "StorePaymentMethod"("storeId", "type");

-- AddForeignKey
ALTER TABLE "StorePaymentCondition" ADD CONSTRAINT "StorePaymentCondition_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;
