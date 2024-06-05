const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const session = require('express-session');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: 'sua_chave_secreta', resave: false, saveUninitialized: true }));

function gerarCodigo() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

app.post('/enviar-codigo', (req, res) => {
    const { email } = req.query;
    if (!email) {
        return res.status(400).send('Email não fornecido');
    }

    const codigo = gerarCodigo();
    req.session.codigo = codigo;

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "ifood.ironsoft@gmail.com",
            pass: "tfagufysgctq",
        },
    });

    const mailOptions = {
        from: 'ifood.ironsoft@gmail.com',
        to: email,
        subject: 'Código de Verificação',
        text: `Seu código de verificação: ${codigo}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res.status(500).send('Erro ao enviar o código de verificação via e-mail.');
        } else {
            console.log('E-mail enviado: ' + info.response);
            res.status(200).send('Código de verificação enviado com sucesso.');
        }
    });
});

app.post('/verificar-codigo', (req, res) => {
    const { code } = req.body;
    const generatedCode = req.session.codigo;
    if (code === generatedCode) {
        res.status(200).send('Autenticação bem-sucedida.');
    } else {
        console.error('Código de verificação inválido.');
        res.status(401).send('Código de verificação inválido.');
    }
});

app.listen(5500, () => {
    console.log('Servidor rodando na porta 5500');
});
