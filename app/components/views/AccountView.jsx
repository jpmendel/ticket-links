import { useState, useCallback, useContext } from 'react';
import { BlockChainContext } from '../contexts/BlockChainContext';
import { AccountContext } from '../contexts/AccountContext';
import { TicketContext } from '../contexts/TicketContext';
import { NavigationContext } from '../contexts/NavigationContext';
import { Page } from '../../data/page';
import './AccountView.css';

export const AccountView = () => {
  const { service } = useContext(BlockChainContext);
  const { balance, loadBalance } = useContext(AccountContext);
  const { myTickets, requestedTickets, loadTickets } =
    useContext(TicketContext);
  const { navigate } = useContext(NavigationContext);

  const [isLoading, setLoading] = useState(false);

  const listTicketForSale = useCallback(
    async (ticketId) => {
      if (isLoading) {
        return;
      }
      setLoading(true);
      try {
        await service.listTicket(ticketId);
        await loadTickets();
      } catch (error) {
        console.error('Failed to list ticket:', error);
      } finally {
        setLoading(false);
      }
    },
    [service, isLoading, loadTickets],
  );

  const purchaseTicket = useCallback(
    async (ticketId, price) => {
      if (isLoading) {
        return;
      }
      setLoading(true);
      try {
        await service.purchaseTicket(ticketId, price);
        await loadBalance();
        await loadTickets();
      } catch (error) {
        console.error('Failed to purchase ticket:', error);
      } finally {
        setLoading(false);
      }
    },
    [service, isLoading, loadBalance, loadTickets],
  );

  return (
    <div>
      <div className="account-title-container">
        <h1 className="text-title">Account</h1>
      </div>
      <div className="account-body-container">
        {service.isConnected() ? (
          <>
            <p className="account-balance-container">
              <b>Balance: </b>
              {`${balance} ETH`}
            </p>
            {myTickets.length > 0 || requestedTickets.length > 0 ? (
              <div className="account-ticket-list">
                {myTickets.map((ticket, index) => (
                  <TicketView
                    key={index}
                    ticket={ticket}
                    description={ticket.isForSale ? 'For sale' : 'Owned'}
                    buttonConfig={
                      !service.isManager()
                        ? {
                            text: ticket.isForSale ? 'Review' : 'Sell',
                            action: async () => {
                              if (ticket.isForSale) {
                                navigate(Page.SELL, { ticket });
                              } else {
                                await listTicketForSale(ticket.id);
                              }
                            },
                          }
                        : null
                    }
                  />
                ))}
                {requestedTickets.map((ticket, index) => (
                  <TicketView
                    key={index}
                    ticket={ticket}
                    description={
                      ticket.isApproved
                        ? 'Ready to purchase'
                        : 'Pending approval'
                    }
                    buttonConfig={{
                      text: ticket.isApproved ? 'Purchase' : 'Pending',
                      disabled: !ticket.isApproved,
                      action: async () => {
                        if (ticket.isApproved) {
                          await purchaseTicket(ticket.id, ticket.price);
                        }
                      },
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="account-no-tickets-container">
                <p className="text-subtitle empty-state-text">No Tickets</p>
              </div>
            )}
          </>
        ) : (
          <p className="text-body">Wallet Not Connected</p>
        )}
      </div>
    </div>
  );
};

const TicketView = ({ ticket, description, buttonConfig }) => (
  <div className="account-ticket-outer">
    <div className="account-ticket-inner">
      <div className="account-ticket-title-container">
        <h2 className="text-body account-ticket-title">
          {`Ticket ${ticket.id} (${ticket.price} ETH)`}
        </h2>
        <p className="text-caption">{description}</p>
      </div>
      {buttonConfig && (
        <div>
          <button
            className={`${
              buttonConfig.disabled ? 'button-disabled' : 'button-primary'
            } text-body account-sell-button`}
            disabled={buttonConfig.disabled}
            onClick={() => buttonConfig.action?.()}
          >
            {buttonConfig.text}
          </button>
        </div>
      )}
    </div>
  </div>
);
