const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');
const cors = require('cors');
const Bull = require('bull');
const Redis = require('ioredis');

const app = express();
const prisma = new PrismaClient();
const redisClient = new Redis();  // Default configuration for local Redis

// Set up a Bull queue for block processing
const blockQueue = new Bull('blockQueue', {
  redis: redisClient,
});

// Middleware to parse JSON body
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // Adjust the limit as needed

// Custom middleware to increase request timeout
app.use((req, res, next) => {
  res.setTimeout(120000, () => {  // Increase timeout to 120 seconds
    console.warn('Request has timed out.');
    res.status(504).json({ error: 'Request timed out.' });
  });
  next();
});

// Queue processor for handling blocks
blockQueue.process(async (job) => {
  const blockData = job.data;

  try {
    // Insert block data into the database
    const newBlock = await prisma.block.create({
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
        transactions: {
          create: blockData.transactions.map(tx => ({
            blockHash: tx.blockHash,
            block_number: tx.blockNumber,
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
            accessList: {
              create: (tx.accessList || []).map(access => ({
                address: access.address,
                storageKeys: access.storageKeys,
              })),
            },
            chainId: tx.chainId,
            v: tx.v,
            r: tx.r,
            yParity: tx.yParity,
          })),
        },
        transactionRoot: blockData.transactionRoot,
        uncles: blockData.uncles || [],
        withdrawals: {
          create: blockData.withdrawals.map(withdrawal => ({
            index: withdrawal.index,
            validatorIndex: withdrawal.validatorIndex,
            address: withdrawal.address,
            amount: withdrawal.amount,
          })),
        },
        withdrawalsRoot: blockData.withdrawalsRoot,
      },
    });

    console.log('Block data stored successfully:', newBlock);
    return newBlock;
  } catch (error) {
    console.error('Error storing block data in job processor:', error);
    throw new Error('Failed to store block data');
  }
});

// Endpoint to receive block data
app.post('/blocks', async (req, res) => {
  const blockData = req.body.data;

  try {
    // Add block data to the queue for background processing
    await blockQueue.add(blockData);
    res.json({ message: 'Block data queued successfully for processing.' });
  } catch (error) {
    console.error('Error queuing block data:', error);
    res.status(500).json({ error: 'Failed to queue block data.' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
