import {
  useState,
  useEffect,
  useCallback,
  useContext,
  createContext,
} from 'react';
import { BlockChainContext } from './BlockChainContext';

export const AccountContext = createContext({
  balance: null,
  loadBalance: async () => {},
});

export const AccountProvider = ({ children }) => {
  const { service } = useContext(BlockChainContext);

  const [balance, setBalance] = useState(null);
  const [isInitialLoaded, setInitialLoaded] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const loadBalance = useCallback(async () => {
    if (!service || isLoading) {
      return;
    }
    setLoading(true);
    try {
      const balance = await service.getBalance();
      setBalance(balance);
    } catch (error) {
      console.error('Failed to get balance:', error);
    } finally {
      setInitialLoaded(true);
      setLoading(false);
    }
  }, [service, isLoading]);

  useEffect(() => {
    setInitialLoaded(false);
  }, [service]);

  useEffect(() => {
    if (!isInitialLoaded) {
      loadBalance();
    }
  }, [isInitialLoaded, loadBalance]);

  return (
    <AccountContext.Provider value={{ balance, loadBalance, isLoading }}>
      {children}
    </AccountContext.Provider>
  );
};
