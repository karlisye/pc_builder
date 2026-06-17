import { createContext, useContext } from "react";

export const BuilderContext = createContext();
export const useBuilder = () => useContext(BuilderContext);
