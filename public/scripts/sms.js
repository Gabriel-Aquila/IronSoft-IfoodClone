console.log('Teste');
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);

function generateRandomCode() {
    return Math.floor(100000 + Math.random() * 900000);
}

let codigo = generateRandomCode()

const sendSMS = async (body) => {
    let msgOptions = {
        from: process.env.TWILIO_FROM_NUMBER,
        to: process.env.TO_NUMBER,
        body
    }
    try{
        const message = await client.messages.create(msgOptions);
        console.log(message, 'SMS enviado com sucesso.');
    } catch (error) {
        console.error('Erro ao enviar SMS:', error);
    }
    
}

sendSMS(`Seu código de verificação: ${codigo}`);

function storeVerificationDetails(recipient, verificationCode) {
    sessionStorage.setItem('recipient', recipient);
    sessionStorage.setItem('verificationCode', verificationCode);
}

storeVerificationDetails(email, verificationCode);