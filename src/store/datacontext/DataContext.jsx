import PropTypes from 'prop-types';
import React, { useState, createContext } from 'react';

export const DataContext = createContext({
  data: {},
  setData: () => { },
  loadingAccProvider: {},
  setLoadingAccProvider: () => { },
  bookingChart: {},
  setBookingChart: () => { },
  user: {},
  setUser: () => { },
  report: {}, setReport: () => { },
  provider: {}, setProvider: () => { }
});

export function DataContextProvider({ children }) {
  const [data, setData] = useState();

  const [user, setUser] = useState()
  const [loadingAccProvider, setLoadingAccProvider] = useState(null);
  const [bookingChart, setBookingChart] = useState();
  const [report, setReport] = useState()
  const [provider, setProvider] = useState()
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
        user, setUser,
        report, setReport,
        provider, setProvider
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

DataContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
