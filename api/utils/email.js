const nodemailer = require("nodemailer");

const sendEmail = async options => {
  //1) Criar o transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  //2) Definir as opções do email
  const mailOptions = {
    from: "Bruno Pereira <bruno_emanuel87@hotmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message
  };
  //console.log(options);
  //3) Enviar o email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
