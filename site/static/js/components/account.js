class AccountView extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const div = document.createElement('div');
    getBalance().then((balance) => {
      if (balance != null) {
        div.innerText = `Balance: ${balance} ETH`;
      } else {
        div.innerText = 'Wallet Not Connected';
      }
    });

    this.innerHTML = '';
    this.appendChild(div);
  }
}

customElements.define('account-view', AccountView);
