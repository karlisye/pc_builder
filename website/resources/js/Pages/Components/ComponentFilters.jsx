import React from "react";
import { useBuilder } from "../../Contexts/BuilderContext";

const ComponentFilters = () => {
  const { search, currentCompToAdd, setSearch, sort, setSort } = useBuilder();

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={search}
        onChange={handleSearch}
        placeholder={`Search ${currentCompToAdd}...`}
        className="bg-secondary text-white flex-1 p-2 outline-0"
      />

      <div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-secondary-light p-2 text-text focus:outline-0"
        >
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name_asc">Name: A to Z</option>
          <option value="name_desc">Name: Z to A</option>
        </select>
      </div>
    </div>
  );
};

export default ComponentFilters;
