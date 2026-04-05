import { useMode } from "../context/ModeContext";
import { Layout } from "./Layout";
import { SimpleLayout } from "./SimpleLayout";

/** Sélectionne le layout en fonction du mode courant. */
export function ModeRouter() {
  const { isSimple } = useMode();
  return isSimple ? <SimpleLayout /> : <Layout />;
}
