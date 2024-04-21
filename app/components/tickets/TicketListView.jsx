import { useState, useEffect, useCallback } from 'react';
import { TicketView } from './TicketView';
import './TicketListView.css';

export const TicketListView = ({ getTickets }) => {
  const [isLoading, setLoading] = useState(false);

  const [tickets, setTickets] = useState(null);

  const loadTickets = useCallback(async () => {
    if (!getTickets || isLoading) {
      return;
    }
    setLoading(true);
    try {
      const myTickets = await getTickets();
      setTickets(myTickets);
    } catch (error) {
      console.error('Failed to get tickets:', error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, [getTickets, isLoading]);

  useEffect(() => {
    if (!tickets) {
      loadTickets();
    }
  }, [tickets, loadTickets]);

  if (!tickets) {
    return <div>Loading...</div>;
  }

  return (
    <div className="ticket-list">
      {tickets.map((ticket) => (
        <TicketView key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
};
