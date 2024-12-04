const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();
const Imap = require('node-imap');
const http = require('http');

app.use(cors());
/*app.use(cors({
	origin: '*',
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization']
}));*/
/*app.use((req, res, next) => {
 res.setHeader('Access-Control-Allow-Headers', 'Content-Type, application/json');
 res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Methods', '*');
 next();
});*/
app.use(express.json());


// Конфигурация подключения к БД
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cabinet',
    password: 'kjrnfhjufh',
    port: 5432,
});

// Настройка транспорта для отправки писем
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

transporter.verify((error, success) => {
	if(error) {
	console.error('error', error)
	} else {
	console.log('connect yes')
}
});

/*const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'zoey87@ethereal.email',
        pass: 'b5JBYsQsR4RXPa73EQ'
    }
});*/

/*const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: '4neroq4@gmail.com',
        pass: 'Kjrnfhjufh6996'
    },
   // proxy: 'http://davaa:GPHrFYZK@proxy.elesy.inc:3128'
});*/

const imapConfig = {
    user: "4neroq4@gmail.com",
    password: "itjh xhjv moux iksi",
    host: "imap.gmail.com",
    port: 993,
    tls: true
}

async function testIMAP() {
    try {
        const emails = await getInboxEmails('4neroq4@gmail.com');
        console.log('Inbox emails:', emails);
    } catch (err) {
        console.error('IMAP test failed:', err);
    }
}


// Получение входящих писем
async function getInboxEmails(userEmail) {
    const imap = new Imap(imapConfig);

    return new Promise((resolve, reject) => {
        imap.once('ready', () => {
            imap.openBox('INBOX', false, (err, box) => {
                if (err) return reject(err);

                imap.search(['UNSEEN', ['FROM', userEmail]], (err, results) => {
                    if (err) return reject(err);

                    if (results.length === 0) {
                        console.log('No new emails found');
                        imap.end();
                        return resolve([]);
                    }

                    const f = imap.fetch(results, { bodies: '' });
                    const emails = [];

                    f.on('message', (msg, seqno) => {
                        msg.on('body', (stream, info) => {
                            let buffer = '';
                            stream.on('data', (chunk) => {
                                buffer += chunk.toString('utf8');
                            });
                            stream.once('end', async () => {
                                const email = await parseEmail(buffer);
                                email.sender_email = userEmail;
                                emails.push(email);
                            });
                        });
                    });

                    f.once('error', (err) => {
                        reject(err);
                    });

                    f.once('end', () => {
                        imap.end();
                        resolve(emails);
                    });
                });
            });
        });

        imap.once('error', (err) => {
            reject(err);
        });

        imap.once('end', () => {
            console.log('Connection ended');
        });

        imap.connect();
    });
}


// Парсинг письма
function parseEmail(emailData) {
    // Реализация парсинга письма для получения необходимых данных
    const subject = 'Example Subject';
    const message = 'Example Message';
    const sender_name = 'John Doe';

    return { subject, message, sender_name };
}

