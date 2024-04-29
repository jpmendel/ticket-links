import { useState, useEffect, useContext, useCallback } from 'react';
import icons from '@primer/octicons';
import { BlockChainContext } from '../contexts/BlockChainContext';
import { TicketContext } from '../contexts/TicketContext';
import { NavigationContext } from '../contexts/NavigationContext';
import { Page } from '../../data/page';
import './SellTicketPage.css';

export const SellTicketPage = ({ ticket }) => {
  const { service } = useContext(BlockChainContext);
  const { loadTickets } = useContext(TicketContext);
  const { navigate } = useContext(NavigationContext);

  const [buyers, setBuyers] = useState([]);
  const [isInitialLoaded, setInitialLoaded] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const loadBuyers = useCallback(async () => {
    if (isLoading) {
      return;
    }
    setLoading(true);
    try {
      const buyers = await service.buyersOfTicket(ticket.id);
      setBuyers(buyers);
    } catch (error) {
      console.error('Failed to load buyers:', error);
    } finally {
      setInitialLoaded(true);
      setLoading(false);
    }
  }, [service, isLoading, ticket.id]);

  const cancelSale = useCallback(
    async (ticketId) => {
      if (isLoading) {
        return;
      }
      setLoading(true);
      try {
        await service.cancelTicketSale(ticketId);
        await loadTickets();
        navigate(Page.MAIN);
      } catch (error) {
        console.error('Failed to cancel sale:', error);
      } finally {
        setLoading(false);
      }
    },
    [service, isLoading, loadTickets, navigate],
  );

  const approveBuyer = useCallback(
    async (ticketId, buyerAddr) => {
      if (isLoading) {
        return;
      }
      setLoading(true);
      try {
        await service.approveBuyer(ticketId, buyerAddr);
        await loadBuyers();
      } catch (error) {
        console.error('Failed to approve buyer:', error);
      } finally {
        setLoading(false);
      }
    },
    [service, isLoading, loadBuyers],
  );

  const dismissBuyer = useCallback(
    async (ticketId, buyerAddr) => {
      if (isLoading) {
        return;
      }
      setLoading(true);
      try {
        await service.dismissBuyer(ticketId, buyerAddr);
        await loadBuyers();
      } catch (error) {
        console.error('Failed to dismiss buyer:', error);
      } finally {
        setLoading(false);
      }
    },
    [service, isLoading, loadBuyers],
  );

  useEffect(() => {
    if (!service.isTicketMine(ticket)) {
      navigate(Page.MAIN);
    }
  }, [service, ticket, navigate]);

  useEffect(() => {
    if (!isInitialLoaded) {
      loadBuyers();
    }
  }, [isInitialLoaded, loadBuyers]);

  return (
    <main className="sell-container">
      <div className="sell-layout">
        <div className="sell-size-container">
          <div className="sell-header">
            <div className="sell-close-button-container">
              <div
                className="sell-close-button"
                role="button"
                dangerouslySetInnerHTML={{
                  __html: icons['arrow-left'].toSVG({ height: 36 }),
                }}
                onClick={() => navigate(Page.MAIN)}
              ></div>
            </div>
            <div className="sell-title-container">
              <h1 className="text-title">{`Sell Ticket ${ticket.id}`}</h1>
            </div>
            <div className="sell-cancel-container">
              <button
                className={'button-destructive text-body sell-cancel-button'}
                type="button"
                onClick={() => cancelSale(ticket.id)}
              >
                Cancel Sale
              </button>
            </div>
          </div>
          <div>
            {buyers.length > 0 ? (
              <div className="sell-buyer-list">
                {buyers.map((buyer, index) => (
                  <div key={index} className="sell-buyer-outer">
                    <div className="sell-buyer-inner">
                      <p className="sell-buyer-address">{buyer.address}</p>
                      <div>
                        <button
                          className={`${
                            buyer.isApproved
                              ? 'button-disabled'
                              : 'button-primary'
                          } text-body`}
                          type="button"
                          disabled={buyer.isApproved}
                          onClick={async () => {
                            if (!buyer.isApproved) {
                              await approveBuyer(ticket.id, buyer.address);
                            }
                          }}
                        >
                          {buyer.isApproved ? 'Approved' : 'Approve'}
                        </button>
                      </div>
                      <div>
                        <button
                          className={'button-secondary text-body'}
                          type="button"
                          onClick={() => dismissBuyer(ticket.id, buyer.address)}
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state-container">
                <p className="text-subtitle empty-state-text">No Buyers</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
