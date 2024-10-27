const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

// Middleware to parse JSON requests
app.use(bodyParser.json());
app.post('/block-stream', async (req, res) => {
    try {
      const { blockNumber, timestamp, transactions } = req.body;
  
      // Validate blockNumber format
      if (!blockNumber || typeof blockNumber !== 'string' || !/^0x[0-9a-fA-F]+$/.test(blockNumber)) {
        return res.status(400).json({ status: 'error', message: 'Invalid blockNumber format. Expected a hexadecimal string.' });
      }
  
      // Convert blockNumber from hexadecimal to BigInt
      const blockNumberBigInt = BigInt(blockNumber);
      
      if (blockNumberBigInt <= 0n) { // Check if it's a valid BigInt
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
          blockNumber: blockNumberBigInt, // Use BigInt for blockNumber
          timestamp: timestampDate, // Use the validated date
          transactions: transactions.length // Count of transactions
        },
      });
  
      // Store each transaction linked to the block
      await Promise.all(transactions.map(async (tx) => {
        await prisma.transaction.create({
          data: {
            blockId: block.id,
            data: tx, // Store the entire transaction JSON
          },
        });
      }));
  
      res.status(200).json({ status: 'success', message: `Block ${blockNumber} stored successfully with ${transactions.length} transactions.` });
    } catch (error) {
      console.error("Error storing block data:", error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  });
  
  
  

  app.get('/',async(req,res)=>{
    res.json("this is just an storage endpoint")
  })
  
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
