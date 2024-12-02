import React, { createContext, useContext, useState, useEffect } from 'react';

const NonceContext = createContext(null);

export function NonceProvider({ children }) {
  const [nonce, setNonce] = useState(null);

  useEffect(() => {
    // Extract nonce from global window object set in the server-side HTML
    const serverNonce = window.NONCE;
    if (serverNonce) {
      setNonce(serverNonce);
    }
  }, []);

  return (
    <NonceContext.Provider value={nonce}>
      {children}
    </NonceContext.Provider>
  );
}

export function useNonce() {
  return useContext(NonceContext);
}