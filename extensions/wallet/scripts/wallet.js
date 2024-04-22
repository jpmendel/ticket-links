const main = async () => {
  const { currentAccount } = await browser.storage.local.get('currentAccount');
  if (currentAccount) {
    const { accounts } = await browser.storage.local.get('accounts');
    const account = accounts[currentAccount];
    if (account) {
      console.log('Loaded Wallet');
      window.postMessage({ type: 'wallet', data: account }, '*');
    }
  }
  console.log('Wallet Not Connected');
  window.postMessage({ type: 'wallet', data: null }, '*');
};

window.addEventListener('DOMContentLoaded', () => main());
