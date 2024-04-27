import { useCallback, useState } from 'react';
import { BlockChainProvider } from './contexts/BlockChainContext';
import { AccountProvider } from './contexts/AccountContext';
import { TicketProvider } from './contexts/TicketContext';
import { NavigationContext } from './contexts/NavigationContext';
import { MainPage } from './pages/MainPage';
import { SellTicketPage } from './pages/SellTicketPage';
import { Page } from '../data/page';
import './App.css';

export const App = () => {
  const [page, setPage] = useState(Page.MAIN);
  const [pageProps, setPageProps] = useState({});

  const navigate = useCallback((page, props = {}) => {
    setPageProps(props);
    setPage(page);
  }, []);

  let component;
  if (page === Page.SELL) {
    component = <SellTicketPage {...pageProps} />;
  } else {
    component = <MainPage {...pageProps} />;
  }

  return (
    <BlockChainProvider>
      <AccountProvider>
        <TicketProvider>
          <NavigationContext.Provider value={{ navigate }}>
            {component}
          </NavigationContext.Provider>
        </TicketProvider>
      </AccountProvider>
    </BlockChainProvider>
  );
};
