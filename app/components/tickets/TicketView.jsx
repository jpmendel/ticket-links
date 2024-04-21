import './TicketView.css';

export const TicketView = ({ ticket }) => {
  return (
    <div className="ticket-outer">
      <div className="ticket-inner">
        <div>{`Ticket ${ticket.id}`}</div>
        <div>{`Owned By: ${ticket.owner}`}</div>
      </div>
    </div>
  );
};
