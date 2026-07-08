import { createContext, useContext, useMemo, useState } from 'react';

export const BuilderContext = createContext();
export const useBuilder = () => useContext(BuilderContext);

export const BuildMetaContext = createContext();
export const useBuildMeta = () => useContext(BuildMetaContext);

export const PickerContext = createContext();
export const usePicker = () => useContext(PickerContext);

// Picker state lives in its own provider so searching/filtering while browsing
// components doesn't re-render the rest of the builder tree.
export const PickerProvider = ({ children }) => {
  const { currentCompToAdd } = useBuilder();
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [prevComp, setPrevComp] = useState(currentCompToAdd);
  if (prevComp !== currentCompToAdd) {
    setPrevComp(currentCompToAdd);
    setFilters({});
    setSort('');
    setDebouncedSearch('');
  }

  const value = useMemo(
    () => ({ filters, setFilters, sort, setSort, debouncedSearch, setDebouncedSearch }),
    [filters, sort, debouncedSearch],
  );

  return <PickerContext value={value}>{children}</PickerContext>;
};
