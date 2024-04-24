import { useState, useEffect, createContext } from 'react';
import { JsonRpcProvider } from 'ethers';
import { BlockChainService } from '../../services/BlockChainService';

export const BlockChainContext = createContext({
  service: null,
  isReady: false,
  isConnected: false,
});

export const BlockChainProvider = ({ children }) => {
  const [service, setService] = useState(null);
  const [isReady, setReady] = useState(false);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'wallet') {
        console.log('Received Wallet Message');
        const wallet = event.data.data;
        if (wallet) {
          const provider = new JsonRpcProvider(wallet.chainUrl || undefined);
          const service = new BlockChainService(provider, wallet);
          setService(service);
        } else {
          setService(null);
        }
        setReady(true);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <BlockChainContext.Provider
      value={{ service, isReady, isConnected: service != null }}
    >
      {children}
    </BlockChainContext.Provider>
  );
};
