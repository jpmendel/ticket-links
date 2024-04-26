import { useContext, useCallback } from 'react';
import { BlockChainContext } from '../contexts/BlockChainContext';
import { AccountContext } from '../contexts/AccountContext';
import { TicketContext } from '../contexts/TicketContext';
import './SoldByOthersView.css';

export const SoldByOthersView = () => {
  const { service } = useContext(BlockChainContext);
  const { loadBalance } = useContext(AccountContext);
  const { ticketsForSale, loadTickets } = useContext(TicketContext);

  const purchaseTicket = useCallback(
    async (id, price) => {
      try {
        await service.purchaseTicket(id, price);
        await loadBalance();
        await loadTickets();
      } catch (error) {
        console.error('Failed to purchase ticket:', error);
      }
    },
    [service, loadBalance, loadTickets],
  );

  const soldByOthers = ticketsForSale.filter(
    (ticket) => !service.isTicketSoldByManager(ticket),
  );

  return (
    <div>
      <div className="sbo-title-container">
        <h1 className="text-title">Sold by Others</h1>
      </div>
      {soldByOthers.length > 0 ? (
        <div className="sbo-ticket-list">
          {soldByOthers.map((ticket, index) => (
            <div key={index} className="sbo-ticket-outer">
              <div className="sbo-ticket-inner">
                <div className="sbo-ticket-info-container">
                  <h2 className="text-subtitle sbo-ticket-title">
                    {`Ticket ${ticket.id}`}
                  </h2>
                  <div className="text-body sbo-ticket-price-label">
                    {`${ticket.price} ETH`}
                  </div>
                  <div className="text-caption sbo-ticket-seller">
                    {`Sold by ${ticket.owner}`}
                  </div>
                </div>
                <div>
                  <button
                    className="button-primary text-body"
                    type="button"
                    onClick={() => purchaseTicket(ticket.id, ticket.price)}
                  >
                    Request
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>No Tickets</div>
      )}
    </div>
  );
};
