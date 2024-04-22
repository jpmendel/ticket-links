const { ethers } = require('hardhat');

const eth = (amt) => ethers.parseUnits(amt.toString(), 'ether');

const main = async () => {
  const [manager] = await ethers.getSigners();

  const Ticket = await ethers.getContractFactory('Ticket');
  const ticket = await Ticket.deploy(manager, 10);
  await ticket.waitForDeployment();

  // Create 5 tickets.
  for (let i = 0; i < 5; i++) {
    await ticket.connect(manager).create(eth(2));
  }

  // List 3 of them for sale.
  for (let i = 0; i < 3; i++) {
    await ticket.connect(manager).list(i + 1);
  }

  const address = await ticket.getAddress();
  console.log(`Deployed Ticket at: ${address}`);
};

main().catch((error) => {
  console.error('Deployment failed:', error);
  process.exit(1);
});
