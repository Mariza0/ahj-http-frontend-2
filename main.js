/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/js/createTicket.js
// создание тестовых тикетов при загрузке страницы
const container = document.querySelector(".list-group");
function createTickets(json) {
  // проверяем что элемент не существует на формк
  const elementWithId = document.querySelector(`[data-ticket-id="${json.id}"]`);
  let nameTicket;
  let status;

  // если такой элемент есть, то смотрим есть ли детальное описание. если есть проверяем актуальность
  if (elementWithId) {
    // проверяем изменилось ли имя
    nameTicket = elementWithId.querySelector(".ticket-name");
    if (nameTicket.firstChild.textContent !== json.name) {
      nameTicket.textContent = json.name;
    }

    // проверяем изменился ли статус
    status = elementWithId.querySelector(".ticket-status").checked;
    if (status !== json.statusTicket) {
      status = json.statusTicket;
    }
    return;
  }

  // иначе добавляем новый тикет в список
  let newEl = document.createElement("DIV");
  newEl.className = "ticket";
  newEl.setAttribute("data-ticket-id", json.id);
  // newEl.setAttribute('data-ticket-description', json.description);

  // статус
  let newStatus = document.createElement("input");
  newStatus.type = "checkbox";
  newStatus.checked = json.statusTicket;
  newStatus.style.marginRight = `20px`;
  newStatus.className = "ticket-status ml-3";

  //краткое описание  и детальное
  let newName = document.createElement("div");
  newName.className = "ticket-name";
  newName.style.marginRight = `20px`;
  newName.textContent = json.name;

  // дата создания
  let newDate = document.createElement("div");
  newDate.className = "ticket-cteate_date";
  newDate.style.marginRight = `20px`;
  // Функция для форматирования чисел с добавлением нуля перед однозначными числами
  // function formatNumber(num) {
  //     return num < 10 ? `0${num}` : num;
  //   }
  //   // Получение текущей даты и времени
  //   const currentDate = new Date();
  //   const day = formatNumber(currentDate.getDate());
  //   const month = formatNumber(currentDate.getMonth() + 1); // Месяцы в JavaScript начинаются с 0
  //   const year = currentDate.getFullYear();
  //   // Форматирование в строку в формате "день-месяц-год"
  //   const formattedDate = `${day}-${month}-${year}`;
  newDate.textContent = json.creationDate;

  //кнопки
  let newDiv = document.createElement("div");
  newDiv.className = "d-grid gap-2 d-md-flex justify-content-md-end";
  let newBtn = document.createElement("button");
  newBtn.className = "btn btn_change btn-outline-success";
  newBtn.textContent = "change";
  let secondBtn = document.createElement("button");
  secondBtn.className = "btn btn_delete btn-outline-danger";
  secondBtn.textContent = "delete";
  newDiv.appendChild(newDate);
  newDiv.appendChild(newBtn);
  newDiv.appendChild(secondBtn);
  newEl.appendChild(newStatus);
  newEl.appendChild(newName);
  // newEl.appendChild(description);

  let newLi = document.createElement("li");
  newLi.className = "list-group-item";
  newLi.appendChild(newEl);
  newLi.appendChild(newDiv);
  container.appendChild(newLi);
}

// создание первых тестовых тикетов
const data = [{
  "name": "замена картриджа в принтере к201",
  "description": "амена на принтере hp-sm001.",
  "creationDate": "2023-12-30",
  "id": "6e8ad17e-f1c7-4332-8323-fc77897c1fbc",
  "statusTicket": true
}, {
  "name": "переустановка windows pk-Petya к310",
  "description": "доступ к компьютеру после 15-00",
  "creationDate": "2024-01-30",
  "id": "ae16412d-1557-411b-ab0e-bc19fef136b1",
  "statusTicket": false
}, {
  "name": "установить обновление кв-ххх",
  "description": "критическое обновление для windows. \nНе забыть сделать бэкапы",
  "creationDate": "2024-01-20",
  "id": "e749d5d8-8e88-47ad-bf6f-2b3a255df0df",
  "statusTicket": false
}];

