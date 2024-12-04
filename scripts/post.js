const form = document.querySelector("form")
const submitButton = document.querySelector("button")

if (form) {
  form.addEventListener("submit", handleFormSubmit)
}

async function handleFormSubmit(event) {
  // Отключаем дефолтное поведение
  event.preventDefault()
  disableButton()

  try {
    const formData = new FormData();
    formData.append('first', 'f');
    formData.append('second', 'sec');

    const response = await fetch("http://localhost:8087/post", {
      method: "POST",
      body: JSON.stringify({
        first: document.querySelector(".input-first").value,
        second: document.querySelector(".input-second").value 
      })
    })
    const result = await response.json()
    console.log(result);
  } catch (error) {
    showError(error)
  } finally {
    hideLoader()
    enableButton()
  }
}

function disableButton() {
  if (submitButton) submitButton.disabled = true
}

function enableButton() {
  if (submitButton) submitButton.disabled = false
}


function hideLoader() {
  // Скрываем лоадер от пользователя
}

function showError() {
  // Показываем пользователю ошибку
}
