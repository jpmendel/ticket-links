import { BlockChainProvider } from './contexts/BlockChainContext';
import { AccountProvider } from './contexts/AccountContext';
import { TicketProvider } from './contexts/TicketContext';
import { NavigationProvider } from './contexts/NavigationContext';
import { MainPage } from './pages/MainPage';
import { SellTicketPage } from './pages/SellTicketPage';
import { Page } from '../data/page';
import './App.css';

const pages = {
  [Page.MAIN]: MainPage,
  [Page.SELL]: SellTicketPage,
};

export const App = () => {
  return (
    <BlockChainProvider>
      <AccountProvider>
        <TicketProvider>
          <NavigationProvider pages={pages} initialPage={Page.MAIN} />
        </TicketProvider>
      </AccountProvider>
    </BlockChainProvider>
  );
};
