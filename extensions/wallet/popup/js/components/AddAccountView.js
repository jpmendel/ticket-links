class AddAccountView extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  async addAccount(account) {
    const data = new FormData(account);
    if (
      !data.get('name') ||
      !data.get('address') ||
      !data.get('private') ||
      !data.get('chain')
    ) {
      return;
    }
    const newAccount = {
      name: data.get('name'),
      address: data.get('address'),
      privateKey: data.get('private'),
      chainUrl: data.get('chain'),
    };
    const { accounts } = await browser.storage.local.get(StorageKey.ACCOUNTS);
    if (!accounts) {
      await browser.storage.local.set({ [StorageKey.ACCOUNTS]: [newAccount] });
    } else {
      const newAccounts = [...accounts, newAccount];
      await browser.storage.local.set({ [StorageKey.ACCOUNTS]: newAccounts });
    }
    await navigate(Page.ACCOUNTS_LIST);
  }

  render() {
    const form = document.createElement('form');
    form.id = 'form';
    form.action = '#';
    form.onsubmit = async (event) => {
      event.preventDefault();
      await browser.storage.session.remove([
        StorageKey.TEMP_NAME,
        StorageKey.TEMP_ADDRESS,
        StorageKey.TEMP_PRIVATE_KEY,
        StorageKey.TEMP_CHAIN_URL,
      ]);
      await this.addAccount(event.target);
    };

    // Name Input
    const nameContainer = document.createElement('div');
    nameContainer.className = 'add-account-input-container';

    const nameLabel = document.createElement('label');
    nameLabel.className = 'add-account-label';
    nameLabel.setAttribute('for', 'name-input');
    nameLabel.innerText = 'Account Name';

    const nameInput = document.createElement('input');
    nameInput.id = 'name-input';
    nameInput.className = 'add-account-input';
    nameInput.name = 'name';
    nameInput.type = 'text';
    nameInput.placeholder = 'Account Name';
    nameInput.onblur = async (event) => {
      await browser.storage.session.set({
        [StorageKey.TEMP_NAME]: event.target.value,
      });
    };
    browser.storage.session.get(StorageKey.TEMP_NAME).then(({ tempName }) => {
      if (tempName) {
        nameInput.value = tempName;
      }
    });

    nameContainer.appendChild(nameLabel);
    nameContainer.appendChild(nameInput);
    form.appendChild(nameContainer);

    // Address Input
    const addressContainer = document.createElement('div');
    addressContainer.className = 'add-account-input-container';

    const addressLabel = document.createElement('label');
    addressLabel.className = 'add-account-label';
    addressLabel.setAttribute('for', 'address-input');
    addressLabel.innerText = 'Account Address';

    const addressInput = document.createElement('input');
    addressInput.id = 'address-input';
    addressInput.className = 'add-account-input';
    addressInput.name = 'address';
    addressInput.type = 'text';
    addressInput.placeholder = 'Account Address';
    addressInput.onblur = async (event) => {
      await browser.storage.session.set({
        [StorageKey.TEMP_ADDRESS]: event.target.value,
      });
    };
    browser.storage.session
      .get(StorageKey.TEMP_ADDRESS)
      .then(({ tempAddress }) => {
        if (tempAddress) {
          addressInput.value = tempAddress;
        }
      });

    addressContainer.appendChild(addressLabel);
    addressContainer.appendChild(addressInput);
    form.appendChild(addressContainer);

    // Private Key Input
    const privateKeyContainer = document.createElement('div');
    privateKeyContainer.className = 'add-account-input-container';

    const privateKeyLabel = document.createElement('label');
    privateKeyLabel.className = 'add-account-label';
    privateKeyLabel.setAttribute('for', 'private-key-input');
    privateKeyLabel.innerText = 'Private Key';

    const privateKeyInput = document.createElement('input');
    privateKeyInput.id = 'private-key-input';
    privateKeyInput.className = 'add-account-input';
    privateKeyInput.name = 'private';
    privateKeyInput.type = 'text';
    privateKeyInput.placeholder = 'Private Key';
    privateKeyInput.onblur = async (event) => {
      await browser.storage.session.set({
        [StorageKey.TEMP_PRIVATE_KEY]: event.target.value,
      });
    };
    browser.storage.session
      .get(StorageKey.TEMP_PRIVATE_KEY)
      .then(({ tempPrivateKey }) => {
        if (tempPrivateKey) {
          privateKeyInput.value = tempPrivateKey;
        }
      });

    privateKeyContainer.appendChild(privateKeyLabel);
    privateKeyContainer.appendChild(privateKeyInput);
    form.appendChild(privateKeyContainer);

    // Chain URL Input
    const chainUrlContainer = document.createElement('div');
    chainUrlContainer.className = 'add-account-input-container';

    const chainUrlLabel = document.createElement('label');
    chainUrlLabel.className = 'add-account-label';
    chainUrlLabel.setAttribute('for', 'chain-url-input');
    chainUrlLabel.innerText = 'Chain URL';

    const chainUrlInput = document.createElement('input');
    chainUrlInput.id = 'chain-url-input';
    chainUrlInput.className = 'add-account-input';
    chainUrlInput.name = 'chain';
    chainUrlInput.type = 'text';
    chainUrlInput.placeholder = 'Chain URL';
    chainUrlInput.onblur = async (event) => {
      await browser.storage.session.set({
        [StorageKey.TEMP_CHAIN_URL]: event.target.value,
      });
    };
    browser.storage.session
      .get(StorageKey.TEMP_CHAIN_URL)
      .then(({ tempChainUrl }) => {
        if (tempChainUrl) {
          chainUrlInput.value = tempChainUrl;
        }
      });

    chainUrlContainer.appendChild(chainUrlLabel);
    chainUrlContainer.appendChild(chainUrlInput);
    form.appendChild(chainUrlContainer);

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'add-account-button-container';

    // Add Button
    const addButtonContainer = document.createElement('div');
    const addButton = document.createElement('button');
    addButton.type = 'submit';
    addButton.innerText = 'Add Account';

    addButtonContainer.appendChild(addButton);
    buttonContainer.appendChild(addButtonContainer);

    // Cancel Button
    const cancelButtonContainer = document.createElement('div');
    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.innerText = 'Cancel';
    cancelButton.onclick = async () => {
      await navigate(Page.ACCOUNTS_LIST);
    };

    cancelButtonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(cancelButtonContainer);

    form.appendChild(buttonContainer);

    this.innerHTML = '';
    this.appendChild(form);
  }
}

customElements.define('add-account-view', AddAccountView);
