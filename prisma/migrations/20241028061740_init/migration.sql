/*
  Warnings:

  - You are about to drop the column `transactionId` on the `AccessList` table. All the data in the column will be lost.
  - Added the required column `accessId` to the `AccessList` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionRoot` to the `Block` table without a default value. This is not possible if the table is not empty.
  - Added the required column `withdrawalsRoot` to the `Block` table without a default value. This is not possible if the table is not empty.
  - Added the required column `r` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `v` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `yParity` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AccessList" DROP CONSTRAINT "AccessList_transactionId_fkey";

-- AlterTable
ALTER TABLE "AccessList" DROP COLUMN "transactionId",
ADD COLUMN     "accessId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Block" ADD COLUMN     "transactionRoot" TEXT NOT NULL,
ADD COLUMN     "uncles" TEXT[],
ADD COLUMN     "withdrawalsRoot" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "r" TEXT NOT NULL,
ADD COLUMN     "v" TEXT NOT NULL,
ADD COLUMN     "yParity" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Withdrawals" (
    "id" SERIAL NOT NULL,
    "index" TEXT NOT NULL,
    "validatorIndex" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "withdrawalId" INTEGER NOT NULL,

    CONSTRAINT "Withdrawals_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AccessList" ADD CONSTRAINT "AccessList_accessId_fkey" FOREIGN KEY ("accessId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Withdrawals" ADD CONSTRAINT "Withdrawals_withdrawalId_fkey" FOREIGN KEY ("withdrawalId") REFERENCES "Block"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
