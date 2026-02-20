import { createContext, useContext } from 'react';

export const BuildContext = createContext(null);
export const useBuild = () => useContext(BuildContext);
