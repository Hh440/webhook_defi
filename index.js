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
   

    try {
        

        // Create new block and transactions
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
                stateRoot: blockData.stateRoot,
                timestamp: blockData.timestamp,
                totalDifficulty: blockData.totalDifficulty,
                transactions: {
                    create: blockData.transactions.map(transaction => ({
                        blockHash: transaction.blockHash,
                        blockNumber: transaction.block_number,
                        from: transaction.from,
                        gas: transaction.gas,
                        gasPrice: transaction.gasPrice,
                        hash: transaction.hash,
                        input: transaction.input,
                        nonce: transaction.nonce,
                        to: transaction.to,
                        transactionIndex: transaction.transactionIndex,
                        type: transaction.type,
                        value: transaction.value,
                        chainId: transaction.chainId,
                        accessList: {
                            create: transaction.accessList.map(access => ({
                                address: access.address,
                                storageKeys: access.storageKeys
                            }))
                        }
                    }))
                },
                // Handle uncles if necessary
                uncles: blockData.uncles,
                withdrawals: {
                    create: blockData.withdrawals.map(withdrawal => ({
                        index: withdrawal.index,
                        validatorIndex: withdrawal.validatorIndex,
                        address: withdrawal.address,
                        amount: withdrawal.amount
                    }))
                },
                transactionRoot: blockData.transactionRoot,
                withdrawalsRoot: blockData.withdrawalsRoot
            }
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
