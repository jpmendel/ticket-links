import { Contract, Wallet, formatEther, parseEther } from 'ethers';
import ticketAbi from '../data/abi/Ticket.json';
import addresses from '../data/local/addresses.json';

export class BlockChainService {
  constructor(provider, wallet) {
    this.provider = provider;
    if (provider && wallet) {
      this.wallet = new Wallet(wallet.privateKey, provider);
    } else {
      this.wallet = null;
    }
    this.contracts = {
      ticket: new Contract(addresses.ticket, ticketAbi, this.provider),
    };
  }

  isConnected() {
    return this.wallet != null;
  }

  isTicketMine(ticket) {
    if (!this.isConnected()) {
      return false;
    }
    return ticket.owner === this.wallet.address;
  }

  isTicketSoldByManager(ticket) {
    return ticket.owner === addresses.manager;
  }

  async getBalance() {
    if (!this.isConnected()) {
      return null;
    }
    const account = this.wallet.address;
    const balance = await this.provider.getBalance(account);
    return formatEther(balance);
  }

  async getTicketsForSale() {
    const forSale = await this.contracts.ticket.allForSale();
    const tickets = [];
    for (const ticket of forSale) {
      tickets.push({
        id: Number(ticket[0]),
        owner: ticket[1],
        price: formatEther(ticket[2]),
        isForSale: ticket[3],
        needsApproval: ticket[4],
      });
    }
    return tickets;
  }

  async getMyTickets() {
    if (!this.isConnected()) {
      return [];
    }
    const myTickets = await this.contracts.ticket
      .connect(this.wallet)
      .ownedByMe();
    const tickets = [];
    for (const ticket of myTickets) {
      tickets.push({
        id: Number(ticket[0]),
        owner: ticket[1],
        price: formatEther(ticket[2]),
        isForSale: ticket[3],
        needsApproval: ticket[4],
      });
    }
    return tickets;
  }

  async getRequestedByMe() {
    if (!this.isConnected()) {
      return [];
    }
    const requested = await this.contracts.ticket
      .connect(this.wallet)
      .requestedByMe();
    const tickets = [];
    for (const ticket of requested) {
      const ticketId = Number(ticket[0]);
      const isApproved = await this.contracts.ticket
        .connect(this.wallet)
        .isApproved(ticketId);
      tickets.push({
        id: ticketId,
        owner: ticket[1],
        price: formatEther(ticket[2]),
        isForSale: ticket[3],
        needsApproval: ticket[4],
        isApproved,
      });
    }
    return tickets;
  }

  async purchaseTicket(ticketId, price) {
    if (!this.isConnected()) {
      throw new Error('No wallet connected');
    }
    await this.contracts.ticket
      .connect(this.wallet)
      .purchase(ticketId, { value: parseEther(price) });
  }

  async purchaseFirstAvailableTicket(seller, price) {
    if (!this.isConnected()) {
      throw new Error('No wallet connected');
    }
    await this.contracts.ticket
      .connect(this.wallet)
      .purchaseFirstAvailable(seller, { value: parseEther(price) });
  }

  async listTicket(ticketId) {
    if (!this.isConnected()) {
      throw new Error('No wallet connected');
    }
    await this.contracts.ticket.connect(this.wallet).list(ticketId, true);
  }

  async requestTicket(ticketId) {
    if (!this.isConnected()) {
      throw new Error('No wallet connected');
    }
    await this.contracts.ticket.connect(this.wallet).requestPurchase(ticketId);
  }

  async buyersOfTicket(ticketId) {
    if (!this.isConnected()) {
      throw new Error('No wallet connected');
    }
    const buyers = await this.contracts.ticket
      .connect(this.wallet)
      .buyersOf(ticketId);
    return buyers.map((buyer) => ({ address: buyer[0], isApproved: buyer[1] }));
  }

  async approveBuyer(ticketId, buyer) {
    if (!this.isConnected()) {
      throw new Error('No wallet connected');
    }
    await this.contracts.ticket.connect(this.wallet).approve(ticketId, buyer);
  }
}
