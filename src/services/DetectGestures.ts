import { emitControl } from "./SocketService";
export const horizontalSwipe = (endX: Number, startX: Number) => {
  if (endX > startX) {
    console.log("next");
    emitControl("audio/next");
  } else {
    console.log("prev");
    emitControl("audio/prev");
  }
};

export const verticalSwipe = (endY: Number, startY: Number) => {
  if (endY > startY) {
    console.log("vol down");
    emitControl("audio/vol/down");
  } else {
    console.log("vol up");
    emitControl("audio/vol/up");
  }
};

export const tap = () => {
  console.log("play/pause");
  emitControl("audio/pause");
};

export const detectDrag = (
  endX: Number,
  endY: Number,
  startX: Number,
  startY: Number
) => {
  if (endY === 0) {
    horizontalSwipe(endX, startX);
  }

  if (endX === 0) {
    verticalSwipe(endY, startY);
  }
};
