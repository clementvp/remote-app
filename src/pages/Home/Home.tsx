import {
  IonButton,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { add, linkOutline, trashOutline } from "ionicons/icons";
import React, { useCallback, useContext } from "react";
import { Redirect, RouteComponentProps } from "react-router";
import { ServerContext } from "../../contexts/ServersContext";
import { SocketIoContext } from "../../contexts/SocketContext";
import {
  initSocket,
  subscribeToConnexionError,
  subscribeToServer,
} from "../../services/SocketService";
import { addStorageLastConnexion } from "../../services/StorageService";

import { ServerItem } from "../../types/ServerItem";

import styles from "./Home.module.scss";

const Home: React.FC<RouteComponentProps> = ({ history }) => {
  const { serverList, deleteServer } = useContext(ServerContext);
  const { connected, setConnected } = useContext(SocketIoContext);

  const connectToServer = useCallback(
    (address: string) => {
      initSocket(address);
      subscribeToServer(async () => {
        await addStorageLastConnexion(address);
        setConnected(true);
      });
      subscribeToConnexionError(() => {
        console.log("connexion error");
      });
    },
    [setConnected]
  );

  if (connected) {
    return <Redirect to="/control"></Redirect>;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className={styles.toolbar}>
          <IonTitle>Servers List</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {serverList.map((item: ServerItem) => {
          return (
            <IonItemSliding key={item.id}>
              <IonItem className={styles.items} lines="none">
                <IonLabel>{item.name}</IonLabel>
                <IonButton
                  onClick={() => {
                    connectToServer(item.address);
                  }}
                >
                  <IonIcon icon={linkOutline} /> &nbsp; Connect
                </IonButton>
              </IonItem>
              <IonItemOptions side="end">
                <IonItemOption
                  color="danger"
                  onClick={() => {
                    deleteServer(item.id);
                  }}
                >
                  <IonIcon icon={trashOutline} />
                  &nbsp; Delete
                </IonItemOption>
              </IonItemOptions>
            </IonItemSliding>
          );
        })}

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton
            onClick={() => {
              history.push("/create");
            }}
          >
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Home;
