import { useState, useEffect } from 'react';
import { JsonRpcProvider } from 'ethers';
import { BlockchainContext } from './Context';

import './App.css';

const App = () => {
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'wallet') {
        console.log('Received Wallet Message');
        const wallet = event.data.data;
        if (wallet) {
          const provider = new JsonRpcProvider(wallet.chainUrl || undefined);
          setProvider(provider);
        } else {
          setProvider(null);
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <BlockchainContext.Provider value={{ provider }}>
      <div>{provider != null ? 'Connected' : 'Not Connected'}</div>
    </BlockchainContext.Provider>
  );
};

export default App;
