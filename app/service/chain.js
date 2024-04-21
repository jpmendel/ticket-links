const getBalance = async () => {
  if (!app.wallet) {
    throw new Error('Wallet not connected');
  }
  const account = app.wallet.account;
  const balance = await app.provider.getBalance(account);
  return ethers.utils.formatEther(balance);
};

const getTicketsForSale = async () => {
  if (!app.wallet) {
    throw new Error('Wallet not connected');
  }
  if (!app.addr?.ticket) {
    throw new Error('Ticket address not found');
  }
  if (!app.abi?.ticket) {
    throw new Error('Ticket ABI not found');
  }
  const ticketContract = new ethers.Contract(
    app.addr.ticket,
    app.abi.ticket,
    app.provider,
  );
  const forSale = await ticketContract.allForSale();
  const tickets = [];
  for (const ticket of forSale) {
    tickets.push({
      id: ticket[0].toNumber(),
      owner: ticket[1],
      price: ethers.utils.formatEther(ticket[2]),
      isForSale: ticket[3],
    });
  }
  return tickets;
};

const getMyTickets = async () => {
  if (!app.wallet) {
    throw new Error('Wallet not connected');
  }
  if (!app.addr?.ticket) {
    throw new Error('Ticket address not found');
  }
  if (!app.abi?.ticket) {
    throw new Error('Ticket ABI not found');
  }
  const ticketContract = new ethers.Contract(
    app.addr.ticket,
    app.abi.ticket,
    app.provider,
  );
  const myTickets = await ticketContract.ownedByMe();
  const tickets = [];
  for (const ticket of myTickets) {
    tickets.push({
      id: ticket[0].toNumber(),
      owner: ticket[1],
      price: ethers.utils.formatEther(ticket[2]),
      isForSale: ticket[3],
    });
  }
  return tickets;
};

export { getBalance, getTicketsForSale, getMyTickets };
