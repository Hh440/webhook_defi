/*
  Warnings:

  - You are about to drop the column `blockNumber` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `block_number` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Block" ALTER COLUMN "block_number" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "BlockContent" ALTER COLUMN "timestamp" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "blockNumber",
ADD COLUMN     "block_number" BIGINT NOT NULL,
ALTER COLUMN "chainId" SET DATA TYPE TEXT,
ALTER COLUMN "gas" SET DATA TYPE TEXT,
ALTER COLUMN "gasPrice" SET DATA TYPE TEXT,
ALTER COLUMN "maxFeePerGas" SET DATA TYPE TEXT,
ALTER COLUMN "maxPriorityFeePerGas" SET DATA TYPE TEXT,
ALTER COLUMN "nonce" SET DATA TYPE TEXT,
ALTER COLUMN "transactionIndex" SET DATA TYPE TEXT,
ALTER COLUMN "type" SET DATA TYPE TEXT,
ALTER COLUMN "value" SET DATA TYPE TEXT;
