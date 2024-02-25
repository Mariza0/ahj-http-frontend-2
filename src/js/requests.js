export default class RequestHandler {
  constructor() {
    // if (
    //   window.location.hostname === "localhost" ||
    //   window.location.hostname === "127.0.0.1"
    // ) {
      // this.url = "http://localhost:7070";
    // } else {
      this.url = "https://ahj-http-backend.onrender.com:10000";
    // }
    this.xhr = new XMLHttpRequest();
  }

  // СОЗДАНИЕ ТИКЕТА
  ticketCreate(body) {
    this.xhr.open("POST", `${this.url}?method=createTicket`);

    this.xhr.send(body);
  }

  // УДАЛЕНИЕ ТИКЕТ
  requestDelete(id) {
    this.xhr.open("DELETE", `${this.url}?method=deleteTicket&id=${id}`);

    this.xhr.setRequestHeader(
      "Content-type",
      "application/x-www-form-urlencoded"
    );

    this.xhr.send();
  }

  // ИЗМЕНЕНИЕ ТИКЕТА
  requestChange(id, body) {
    this.xhr.open("POST", `${this.url}?method=changeTicket&id=${id}`);

    this.xhr.send(body);
  }

  // ДЕТАЛЬНОЕ ОПИСАНИЕ
  getDesctiption(id) {
    return new Promise((resolve, reject) => {
      this.xhr.open("GET", `${this.url}?method=getDescription&id=${id}`);

      this.xhr.addEventListener("load", () => {
        let desc;
        if (this.xhr.status >= 200 && this.xhr.status < 300) {
          try {
            desc = this.xhr.responseText;

            resolve(desc);
          } catch (e) {
            console.error(e);
          }
        } else {
          reject(new Error(`Request failed with status ${this.xhr.status}`));
        }
      });

      this.xhr.send();
    });
  }

  // ИЗМЕНЕНИЕ СТАТУСА ТИКЕТА
  changeStatus(id, status) {
    this.xhr.open(
      "POST",
      `${this.url}?method=changeStatus&id=${id}&status=${status}`
    );
    this.xhr.setRequestHeader(
      "Content-type",
      "application/x-www-form-urlencoded"
    );

    this.xhr.send();
  }
}
