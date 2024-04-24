import { useContext } from 'react';
import { BlockChainContext } from './context/BlockChainContext';
import { EmptyStateView } from './EmptyStateView';
import { AccountView } from './account/AccountView';
import { SoldByManagerView } from './tickets/SoldByManagerView';
import { SoldByOthersView } from './tickets/SoldByOthersView';

export const MainPage = () => {
  const { isReady, isConnected } = useContext(BlockChainContext);

  if (!isReady) {
    return <div>Loading...</div>;
  }

  if (!isConnected) {
    return <EmptyStateView />;
  }

  return (
    <div>
      <AccountView />
      <SoldByManagerView />
      <SoldByOthersView />
    </div>
  );
};
