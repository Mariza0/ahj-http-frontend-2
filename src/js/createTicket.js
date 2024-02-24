// создание тестовых тикетов при загрузке страницы
const container = document.querySelector(".list-group");

export default function createTickets(json) {
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

  // let description = document.createElement("div");
  // description.className = "description disable";
  // description.textContent = json.description;

  // newName.appendChild(description);

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
const data = [
  {
    name: "замена картриджа в принтере к201",
    description: "амена на принтере hp-sm001.",
    creationDate: "2023-12-30",
    id: "6e8ad17e-f1c7-4332-8323-fc77897c1fbc",
    statusTicket: true,
  },
  {
    name: "переустановка windows pk-Petya к310",
    description: "доступ к компьютеру после 15-00",
    creationDate: "2024-01-30",
    id: "ae16412d-1557-411b-ab0e-bc19fef136b1",
    statusTicket: false,
  },
  {
    name: "установить обновление кв-ххх",
    description:
      "критическое обновление для windows. \nНе забыть сделать бэкапы",
    creationDate: "2024-01-20",
    id: "e749d5d8-8e88-47ad-bf6f-2b3a255df0df",
    statusTicket: false,
  },
];

// for (let i=0; i< data.length; i++) {
//   createTickets(data[i]);
// };
