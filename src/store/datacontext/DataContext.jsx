import PropTypes from 'prop-types';
import React, { useState, createContext } from 'react';

export const DataContext = createContext({
  data: {},
  setData: () => {},
  loadingAccProvider: {},
  setLoadingAccProvider: () => {},
  bookingChart: {},
  setBookingChart: () => {},
});

export function DataContextProvider({ children }) {
  const [data, setData] = useState();

  const [loadingAccProvider, setLoadingAccProvider] = useState(null);
  const [bookingChart, setBookingChart] = useState();
  return (
    <DataContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        data,
        setData,
        loadingAccProvider,
        setLoadingAccProvider,
        bookingChart,
        setBookingChart,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

DataContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
