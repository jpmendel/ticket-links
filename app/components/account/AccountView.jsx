import { useContext } from 'react';
import { AccountContext } from '../context/AccountContext';
import { TicketContext } from '../context/TicketContext';
import './AccountView.css';

export const AccountView = () => {
  const { balance } = useContext(AccountContext);
  const { myTickets } = useContext(TicketContext);

  return (
    <div>
      <div className="account-title-container">
        <h1 className="text-title">Account</h1>
      </div>
      <div className="account-body-container">
        {balance != null ? (
          <div>{`Balance: ${balance} ETH`}</div>
        ) : (
          <div>Wallet Not Connected</div>
        )}
        {myTickets.length > 0 && (
          <div>
            {myTickets.map((ticket, index) => (
              <div key={index}>{ticket.id}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
