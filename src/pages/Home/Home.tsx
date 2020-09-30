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
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { add, linkOutline, trashOutline } from "ionicons/icons";
import React, { useContext, useEffect, useState } from "react";
import { Redirect, RouteComponentProps } from "react-router";
import { ServerContext } from "../../contexts/ServersContext";
import { SocketIoContext } from "../../contexts/SocketContext";

import { ServerItem } from "../../types/ServerItem";

import styles from "./Home.module.scss";

const Home: React.FC<RouteComponentProps> = ({ history }) => {
  const { serverList, deleteServer } = useContext(ServerContext);
  const { init, connectedToServer, loading } = useContext(SocketIoContext);
  const [loader, setloader] = useState(false);

  useEffect(() => {
    if (loading) {
      setloader(true);
    }

    if (!loading) {
      setloader(false);
    }
  }, [loading]);

  const connectToServer = (address: string) => {
    if (init) {
      init(address);
    }
  };

  if (connectedToServer) {
    return <Redirect to="/control"></Redirect>;
  }

  if (serverList && deleteServer) {
    return (
      <IonPage>
        <IonHeader>
          <IonLoading isOpen={loader}></IonLoading>
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
  } else {
    return <div></div>;
  }
};

export default Home;
