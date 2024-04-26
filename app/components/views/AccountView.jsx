import { useCallback, useContext } from 'react';
import { BlockChainContext } from '../contexts/BlockChainContext';
import { AccountContext } from '../contexts/AccountContext';
import { TicketContext } from '../contexts/TicketContext';
import './AccountView.css';

export const AccountView = () => {
  const { service } = useContext(BlockChainContext);
  const { balance } = useContext(AccountContext);
  const { myTickets, loadTickets } = useContext(TicketContext);

  const listTicketForSale = useCallback(
    async (ticketId) => {
      try {
        await service.listTicket(ticketId);
        await loadTickets();
      } catch (error) {
        console.error('Failed to purchase ticket:', error);
      }
    },
    [service, loadTickets],
  );

  return (
    <div>
      <div className="account-title-container">
        <h1 className="text-title">Account</h1>
      </div>
      <div className="account-body-container">
        <div className="account-balance-container">
          {balance != null ? (
            <div>
              <b>Balance: </b>
              {`${balance} ETH`}
            </div>
          ) : (
            <div>Wallet Not Connected</div>
          )}
        </div>
        {myTickets.length > 0 ? (
          <div className="account-ticket-list">
            {myTickets.map((ticket, index) => (
              <div key={index} className="account-ticket-outer">
                <div className="account-ticket-inner">
                  <div className="account-ticket-title-container">
                    <h2 className="text-body account-ticket-title">
                      {`Ticket ${ticket.id} (${ticket.price} ETH)`}
                    </h2>
                  </div>
                  <div>
                    <button
                      className="button-primary text-body account-sell-button"
                      onClick={() => listTicketForSale(ticket.id)}
                    >
                      Sell
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="account-no-tickets-container">
            <div className="text-subtitle account-no-tickets-text">
              No Tickets
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
