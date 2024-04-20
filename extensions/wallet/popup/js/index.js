const setup = async () => {
  const data = await browser.storage.local.get([
    'public',
    'private',
    'chainUrl',
  ]);
  const body = document.getElementById('body');
  if (data.public && data.private && data.chainUrl) {
    body.innerHTML = '';
    body.appendChild(document.createElement('wallet-view'));
  } else {
    await browser.storage.local.remove(['public', 'private', 'chainUrl']);
    body.innerHTML = '';
    body.appendChild(document.createElement('connect-view'));
  }
};

window.onload = () => setup();
