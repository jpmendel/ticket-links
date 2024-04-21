class AccountView extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const div = document.createElement('div');
    getBalance()
      .then((balance) => {
        div.innerText = `Balance: ${balance} ETH`;
      })
      .catch(() => {
        div.innerText = 'Wallet Not Connected';
      });

    this.innerHTML = '';
    this.appendChild(div);
  }
}

customElements.define('account-view', AccountView);
