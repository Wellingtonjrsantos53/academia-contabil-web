const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Seu Token de Produção
const MP_ACCESS_TOKEN = 'APP_USR-7500112478325134-021111-12c64fd8a13547f6e00ff7db6f9ffd73-290268833';

// ROTA 1: Gerar o pagamento (PIX)
app.post('/processar-pagamento', async (req, res) => {
    try {
        const paymentData = {
            transaction_amount: 2.00, // Valor da recarga
            description: 'Recarga 30 dias - Academia Contábil',
            payment_method_id: 'pix',
            payer: {
                email: req.body.email || 'usuario@email.com',
                identification: { type: 'CPF', number: '00000000000' }
            }
        };

        const response = await axios.post('https://api.mercadopago.com/v1/payments', paymentData, {
            headers: {
                'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
                'X-Idempotency-Key': Date.now().toString()
            }
        });
        
        res.json(response.data);
    } catch (error) {
        console.error("Erro ao gerar PIX:", error.response?.data || error.message);
        res.status(500).json({ error: 'Erro ao gerar pagamento' });
    }
});

// ROTA 2: Consultar se o pagamento foi aprovado (ESSENCIAL PARA O FECHAMENTO DO MODAL)
app.get('/consultar-pagamento/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(`https://api.mercadopago.com/v1/payments/${id}`, {
            headers: {
                'Authorization': `Bearer ${MP_ACCESS_TOKEN}`
            }
        });
        
        // Retornamos apenas o status para o frontend (approved, pending, etc)
        res.json({ status: response.data.status });
    } catch (error) {
        console.error("Erro ao consultar status:", error.response?.data || error.message);
        res.status(500).json({ error: 'Erro ao consultar status do pagamento' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});