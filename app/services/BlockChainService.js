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

  isTicketMine(ticket) {
    return ticket.owner === this.wallet.address;
  }

  isTicketSoldByManager(ticket) {
    return ticket.owner === addresses.manager;
  }
}
