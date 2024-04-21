class TicketView extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const div = document.createElement('div');

    getTicketsForSale()
      .then((tickets) => {
        div.innerText = JSON.stringify(tickets);
      })
      .catch(() => {
        div.innerText = 'Failed to load tickets';
      });

    this.innerHTML = '';
    this.appendChild(div);
  }
}

customElements.define('ticket-view', TicketView);
