import React, { useState } from "react";

type ContextProps = {
  connected: boolean;
  setConnected: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SocketIoContext = React.createContext<ContextProps>({
  connected: false,
  setConnected: () => {},
});

export const SocketIoProvider = ({ children }: any) => {
  const [connected, setConnected] = useState(false);

  return (
    <SocketIoContext.Provider value={{ connected, setConnected }}>
      {children}
    </SocketIoContext.Provider>
  );
};
