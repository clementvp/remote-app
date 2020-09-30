import React, { useEffect, useState } from "react";
import checkStorage, {
  addServer,
  removeServer,
  retrieveStorage,
} from "../services/StorageService";
import { ServerItem } from "../types/ServerItem";

type ContextProps = {
  serverList: Array<ServerItem>;
  createServer: (id: string, name: string, address: string) => Promise<void>;
  deleteServer: (id: string) => Promise<void>;
};

export const ServerContext = React.createContext<Partial<ContextProps>>({});

export const ServerProvider = ({ children }: any) => {
  const [serverList, setServerList] = useState<Array<ServerItem>>([]);

  const retrieveServersList = async () => {
    const list = await retrieveStorage();
    if (list) {
      setServerList(list);
    }
  };

  const createServer = async (id: string, name: string, address: string) => {
    await addServer(id, name, address);
    await retrieveServersList();
  };

  const deleteServer = async (id: string) => {
    await removeServer(id);
    await retrieveServersList();
  };

  useEffect(() => {
    const fn = async () => {
      await checkStorage();
      await retrieveServersList();
    };
    fn();
  }, []);

  return (
    <ServerContext.Provider value={{ serverList, createServer, deleteServer }}>
      {children}
    </ServerContext.Provider>
  );
};
