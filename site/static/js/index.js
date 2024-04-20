const linkWallet = (wallet) => {
  window.wallet = wallet;
};

const setup = async () => {
  window.addEventListener('message', (event) => {
    if (event.data.type === 'wallet') {
      linkWallet(event.data.data);
    }
  });
  const body = document.getElementById('body');
  body.innerHTML = '';
  body.appendChild(document.createElement('ticket-view'));
};

window.onload = () => setup();
