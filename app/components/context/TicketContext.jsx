import {
  useState,
  useEffect,
  useCallback,
  useContext,
  createContext,
} from 'react';
import { BlockChainContext } from './BlockChainContext';

export const TicketContext = createContext({
  tickets: null,
  ticketsForSale: null,
  myTickets: null,
  isLoading: false,
  loadTickets: async () => {},
});

export const TicketProvider = ({ children }) => {
  const { service } = useContext(BlockChainContext);

  const [ticketsForSale, setTicketsForSale] = useState([]);
  const [myTickets, setMyTickets] = useState([]);
  const [isInitialLoaded, setInitialLoaded] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const loadTickets = useCallback(async () => {
    if (!service || isLoading) {
      return;
    }
    setLoading(true);
    try {
      const ticketsForSale = await service.getTicketsForSale();
      const myTickets = await service.getMyTickets();
      setTicketsForSale(ticketsForSale);
      setMyTickets(myTickets);
    } catch (error) {
      console.error('Failed to get tickets:', error);
      setTicketsForSale([]);
      setMyTickets([]);
    } finally {
      setInitialLoaded(true);
      setLoading(false);
    }
  }, [service, isLoading]);

  useEffect(() => {
    if (!isInitialLoaded) {
      loadTickets();
    }
  }, [isInitialLoaded, loadTickets]);

  return (
    <TicketContext.Provider
      value={{
        ticketsForSale,
        myTickets,
        isLoading,
        loadTickets,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};
