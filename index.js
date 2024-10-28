app.post('/blocks', async (req, res) => {
  const blocksData = req.body.data; // Attempt to retrieve 'data' from the request body

  // Log to check the structure of req.body
  
  if (!Array.isArray(blocksData)) {
      // If blocksData is not an array, respond with an error
      console.error('Invalid data format:', blocksData);
      return res.status(400).json({ error: "Invalid data format; 'data' should be an array." });
  }

  try {
      const newBlocks = await Promise.all(blocksData.map(async (blockData) => {
          // Ensure nested objects exist before accessing their properties
          const transactions = blockData.transactions || [];
          const withdrawals = blockData.withdrawals || [];

          // Create the block entry in your database
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
                  transactions: {
                      create: transactions.map(tx => ({
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
                      create: withdrawals.map(withdrawal => ({
                          index: withdrawal.index,
                          validatorIndex: withdrawal.validatorIndex,
                          address: withdrawal.address,
                          amount: withdrawal.amount,
                      })),
                  },
                  withdrawalsRoot: blockData.withdrawalsRoot,
              },
          });
      }));

      res.json({ message: 'Blocks stored successfully', data: newBlocks });
  } catch (error) {
      console.error('Error storing block data:', error);
      res.status(500).json({ error: 'An error occurred while storing block data.' });
  }
});
