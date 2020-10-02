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
import React, { useContext, useState } from "react";
import { Redirect } from "react-router";
import { useGesture } from "react-use-gesture";

import { SocketIoContext } from "../../contexts/SocketContext";
import {
  detectDrag,
  detectVerticalSwipe,
  tap,
} from "../../services/DetectGestures";

import styles from "./Control.module.scss";

const Control = () => {
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [previousY, setPreviousY] = useState(0);
  const [triggerY, setTriggerY] = useState(0);

  const { disconnect, connectedToServer } = useContext(SocketIoContext);

  const quit = () => {
    if (disconnect) {
      disconnect();
    }
  };

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

  if (!connectedToServer) {
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
          <IonFabButton onClick={quit} color="danger">
            <IonIcon icon={logOutOutline} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Control;
