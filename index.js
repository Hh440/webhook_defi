const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const prisma = new PrismaClient();

// Middleware to parse JSON body
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // Adjust the limit as needed

// Endpoint to receive block data
app.post('/blocks', async (req, res) => {
  const blocksData = req.body.data; // Retrieve the entire array of blocks

  try {
      const newBlocks = await Promise.all(blocksData.map(async (blockData) => {
          // Convert hexadecimal fields to decimal strings
          

          return await prisma.block.create({
              data: {
                  baseFeePerGas: blockData.baseFeePerGas,
                  difficulty: blockData.difficulty,
                  extraData: blockData.extraData,
                  gasLimit: blockData.gasLimit,
                  gasUsed: blockData.gasUsed,
                  hash: blockData.hash,
                  logsBloom: blockData.logsBloom,
                  miner: blockData.miner,
                  mixHash: blockData.mixHash,
                  nonce: blockData.nonce,
                  number: blockData.number,
                  parentHash: blockData.parentHash,
                  receiptsRoot: blockData.receiptsRoot,
                  sha3Uncles: blockData.sha3Uncles,
                  size: blockData.size,
                  stateRoot: blockData.stateRoot,
                  timestamp: blockData.timestamp,
                  totalDifficulty: blockData.totalDifficulty,
                  transactionRoot: blockData.transactionsRoot,
                  uncles: blockData.uncles,
                  withdrawalsRoot: blockData.withdrawalsRoot,

                  // Map transactions array
                  transactions: {
                      create: blockData.transactions.map((tx) => ({
                          blockHash: tx.blockHash,
                          block_number: tx.block_number,
                          from: tx.from,
                          gas: tx.gas,
                          gasPrice: tx.gasPrice,
                          hash: tx.hash,
                          input: tx.input,
                          nonce: tx.nonce,
                          to: tx.to,
                          transactionIndex: tx.transactionIndex,
                          value: tx.value,
                          type: tx.type,
                          chainId: tx.chainId,
                          v: tx.v,
                          r: tx.r,
                          yParity: tx.yParity,

                          // Map accessList array within each transaction
                          accessList: {
                              create: tx.accessList.map((access) => ({
                                  address: access.address,
                                  storageKeys: access.storageKeys
                              })),
                          },
                      })),
                  },

                  // Map withdrawals array
                  withdrawals: {
                      create: blockData.withdrawals.map((withdrawal) => ({
                          index: parseInt(withdrawal.index, 16).toString(),
                          validatorIndex: parseInt(withdrawal.validatorIndex, 16).toString(),
                          address: withdrawal.address,
                          amount: parseInt(withdrawal.amount, 16).toString(),
                      })),
                  },
              },
          });
      }));

      res.json({ message: 'Blocks stored successfully', data: newBlocks });
  } catch (error) {
      console.error('Error storing block data:', error);
      res.status(500).json({ error: 'An error occurred while storing block data.' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
