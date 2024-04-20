const { ethers } = require('hardhat');

const eth = (amt) => ethers.parseUnits(amt.toString(), 'ether');

const main = async () => {
  const [manager] = await ethers.getSigners();

  const Ticket = await ethers.getContractFactory('Ticket');
  const ticket = await Ticket.deploy(manager, 20);
  await ticket.deployed();

  for (let i = 0; i < 10; i++) {
    const transaction = await ticket.connect(manager).create(eth(2));
    await transaction.wait();
  }
};

main();
