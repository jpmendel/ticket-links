const setup = async () => {
  const data = await browser.storage.local.get([
    'account',
    'privateKey',
    'chainUrl',
  ]);
  const body = document.getElementById('body');
  if (data.account && data.privateKey && data.chainUrl) {
    body.innerHTML = '';
    body.appendChild(document.createElement('wallet-view'));
  } else {
    await browser.storage.local.remove(['account', 'privateKey', 'chainUrl']);
    body.innerHTML = '';
    body.appendChild(document.createElement('connect-view'));
  }
};

window.onload = () => setup();
