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
  
      // Create the block first
      const block = await prisma.block.create({
        data: {
          blockNumber: parseInt(blockNumber, 16), // Convert from hex to decimal
          timestamp: new Date(timestamp * 1000), // Assuming timestamp is in seconds
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
