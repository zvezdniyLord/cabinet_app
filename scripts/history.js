const openBtn = document.getElementById('composeBtn');
const closeBtn = document.querySelector('.btn-close-form');
const formBlock = document.querySelector('.email-form-overlay');

openBtn.addEventListener('click', () => {
    formBlock.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    formBlock.style.display = 'none';
});

const userEmail = sessionStorage.getItem('userEmail');
        if (!userEmail) {
            window.location.href = 'auth.html';
        }
    console.log(userEmail)
        // Отправка письма
        document.getElementById('emailForm').addEventListener('submit', async function(e) {
            e.preventDefault();

            const emailData = {
                userEmail: userEmail,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            try {
                const response = await fetch('http://89.111.169.54/api/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(emailData)
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Письмо отправлено');
                    this.reset();
                    showEmails('sent');
                } else {
                    alert(data.error || 'Ошибка отправки письма');
                }
            } catch (error) {
                alert('Ошибка соединения с сервером');
            }
        });

        // Показ писем
        async function showEmails(folder) {
            try {
                const response = await fetch(`http://89.111.169.54/api/emails/${userEmail}?folder=${folder}`);
                const emails = await response.json();

                const emailsList = document.getElementById('emailsList');
                emailsList.innerHTML = '';

                emails.forEach(email => {
                    const emailElement = document.createElement('div');
                    emailElement.className = 'email-item';
                    emailElement.innerHTML = `
                        <h3>${email.subject}</h3>
                        <p>Кому: ${email.recipient_email}</p>
                        <p>${email.message}</p>
                        <p>Отправлено: ${new Date(email.sent_date).toLocaleString()}</p>
                        ${folder === 'sent'
                            ? `<button onclick="moveToTrash(${email.id})">Удалить</button>`
                            : `<button onclick="deletePermantly(${email.id})">Удалить навсегда</button>`
                        }
                    `;
                    emailsList.appendChild(emailElement);
                });
            } catch (error) {
                alert('Ошибка загрузки писем');
            }
        }

        // Перемещение в корзину
        async function moveToTrash(emailId) {
            try {
                const response = await fetch(`http://89.111.169.54/api/email/${emailId}/trash`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userEmail })
                });

                if (response.ok) {
                    showEmails('sent');
                } else {
                    const data = await response.json();
                    alert(data.error || 'Ошибка удаления письма');
                }
            } catch (error) {
                alert('Ошибка соединения с сервером');
            }
        }

        // Окончательное удаление
        async function deletePermantly(emailId) {
            if (!confirm('Вы уверены, что хотите удалить письмо навсегда?')) return;

            try {
                const response = await fetch(`http://89.111.169.54/api/email/${emailId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userEmail })
                });

                if (response.ok) {
                    showEmails('trash');
                } else {
                    const data = await response.json();
                    alert(data.error || 'Ошибка удаления письма');
                }
            } catch (error) {
                alert('Ошибка соединения с сервером');
            }
        }

        // Показываем исходящие письма при загрузке страницы
        showEmails('sent');

        function logout() {
            sessionStorage.removeItem('userEmail');
            window.location.href = 'auth.html';
        }
