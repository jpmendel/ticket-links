class ConnectView extends HTMLElement {
  constructor() {
    super();
  }

  async connectAccount(account) {
    const data = new FormData(account);
    if (!data.get('account') || !data.get('private') || !data.get('chain')) {
      return;
    }
    await browser.storage.local.set({
      account: data.get('account'),
      privateKey: data.get('private'),
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

    // Account Input
    const accountContainer = document.createElement('div');
    accountContainer.className = 'connect-input-container';

    const accountLabel = document.createElement('label');
    accountLabel.setAttribute('for', 'account-input');
    accountLabel.innerText = 'Account Address';

    const accountInput = document.createElement('input');
    accountInput.id = 'account-input';
    accountInput.className = 'connect-input';
    accountInput.name = 'account';
    accountInput.type = 'text';
    accountInput.placeholder = 'Account Address';
    accountInput.onblur = async (event) => {
      await browser.storage.session.set({ account: event.target.value });
    };
    browser.storage.session.get(['account']).then(({ account }) => {
      if (account) {
        accountInput.value = account;
      }
    });

    accountContainer.appendChild(accountLabel);
    accountContainer.appendChild(accountInput);
    form.appendChild(accountContainer);

    // Private Key Input
    const privateKeyContainer = document.createElement('div');
    privateKeyContainer.className = 'connect-input-container';

    const privateKeyLabel = document.createElement('label');
    privateKeyLabel.setAttribute('for', 'private-key-input');
    privateKeyLabel.innerText = 'Private Key';

    const privateKeyInput = document.createElement('input');
    privateKeyInput.id = 'private-key-input';
    privateKeyInput.className = 'connect-input';
    privateKeyInput.name = 'private';
    privateKeyInput.type = 'text';
    privateKeyInput.placeholder = 'Private Key';
    privateKeyInput.onblur = async (event) => {
      await browser.storage.session.set({ privateKey: event.target.value });
    };
    browser.storage.session.get(['privateKey']).then(({ privateKey }) => {
      if (privateKey) {
        privateKeyInput.value = privateKey;
      }
    });

    privateKeyContainer.appendChild(privateKeyLabel);
    privateKeyContainer.appendChild(privateKeyInput);
    form.appendChild(privateKeyContainer);

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
    chainUrlInput.onblur = async (event) => {
      await browser.storage.session.set({ chainUrl: event.target.value });
    };
    browser.storage.session.get(['chainUrl']).then(({ chainUrl }) => {
      if (chainUrl) {
        chainUrlInput.value = chainUrl;
      }
    });

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
