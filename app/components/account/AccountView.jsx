import { useContext } from 'react';
import { AccountContext } from '../context/AccountContext';

export const AccountView = () => {
  const { balance } = useContext(AccountContext);

  return (
    <div>
      <div>{`Balance: ${balance} ETH`}</div>
    </div>
  );
};
