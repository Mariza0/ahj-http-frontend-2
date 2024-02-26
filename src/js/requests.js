
  const url = "http://localhost:7070";
  // СОЗДАНИЕ ТИКЕТА
  export function ticketCreate(body) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${url}?method=createTicket`);

    xhr.send(body);
  }

  // УДАЛЕНИЕ ТИКЕТ
  export function requestDelete(id) {
    xhr.open("DELETE", `${url}?method=deleteTicket&id=${id}`);

    xhr.setRequestHeader(
      "Content-type",
      "application/x-www-form-urlencoded"
    );

    xhr.send();
  }

  // ИЗМЕНЕНИЕ ТИКЕТА
  export function requestChange(id, body) {
    xhr.open("POST", `${url}?method=changeTicket&id=${id}`);

    xhr.send(body);
  }

  // ДЕТАЛЬНОЕ ОПИСАНИЕ
  export function getDesctiption(id) {
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
  export function changeStatus(id, status) {
    xhr.open(
      "POST",
      `${url}?method=changeStatus&id=${id}&status=${status}`
    );
    xhr.setRequestHeader(
      "Content-type",
      "application/x-www-form-urlencoded"
    );

    xhr.send();
  }
