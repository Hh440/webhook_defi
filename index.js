/*const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

// Middleware to parse JSON requests
app.use(bodyParser.json());
/*app.post('/block-stream', async (req, res) => {
    console.log("Incoming request body:", req.body); // Log the incoming data
    
    try {
      const { blockNumber, timestamp, transactions } = req.body;
  
      // Validate blockNumber format
      if (!blockNumber || typeof blockNumber !== 'string' || !/^0x[0-9a-fA-F]+$/.test(blockNumber)) {
        return res.status(400).json({ status: 'error', message: 'Invalid blockNumber format. Expected a hexadecimal string.' });
      }
  
      // Convert blockNumber from hexadecimal to BigInt
      const blockNumberBigInt = BigInt(blockNumber);
      
      if (blockNumberBigInt <= 0n) {
        return res.status(400).json({ status: 'error', message: 'blockNumber must be greater than zero.' });
      }
  
      // Validate timestamp
      if (!timestamp || typeof timestamp !== 'number') {
        return res.status(400).json({ status: 'error', message: 'Invalid timestamp format.' });
      }
  
      const timestampDate = new Date(timestamp * 1000); // Convert from seconds to milliseconds
      if (isNaN(timestampDate.getTime())) {
        return res.status(400).json({ status: 'error', message: 'Invalid timestamp value.' });
      }
  
      // Create the block in the database
      const block = await prisma.block.create({
        data: {
          blockNumber: blockNumberBigInt,
          timestamp: timestampDate,
          transactions: transactions.length
        },
      });
  
      await Promise.all(transactions.map(async (tx) => {
        await prisma.transaction.create({
          data: {
            blockId: block.id,
            data: tx,
          },
        });
      }));
  
      res.status(200).json({ status: 'success', message: `Block ${blockNumber} stored successfully with ${transactions.length} transactions.` });
    } catch (error) {
      console.error("Error storing block data:", error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  });
  

  app.post('/block-stream', async (req, res) => {
    console.log("Received request:", JSON.stringify(req.body, null, 2)); // Log the entire request

    const { blockNumber, timestamp, transactions } = req.body;

    

    // Validate timestamp
    if (!timestamp || isNaN(new Date(timestamp))) {
        return res.status(400).json({ status: 'error', message: 'Invalid timestamp format. Expected a valid date.' });
    }

    try {
        // Convert block number to bigint for Prisma
        const blockNumberBigInt = BigInt(blockNumber).toString(); // Convert to string for storage as bigint

        // Create a new block entry in the database
        const newBlock = await prisma.block.create({
            data: {
                blockNumber: blockNumberBigInt, // Store as a string representing bigint
                timestamp: new Date(timestamp * 1000), // Convert timestamp from seconds to milliseconds
                transactions: {
                    create: transactions.map(tx => ({
                        // Add your transaction fields here
                        // Example:
                        // txId: tx.id,
                        // amount: tx.amount


                        blockId: block.id,
                        data: tx,
                    }))
                }
            }
        });

        console.log("New block stored:", newBlock);
        res.status(201).json({ status: 'success', data: newBlock });
    } catch (error) {
        console.error("Error storing block data:", error);
        res.status(500).json({ status: 'error', message: 'Error storing block data.' });
    }
});

  

  app.get('/',async(req,res)=>{
    res.json("this is just an storage endpoint")
  })
  
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
*/



const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');

const app = express();
const prisma = new PrismaClient();

// Middleware to parse JSON body
app.use(bodyParser.json());

// Endpoint to receive block data
app.post('/webhook/block', async (req, res) => {
  const { block_number, content } = req.body;

  // Validate block_number and content
  if (typeof block_number !== 'number' || !content) {
    return res.status(400).json({ error: 'Invalid block data format' });
  }

  try {
    // Create a new block entry in the database
    const blockData = await prisma.block.create({
      data: {
        blockNumber: BigInt(block_number), // Convert block_number to bigint
        content: {
          create: {
            baseFeePerGas: content.baseFeePerGas,
            blobGasUsed: content.blobGasUsed,
            difficulty: content.difficulty,
            excessBlobGas: content.excessBlobGas,
            extraData: content.extraData,
            gasLimit: content.gasLimit,
            gasUsed: content.gasUsed,
            hash: content.hash,
            logsBloom: content.logsBloom,
            miner: content.miner,
            mixHash: content.mixHash,
            nonce: content.nonce,
            number: content.number,
            parentBeaconBlockRoot: content.parentBeaconBlockRoot,
            parentHash: content.parentHash,
            receiptsRoot: content.receiptsRoot,
            sha3Uncles: content.sha3Uncles,
            size: content.size,
            stateRoot: content.stateRoot,
            timestamp: new Date(parseInt(content.timestamp, 16) * 1000), // Convert hex timestamp to Date
            totalDifficulty: content.totalDifficulty,
            transactions: {
              create: content.transactions.map((transaction) => ({
                accessList: transaction.accessList,
                blockHash: transaction.blockHash,
                blockNumber: BigInt(parseInt(transaction.blockNumber, 16)), // Convert hex to bigint
                chainId: BigInt(parseInt(transaction.chainId, 16)), // Convert hex to bigint
                from: transaction.from,
                gas: BigInt(parseInt(transaction.gas, 16)), // Convert hex to bigint
                gasPrice: BigInt(parseInt(transaction.gasPrice, 16)), // Convert hex to bigint
                hash: transaction.hash,
                input: transaction.input,
                maxFeePerGas: BigInt(parseInt(transaction.maxFeePerGas, 16)), // Convert hex to bigint
                maxPriorityFeePerGas: BigInt(parseInt(transaction.maxPriorityFeePerGas, 16)), // Convert hex to bigint
                nonce: BigInt(parseInt(transaction.nonce, 16)), // Convert hex to bigint
                to: transaction.to,
                transactionIndex: BigInt(parseInt(transaction.transactionIndex, 16)), // Convert hex to bigint
                type: BigInt(parseInt(transaction.type, 16)), // Convert hex to bigint
                value: BigInt(parseInt(transaction.value, 16)), // Convert hex to bigint
              })),
            },
          },
        },
      },
    });

    // Respond with success message and stored data
    res.status(201).json({ message: 'Block data stored successfully', blockData });
  } catch (error) {
    console.error('Error storing block data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