// for (let i=0; i< data.length; i++) {
//   createTickets(data[i]);
// };
;// CONCATENATED MODULE: ./src/js/requests.js
const url = "http://localhost:7070";
// СОЗДАНИЕ ТИКЕТА
async function ticketCreate(body) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${url}?method=createTicket`);
  xhr.send(body);
}

// УДАЛЕНИЕ ТИКЕТ
function requestDelete(id) {
  const xhr = new XMLHttpRequest();
  xhr.open("DELETE", `${url}?method=deleteTicket&id=${id}`);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.send();
}

// ИЗМЕНЕНИЕ ТИКЕТА
function requestChange(id, body) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${url}?method=changeTicket&id=${id}`);
  xhr.send(body);
}

// ДЕТАЛЬНОЕ ОПИСАНИЕ
function getDesctiption(id) {
  const xhr = new XMLHttpRequest();
  return new Promise((resolve, reject) => {
    xhr.open("GET", `${url}?method=getDescription&id=${id}`);
    xhr.addEventListener("load", () => {
      let desc;
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          desc = xhr.responseText;
          resolve(desc);
        } catch (e) {
          console.error(e);
        }
      } else {
        reject(new Error(`Request failed with status ${xhr.status}`));
      }
    });
    xhr.send();
  });
}

