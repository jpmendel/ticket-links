const main = async () => {
  const data = await browser.storage.local.get([
    'account',
    'privateKey',
    'chainUrl',
  ]);
  if (data.public && data.private && data.chainUrl) {
    window.postMessage({ type: 'wallet', data }, '*');
  } else {
    window.postMessage({ type: 'wallet', data: null }, '*');
  }
};

main();
