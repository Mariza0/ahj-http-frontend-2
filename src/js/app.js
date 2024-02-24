// import "./createTicket";
import createTickets from "./createTicket";
import { ticketCreate } from "./requests";
import "./changeTicket";

let isFirstLoad = true;

let btnCancel = document.querySelector(".btn-cancel");
// Получаем ссылку на элемент для закрытия всплывающего окна
let closePopup = document.querySelector(".closePopup");
let ticketCreateButton = document.querySelector(".popup-ticket");
const ticketPopup = document.querySelector(".popup-ticket");

// запрашиваем сервер на наличие новых тикетов
export function checkTickets() {
  console.log("запрос на сервер");
  const xhr = new XMLHttpRequest();

  if (isFirstLoad) {
    const loadingIndicator = document.querySelector(".loading-indicator");
    loadingIndicator.style.display = "flex";
  }

  xhr.open("GET", "http://localhost:7070?method=allTickets");

  xhr.addEventListener("load", () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        // Скрыть индикатор загрузки
        if (isFirstLoad) {
          const loadingIndicator = document.querySelector(".loading-indicator");
          loadingIndicator.style.display = "none";
          isFirstLoad = false; // Устанавливаем флаг как false после первой загрузки
        }

        const data = JSON.parse(xhr.responseText);

        // отрисовываем тикеты
        createFormTickets(data);
      } catch (e) {
        console.error(e);
      }
    }
  });

  xhr.send();
}

setInterval(checkTickets, 10000);

// передача тикетов на форму в браузер

function createFormTickets(jsonMassive) {
  for (const item of jsonMassive) {
    createTickets(item);
  }
}

let btnPopup = document.querySelector(".popup");

// Открываем всплывающее окно при клике на кнопку
btnPopup.addEventListener("click", function () {
  ticketPopup.style.display = "flex";
});

// СОЗДАНИЕ НОВОГО ТИКЕТА
ticketCreateButton.addEventListener("submit", (e) => {
  e.preventDefault();

  let nameValue = ticketPopup.querySelector(".input-class").value.trim();

  if (nameValue === "") {
    ticketPopup.style.display = "none";
    return;
  }

  // создаем http запрос для отправки данных формы на сервер
  const body = new FormData(ticketPopup);
  ticketCreate(body);

  // обновляем список тикетов
  checkTickets();

  ticketPopup.style.display = "none";
  return;
});

// Закрываем всплывающее окно при клике на крестик
closePopup.addEventListener("click", function (event) {
  event.preventDefault();
  ticketPopup.style.display = "none";
});

// Закрываем окно при отмене
btnCancel.addEventListener("click", function (event) {
  event.preventDefault();
  ticketPopup.style.display = "none";
});

// Закрываем всплывающее окно при клике вне него
ticketCreateButton.addEventListener("click", function (event) {
  if (event.target == ticketPopup) {
    ticketPopup.style.display = "none";
  }
});

//