// ИЗМЕНЕНИЕ СТАТУСА ТИКЕТА
function changeStatus(id, status) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${url}?method=changeStatus&id=${id}&status=${status}`);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.send();
}
;// CONCATENATED MODULE: ./src/js/changeTicket.js



const changeTicket_url = "http://localhost:7070";
const formChange = document.querySelector(".popup-ticket_change");
const ticketPopup = document.querySelector(".popup-ticket");
const closePopupCreate = document.querySelector(".closePopup-create");
const btnCancelCreate = document.querySelector(".btn-cancel-create");
document.addEventListener("click", async event => {
  const target = event.target;
  const parent = target.closest(".list-group-item");
  let id;
  if (parent) {
    id = parent.querySelector(".ticket").getAttribute("data-ticket-id");
  }

  // Открываем всплывающее окно при клике на кнопку
  if (target.classList.contains("popup")) {
    ticketPopup.style.display = "flex";

    // СОЗДАНИЕ НОВОГО ТИКЕТА
    const create = async e => {
      e.preventDefault();
      const nameValue = ticketPopup.querySelector(".input-class_create").value.trim();
      console.log(nameValue, "namevalue");
      if (nameValue === "") {
        //ticketPopup.style.display = "none";
        ticketPopup.removeEventListener("submit", create);
        alert('Краткое описание не может быть пустым');
        return;
      }
      const body = new FormData(ticketPopup);
      try {
        // Отправляем данные на сервер для создания тикета
        console.log('создаем тикет');
        //await ticketCreate(body)
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${changeTicket_url}?method=createTicket`);
        xhr.send(body);

        // Вызываем функцию, которая будет обновлять список тикетов после успешного создания
        console.log('запрос на сервер на наличие новых тикетов');
        checkTickets();

        // Сбрасываем форму и скрываем всплывающее окно
        ticketPopup.reset();
        ticketPopup.removeEventListener("submit", create);
        ticketPopup.style.display = "none";
      } catch (error) {
        console.error("Error creating ticket:", error);
        // Здесь можно добавить обработку ошибки, если необходимо
      }

      // создаем http запрос для отправки данных формы на сервер
      //const body = new FormData(ticketPopup);
      //ticketCreate(body);

      // обновляем список тикетов
      // checkTickets();

      // ticketPopup.reset();
      // ticketPopup.style.display = "none";
      // ticketPopup.removeEventListener("submit", create);

      // return;
    };

    ticketPopup.addEventListener("submit", create);

    // Закрываем всплывающее окно при клике на крестик
    closePopupCreate.addEventListener("click", function (event) {
      event.preventDefault();
      ticketPopup.reset();
      ticketPopup.style.display = "none";
    });

    // Закрываем окно при отмене
    btnCancelCreate.addEventListener("click", function (event) {
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
  }
  ;

  // ИЗМЕНЯЕМ СТАТУС ТИКЕТА
  if (target.classList.contains("ticket-status")) {
    // отправляем смену статуса на сервер
    const status = parent.querySelector(".ticket-status").checked;
    changeStatus(id, status);
    checkTickets();
  }

  // УДАЛЯЕМ ТИКЕТ
  if (target.classList.contains("btn_delete")) {
    const ticketDelete = document.querySelector(".popup-delete");
    ticketDelete.style.display = "flex";

    // модальное окно
    const btnCancel = ticketDelete.querySelector(".btn-cancel");
    btnCancel.addEventListener("click", e => {
      e.preventDefault();
      ticketDelete.style.display = "none";
      return;
    });

    // Закрываем всплывающее окно при клике вне него
    ticketDelete.addEventListener("click", function (e) {
      if (e.target == ticketDelete) {
        ticketDelete.style.display = "none";
      }
    });
    const del = e => {
      ticketDelete.removeEventListener("submit", del);
      e.preventDefault();

      //удаляем на сервере
      requestDelete(id);

      //удаляем в браузере
      parent.remove();
      ticketDelete.style.display = "none";
      return;
    };
    ticketDelete.addEventListener("submit", del);
  }

  // ПОЛУЧАЕМ Description
  if (target.className === "ticket" || target.className === "ticket-name") {
    const descElement = parent.querySelector(".description_add");
    if (descElement) {
      descElement.remove();
      return;
    }
    const description = await getDesctiption(id);
    let elementDescription = document.createElement("div");
    elementDescription.className = "description_add";
    elementDescription.textContent = description;
    const ticket = parent.querySelector(".ticket-name");
    ticket.appendChild(elementDescription);
  }

  // ИЗМЕНЯЕМ ТИКЕТ
  if (target.classList.contains("btn_change")) {
    formChange.reset();
    // const parent = target.closest(".list-group-item");
    // const id = parent.querySelector(".ticket").getAttribute("data-ticket-id");
    const nameTicket = parent.querySelector(".ticket-name").textContent;
    try {
      const description = await getDesctiption(id);
      formChange.style.display = "flex";

      // Обработчик сабмита формы
      const handleFormSubmit = async e => {
        e.preventDefault();
        const nameTicket = parent.querySelector(".ticket-name").textContent;
        try {
          const description = await getDesctiption(id);
          const inputClassValue = formChange.querySelector(".input-class").value;
          const descriptionPopupValue = formChange.querySelector(".description-popup").value;
          if (inputClassValue === nameTicket && descriptionPopupValue === description) {
            closeForm();
            return;
          }
          let body = new FormData(formChange);
          requestChange(id, body);
          console.log("обновляем тикеты");
          checkTickets();
          closeForm();
        } catch (error) {
          console.error(error);
        }
      };
      function closeForm() {
        formChange.removeEventListener("submit", handleFormSubmit);
        formChange.reset();
        formChange.style.display = "none";
      }
      const btnCancel = formChange.querySelector(".btn-cancel");
      btnCancel.addEventListener("click", function (event) {
        event.preventDefault();
        closeForm();
      });
      const closePopup = formChange.querySelector(".closePopup");
      closePopup.addEventListener("click", function (event) {
        event.preventDefault();
        closeForm();
      });

      // Закрываем всплывающее окно при клике вне него
      formChange.addEventListener("click", function (event) {
        if (event.target == formChange) {
          closeForm();
        }
      });

      // Добавление обработчика сабмита формы
      formChange.addEventListener("submit", handleFormSubmit);
      formChange.querySelector(".input-class").value = nameTicket;
      formChange.querySelector(".description-popup").value = description;
    } catch (error) {
      console.error(error);
    }
  }
});
;// CONCATENATED MODULE: ./src/js/app.js

//import { ticketCreate } from "./requests";

let isFirstLoad = true;

//const btnCancel = document.querySelector(".btn-cancel-create");
//const btnPopup = document.querySelector(".popup");
// Получаем ссылку на элемент для закрытия всплывающего окна
//let closePopup = document.querySelector(".closePopup");
// let ticketCreateButton = document.querySelector(".popup");//(".popup-ticket");
//const ticketPopup = document.querySelector(".popup-ticket");

const app_url = "http://localhost:7070";

// запрашиваем сервер на наличие новых тикетов
function checkTickets() {
  console.log("запрос на сервер");
  if (isFirstLoad) {
    const loadingIndicator = document.querySelector(".loading-indicator");
    loadingIndicator.style.display = "flex";
  }
  const xhr = new XMLHttpRequest();
  xhr.open("GET", `${app_url}?method=allTickets`);
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
  console.log(jsonMassive, 'jsonMassive');
  for (const item of jsonMassive) {
    createTickets(item);
  }
}
;// CONCATENATED MODULE: ./src/index.js



// TODO: write your code in app.js
/******/ })()
;