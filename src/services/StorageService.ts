import { ServerItem } from "../types/ServerItem";
import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

let serverList: Array<ServerItem> = [];

const checkStorage = async () => {
  const { keys } = await Storage.keys();
  const find = keys.find((element) => {
    return element === "remoteApp";
  });
  await setStorage(find);
};

const setStorage = async (result: string | undefined) => {
  if (!result) {
    await Storage.set({
      key: "remoteApp",
      value: JSON.stringify({
        list: [],
      }),
    });
  }
};

const retrieveStorage = async () => {
  const ret = await Storage.get({ key: "remoteApp" });
  if (ret.value) {
    const value = JSON.parse(ret.value);
    serverList = value.list;
    return serverList;
  }
};

const addServer = async (id: string, name: string, address: string) => {
  serverList.push({ id, name, address });
  await Storage.set({
    key: "remoteApp",
    value: JSON.stringify({
      list: serverList,
    }),
  });
};

const removeServer = async (id: string) => {
  const servers = serverList.filter((element: ServerItem) => {
    return element.id !== id;
  });
  serverList = servers;
  await Storage.set({
    key: "remoteApp",
    value: JSON.stringify({
      list: servers,
    }),
  });
};

export default checkStorage;
export { retrieveStorage, addServer, removeServer };
