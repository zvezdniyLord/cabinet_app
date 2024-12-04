
const express = require('express');
const nodemailer = require('nodemailer');
const { simpleParser } = require('mailparser');
const cors = require('cors');
const bodyParser = require('body-parser');

let Imap = require("node-imap");
let inspect = require("util").inspect;
const app = express();

// Enable CORS with specific options
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  host: 'smtp.yandex.ru',
  port: 465,
  secure: true, // Для порта 465 используем SSL/TLS
  auth: {
    user: 'aadavidenkoweb',
    pass: 'dbccigpfpdietirz'
  },
  tls: {
    rejectUnauthorized: false // Только для разработки
  }
});

// Email configuration
const EMAIL_CONFIG = {
  user: 'aadavidenkoweb@yandex.ru',
  password: 'dbccigpfpdietirz',
  smtp: {
    host: 'smtp.yandex.ru',
    port: 465,
    secure: true
  },
  imap: {
    host: 'imap.yandex.ru',
    port: 993,
    tls: true
  }
};


const imapConfig = {
  user: "4neroq4@gmail.com",
  password: "itjh xhjv moux iksi",
  host: "imap.gmail.com",
  port: 993,
  tls: true
}

app.get('/api/get-emails', (req, res) => {
  const imap = new Imap(imapConfig);

  imap.once('ready', () => {
      imap.openBox('INBOX', false, (err, box) => {
          if (err) {
              console.error('Ошибка при открытии почтового ящика:', err);
              return res.status(500).json({ success: false, message: 'Ошибка при получении писем' });
          }

          // Поиск всех писем
          imap.search(['ALL'], (err, results) => {
              if (err) {
                  console.error('Ошибка при поиске писем:', err);
                  return res.status(500).json({ success: false, message: 'Ошибка при поиске писем' });
              }

              if (results.length === 0) {
                  return res.json({ success: true, emails: [] });
              }

              // Ограничиваем до последних 10 сообщений
              const fetch = imap.fetch(results.slice(-10), { bodies: ['HEADER.FIELDS (FROM SUBJECT DATE)', 'TEXT'] });
              const messages = [];

              fetch.on('message', (msg) => {
                  msg.on('body', (stream, info) => {
                      simpleParser(stream, (err, parsed) => {
                          if (!err) {
                              messages.push({
                                  from: parsed.from ? parsed.from.text : 'Неизвестный отправитель',
                                  subject: parsed.subject || 'Без темы',
                                  date: parsed.date || new Date().toISOString(),
                                  body: parsed.text || 'Нет содержимого'
                              });
                          }
                      });
                  });
              });

              fetch.once('end', () => {
                  console.log('Полученные сообщения:', messages);
                  imap.end();
                  return res.json({
                      success: true,
                      emails: messages
                  });
              });
          });
      });
  });

  imap.once('error', (err) => {
      console.error('Ошибка IMAP соединения:', err);
      return res.status(500).json({ success: false, message: 'Ошибка IMAP соединения' });
  });

  imap.connect();
});

// Send email endpoint with improved error handling
app.post('/api/send-email', cors(corsOptions), async (req, res) => {
  try {
    const { to, subject, body } = req.body;

    const mailOptions = {
      from: {
        name: 'scadaint_support',
        address: EMAIL_CONFIG.user
      },
      to: to,
      subject: subject,
      text: body,
      headers: {
        'X-Priority': '3',
        'X-MSMail-Priority': 'Normal'
      }
    };

    const info = await transporter.sendMail(mailOptions);
    res.json({
      success: true,
      message: 'Email sent successfully',
      messageId: info.messageId
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
