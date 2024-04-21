import { useCallback, useContext, useEffect, useState } from 'react';
import { BlockChainContext } from '../Context';

export const AccountView = () => {
  const { service } = useContext(BlockChainContext);
  const [isLoading, setLoading] = useState(false);

  const [balance, setBalance] = useState('');

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
      setLoading(false);
    }
  }, [service, isLoading]);

  useEffect(() => {
    if (!balance) {
      loadBalance();
    }
  }, [balance, loadBalance]);

  return (
    <div>
      <div>{`Balance: ${balance} ETH`}</div>
    </div>
  );
};
