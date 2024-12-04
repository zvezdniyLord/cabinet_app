/*const inputSubmit = document.querySelector(".btn__product-submit");
let controller = new AbortController();
const formMessage = document.getElementById("form-message");

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("form");
    form.addEventListener("submit", formSend);

    async function formSend(e) {
        e.preventDefault();

        let error = formValidate(form);
        const formData = new FormData(form);

        if(error === 0) {
            const response = await fetch('../php.php', {
                method: "POST",
                body: formData,
                signal: controller.signal,
            });
            if(response.ok) {
                const result = await response.json();
                console.log("response ok");
                alertSendForm(inputSubmit, "Сообщение отправлено");
                restartInput();
            } else {
                resetFetch();
                console.log(`response ne ok`);
                alertSendForm(inputSubmit, "Ошибка");
                restartInput();
            }
        } else {
            console.log("empty");
        }
        console.log(formData);
    }
});

const resetFetch = () => {
    setTimeout(() => {
        controller.abort();
        controller = new AbortController();
    }, 3000);
}


const alertSendForm = (element, value) => {
    element.value = value;
};

const restartInput = () => {
    setTimeout(() => {
        alertSendForm(inputSubmit, "Отправить запрос");
    }, 3000);
}

function formValidate(form) {
    let error = 0;
    const captchaInput = document.querySelector('.form__captcha-input');
    const warning = document.querySelector(".captcha__warning");
    const char = document.querySelector(".captcha__char").innerHTML;
    const inputs = document.querySelectorAll('.req');
    for(let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        if(input.value === '') {
            error++;
        }
    }
    if(captchaInput.value === char) {
        console.log("true captcha");
        warning.style.display = "none";
    } else {
        console.log("false captcha");
        warning.style.display = "block";
        captchaInput.value = "";
    }
   
    return error;
};

function createCaptcha(text) {
    if(typeof text != "string") {
        return;
    }
    const inputText = document.querySelector(".form__captcha-target");
    let innerHTML = inputText.innerHTML;
    let index = innerHTML.indexOf(text);
    const rand = Math.floor(Math.random() * inputText.dataset.value);
    index = rand;
    if (index >= 0) { 
     innerHTML = innerHTML.substring(0, index) + "<span class='captcha__char'>" + innerHTML.substring(index,index+text.length) + "</span>" + innerHTML.substring(index + text.length);
     inputText.innerHTML = innerHTML;
    }
}

createCaptcha("e");*/

const inputSubmit = document.querySelector('.btn__product-submit');
let controller = new AbortController();
const formMessage = document.getElementById('form-message');

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('form');
  form.addEventListener('submit', formSend);

  async function formSend(e) {
    e.preventDefault();

    let error = formValidate(form);
    const formData = new FormData(form);

    if (error === 0) {
      const response = await fetch('http://31.31.202.81/v1/', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });
      if (response.ok) {
        const result = await response.json();
        console.log('response ok');
        alertSendForm(inputSubmit, 'Сообщение отправлено');
        restartInput();
      } else {
        controller.abort();
        resetFetch();
        console.log(`response ne ok`);
        alertSendForm(inputSubmit, 'Ошибка');
        restartInput();
      }
    } else {
      console.log('empty');
    }
    console.log(formData);
  }
});

const resetFetch = () => {
  setTimeout(() => {
    controller = new AbortController();
  }, 1500);
};

const alertSendForm = (element, textValue) => {
  element.value = textValue;
};

const restartInput = () => {
  setTimeout(() => {
    alertSendForm(inputSubmit, 'Отправить запрос');
  }, 1500);
};

function formValidate(form) {
  let error = 0;
  const captchaInput = document.querySelector('.form__captcha-input');
  const warning = document.querySelector('.captcha__warning');
  const char = document.querySelector('.captcha__char').innerHTML;
  const inputs = document.querySelectorAll('.req');
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].value === '') {
      error++;
    }
  }
  if (captchaInput.value === char) {
    console.log('true captcha');
    warning.style.display = 'none';
  } else {
    console.log('false captcha');
    warning.style.display = 'block';
    captchaInput.value = '';
    error++;
  }

  return error;
}

function createCaptcha(text) {
  if (typeof text != 'string') {
    return;
  }
  const inputText = document.querySelector('.form__captcha-target');
  let innerHTML = inputText.innerHTML;
  let index = innerHTML.indexOf(text);
  const rand = Math.floor(Math.random() * inputText.dataset.value);
  index = rand;
  if (index >= 0) {
    innerHTML =
      innerHTML.substring(0, index) +
      "<span class='captcha__char'>" +
      innerHTML.substring(index, index + text.length) +
      '</span>' +
      innerHTML.substring(index + text.length);
    inputText.innerHTML = innerHTML;
  }
}



module.exports = sendManyEmail;

createCaptcha('e');
