import { createContext } from "react";

export interface ServerStyleContextData {
  key: string;
  ids: Array<string>;
  css: string;
}

export const ServerStyleContext = createContext<
  ServerStyleContextData[] | null
>(null);

export interface ClientStyleContenxtData {
  reset: () => void;
}

export const ClientStyleContext = createContext<ClientStyleContenxtData | null>(
  null,
);
