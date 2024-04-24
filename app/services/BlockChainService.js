import { Contract, Wallet, formatEther, parseEther } from 'ethers';
import ticketAbi from '../data/abi/Ticket.json';
import addresses from '../data/local/addresses.json';

export class BlockChainService {
  constructor(provider, wallet) {
    this.wallet = new Wallet(wallet.privateKey, provider);
    this.contracts = {
      ticket: new Contract(addresses.ticket, ticketAbi, this.wallet.provider),
    };
  }

  async getBalance() {
    const account = this.wallet.address;
    const balance = await this.wallet.provider.getBalance(account);
    return formatEther(balance);
  }

  async getTicketsForSale() {
    const forSale = await this.contracts.ticket
      .connect(this.wallet)
      .allForSale();
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
    await this.contracts.ticket
      .connect(this.wallet)
      .buy(ticketId, { value: parseEther(price) });
  }

  isTicketMine(ticket) {
    return ticket.owner === this.wallet.address;
  }

  isTicketSoldByManager(ticket) {
    return ticket.owner === addresses.manager;
  }
}
