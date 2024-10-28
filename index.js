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
        const content = blockData.content;

        if (!content) {
            return res.status(400).json({ error: 'Content is required' });
        }

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
                    create: Array.isArray(blockData.transactions) ? blockData.transactions.map(transaction => ({
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
                            create: Array.isArray(transaction.accessList) ? transaction.accessList.map(access => ({
                                address: access.address,
                                storageKeys: access.storageKeys
                            })) : [] // Default to empty array if not an array
                        }
                    })) : [] // Default to empty array if not an array
                },
                // Handle uncles if necessary
                uncles: blockData.uncles,
                withdrawals: {
                    create: Array.isArray(blockData.withdrawals) ? blockData.withdrawals.map(withdrawal => ({
                        index: withdrawal.index,
                        validatorIndex: withdrawal.validatorIndex,
                        address: withdrawal.address,
                        amount: withdrawal.amount
                    })) : [] // Default to empty array if not an array
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
