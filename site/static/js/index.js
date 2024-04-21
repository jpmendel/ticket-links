const loadAbiFiles = async () => {
  const res = await fetch('/static/abi/Ticket.json');
  const ticket = await res.json();
  app.abi = { ticket };
};

const linkWallet = (wallet) => {
  app.wallet = wallet;
  if (wallet) {
    const provider = new ethers.providers.JsonRpcProvider(
      wallet.chainUrl || undefined,
    );
    app.provider = provider;
  }
};

const setup = async () => {
  window.app = {};
  window.addEventListener('message', (event) => {
    if (event.data.type === 'wallet') {
      console.log('Received Wallet Message');
      linkWallet(event.data.data);
    }
  });
  await loadAbiFiles();
  const body = document.getElementById('body');
  body.innerHTML = '';
  body.appendChild(document.createElement('account-view'));
};

window.onload = () => setup();