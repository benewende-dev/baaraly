import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type AppMode = "simple" | "pro";

const MODE_KEY = "baarali.mode";

interface ModeContextValue {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  isSimple: boolean;
  isPro: boolean;
}

const ModeContext = createContext<ModeContextValue | undefined>(undefined);

function readStoredMode(): AppMode {
  try {
    const stored = localStorage.getItem(MODE_KEY);
    if (stored === "simple" || stored === "pro") return stored;
  } catch {
    // ignore
  }
  return "simple";
}

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<AppMode>(readStoredMode);

  const setMode = useCallback((m: AppMode) => {
    setModeState(m);
    try {
      localStorage.setItem(MODE_KEY, m);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo<ModeContextValue>(
    () => ({
      mode,
      setMode,
      isSimple: mode === "simple",
      isPro: mode === "pro",
    }),
    [mode, setMode],
  );

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
}

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error("useMode must be used within ModeProvider");
  return ctx;
}
