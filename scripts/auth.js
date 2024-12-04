const svgAuth = document.querySelector('.svg__auth');
let formAuthPassword = document.querySelector('.form__auth-password');
svgAuth.addEventListener('click', switchTypeInput);

function switchTypeInput() {
    if(formAuthPassword.type === "password") {
        formAuthPassword.type = "text";
    } else {
        formAuthPassword.type = "password";
    }
}


const form = document.querySelector('form');
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = {
        email: formData.get('email'),
        password: formData.get('password')
    };

    try {
        const response = await fetch('http://89.111.169.54/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok) {
            sessionStorage.setItem('userEmail', data.email);
            window.location.href = 'components/lk.html';
        } else {
            alert(data.error || 'Ошибка входа');
        }
    } catch (err) {
        alert('Ошибка при входе');
    }
});
