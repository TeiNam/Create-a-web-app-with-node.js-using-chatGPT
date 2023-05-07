// exchangeRouter.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', async (req, res) => {
    try {
        const response = await axios.get('https://api.exchangeratesapi.io/latest?base=USD&symbols=KRW');
        const exchangeRate = response.data.rates.KRW;
        res.status(200).json({ exchangeRate });
    } catch (error) {
        console.error('Error fetching exchange rate:', error);
        res.status(500).send('Error fetching exchange rate');
    }
});

module.exports = router;
