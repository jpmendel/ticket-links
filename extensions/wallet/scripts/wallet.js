const main = async () => {
  const data = await browser.storage.local.get([
    'account',
    'privateKey',
    'chainUrl',
  ]);
  if (data.account && data.privateKey && data.chainUrl) {
    console.log('Loaded Wallet');
    window.postMessage({ type: 'wallet', data }, '*');
  } else {
    console.log('Wallet Not Connected');
    window.postMessage({ type: 'wallet', data: null }, '*');
  }
};

main();
