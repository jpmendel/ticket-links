import { useContext, useCallback } from 'react';
import { BlockChainContext } from '../contexts/BlockChainContext';
import { AccountContext } from '../contexts/AccountContext';
import { TicketContext } from '../contexts/TicketContext';
import './SoldByOthersView.css';

export const SoldByOthersView = () => {
  const { service } = useContext(BlockChainContext);
  const { loadBalance } = useContext(AccountContext);
  const { ticketsForSale, loadTickets } = useContext(TicketContext);

  const requestTicket = useCallback(
    async (ticketId) => {
      try {
        await service.requestTicket(ticketId);
        await loadTickets();
      } catch (error) {
        console.error('Failed to request ticket:', error);
      }
    },
    [service, loadTickets],
  );

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
                  <p className="text-body sbo-ticket-price-label">
                    {`${ticket.price} ETH`}
                  </p>
                  <p className="text-caption sbo-ticket-seller">
                    {`Sold by ${
                      service.isTicketMine(ticket) ? 'me' : ticket.owner
                    }`}
                  </p>
                </div>
                <div className="sbo-ticket-button-container">
                  <button
                    className={`${
                      !service.isConnected() || service.isTicketMine(ticket)
                        ? 'button-disabled'
                        : 'button-primary'
                    } text-body`}
                    type="button"
                    disabled={
                      !service.isConnected() || service.isTicketMine(ticket)
                    }
                    onClick={async () => {
                      if (ticket.needsApproval) {
                        await requestTicket(ticket.id);
                      } else {
                        await purchaseTicket(ticket.id, ticket.price);
                      }
                    }}
                  >
                    {ticket.needsApproval ? 'Request' : 'Purchase'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state-container">
          <p className="text-subtitle empty-state-text">No Tickets</p>
        </div>
      )}
    </div>
  );
};
