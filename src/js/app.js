// import "./createTicket";
import createTickets from "./createTicket";
//import { ticketCreate } from "./requests";
import RequestHandler from "./requests";
import "./changeTicket";

let isFirstLoad = true;

let btnCancel = document.querySelector(".btn-cancel");
// Получаем ссылку на элемент для закрытия всплывающего окна
let closePopup = document.querySelector(".closePopup");
let ticketCreateButton = document.querySelector(".popup-ticket");
const ticketPopup = document.querySelector(".popup-ticket");

let url;

if (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
) {
  url = "http://localhost:7070";
} else {
  url = `https://ahj-http-backend.onrender.com:10000`;
}



const req = new RequestHandler(url);

// запрашиваем сервер на наличие новых тикетов
export function checkTickets() {
  console.log("запрос на сервер");
  //const xhr = new XMLHttpRequest();

  if (isFirstLoad) {
    const loadingIndicator = document.querySelector(".loading-indicator");
    loadingIndicator.style.display = "flex";
  }

  req.xhr.open("GET", `${req.url}?method=allTickets`);
  req.xhr.setRequestHeader("Content-Type", "application/json"); // Установка заголовка Content-Type
  req.xhr.setRequestHeader("Accept", "application/json"); // Установка заголовка Accept

  req.xhr.addEventListener("load", () => {
    if (req.xhr.status >= 200 && req.xhr.status < 300) {
      try {
        // Скрыть индикатор загрузки
        if (isFirstLoad) {
          const loadingIndicator = document.querySelector(".loading-indicator");
          loadingIndicator.style.display = "none";
          isFirstLoad = false; // Устанавливаем флаг как false после первой загрузки
        }

        const data = JSON.parse(req.xhr.responseText);

        // отрисовываем тикеты
        createFormTickets(data);
      } catch (e) {
        console.error(e);
      }
    }
  });

  req.xhr.send();
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
  req.ticketCreate(body);

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
