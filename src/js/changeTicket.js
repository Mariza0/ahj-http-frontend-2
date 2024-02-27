import { checkTickets } from "./app";
import * as request from "./requests";
import  {ticketCreate} from "./requests";

const url = "http://localhost:7070";

const formChange = document.querySelector(".popup-ticket_change");
const ticketPopup = document.querySelector(".popup-ticket");
const closePopupCreate = document.querySelector(".closePopup-create");
const btnCancelCreate = document.querySelector(".btn-cancel-create");


document.addEventListener("click", async (event) => {
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
const create = async (e) => {

  e.preventDefault();

  const nameValue = ticketPopup.querySelector(".input-class_create").value.trim();

  console.log(nameValue,"namevalue")
  if (nameValue === "") {
    //ticketPopup.style.display = "none";
    ticketPopup.removeEventListener("submit", create);
    alert('Краткое описание не может быть пустым')
    return;
  }

  const body = new FormData(ticketPopup);

  try {
    // Отправляем данные на сервер для создания тикета
    console.log('создаем тикет')
    await ticketCreate(body);
  

    // Вызываем функцию, которая будет обновлять список тикетов после успешного создания
    console.log('запрос на сервер на наличие новых тикетов')
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
}

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
};

  // ИЗМЕНЯЕМ СТАТУС ТИКЕТА
  if (target.classList.contains("ticket-status")) {
    // отправляем смену статуса на сервер
    const status = parent.querySelector(".ticket-status").checked;
    request.changeStatus(id, status);
    checkTickets();
  }

  // УДАЛЯЕМ ТИКЕТ
  if (target.classList.contains("btn_delete")) {
    const ticketDelete = document.querySelector(".popup-delete");
    ticketDelete.style.display = "flex";

    // модальное окно
    const btnCancel = ticketDelete.querySelector(".btn-cancel");
    btnCancel.addEventListener("click", (e) => {
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

    ticketDelete.addEventListener("submit", (e) => {
      e.preventDefault();

      //удаляем на сервере
      request.requestDelete(id);

      //удаляем в браузере
      parent.remove();

      ticketDelete.style.display = "none";
      return;
    });
  }

  // ПОЛУЧАЕМ Description
  if (target.className === "ticket" || target.className === "ticket-name") {
    const descElement = parent.querySelector(".description_add");
    if (descElement) {
      descElement.remove();
      return;
    }
    const description = await request.getDesctiption(id);

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
      const description = await request.getDesctiption(id);
      formChange.style.display = "flex";

      // Обработчик сабмита формы
      const handleFormSubmit = async (e) => {
        e.preventDefault();

        const nameTicket = parent.querySelector(".ticket-name").textContent;

        try {
          const description = await request.getDesctiption(id);
          const inputClassValue =
            formChange.querySelector(".input-class").value;
          const descriptionPopupValue =
            formChange.querySelector(".description-popup").value;

          if (
            inputClassValue === nameTicket &&
            descriptionPopupValue === description
          ) {
            closeForm();
            return;
          }

          let body = new FormData(formChange);
          request.requestChange(id, body);
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
