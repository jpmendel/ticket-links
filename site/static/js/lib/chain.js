const getBalance = async () => {
  if (!app.wallet) {
    return null;
  }
  const account = app.wallet.account;
  const balance = await app.provider.getBalance(account);
  return ethers.utils.formatEther(balance);
};
