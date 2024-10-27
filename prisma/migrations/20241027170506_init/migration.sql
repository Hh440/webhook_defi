/*
  Warnings:

  - You are about to drop the column `timestamp` on the `Block` table. All the data in the column will be lost.
  - You are about to drop the column `blockId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `data` on the `Transaction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[blockNumber]` on the table `Block` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[contentId]` on the table `Block` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `contentId` to the `Block` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accessList` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `blockHash` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `blockNumber` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chainId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contentId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `from` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gas` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gasPrice` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hash` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `input` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxFeePerGas` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxPriorityFeePerGas` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nonce` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionIndex` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_blockId_fkey";

-- AlterTable
ALTER TABLE "Block" DROP COLUMN "timestamp",
ADD COLUMN     "contentId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "blockId",
DROP COLUMN "data",
ADD COLUMN     "accessList" JSONB NOT NULL,
ADD COLUMN     "blockHash" TEXT NOT NULL,
ADD COLUMN     "blockNumber" BIGINT NOT NULL,
ADD COLUMN     "chainId" BIGINT NOT NULL,
ADD COLUMN     "contentId" INTEGER NOT NULL,
ADD COLUMN     "from" TEXT NOT NULL,
ADD COLUMN     "gas" BIGINT NOT NULL,
ADD COLUMN     "gasPrice" BIGINT NOT NULL,
ADD COLUMN     "hash" TEXT NOT NULL,
ADD COLUMN     "input" TEXT NOT NULL,
ADD COLUMN     "maxFeePerGas" BIGINT NOT NULL,
ADD COLUMN     "maxPriorityFeePerGas" BIGINT NOT NULL,
ADD COLUMN     "nonce" BIGINT NOT NULL,
ADD COLUMN     "to" TEXT NOT NULL,
ADD COLUMN     "transactionIndex" BIGINT NOT NULL,
ADD COLUMN     "type" BIGINT NOT NULL,
ADD COLUMN     "value" BIGINT NOT NULL;

-- CreateTable
CREATE TABLE "BlockContent" (
    "id" SERIAL NOT NULL,
    "baseFeePerGas" TEXT NOT NULL,
    "blobGasUsed" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "excessBlobGas" TEXT NOT NULL,
    "extraData" TEXT NOT NULL,
    "gasLimit" TEXT NOT NULL,
    "gasUsed" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "logsBloom" TEXT NOT NULL,
    "miner" TEXT NOT NULL,
    "mixHash" TEXT NOT NULL,
    "nonce" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "parentBeaconBlockRoot" TEXT NOT NULL,
    "parentHash" TEXT NOT NULL,
    "receiptsRoot" TEXT NOT NULL,
    "sha3Uncles" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "stateRoot" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "totalDifficulty" TEXT NOT NULL,

    CONSTRAINT "BlockContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Block_blockNumber_key" ON "Block"("blockNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Block_contentId_key" ON "Block"("contentId");

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "BlockContent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "BlockContent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
