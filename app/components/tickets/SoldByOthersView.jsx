import { useContext } from 'react';
import { BlockChainContext } from '../context/BlockChainContext';
import { TicketContext } from '../context/TicketContext';
import './SoldByOthersView.css';

export const SoldByOthersView = () => {
  const { service } = useContext(BlockChainContext);
  const { ticketsForSale } = useContext(TicketContext);
  const soldByOthers = ticketsForSale.filter(
    (ticket) =>
      !service.isTicketSoldByManager(ticket) &&
      !service.isTicketOwnedByMe(ticket),
  );
  return <div>{soldByOthers}</div>;
};
