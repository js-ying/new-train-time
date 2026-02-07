import { sendGAEvent } from "@next/third-parties/google";
import { GaEnum } from "../enums/GaEnum";

/**
 * 送出 Google Analytics 點擊事件
 * 在開發模式下僅會 console.log 而不會實際送出事件
 * @param target 點擊目標
 */
const gaClickEvent = (target: GaEnum) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`[GA Event] 開發模式：跳過送出 jsy_click 事件`, { target });
    return;
  }
  sendGAEvent("event", "jsy_click", { target: target });
};

export { gaClickEvent };
