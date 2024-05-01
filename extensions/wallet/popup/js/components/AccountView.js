class AccountView extends HTMLElement {
  constructor() {
    super();
    this.account = {};
    this.isCurrent = false;
    this.connectAccount = async () => {};
    this.disconnectAccount = async () => {};
    this.deleteAccount = async () => {};
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const mainContainer = document.createElement('div');
    mainContainer.className = 'account-container';

    const accountItemOuter = document.createElement('div');
    accountItemOuter.className = 'account-outer';
    accountItemOuter.onclick = async () => {
      if (this.isCurrent) {
        await this.disconnectAccount();
      } else {
        await this.connectAccount();
      }
    };

    const accountItemInner = document.createElement('div');
    accountItemInner.className = 'account-inner';

    const statusContainer = document.createElement('div');
    statusContainer.className = 'account-status-container';

    const status = document.createElement('div');
    status.className = 'account-status' + (this.isCurrent ? ' active' : '');
    statusContainer.appendChild(status);

    accountItemInner.appendChild(statusContainer);

    const infoContainer = document.createElement('div');
    infoContainer.className = 'account-info-container';

    const name = document.createElement('div');
    name.className = 'account-name';
    name.innerText = this.account.name;
    infoContainer.appendChild(name);

    const address = document.createElement('div');
    address.className = 'account-address';
    address.innerText = this.account.address;
    infoContainer.appendChild(address);

    accountItemInner.appendChild(infoContainer);
    accountItemOuter.appendChild(accountItemInner);
    mainContainer.appendChild(accountItemOuter);

    const deleteButtonContainer = document.createElement('div');
    deleteButtonContainer.className = 'account-delete-button-container';

    const deleteButton = document.createElement('div');
    deleteButton.className = 'account-delete-button';
    deleteButton.innerHTML = IconImage.DELETE;
    deleteButton.onclick = async () => {
      await this.deleteAccount();
    };
    deleteButtonContainer.appendChild(deleteButton);

    mainContainer.appendChild(deleteButtonContainer);

    this.innerHTML = '';
    this.appendChild(mainContainer);
  }
}

customElements.define('account-view', AccountView);
