/*
  Warnings:

  - You are about to drop the column `blockNumber` on the `Block` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[block_number]` on the table `Block` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `block_number` to the `Block` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Block_blockNumber_key";

-- AlterTable
ALTER TABLE "Block" DROP COLUMN "blockNumber",
ADD COLUMN     "block_number" BIGINT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Block_block_number_key" ON "Block"("block_number");
