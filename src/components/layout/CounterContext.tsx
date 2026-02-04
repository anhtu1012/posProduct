import { createContext } from "react";

export const CounterContext = createContext<{
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
} | null>(null);
