import PropTypes from 'prop-types';
import React, { useState, createContext } from 'react';

export const DataContext = createContext({
  data: {},
  setData: () => {},
  loadingAccProvider: {},
  setLoadingAccProvider: () => {},
  bookingChart: {},
  setBookingChart: () => {},
  user: {},
  setUser: () => {},
  report: {},
  setReport: () => {},
  provider: {},
  setProvider: () => {},
  saveDateChartChoose: {},
  setSaveDateChartChoose: () => {},
  fieldSaveDateChartChoose: {},
  setFieldSaveDateChartChoose: () => {},
  allTour: {},
  setAllTour: () => {},
});

export function DataContextProvider({ children }) {
  const [data, setData] = useState();
  const [allTour, setAllTour] = useState();
  const [user, setUser] = useState();
  const [loadingAccProvider, setLoadingAccProvider] = useState(null);
  const [bookingChart, setBookingChart] = useState();
  const [report, setReport] = useState();
  const [provider, setProvider] = useState();

  const [saveDateChartChoose, setSaveDateChartChoose] = useState();
  const [fieldSaveDateChartChoose, setFieldSaveDateChartChoose] = useState('normal');
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
        user,
        setUser,
        report,
        setReport,
        provider,
        setProvider,
        saveDateChartChoose,
        setSaveDateChartChoose,
        fieldSaveDateChartChoose,
        setFieldSaveDateChartChoose,
        allTour,
        setAllTour,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

DataContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
