const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();

// Configurações
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve o seu index.html automaticamente

const MP_ACCESS_TOKEN = 'APP_USR-7500112478325134-021111-12c64fd8a13547f6e00ff7db6f9ffd73-290268833';

// Rota que seu front-end vai chamar
app.post('/processar-pagamento', async (req, res) => {
    try {
        const response = await axios.post('https://api.mercadopago.com/v1/payments', req.body, {
            headers: {
                'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
                'X-Idempotency-Key': Date.now().toString()
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Erro MP:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Erro ao gerar Pix' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});