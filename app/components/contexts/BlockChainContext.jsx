import { useState, useEffect, useRef, createContext } from 'react';
import { JsonRpcProvider } from 'ethers';
import { BlockChainService } from '../../services/BlockChainService';

export const BlockChainContext = createContext({
  service: null,
  isReady: false,
});

export const BlockChainProvider = ({ children }) => {
  const providerRef = useRef(
    new JsonRpcProvider(import.meta.env.VITE_BLOCKCHAIN_URL),
  );
  const [service, setService] = useState(null);
  const [isReady, setReady] = useState(false);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'wallet') {
        console.log('Received Wallet Message');
        const wallet = event.data.data;
        if (wallet) {
          const chainUrl = new URL(import.meta.env.VITE_BLOCKCHAIN_URL);
          const walletUrl = new URL(wallet.chainUrl);
          if (walletUrl.host === chainUrl.host) {
            const service = new BlockChainService(providerRef.current, wallet);
            setService(service);
            return;
          } else {
            console.warn('Account connected for incorrect host');
          }
        }
        const service = new BlockChainService(providerRef.current, null);
        setService(service);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  useEffect(() => {
    if (!service) {
      const service = new BlockChainService(providerRef.current, null);
      setService(service);
      setReady(true);
    }
  }, [service]);

  return (
    <BlockChainContext.Provider value={{ service, isReady }}>
      {children}
    </BlockChainContext.Provider>
  );
};
