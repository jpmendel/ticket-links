class AccountListView extends HTMLElement {
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
    listContainer.className = 'account-list-container';
    browser.storage.local
      .get([StorageKey.ACCOUNTS, StorageKey.CURRENT_ACCOUNT])
      .then(({ accounts, currentAccount }) => {
        listContainer.innerHTML = '';
        if (!accounts || accounts.length === 0) {
          const noAccountsContainer = document.createElement('div');
          noAccountsContainer.className = 'account-list-empty-state-container';

          const noAccountsText = document.createElement('div');
          noAccountsText.className = 'account-list-empty-state-text';
          noAccountsText.innerText = 'No Accounts';

          noAccountsContainer.appendChild(noAccountsText);
          listContainer.appendChild(noAccountsContainer);
          return;
        }
        for (let index = 0; index < accounts.length; index++) {
          const account = accounts[index];
          const isCurrent = index === currentAccount;

          const accountView = document.createElement('account-view');
          accountView.account = account;
          accountView.isCurrent = isCurrent;
          accountView.connectAccount = async () => this.connectAccount(index);
          accountView.disconnectAccount = async () => this.disconnectAccount();
          accountView.deleteAccount = async () => {
            if (isCurrent) {
              await browser.storage.local.remove(StorageKey.CURRENT_ACCOUNT);
            }
            await this.deleteAccount(accounts, index);
          };

          listContainer.appendChild(accountView);
        }
      });

    mainContainer.appendChild(listContainer);

    const addButtonContainer = document.createElement('div');
    const addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.innerText = 'Add Account';
    addButton.onclick = async () => {
      await navigate(Page.ADD_ACCOUNT);
    };

    addButtonContainer.appendChild(addButton);
    mainContainer.appendChild(addButtonContainer);

    this.innerHTML = '';
    this.appendChild(mainContainer);
  }
}

customElements.define('account-list-view', AccountListView);
