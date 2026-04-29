import React from "react";

const BuildFilters = ({ search, setSearch, sort, setSort }) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search build or author...`}
          className="bg-secondary text-white p-2 flex-1 outline-border focus:outline-1"
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-secondary-light p-2 text-text outline-border focus:outline-1"
        >
          <option value="date_asc">Date: Newest</option>
          <option value="date_desc">Date: Oldest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="likes_asc">Likes: Low to High</option>
          <option value="likes_desc">Likes: High to Low</option>
          <option value="rating_asc">Rating: Low to High</option>
          <option value="rating_desc">Rating: High to Low</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2"></div>

      <button
        className="w-full p-4 bg-secondary hover:bg-secondary-dark transition cursor-pointer text-white"
        // onClick={() => setFilters({})}
      >
        Clear Filters
      </button>
    </div>
  );
};

export default BuildFilters;
