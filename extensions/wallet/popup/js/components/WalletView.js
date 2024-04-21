class WalletView extends HTMLElement {
  constructor() {
    super();
  }

  async disconnect() {
    await browser.storage.local.remove(['account', 'privateKey', 'chainUrl']);
    const body = document.getElementById('body');
    body.innerHTML = '';
    body.appendChild(document.createElement('connect-view'));
  }

  connectedCallback() {
    const mainContainer = document.createElement('div');

    const disconnectButton = document.createElement('button');
    disconnectButton.type = 'button';
    disconnectButton.innerText = 'Disconnect';
    disconnectButton.onclick = async () => {
      await this.disconnect();
    };

    mainContainer.appendChild(disconnectButton);

    this.innerHTML = '';
    this.appendChild(mainContainer);
  }
}

customElements.define('wallet-view', WalletView);
