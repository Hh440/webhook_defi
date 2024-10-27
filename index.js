const express = require('express');
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
  */

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
