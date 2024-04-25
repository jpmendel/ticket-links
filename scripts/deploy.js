const fs = require('fs');
const path = require('path');
const { ethers } = require('hardhat');

const eth = (amt) => ethers.parseEther(amt.toString());

const main = async () => {
  try {
    const [manager] = await ethers.getSigners();

    const Ticket = await ethers.getContractFactory('Ticket');
    const ticket = await Ticket.deploy(manager, 10);
    await ticket.waitForDeployment();

    // Create 10 tickets.
    for (let i = 0; i < 3; i++) {
      await ticket.connect(manager).create(eth(2));
    }
    for (let i = 0; i < 2; i++) {
      await ticket.connect(manager).create(eth(5));
    }

    // List 5 of them for sale.
    for (let i = 0; i < 5; i++) {
      await ticket.connect(manager).list(i + 1, false);
    }

    // Save the deployed address to a file.
    const address = await ticket.getAddress();
    const addressesPath = path.join(
      __dirname,
      '../app/data/local/addresses.json',
    );

    let addresses = {};
    try {
      const fileContent = fs.readFileSync(addressesPath, { encoding: 'utf-8' });
      addresses = JSON.parse(fileContent);
    } catch {}

    addresses.ticket = address;
    addresses.manager = manager.address;
    fs.writeFileSync(addressesPath, JSON.stringify(addresses, null, 2));

    console.log(`Deployed Ticket at: ${address}`);
  } catch (error) {
    console.error('Deployment failed:', error);
    process.exit(1);
  }
};

main();
