import { createContext, useContext } from 'react';

// Provided by the builder layout route (src/routes/builder.jsx).
// Picker/detail visibility lives in the URL (/builder/components/:type/:code?);
// the layout route exposes pickerType plus href/navigation helpers here.
export const BuilderContext = createContext();
export const useBuilder = () => useContext(BuilderContext);

export const BuildMetaContext = createContext();
export const useBuildMeta = () => useContext(BuildMetaContext);
