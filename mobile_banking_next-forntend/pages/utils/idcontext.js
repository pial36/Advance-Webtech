// Idcontext.js

import React, {createContext, useContext, useState} from 'react';

const Idcontext = createContext();

export const IdProvider = ({ children }) => {
    const [id, setId] = useState(null);

    return (
        <Idcontext.Provider value={{ id, setId }}>
            {children}
        </Idcontext.Provider>
    );
};

export const useId = () => useContext(Idcontext);
