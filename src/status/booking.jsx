import { GoDotFill } from 'react-icons/go';

// eslint-disable-next-line react/prop-types
function StatusBooking({ children }) {
  const statusColors = {
    PENDING: 'bg-yellow-300 text-yellow-900',
    ACCEPTED: 'bg-navy-blue-opacity-5 text-navy-blue',
    REJECT: 'bg-red-300 text-red-900',
    REFUNDED: 'bg-blue-300 text-blue-900',
    USER_REQUEST_REFUND: 'bg-purple-300 text-purple-900',
    PROVIDER_REFUNDED: 'bg-indigo-300 text-indigo-900',
  };

  const statusColorClass = typeof children === 'string' ? statusColors[children] : 'bg-gray-300';

  return (
    <div className={`flex items-center gap-1 p-1 rounded-lg text-sm ${statusColorClass}`}>
      <GoDotFill />
      {children}
    </div>
  );
}

export default StatusBooking;
