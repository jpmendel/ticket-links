import { useState, useEffect, useContext, useCallback } from 'react';
import { BlockChainContext } from '../context/BlockChainContext';
import { AccountContext } from '../context/AccountContext';
import { TicketContext } from '../context/TicketContext';
import './SoldByManagerView.css';

export const SoldByManagerView = () => {
  const { service } = useContext(BlockChainContext);
  const { loadBalance } = useContext(AccountContext);
  const { ticketsForSale, loadTickets } = useContext(TicketContext);

  const [ticketGroups, setTicketGroups] = useState([]);

  const purchaseTicket = useCallback(
    async (ticketId, price) => {
      try {
        await service.purchaseTicket(ticketId, price);
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
        existingGroup.ids.push(ticket.id);
      } else {
        ticketGroups[ticket.price] = { price: ticket.price, ids: [ticket.id] };
      }
    }
    setTicketGroups(
      Object.values(ticketGroups).sort(
        (a, b) => parseInt(a.price) - parseInt(b.price),
      ),
    );
  }, [service, ticketsForSale]);

  return (
    <div className="sbm-ticket-list">
      {ticketGroups.map((group, index) => (
        <div key={index} className="sbm-ticket-group-outer">
          <div className="ticket-inner">
            <div>Ticket</div>
            <div>{`Price: ${group.price} ETH`}</div>
            <div>{`Left at this price: ${group.ids.length}`}</div>
            <button
              type="button"
              onClick={async () => {
                if (!group.ids[0]) {
                  return;
                }
                await purchaseTicket(group.ids[0], group.price);
              }}
            >
              Purchase
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
