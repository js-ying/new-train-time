import useRouteChangePending from "@/hooks/useRouteChangePending";
import { CSSProperties, FC, useEffect, useState } from "react";

/** 導頁超過此毫秒數才顯示，避免一般 0.1～0.2 秒的導頁閃現 */
const SHOW_DELAY_MS = 200;
/** 完成時補滿 + 淡出的總長 */
const FINISH_MS = 450;

type Phase = "idle" | "active" | "done";

/** 各階段樣式：idle 瞬間歸零、active 緩慢逼近 90%、done 補滿後淡出 */
const PHASE_STYLE: Record<Phase, CSSProperties> = {
  idle: { transform: "scaleX(0)", opacity: 0, transition: "none" },
  active: {
    transform: "scaleX(0.9)",
    opacity: 1,
    transition: "transform 8s cubic-bezier(0.1, 0.7, 0.2, 1)",
  },
  done: {
    transform: "scaleX(1)",
    opacity: 0,
    transition: "transform 200ms ease-out, opacity 250ms ease-in 200ms",
  },
};

/** 全站頂部導頁進度條：非 shallow 導頁等待中顯示 */
const NavProgressBar: FC = () => {
  const pending = useRouteChangePending();
  const [phase, setPhase] = useState<Phase>("idle");

  // pending 持續超過門檻才進 active；結束時已顯示則補滿，未顯示則維持 idle
  useEffect(() => {
    if (pending) {
      const timer = setTimeout(() => setPhase("active"), SHOW_DELAY_MS);
      return () => clearTimeout(timer);
    }
    setPhase((prev) => (prev === "active" ? "done" : "idle"));
  }, [pending]);

  // 補滿淡出後歸零
  useEffect(() => {
    if (phase !== "done") return;
    const timer = setTimeout(() => setPhase("idle"), FINISH_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-progress h-0.5 origin-left bg-primary"
      style={{ top: "env(safe-area-inset-top, 0px)", ...PHASE_STYLE[phase] }}
    />
  );
};

export default NavProgressBar;
