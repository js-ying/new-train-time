import { sendGAEvent } from "@next/third-parties/google";
import { onCLS, onINP } from "web-vitals/attribution";

/** GA4 事件參數字串長度上限 */
const GA_PARAM_MAX_LENGTH = 100;

let initialized = false;

/** 截斷成 GA4 參數可接受的長度 */
const clip = (text?: string): string =>
  (text ?? "").slice(0, GA_PARAM_MAX_LENGTH);

/** 歸因元素轉成可讀標記（標籤 + aria-label 或前段文字）；無文字時回 undefined 改用預設 selector */
const describeTarget = (node: Node | null): string | undefined => {
  if (!(node instanceof Element)) return undefined;
  const label =
    node.getAttribute("aria-label") ||
    (node.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 24);
  if (!label) return undefined;
  const slot = node.getAttribute("data-slot");
  return `${node.tagName.toLowerCase()}${slot ? `[${slot}]` : ""} "${label}"`;
};

/** 送出 web vitals 事件；開發模式只印 log 不送出 */
const sendVitalEvent = (name: string, params: Record<string, unknown>) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`[GA Event] 開發模式：跳過送出 ${name} 事件`, params);
    return;
  }
  sendGAEvent("event", name, params);
};

/**
 * CLS / INP 帶元素歸因上報 GA4（事件名與 value 格式同 reportWebVitals）。
 * debug_* 參數須在 GA4 註冊為事件範圍自訂維度才能在探索報表使用。
 */
export const initWebVitalsAttribution = () => {
  if (initialized) return;
  initialized = true;

  onCLS(
    ({ name, value, id, navigationType, attribution }) => {
      sendVitalEvent(name, {
        value: Math.round(value * 1000),
        metric_id: id,
        metric_value: value,
        metric_label: "web-vital",
        debug_target: clip(attribution.largestShiftTarget),
        debug_time: Math.round(attribution.largestShiftTime ?? 0),
        debug_load_state: attribution.loadState ?? "",
        debug_nav_type: navigationType,
      });
    },
    { generateTarget: describeTarget },
  );

  onINP(
    ({ name, value, id, navigationType, attribution }) => {
      sendVitalEvent(name, {
        value: Math.round(value),
        metric_id: id,
        metric_value: value,
        metric_label: "web-vital",
        debug_target: clip(attribution.interactionTarget),
        debug_event: attribution.interactionType,
        // 輸入延遲 / 處理 / 呈現延遲（ms）
        debug_timing: [
          attribution.inputDelay,
          attribution.processingDuration,
          attribution.presentationDelay,
        ]
          .map((ms) => Math.round(ms))
          .join("/"),
        debug_load_state: attribution.loadState,
        debug_nav_type: navigationType,
      });
    },
    { generateTarget: describeTarget },
  );
};
