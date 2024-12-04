const formLK = document.querySelector("form");

async function formSend(e) {
    e.preventDefault();
    const inputEmail = document.querySelector(".input-reg-email").value;
    const inputFIO = document.querySelector(".input-reg-fio").value;
    const inputPWD = document.querySelector(".input-reg-pwd").value;
    const inputPosition = document.querySelector(".input-reg-position").value;
    const inputCompany = document.querySelector(".input-reg-company").value;
    const inputEnviroment = document.querySelector(".input-reg-enviroment").value;
    const inputCity = document.querySelector(".input-reg-city").value;
    const inputTel = document.querySelector(".input-reg-tel").value;
    //const formData = new FormData(formLK);


      const response = await fetch('http://localhost:8087/post/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          first: inputFIO,
          second: inputTel,
        }),
      });
      if (response.ok) {
        const result = await response.json();
        console.log(result);
      } else {
        console.log(`response ne ok`);
      }
    }

formLK.addEventListener("submit", formSend);
