const { expect } = require('chai');
const { ethers } = require('hardhat');

const eth = (amt) => ethers.parseUnits(amt.toString(), 'ether');

describe('Ticket', () => {
  let manager;
  let user;
  let ticket;

  beforeEach(async () => {
    [manager, user] = await ethers.getSigners();

    const Ticket = await ethers.getContractFactory('Ticket');
    ticket = await Ticket.deploy(manager, 10);

    // Create 5 tickets.
    for (let i = 0; i < 5; i++) {
      await ticket.connect(manager).create(eth(2));
    }

    // List 3 of them for sale.
    for (let i = 0; i < 3; i++) {
      await ticket.connect(manager).list(i + 1);
    }
  });

  describe('Creation and Supply', () => {
    it('shows total amount of tickets', async () => {
      const count = await ticket.totalAmount();
      expect(count).to.be.equal(5);
    });

    it('shows all tickets for sale', async () => {
      const tickets = await ticket.allForSale();
      expect(tickets.length).to.be.equal(3);
      for (let i = 0; i < tickets.length; i++) {
        const item = tickets[i];
        expect(item[0]).to.be.equal(i + 1);
        expect(item[1]).to.be.equal(manager.address);
        expect(item[2]).to.be.equal(eth(2));
        expect(item[3]).to.be.true;
      }
    });

    it('shows the price of tickets', async () => {
      const price = await ticket.priceOf(1);
      expect(price).to.be.equal(eth(2));
    });

    it('manager can create new tickets', async () => {
      await ticket.connect(manager).create(eth(5));

      const count = await ticket.totalAmount();
      expect(count).to.be.equal(6);

      const existingPrice = await ticket.priceOf(1);
      const newPrice = await ticket.priceOf(6);
      expect(existingPrice).to.be.equal(eth(2));
      expect(newPrice).to.be.equal(eth(5));
    });

    it('manager cannot create more than max amount of tickets', async () => {
      for (let i = 0; i < 5; i++) {
        await ticket.connect(manager).create(eth(2));
      }
      const total = await ticket.totalAmount();
      const max = await ticket.maxAmount();
      expect(total).to.be.equal(max);

      await expect(ticket.connect(manager).create(eth(2))).to.be.revertedWith(
        'No tickets remaining',
      );
    });
  });

  describe('Ticket Sale', () => {
    it('owner can list a ticket for sale', async () => {
      let isForSale = await ticket.isForSale(4);
      expect(isForSale).to.be.equal(false);

      await ticket.connect(manager).list(4);

      isForSale = await ticket.isForSale(4);
      expect(isForSale).to.be.equal(true);
    });

    it('buyer can buy an approved ticket', async () => {
      const managerStartBalance = await ethers.provider.getBalance(manager);
      const userStartBalance = await ethers.provider.getBalance(user);

      await ticket.connect(user).requestPurchase(1);
      await ticket.connect(manager).approve(1, user.address);
      await ticket.connect(user).buy(1, { value: eth(2) });

      const newOwner = await ticket.ownerOf(1);
      expect(newOwner).to.be.equal(user.address);

      const managerEndBalance = await ethers.provider.getBalance(manager);
      const userEndBalance = await ethers.provider.getBalance(user);
      expect(managerEndBalance).to.be.greaterThan(managerStartBalance);
      expect(userEndBalance).to.be.lessThan(userStartBalance);
    });

    it('buyer cannot buy a ticket that is not approved', async () => {
      await ticket.connect(user).requestPurchase(1);

      await expect(
        ticket.connect(user).buy(1, { value: eth(2) }),
      ).to.be.revertedWith('Must be approved');
    });

    it('buyer cannot buy a ticket without the exact amount of money', async () => {
      await ticket.connect(user).requestPurchase(1);
      await ticket.connect(manager).approve(1, user.address);

      await expect(
        ticket.connect(user).buy(1, { value: eth(1) }),
      ).to.be.revertedWith('Incorrect amount of money');
      await expect(
        ticket.connect(user).buy(1, { value: eth(3) }),
      ).to.be.revertedWith('Incorrect amount of money');
    });

    it('buyer cannot request purchase more than once', async () => {
      await ticket.connect(user).requestPurchase(1);

      await expect(ticket.connect(user).requestPurchase(1)).to.be.revertedWith(
        'Already a buyer',
      );
    });

    it('owner can dismiss a buyer', async () => {
      await ticket.connect(user).requestPurchase(1);
      await ticket.connect(manager).dismissBuyer(1, user.address);

      await expect(
        ticket.connect(user).buy(1, { value: eth(2) }),
      ).to.be.revertedWith('Must be a buyer of the ticket');
    });
  });
});
