const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const prisma = new PrismaClient();

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

// Endpoint to receive block data
app.post('/blocks', async (req, res) => {
  const blockData = req.body.data;

  try {
    // Respond immediately to the client
    res.json({ message: 'Block data received and processing started.' });

    // Process block data asynchronously
    setImmediate(async () => {
      try {
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
      } catch (error) {
        console.error('Error storing block data in background task:', error);
      }
    });
  } catch (error) {
    console.error('Error queuing block data:', error);
    res.status(500).json({ error: 'Failed to receive block data.' });
  }
});

app.get('/blocks', async (req, res) => {
  try {
    const blocks = await prisma.block.findMany({
      orderBy: {
        id: 'desc', // Sort in descending order to get the latest blocks first
      },
      take: 5, // Limit the result to the latest 20 blocks
      include: {
        transactions: false, // Include transactions if needed
        withdrawals: false, // Include withdrawals if needed
      },
    });
    res.json(blocks);
  } catch (error) {
    console.error('Error fetching blocks:', error);
    res.status(500).json({ error: 'Failed to fetch blocks' });
  }
});

app.get('/transactions', async (req, res) => {
  try {
    const transaction = await prisma.transaction.findMany({
      orderBy: {
        id: 'desc', // Sort in descending order to get the latest blocks first
      },
      take: 5, // Limit the result to the latest 20 blocks
      include: {
        accessList : false
      },
    });
    res.json(transaction);
  } catch (error) {
    console.error('Error fetching trasactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
