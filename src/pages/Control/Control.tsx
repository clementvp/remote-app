import React, { useContext, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
} from "@ionic/react";
import { logOutOutline } from "ionicons/icons";
import { useEffectOnce } from "react-use";
import { Redirect } from "react-router";
import { useGesture } from "react-use-gesture";
import { SocketIoContext } from "../../contexts/SocketContext";
import {
  detectDrag,
  detectVerticalSwipe,
  tap,
} from "../../services/DetectGestures";
import {
  disconnectSocket,
  subscribeToDisconnectServer,
} from "../../services/SocketService";

import { resetStorageLastConnexion } from "../../services/StorageService";

import styles from "./Control.module.scss";

const Control: React.FC = () => {
  const { connected, setConnected } = useContext(SocketIoContext);

  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [previousY, setPreviousY] = useState(0);
  const [triggerY, setTriggerY] = useState(0);

  useEffectOnce(() => {
    subscribeToDisconnectServer(() => {
      setConnected(false);
    });
  });

  const bind = useGesture(
    {
      onDragStart: (state) => {
        setStartX(state.movement[0]);
        setStartY(state.movement[1]);
        setPreviousY(state.movement[1]);
        setTriggerY(state.movement[1]);
      },
      onDrag: (state) => {
        detectVerticalSwipe(
          state.movement[1],
          triggerY,
          previousY,
          setTriggerY,
          setPreviousY
        );
      },
      onDragEnd: (state) => {
        detectDrag(state.movement[0], state.movement[1], startX, startY);
      },
      onDoubleClick: () => {
        tap();
      },
    },
    {
      drag: {
        lockDirection: true,
        filterTaps: true,
      },
    }
  );

  const quit = async () => {
    await resetStorageLastConnexion();
    disconnectSocket();
  };

  if (!connected) {
    return <Redirect to="/home"></Redirect>;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className={styles.toolbar}>
          <IonTitle>Control</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className={styles.controlArea} {...bind()}></div>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton color="danger" onClick={quit}>
            <IonIcon icon={logOutOutline} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Control;
