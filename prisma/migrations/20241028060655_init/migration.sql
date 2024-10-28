/*
  Warnings:

  - You are about to drop the column `block_number` on the `Block` table. All the data in the column will be lost.
  - You are about to drop the column `contentId` on the `Block` table. All the data in the column will be lost.
  - You are about to drop the column `accessList` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `contentId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `maxFeePerGas` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `maxPriorityFeePerGas` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the `BlockContent` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `baseFeePerGas` to the `Block` table without a default value. This is not possible if the table is not empty.
  - Added the required column `difficulty` to the `Block` table without a default value. This is not possible if the table is not empty.
  - Added the required column `extraData` to the `Block` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gasLimit` to the `Block` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gasUsed` to the `Block` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hash` to the `Block` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logsBloom` to the `Block` table without a default value. This is not possible if the table is not empty.
  - Added the required column `miner` to the `Block` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mixHash` to the `Block` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nonce` to the `Block` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `Block` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parentHash` to the `Block` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiptsRoot` to the `Block` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sha3Uncles` to the `Block` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `Block` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stateRoot` to the `Block` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timestamp` to the `Block` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalDifficulty` to the `Block` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Block" DROP CONSTRAINT "Block_contentId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_contentId_fkey";

-- DropIndex
DROP INDEX "Block_block_number_key";

-- DropIndex
DROP INDEX "Block_contentId_key";

-- AlterTable
ALTER TABLE "Block" DROP COLUMN "block_number",
DROP COLUMN "contentId",
ADD COLUMN     "baseFeePerGas" TEXT NOT NULL,
ADD COLUMN     "difficulty" TEXT NOT NULL,
ADD COLUMN     "extraData" TEXT NOT NULL,
ADD COLUMN     "gasLimit" TEXT NOT NULL,
ADD COLUMN     "gasUsed" TEXT NOT NULL,
ADD COLUMN     "hash" TEXT NOT NULL,
ADD COLUMN     "logsBloom" TEXT NOT NULL,
ADD COLUMN     "miner" TEXT NOT NULL,
ADD COLUMN     "mixHash" TEXT NOT NULL,
ADD COLUMN     "nonce" TEXT NOT NULL,
ADD COLUMN     "number" TEXT NOT NULL,
ADD COLUMN     "parentHash" TEXT NOT NULL,
ADD COLUMN     "receiptsRoot" TEXT NOT NULL,
ADD COLUMN     "sha3Uncles" TEXT NOT NULL,
ADD COLUMN     "size" TEXT NOT NULL,
ADD COLUMN     "stateRoot" TEXT NOT NULL,
ADD COLUMN     "timestamp" TEXT NOT NULL,
ADD COLUMN     "totalDifficulty" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "accessList",
DROP COLUMN "contentId",
DROP COLUMN "maxFeePerGas",
DROP COLUMN "maxPriorityFeePerGas",
ALTER COLUMN "block_number" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "BlockContent";

-- CreateTable
CREATE TABLE "AccessList" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "storageKeys" TEXT[],
    "transactionId" INTEGER NOT NULL,

    CONSTRAINT "AccessList_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_id_fkey" FOREIGN KEY ("id") REFERENCES "Block"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessList" ADD CONSTRAINT "AccessList_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
