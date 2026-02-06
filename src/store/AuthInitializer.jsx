import { useEffect } from "react";
import { useAuthStore } from "./authStore";

export function AuthInitializer() {
  const initialize = useAuthStore((state) => state.initialize);
  const checkSession = useAuthStore((state) => state.checkSession);

  useEffect(() => {
    let isMounted = true;

    const runInit = async () => {
      if (!isMounted) return;
      await initialize();
    };

    runInit();
    checkSession();
    const intervalId = window.setInterval(checkSession, 60 * 1000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [initialize, checkSession]);

  return null;
}
