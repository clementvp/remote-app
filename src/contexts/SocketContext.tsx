import React, { useEffect, useState } from "react";
import {
  initSocket,
  subscribeToDisconnectServer,
  subscribeToServer,
  subscribeToConnexionError,
  disconnectSocket,
} from "../services/SocketService";

type ContextProps = {
  init: (address: string) => void;
  disconnect: () => void;
  connectedToServer: boolean;
  loading: boolean | undefined;
};

export const SocketIoContext = React.createContext<Partial<ContextProps>>({});

export const SocketIoProvider = ({ children }: any) => {
  const [initiatedConnection, setInitiatedConnection] = useState(false);
  const [connectedToServer, setConnectedToServer] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initiatedConnection) {
      setLoading(true);
    }
    subscribeToServer(() => {
      setConnectedToServer(true);
      setLoading(false);
    });
    subscribeToDisconnectServer(() => {
      setLoading(false);
      setConnectedToServer(false);
      setInitiatedConnection(false);
    });
    subscribeToConnexionError(() => {
      setLoading(false);
      setConnectedToServer(false);
      setInitiatedConnection(false);
    });
  }, [initiatedConnection]);

  const init = (address: string) => {
    initSocket(address);
    setInitiatedConnection(true);
  };

  const disconnect = () => {
    disconnectSocket();
  };

  return (
    <SocketIoContext.Provider
      value={{ init, connectedToServer, loading, disconnect }}
    >
      {children}
    </SocketIoContext.Provider>
  );
};
