class MainView extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const div = document.createElement('div');
    const accountView = document.createElement('account-view');
    const ticketView = document.createElement('ticket-view');

    div.appendChild(accountView);
    div.appendChild(ticketView);

    this.innerHTML = '';
    this.appendChild(div);
  }
}

customElements.define('main-view', MainView);
