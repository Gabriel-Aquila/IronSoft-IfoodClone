const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const twilio = require('twilio');
const fs = require('fs');
const path = require('path');


dotenv.config();
const app = express();
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/send-sms', (req, res) => {
    const { recipient, message } = req.body;
    
    client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: recipient
    })
    .then(() => {
        res.status(200).json({ message: 'Mensagem SMS enviada com sucesso!' });
    })
    .catch(error => {
        console.error('Erro ao enviar SMS:', error);
        res.status(500).json({ message: 'Erro ao enviar mensagem SMS.' });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}/`);
});
