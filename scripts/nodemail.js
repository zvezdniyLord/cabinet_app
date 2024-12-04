const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    host: "smtp.yandex.ru",
    port: 587,
    secure: true,
    auth: {
        user: "aadavidenkoweb@yandex.ru",
        pass: "vklwygvjagfggohn"
    },
});

const mailOpt = {
    from: "aadavidenkoweb@yandex.ru",
    to: "4neroq4@gmail.com",
    subject: "Sending email",
    text: "text"
};

transporter.sendMail(mailOpt, (err, info) => {
    return err ? console.log(err) : info.response;
});


transporter.sendMail(() => {});