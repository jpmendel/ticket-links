import { useState, useEffect, useContext, useCallback } from 'react';
import { BlockChainContext } from '../context/BlockChainContext';
import { AccountContext } from '../context/AccountContext';
import { TicketContext } from '../context/TicketContext';
import addresses from '../../data/local/addresses.json';
import './SoldByManagerView.css';

export const SoldByManagerView = () => {
  const { service } = useContext(BlockChainContext);
  const { loadBalance } = useContext(AccountContext);
  const { ticketsForSale, loadTickets } = useContext(TicketContext);

  const [ticketGroups, setTicketGroups] = useState([]);

  const purchaseTicket = useCallback(
    async (price) => {
      try {
        await service.purchaseFirstAvailableTicket(addresses.manager, price);
        await loadBalance();
        await loadTickets();
      } catch (error) {
        console.error('Failed to purchase ticket:', error);
      }
    },
    [service, loadBalance, loadTickets],
  );

  useEffect(() => {
    const soldByManager = ticketsForSale.filter((ticket) =>
      service.isTicketSoldByManager(ticket),
    );
    const ticketGroups = {};
    for (const ticket of soldByManager) {
      const existingGroup = ticketGroups[ticket.price];
      if (existingGroup) {
        existingGroup.count++;
      } else {
        ticketGroups[ticket.price] = { price: ticket.price, count: 1 };
      }
    }
    setTicketGroups(
      Object.values(ticketGroups).sort(
        (a, b) => parseInt(a.price) - parseInt(b.price),
      ),
    );
  }, [service, ticketsForSale]);

  return (
    <div>
      <div className="sbm-title-container">
        <h1 className="text-title">Sold by Manager</h1>
      </div>
      <div className="sbm-ticket-list">
        {ticketGroups.map((group, index) => (
          <div key={index} className="sbm-ticket-group-outer">
            <div className="ticket-inner">
              <h2 className="text-subtitle sbm-ticket-title">Ticket</h2>
              <div className="sbm-ticket-price-label">{`${group.price} ETH`}</div>
              <div className="sbm-ticket-amount-left">
                {`${group.count} left at this price`}
              </div>
              <button
                className="button-primary text-body"
                type="button"
                onClick={() => purchaseTicket(group.price)}
              >
                Purchase
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
