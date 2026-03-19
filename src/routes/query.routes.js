const express = require('express');
const router = express.Router();
const { getUniBalance, getEthQuoteForUni } = require('../services/uniswap.service');

router.post('/query', async (req, res) => {
    try {
        const uniBalance = await getUniBalance();
        console.log(`Current UNI balance: ${uniBalance} UNI`);
        
        const ethQuote = await getEthQuoteForUni("10");
        console.log(`ETH needed for 10 UNI: ${ethQuote} ETH`);
        
        res.status(200).json({ 
            message: `Current UNI balance: ${uniBalance} UNI, ETH needed for 10 UNI: ${ethQuote} ETH`,
            uniBalance: uniBalance, 
            ethQuote: ethQuote
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;