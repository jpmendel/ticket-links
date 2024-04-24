import { BlockChainProvider } from './context/BlockChainContext';
import { AccountProvider } from './context/AccountContext';
import { TicketProvider } from './context/TicketContext';
import { MainPage } from './MainPage';
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
