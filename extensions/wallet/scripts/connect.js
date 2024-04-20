class ConnectView extends HTMLElement {
  constructor() {
    super();
  }

  async connectAccount(account) {
    const data = new FormData(account);
    if (!data.get('public') || !data.get('private') || !data.get('chain')) {
      return;
    }
    await browser.storage.local.set({
      public: data.get('public'),
      private: data.get('private'),
      chainUrl: data.get('chain'),
    });
    const body = document.getElementById('body');
    body.innerHTML = '';
    body.appendChild(document.createElement('wallet-view'));
  }

  connectedCallback() {
    const form = document.createElement('form');
    form.id = 'form';
    form.action = '#';
    form.onsubmit = async (event) => {
      event.preventDefault();
      await this.connectAccount(event.target);
    };

    // Public Input
    const publicContainer = document.createElement('div');
    publicContainer.className = 'connect-input-container';

    const publicLabel = document.createElement('label');
    publicLabel.setAttribute('for', 'public-input');
    publicLabel.innerText = 'Public';

    const publicInput = document.createElement('input');
    publicInput.id = 'public-input';
    publicInput.className = 'connect-input';
    publicInput.name = 'public';
    publicInput.type = 'text';
    publicInput.placeholder = 'Public';

    publicContainer.appendChild(publicLabel);
    publicContainer.appendChild(publicInput);
    form.appendChild(publicContainer);

    // Private Input
    const privateContainer = document.createElement('div');
    privateContainer.className = 'connect-input-container';

    const privateLabel = document.createElement('label');
    privateLabel.setAttribute('for', 'private-input');
    privateLabel.innerText = 'Private';

    const privateInput = document.createElement('input');
    privateInput.id = 'private-input';
    privateInput.className = 'connect-input';
    privateInput.name = 'private';
    privateInput.type = 'text';
    privateInput.placeholder = 'Private';

    privateContainer.appendChild(privateLabel);
    privateContainer.appendChild(privateInput);
    form.appendChild(privateContainer);

    // Chain URL Input
    const chainUrlContainer = document.createElement('div');
    chainUrlContainer.className = 'connect-input-container';

    const chainUrlLabel = document.createElement('label');
    chainUrlLabel.setAttribute('for', 'chain-url-input');
    chainUrlLabel.innerText = 'Chain URL';

    const chainUrlInput = document.createElement('input');
    chainUrlInput.id = 'chain-url-input';
    chainUrlInput.className = 'connect-input';
    chainUrlInput.name = 'chain';
    chainUrlInput.type = 'text';
    chainUrlInput.placeholder = 'Chain URL';

    chainUrlContainer.appendChild(chainUrlLabel);
    chainUrlContainer.appendChild(chainUrlInput);
    form.appendChild(chainUrlContainer);

    // Connect Button
    const connectButtonContainer = document.createElement('div');
    const connectButton = document.createElement('button');
    connectButton.type = 'submit';
    connectButton.innerText = 'Connect';

    connectButtonContainer.appendChild(connectButton);
    form.appendChild(connectButtonContainer);

    this.innerHTML = '';
    this.appendChild(form);
  }
}

customElements.define('connect-view', ConnectView);
