import { useState, useEffect } from 'react';
import { JsonRpcProvider } from 'ethers';
import { BlockChainContext } from './Context';
import { AccountView } from './account/AccountView';
import { TicketListView } from './tickets/TicketListView';
import { EmptyStateView } from './EmptyStateView';
import { BlockChainService } from '../services/BlockChainService';
import './App.css';

export const App = () => {
  const [service, setService] = useState(null);
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'wallet') {
        console.log('Received Wallet Message');
        const wallet = event.data.data;
        if (wallet) {
          const provider = new JsonRpcProvider(wallet.chainUrl || undefined);
          const service = new BlockChainService(provider, wallet);
          setService(service);
          setWallet(wallet);
        } else {
          setService(null);
          setWallet(null);
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  useEffect(() => {}, []);

  if (!wallet) {
    return <EmptyStateView />;
  }

  return (
    <BlockChainContext.Provider value={{ service, wallet }}>
      <div className="account-container">
        <AccountView />
      </div>
      <div>
        <TicketListView getTickets={() => service.getTicketsForSale()} />
      </div>
      <div>
        <TicketListView getTickets={() => service.getMyTickets()} />
      </div>
    </BlockChainContext.Provider>
  );
};
