import { BlockChainProvider } from './contexts/BlockChainContext';
import { AccountProvider } from './contexts/AccountContext';
import { TicketProvider } from './contexts/TicketContext';
import { MainPage } from './pages/MainPage';
import './App.css';

export const App = () => {
  return (
    <BlockChainProvider>
      <AccountProvider>
        <TicketProvider>
          <MainPage />
        </TicketProvider>
      </AccountProvider>
    </BlockChainProvider>
  );
};
