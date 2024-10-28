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
const cors = require('cors');

const app = express();
const prisma = new PrismaClient();

// Middleware to parse JSON body
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // Adjust the limit as needed


// Endpoint to receive block data
app.post('/blocks', async (req, res) => {
    const blockData = req.body;
    console.log('Incoming block data:', blockData); // Log incoming data
    
    try {
        const block_number = blockData.block_number;
        const content = blockData.content;

        if (!content) {
            return res.status(400).json({ error: 'Content is required' });
        }

        const newBlock = await prisma.block.create({
            data: {
                block_number,
                content: {
                    create: {
                        baseFeePerGas: content.baseFeePerGas ? BigInt(content.baseFeePerGas) : undefined,
                        blobGasUsed: content.blobGasUsed ? BigInt(content.blobGasUsed) : undefined,
                        difficulty: content.difficulty ? BigInt(content.difficulty) : undefined,
                        excessBlobGas: content.excessBlobGas ? BigInt(content.excessBlobGas) : undefined,
                        extraData: content.extraData,
                        gasLimit: content.gasLimit ? BigInt(content.gasLimit) : undefined,
                        gasUsed: content.gasUsed ? BigInt(content.gasUsed) : undefined,
                        hash: content.hash,
                        logsBloom: content.logsBloom,
                        miner: content.miner,
                        mixHash: content.mixHash,
                        nonce: content.nonce ? BigInt(content.nonce) : undefined,
                        number: content.number ? BigInt(content.number) : undefined,
                        parentBeaconBlockRoot: content.parentBeaconBlockRoot,
                        parentHash: content.parentHash,
                        receiptsRoot: content.receiptsRoot,
                        sha3Uncles: content.sha3Uncles,
                        size: content.size ? BigInt(content.size) : undefined,
                        stateRoot: content.stateRoot,
                        timestamp: new Date(Number(content.timestamp) * 1000), // Convert to milliseconds
                        totalDifficulty: content.totalDifficulty ? BigInt(content.totalDifficulty) : undefined,
                        transactions: {
                            create: content.transactions.map(tx => ({
                                accessList: tx.accessList || [],
                                blockHash: tx.blockHash,
                                blockNumber: blockNumber, // Use blockNumber from the outer context
                                chainId: BigInt(tx.chainId), // Ensure tx.chainId is defined
                                from: tx.from,
                                gas: BigInt(tx.gas), // Ensure tx.gas is defined
                                gasPrice: BigInt(tx.gasPrice), // Ensure tx.gasPrice is defined
                                hash: tx.hash,
                                input: tx.input,
                                maxFeePerGas: BigInt(tx.maxFeePerGas), // Ensure tx.maxFeePerGas is defined
                                maxPriorityFeePerGas: BigInt(tx.maxPriorityFeePerGas), // Ensure tx.maxPriorityFeePerGas is defined
                                nonce: BigInt(tx.nonce), // Ensure tx.nonce is defined
                                to: tx.to,
                                transactionIndex: BigInt(tx.transactionIndex), // Ensure tx.transactionIndex is defined
                                type: BigInt(tx.type), // Ensure tx.type is defined
                                value: BigInt(tx.value), // Ensure tx.value is defined
                            })),
                        },
                    },
                },
            },
        });

        res.json(newBlock);
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
