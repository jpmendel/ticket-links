const updateWallet = async () => {
  const { currentAccount } = await browser.storage.local.get(
    StorageKey.CURRENT_ACCOUNT,
  );
  if (currentAccount != null) {
    const { accounts } = await browser.storage.local.get(StorageKey.ACCOUNTS);
    const account = accounts[currentAccount];
    if (account) {
      console.log('Wallet Connected');
      window.postMessage({ type: 'wallet', data: account }, '*');
      return;
    }
  }
  console.log('Wallet Not Connected');
  window.postMessage({ type: 'wallet', data: null }, '*');
};

window.addEventListener('DOMContentLoaded', () => updateWallet());
browser.runtime.onMessage.addListener((request) => {
  if (request.message === Message.WALLET_UPDATE) {
    updateWallet();
  }
});
