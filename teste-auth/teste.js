const nodemailer = require("nodemailer")
require("dotenv").config();
const path = require("path")

function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

const verificationCode = generateVerificationCode();

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: "ifood.ironsoft@gmail.com",
      pass: "otfagufsysgctquu",
    },
  });


const mailOptions = {
    from:{
        name: "Web",
        address: process.env.USER
    },
    to: ["marcosvieira271712@gmail.com"],
    subject: "Sending email",
    text: "Código de verificação",
    html: "<style>h1,h2{color: red}</style><b><h1>Seja Bem Vindo!</h1></b></br><h2>Este é o seu código de verificação: " + verificationCode + "</h2>"
}

const sendMail = async (transporter, mailOptions) => {
    try{
        await transporter.sendMail(mailOptions)
        console.log("Email enviado");
    }
    catch (error){
        console.error(error);
    }
}

sendMail(transporter, mailOptions);