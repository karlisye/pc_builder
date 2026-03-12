import React from "react";
import { useBuilder } from "../../Contexts/BuilderContext";

const ComponentFilters = () => {
  const { search, currentCompToAdd, setSearch } = useBuilder();

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  return (
    <input
      type="text"
      value={search}
      onChange={handleSearch}
      placeholder={`Search ${currentCompToAdd}...`}
      className="border border-border bg-surface text-text p-2 w-full"
    />
  );
};

export default ComponentFilters;
