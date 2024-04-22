import { Contract, Wallet, formatEther } from 'ethers';
import ticketAbi from '../data/abi/Ticket.json';
import addresses from '../data/addresses.json';

export class BlockChainService {
  constructor(provider, wallet) {
    this.wallet = new Wallet(wallet.privateKey, provider);
  }

  async getBalance() {
    const account = this.wallet.address;
    const balance = await this.wallet.provider.getBalance(account);
    return formatEther(balance);
  }

  async getTicketsForSale() {
    const ticketContract = new Contract(
      addresses.ticket,
      ticketAbi,
      this.wallet.provider,
    );
    const forSale = await ticketContract.connect(this.wallet).allForSale();
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
    const ticketContract = new Contract(
      addresses.ticket,
      ticketAbi,
      this.wallet.provider,
    );
    const myTickets = await ticketContract.connect(this.wallet).ownedByMe();
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
}
