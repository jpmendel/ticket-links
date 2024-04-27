import { useState, useEffect, useContext, useCallback } from 'react';
import { BlockChainContext } from '../contexts/BlockChainContext';
import { AccountContext } from '../contexts/AccountContext';
import { TicketContext } from '../contexts/TicketContext';
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
      {ticketGroups.length > 0 ? (
        <div className="sbm-ticket-list">
          {ticketGroups.map((group, index) => (
            <div key={index} className="sbm-ticket-group-outer">
              <div className="sbm-ticket-group-inner">
                <h2 className="text-subtitle sbm-ticket-title">Ticket</h2>
                <p className="text-body sbm-ticket-price-label">
                  {`${group.price} ETH`}
                </p>
                <p className="text-body sbm-ticket-amount-left">
                  {`${group.count} left at this price`}
                </p>
                <button
                  className={`${
                    service.isConnected() ? 'button-primary' : 'button-disabled'
                  } text-body`}
                  type="button"
                  disabled={!service.isConnected()}
                  onClick={() => purchaseTicket(group.price)}
                >
                  Purchase
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="sbm-no-tickets-container">
          <p className="text-subtitle sbm-no-tickets-text">No Tickets</p>
        </div>
      )}
    </div>
  );
};
