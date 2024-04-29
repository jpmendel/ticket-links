class AccountsView extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  async connectAccount(index) {
    await browser.storage.local.set({ [StorageKey.CURRENT_ACCOUNT]: index });
    await this.updateWallet();
    this.render();
  }

  async disconnectAccount() {
    await browser.storage.local.remove(StorageKey.CURRENT_ACCOUNT);
    await this.updateWallet();
    this.render();
  }

  async deleteAccount(accounts, accountIndex) {
    const newAccounts = accounts.filter((_, index) => index !== accountIndex);
    await browser.storage.local.set({ [StorageKey.ACCOUNTS]: newAccounts });
    await this.updateWallet();
    this.render();
  }

  async updateWallet() {
    try {
      const tabs = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });
      for (const tab of tabs) {
        await browser.tabs.sendMessage(tab.id, {
          message: Message.WALLET_UPDATE,
        });
      }
    } catch (error) {
      console.warn('Skipped sending wallet update message:', error);
    }
  }

  render() {
    const mainContainer = document.createElement('div');

    const listContainer = document.createElement('div');
    listContainer.className = 'accounts-list-container';
    browser.storage.local
      .get([StorageKey.ACCOUNTS, StorageKey.CURRENT_ACCOUNT])
      .then(({ accounts, currentAccount }) => {
        listContainer.innerHTML = '';
        if (!accounts || accounts.length === 0) {
          const noAccountsContainer = document.createElement('div');
          noAccountsContainer.className = 'accounts-empty-state-container';

          const noAccountsText = document.createElement('div');
          noAccountsText.className = 'accounts-empty-state-text';
          noAccountsText.innerText = 'No Accounts';

          noAccountsContainer.appendChild(noAccountsText);
          listContainer.appendChild(noAccountsContainer);
          return;
        }
        for (let index = 0; index < accounts.length; index++) {
          const account = accounts[index];
          const isCurrent = index === currentAccount;

          const row = document.createElement('div');
          row.className = 'accounts-list-row';

          const accountItemOuter = document.createElement('div');
          accountItemOuter.className = 'accounts-item-outer';
          accountItemOuter.onclick = async () => {
            if (isCurrent) {
              await this.disconnectAccount();
            } else {
              await this.connectAccount(index, account);
            }
          };

          const accountItemInner = document.createElement('div');
          accountItemInner.className = 'accounts-item-inner';

          const statusContainer = document.createElement('div');
          statusContainer.className = 'accounts-item-status-container';

          const status = document.createElement('div');
          status.className =
            'accounts-item-status' + (isCurrent ? ' active' : '');
          statusContainer.appendChild(status);

          accountItemInner.appendChild(statusContainer);

          const infoContainer = document.createElement('div');
          infoContainer.className = 'accounts-info-container';

          const name = document.createElement('div');
          name.className = 'accounts-item-name';
          name.innerText = account.name;
          infoContainer.appendChild(name);

          const address = document.createElement('div');
          address.className = 'accounts-item-address';
          address.innerText = account.address;
          infoContainer.appendChild(address);

          accountItemInner.appendChild(infoContainer);
          accountItemOuter.appendChild(accountItemInner);
          row.appendChild(accountItemOuter);

          const deleteButtonContainer = document.createElement('div');
          deleteButtonContainer.className = 'accounts-delete-button-container';

          const deleteButton = document.createElement('div');
          deleteButton.className = 'accounts-delete-button';
          deleteButton.innerHTML = IconImage.DELETE;
          deleteButton.onclick = async () => {
            if (isCurrent) {
              await browser.storage.local.remove(StorageKey.CURRENT_ACCOUNT);
            }
            await this.deleteAccount(accounts, index);
          };
          deleteButtonContainer.appendChild(deleteButton);

          row.appendChild(deleteButtonContainer);
          listContainer.appendChild(row);
        }
      });

    mainContainer.appendChild(listContainer);

    const addButtonContainer = document.createElement('div');
    const addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.innerText = 'Add Account';
    addButton.onclick = async () => {
      await navigate('add-account-view');
    };

    addButtonContainer.appendChild(addButton);
    mainContainer.appendChild(addButtonContainer);

    this.innerHTML = '';
    this.appendChild(mainContainer);
  }
}

customElements.define('accounts-view', AccountsView);
