import { createContext, useContext, useEffect, useState } from "react";

const PwaContext = createContext(null);

export function PwaProvider({ children }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  return (
    <PwaContext.Provider value={deferredPrompt}>{children}</PwaContext.Provider>
  );
}

export function usePwaPrompt() {
  return useContext(PwaContext);
}
