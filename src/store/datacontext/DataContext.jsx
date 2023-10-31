import PropTypes from "prop-types";
import React, { useState, createContext } from "react";

export const DataContext = createContext({
    data: {},
    setData: () => { },
    loadingAccProvider: {}, setLoadingAccProvider: () => { }
});

export function DataContextProvider({ children }) {

    const [data, setData] = useState();

    const [loadingAccProvider, setLoadingAccProvider] = useState(null)

    return (
        <DataContext.Provider
            // eslint-disable-next-line react/jsx-no-constructed-context-values
            value={{
                data,
                setData,
                loadingAccProvider, setLoadingAccProvider
            }}
        >
            {children}
        </DataContext.Provider>
    );
}

DataContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
