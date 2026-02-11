const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const MP_ACCESS_TOKEN = 'APP_USR-7500112478325134-021111-12c64fd8a13547f6e00ff7db6f9ffd73-290268833';

app.post('/gerar-pix', async (req, res) => {
    try {
        const response = await axios.post('https://api.mercadopago.com/v1/payments', req.body, {
            headers: {
                'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
                'X-Idempotency-Key': Date.now().toString()
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json(error.response.data);
    }
});

app.listen(3000, () => console.log('Servidor de pagamentos rodando na porta 3000'));