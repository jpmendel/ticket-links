import { useContext } from 'react';
import { BlockChainContext } from './context/BlockChainContext';
import { AccountView } from './account/AccountView';
import { SoldByManagerView } from './tickets/SoldByManagerView';
import { SoldByOthersView } from './tickets/SoldByOthersView';
import './MainPage.css';

export const MainPage = () => {
  const { isReady } = useContext(BlockChainContext);

  if (!isReady) {
    return <div>Loading...</div>;
  }

  return (
    <main className="main-container">
      <div className="main-layout">
        <div className="main-size-container">
          <div className="main-account-container">
            <AccountView />
          </div>
          <div className="main-sbm-container">
            <SoldByManagerView />
          </div>
          <div className="main-sbo-container">
            <SoldByOthersView />
          </div>
        </div>
      </div>
    </main>
  );
};
