import createTickets from "./createTicket";
import { ticketCreate } from "./requests";
import "./changeTicket";

let isFirstLoad = true;

const btnCancel = document.querySelector(".btn-cancel-create");
const btnPopup = document.querySelector(".popup");
// Получаем ссылку на элемент для закрытия всплывающего окна
let closePopup = document.querySelector(".closePopup");
// let ticketCreateButton = document.querySelector(".popup");//(".popup-ticket");
const ticketPopup = document.querySelector(".popup-ticket");

const url = "http://localhost:7070";

// запрашиваем сервер на наличие новых тикетов
export function checkTickets() {
  console.log("запрос на сервер");

  if (isFirstLoad) {
    const loadingIndicator = document.querySelector(".loading-indicator");
    loadingIndicator.style.display = "flex";
  }
  const xhr = new XMLHttpRequest();

  xhr.open("GET", `${url}?method=allTickets`);

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
  console.log(jsonMassive,'jsonMassive')
  for (const item of jsonMassive) {
    createTickets(item);
  }
}

// Открываем всплывающее окно при клике на кнопку
btnPopup.addEventListener("click", function () {
  ticketPopup.style.display = "flex";
});

// СОЗДАНИЕ НОВОГО ТИКЕТА
const create = (e) => {

  e.preventDefault();

  let nameValue = ticketPopup.querySelector(".input-class").value.trim();

  if (nameValue === "") {
    //ticketPopup.style.display = "none";
    alert('Краткое описание не может быть пустым')
    return;
  }

  // создаем http запрос для отправки данных формы на сервер
  const body = new FormData(ticketPopup);
  console.log(body,'body')
  ticketCreate(body);

  // обновляем список тикетов
 
  checkTickets();

  ticketPopup.reset();
  ticketPopup.style.display = "none";
  ticketPopup.removeEventListener("submit", create);
 
  return;
}

ticketPopup.addEventListener("submit", create);

// Закрываем всплывающее окно при клике на крестик
closePopup.addEventListener("click", function (event) {
  event.preventDefault();
  ticketPopup.reset();
  ticketPopup.style.display = "none";
});

// Закрываем окно при отмене
btnCancel.addEventListener("click", function (event) {
  event.preventDefault();
  ticketPopup.reset();
  ticketPopup.style.display = "none";
});

// Закрываем всплывающее окно при клике вне него
ticketPopup.addEventListener("click", function (event) {
  if (event.target == ticketPopup) {
    ticketPopup.reset();
    ticketPopup.style.display = "none";
  }
});

//