// Регистрация
app.post('/api/register', async (req, res) => {
    //res.setHeader('Access-Control-Allow-Origin', '*');
    try {
        const { email, fio, password, position, company, fieldActivity, city, tel } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await pool.query(
            'INSERT INTO users (fio, email, password, position, company, fieldActivity, city, tel) VALUES (\$1, \$2, $3, \$4, \$5, \$6, \$7, \$8) RETURNING *',
            [fio, email, hashedPassword, position, company, fieldActivity, city, tel]
        );

        res.json({ message: 'Регистрация успешна' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Авторизация
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (user.rows.length === 0) {
            return res.status(401).json({ error: 'Пользователь не найден' });
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password);

        if (!validPassword) {
            return res.status(401).json({ error: 'Неверный пароль' });
        }

        res.json({ message: 'Вход выполнен успешно' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Получение данных пользователя
app.get('/api/user/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const user = await pool.query(
            'SELECT fio, email, position, company, fieldActivity, city, tel FROM users WHERE email = $1',
            [email]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        res.json(user.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Обновление данных пользователя
app.put('/api/user/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const { fio, position, company, fieldActivity, city, tel } = req.body;

        const updatedUser = await pool.query(
            'UPDATE users SET fio = $1, position = $2, company = $3, fieldActivity = $4, city = $5, tel = $6 WHERE email = $7 RETURNING *',
            [fio, position, company, fieldActivity, city, tel, email]
        );

        if (updatedUser.rows.length === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        res.json({ message: 'Данные обновлены успешно' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Отправка письма
/*app.post('/send-email', async (req, res) => {
    try {
        const { userEmail, recipientEmail, subject, message } = req.body;

        // Получаем ID пользователя
        const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [userEmail]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        const userId = userResult.rows[0].id;

        // Отправляем письмо
        await transporter.sendMail({
            from: 'aadavidenkoweb@yandex.ru',
            to: recipientEmail,
            subject: subject,
            text: message
        });

        // Сохраняем письмо в базе данных
        await pool.query(
            'INSERT INTO emails (user_id, recipient_email, subject, message) VALUES (\$1, \$2, \$3, $4)',
            [userId, recipientEmail, subject, message]
        );

        res.json({ message: 'Письмо успешно отправлено' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Получение писем пользователя
app.get('/emails/:userEmail', async (req, res) => {
    try {
        const { userEmail } = req.params;
        const { folder } = req.query; // 'sent' или 'trash'

        const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [userEmail]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        const userId = userResult.rows[0].id;

        const isDeleted = folder === 'trash';
        const emails = await pool.query(
            'SELECT * FROM emails WHERE user_id = $1 AND is_deleted = $2 ORDER BY sent_date DESC',
            [userId, isDeleted]
        );

        res.json(emails.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Перемещение письма в корзину
app.put('/email/:id/trash', async (req, res) => {
    try {
        const { id } = req.params;
        const { userEmail } = req.body;

        const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [userEmail]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        const userId = userResult.rows[0].id;

        await pool.query(
            'UPDATE emails SET is_deleted = true WHERE id = $1 AND user_id = $2',
            [id, userId]
        );

        res.json({ message: 'Письмо перемещено в корзину' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Окончательное удаление письма
app.delete('/email/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { userEmail } = req.body;

        const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [userEmail]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        const userId = userResult.rows[0].id;

        await pool.query(
            'DELETE FROM emails WHERE id = $1 AND user_id = $2 AND is_deleted = true',
            [id, userId]
        );

        res.json({ message: 'Письмо удалено' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});*/

// Обновленный эндпоинт отправки письма
app.post('/api/send-email', async (req, res) => {
    try {
        const { userEmail, subject, message } = req.body;
        const ADMIN_EMAIL = '4neroq4@gmail.com'; // Email администратора, куда будут приходить все письма

        // Получаем данные отправителя
        const userResult = await pool.query(
            'SELECT id, fio, email FROM users WHERE email = $1',
            [userEmail]
        );
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        const user = userResult.rows[0];

        // Отправляем письмо
        await transporter.sendMail({
            from: 'aadavidenkoweb@yandex.ru',
            to: ADMIN_EMAIL,
            subject: subject,
            text: `От: ${user.fio} (${user.email})\n\n${message}`
        });

        // Сохраняем письмо в базе данных
        await pool.query(
            'INSERT INTO emails (user_id, recipient_email, subject, message, sender_name, sender_email) VALUES (\$1, \$2, \$3, \$4, \$5, $6)',
            [user.id, ADMIN_EMAIL, subject, message, user.fio, user.email]
        );

        res.json({ message: 'Письмо успешно отправлено' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Получение писем пользователя
app.get('/api/emails/:userEmail', async (req, res) => {
    try {
        const { userEmail } = req.params;
        const { folder } = req.query; // 'sent', 'inbox' или 'trash'

        const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [userEmail]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        const userId = userResult.rows[0].id;

        let query;
        const isDeleted = folder === 'trash';

        if (folder === 'inbox') {
            // Для входящих писем (только для админа)
            query = {
                text: 'SELECT * FROM emails WHERE recipient_email = $1 AND is_deleted = $2 ORDER BY sent_date DESC',
                values: [userEmail, isDeleted]
            };
        } else {
            // Для исходящих писем
            query = {
                text: 'SELECT * FROM emails WHERE user_id = $1 AND is_deleted = $2 ORDER BY sent_date DESC',
                values: [userId, isDeleted]
            };
        }

        const emails = await pool.query(query);
        res.json(emails.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Перемещение письма в корзину
app.put('/email/:id/trash', async (req, res) => {
    try {
        const { id } = req.params;
        const { userEmail } = req.body;

        const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [userEmail]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        const userId = userResult.rows[0].id;

        await pool.query(
            'UPDATE emails SET is_deleted = true WHERE id = $1 AND user_id = $2',
            [id, userId]
        );

        res.json({ message: 'Письмо перемещено в корзину' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Окончательное удаление письма
app.delete('/email/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { userEmail } = req.body;

        const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [userEmail]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        const userId = userResult.rows[0].id;

        await pool.query(
            'DELETE FROM emails WHERE id = $1 AND user_id = $2 AND is_deleted = true',
            [id, userId]
        );

        res.json({ message: 'Письмо удалено' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.listen(3000, '0.0.0.0', () => {
    console.log('Сервер запущен на порту 3000');
});
