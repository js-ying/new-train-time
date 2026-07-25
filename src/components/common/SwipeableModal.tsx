import useRwd from "@/hooks/useRwd";
import {
  Modal as HeroModal,
  ModalContent as HeroModalContent,
} from "@heroui/react";
import { type Variants } from "framer-motion";
import {
  ComponentProps,
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
} from "react";

export { ModalBody, ModalFooter, ModalHeader } from "@heroui/react";

// 下滑關閉的淡出時間（秒）
const CLOSE_ANIM_S = 0.35;
// 需拉過本體高度的比例才關閉
const CLOSE_THRESHOLD_RATIO = 0.25;
// 關閉時本體續滑的螢幕高比例
const EXTRA_SLIDE_RATIO = 0.12;
// 往上拖曳的阻尼倍率
const UP_DAMPING = 6;
// 回彈曲線
const SPRING_BACK = "0.35s cubic-bezier(0.22, 1, 0.36, 1)";
// 與 HeroUI 開場動畫相同的 ease
const EASE: [number, number, number, number] = [0.36, 0.66, 0.4, 1];

// 複製 HeroUI 開場變體，僅把 exit 拉長成 CLOSE_ANIM_S
const SLOW_EXIT_MOTION: { variants: Variants } = {
  variants: {
    enter: {
      scale: "var(--scale-enter)",
      y: "var(--slide-enter)",
      opacity: 1,
      willChange: "auto",
      transition: {
        scale: { duration: 0.4, ease: EASE },
        opacity: { duration: 0.4, ease: EASE },
        y: { type: "spring", bounce: 0, duration: 0.6 },
      },
    },
    exit: {
      scale: "var(--scale-exit)",
      y: "var(--slide-exit)",
      opacity: 0,
      willChange: "transform",
      transition: { duration: CLOSE_ANIM_S, ease: EASE },
    },
  },
};

interface SwipeDismissValue {
  enabled: boolean;
  requestClose: () => void;
}
const SwipeDismissContext = createContext<SwipeDismissValue | null>(null);

type ModalProps = ComponentProps<typeof HeroModal>;

/**
 * HeroUI Modal 包裝：手機版可從頂端（灰條 + 標題列）往下滑動關閉，桌機維持原生行為。
 */
export const Modal = ({
  motionProps,
  onOpenChange,
  disableAnimation,
  children,
  ...rest
}: ModalProps) => {
  const { isMobile } = useRwd();
  const enabled = isMobile && !disableAnimation;

  return (
    <SwipeDismissContext.Provider
      value={{ enabled, requestClose: () => onOpenChange?.(false) }}
    >
      <HeroModal
        {...rest}
        onOpenChange={onOpenChange}
        disableAnimation={disableAnimation}
        motionProps={enabled ? { ...motionProps, ...SLOW_EXIT_MOTION } : motionProps}
      >
        {children}
      </HeroModal>
    </SwipeDismissContext.Provider>
  );
};

type ModalContentProps = ComponentProps<typeof HeroModalContent>;

/**
 * HeroUI ModalContent 包裝：手機版在最上緣插入可下滑的握把。
 */
export const ModalContent = ({ children, ...rest }: ModalContentProps) => {
  const swipe = useContext(SwipeDismissContext);

  const renderChildren = (onClose: () => void): ReactNode => (
    <>
      {swipe?.enabled && <SwipeHandle requestClose={swipe.requestClose} />}
      {typeof children === "function" ? children(onClose) : children}
    </>
  );

  return <HeroModalContent {...rest}>{renderChildren}</HeroModalContent>;
};

/**
 * 從 modal 本體 (base) 下滑關閉：內容捲到頂端往下拉才關，否則交還原生捲動；
 * 標題／灰條等不可捲處一律可關。回傳需掛在灰條上的 ref。
 */
function useSwipeToDismiss(requestClose: () => void) {
  const grabberRef = useRef<HTMLDivElement>(null);
  // 以 ref 保存最新 requestClose，讓監聽只掛一次
  const requestCloseRef = useRef(requestClose);
  requestCloseRef.current = requestClose;

  useEffect(() => {
    const base = grabberRef.current?.closest<HTMLElement>('[role="dialog"]');
    if (!base) return;

    let mode: "idle" | "deciding" | "dismiss" | "scroll" = "idle";
    let startX = 0;
    let startY = 0;
    let scroller: HTMLElement | null = null;

    // 找觸控點所在、base 內最近的可捲動容器
    const findScroller = (target: EventTarget | null) => {
      let el = target as HTMLElement | null;
      while (el && el !== base) {
        const oy = getComputedStyle(el).overflowY;
        if (
          (oy === "auto" || oy === "scroll") &&
          el.scrollHeight > el.clientHeight
        ) {
          return el;
        }
        el = el.parentElement;
      }
      return null;
    };

    const onStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      mode = "deciding";
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      scroller = findScroller(e.target);
      base.style.transition = "none";
    };

    const onMove = (e: TouchEvent) => {
      if (mode === "idle" || mode === "scroll") return;
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;

      // 第一個 move 即判定（iOS 捲動一旦啟動就無法攔截）
      if (mode === "deciding") {
        const atTop = !scroller || scroller.scrollTop <= 0;
        if (Math.abs(dy) >= Math.abs(dx) && dy > 0 && atTop) {
          mode = "dismiss";
        } else {
          mode = "scroll";
          return;
        }
      }

      e.preventDefault(); // 攔下原生捲動，改為跟手
      const move = dy < 0 ? dy / UP_DAMPING : dy;
      base.style.transform = `translateY(${move}px)`;
    };

    const onEnd = (e: TouchEvent) => {
      if (mode === "dismiss") {
        const dy = (e.changedTouches[0]?.clientY ?? startY) - startY;
        if (dy > base.offsetHeight * CLOSE_THRESHOLD_RATIO) {
          // 續滑一小段後關閉，淡出由 framer 的慢速 exit 收尾
          base.style.transition = `transform ${CLOSE_ANIM_S}s ease-out`;
          base.style.transform = `translateY(${dy + window.innerHeight * EXTRA_SLIDE_RATIO}px)`;
          requestCloseRef.current();
        } else {
          base.style.transition = `transform ${SPRING_BACK}`;
          base.style.transform = "translateY(0px)";
        }
      }
      mode = "idle";
      scroller = null;
    };

    base.addEventListener("touchstart", onStart, { passive: true });
    base.addEventListener("touchmove", onMove, { passive: false });
    base.addEventListener("touchend", onEnd);
    base.addEventListener("touchcancel", onEnd);
    return () => {
      base.removeEventListener("touchstart", onStart);
      base.removeEventListener("touchmove", onMove);
      base.removeEventListener("touchend", onEnd);
      base.removeEventListener("touchcancel", onEnd);
    };
  }, []);

  return grabberRef;
}

/** 頂端 iOS 式握把：下滑關閉的視覺提示（手勢本身可從內容任意處發起） */
const SwipeHandle = ({ requestClose }: { requestClose: () => void }) => {
  const grabberRef = useSwipeToDismiss(requestClose);

  return (
    <div
      ref={grabberRef}
      aria-hidden
      // capture-ignore 供截圖排除
      className="capture-ignore flex touch-none select-none justify-center pb-1 pt-2"
    >
      <span className="h-1 w-9 rounded-full bg-muted-foreground/40" />
    </div>
  );
};
