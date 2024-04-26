import { useContext } from 'react';
import { BlockChainContext } from '../contexts/BlockChainContext';
import { AccountView } from '../views/AccountView';
import { SoldByManagerView } from '../views/SoldByManagerView';
import { SoldByOthersView } from '../views/SoldByOthersView';
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
