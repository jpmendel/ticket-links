const connectAccount = async (account) => {
  const data = new FormData(account);
  if (!data.get('public') || !data.get('private') || !data.get('chainUrl')) {
    displayError();
    return;
  }
  browser.storage.local.set({
    public: data.get('public'),
    private: data.get('private'),
    chainUrl: data.get('chain-url'),
  });
};

const disconnect = async () => {
  browser.storage.local.remove(['public', 'private', 'chainUrl']);
};

const displayError = async () => {};

const setup = async () => {
  const form = document.getElementById('form');
  form.onsubmit = async (event) => {
    event.preventDefault();
    await connectAccount(event.target);
  };
};

window.onload = () => setup();
