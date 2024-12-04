let rotateArrow = document.querySelector(".svg");
const rotateArrowSupport = document.querySelector(".svg-support");

const menuBlockProduct = document.querySelector(".menu__block-product");
const menuBlockSupports = document.querySelector(".menu__block-supports");

const productMobileList = document.querySelector(".product__mobile-list");
const supportsMobileList = document.querySelector(".supports__mobile-list");

menuBlockProduct.addEventListener("click", () => openMobileListComponents(productMobileList, rotateArrow));
menuBlockSupports.addEventListener("click", () => openMobileListComponents(supportsMobileList, rotateArrowSupport));

function openMobileListComponents(handlerClick, iconAnimate) {
    if(handlerClick.classList.contains('mobile-list')) {
        handlerClick.classList.remove('mobile-list');
        handlerClick.classList.add('mobile-list-view');
        iconAnimate.classList.add("rotate-arrow");
    } else {
        handlerClick.classList.remove('mobile-list-view');
        iconAnimate.classList.remove("rotate-arrow");
        handlerClick.classList.add('mobile-list');
    }
}

const form = document.querySelector('form');
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = {
        fio: formData.get('fio'),
        email: formData.get('email'),
        password: formData.get('password'),
        position: formData.get('position'),
        company: formData.get('company'),
        fieldActivity: formData.get('fieldActivity'),
        city: formData.get('city'),
        tel: formData.get('tel'),
    };
    console.log(formData)
    try {
        const response = await fetch('http://89.111.169.54/api/register', {
            method: 'POST',
	    headers: {
		'Content-Type': 'application/json'
	    },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok) {
            console.log(formData)
            alert('Регистрация успешна');
            window.location.href = 'auth.html';
        } else {
            alert(result.error);
        }
    } catch (err) {
	console.log(err);
        alert('Ошибка при регистрации');
        console.log(formData)
    }
});

fetch('http://localhost:3000/test').then(res => console.log(res))
.then(data => console.log(data));
