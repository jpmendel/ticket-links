import { useState, useEffect, useContext, useCallback } from 'react';
import { BlockChainContext } from '../contexts/BlockChainContext';
import './SellTicketPage.css';

export const SellTicketPage = ({ ticket }) => {
  const { service } = useContext(BlockChainContext);
  const [buyers, setBuyers] = useState([]);
  const [isInitialLoaded, setInitialLoaded] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const loadBuyers = useCallback(async () => {
    if (!service || isLoading) {
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

  const approveBuyer = useCallback(
    async (ticketId, buyerAddr) => {
      try {
        await service.approveBuyer(ticketId, buyerAddr);
        await loadBuyers();
      } catch (error) {
        console.error('Failed to approve buyer:', error);
      }
    },
    [service, loadBuyers],
  );

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
            <div className="sell-title-container">
              <h1 className="text-title">{`Sell Ticket ${ticket.id}`}</h1>
            </div>
            <div>{`Close`}</div>
          </div>
          <div>
            {!isLoading ? (
              buyers.length > 0 ? (
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
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>No Buyers</div>
              )
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
