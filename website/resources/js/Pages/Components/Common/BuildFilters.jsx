import React from "react";

const BuildFilters = ({
  search,
  setSearch,
  sort,
  setSort,
  filters,
  setFilters,
  expanded,
}) => {
  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setSearch("");
    setSort("");
    setFilters({});
  };

  return (
    <div
      className={`grid transition-all lg:mt-4 ${expanded ? "grid-rows-[1fr] mt-4" : "grid-rows-[0fr] lg:grid-rows-[1fr]"}`}
    >
      <div className="overflow-hidden space-y-4 p-px">
        <div className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search by build or author...`}
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

        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            id="minPrice"
            className="bg-secondary p-2 text-white outline-border focus:outline-1"
            placeholder="Min price (€)"
            value={filters["min_price"] ?? ""}
            onChange={(e) =>
              updateFilter("min_price", e.target.value || undefined)
            }
          />

          <input
            type="number"
            id="maxPrice"
            className="bg-secondary p-2 text-white outline-border focus:outline-1"
            placeholder="Max price (€)"
            value={filters["max_price"] ?? ""}
            onChange={(e) =>
              updateFilter("max_price", e.target.value || undefined)
            }
          />

          <select
            value={filters["rating"] ?? ""}
            onChange={(e) =>
              updateFilter("rating", e.target.value || undefined)
            }
            className="bg-secondary-light p-2 text-text outline-border focus:outline-1"
          >
            <option value="">Min rating: Any</option>
            <option value="1">Min rating: 1 star</option>
            <option value="2">Min rating: 2 stars</option>
            <option value="3">Min rating: 3 stars</option>
            <option value="4">Min rating: 4 stars</option>
            <option value="5">Min rating: 5 stars</option>
          </select>

          <select
            value={filters["type"] ?? ""}
            onChange={(e) => updateFilter("type", e.target.value || undefined)}
            className="bg-secondary-light p-2 text-text outline-border focus:outline-1"
          >
            <option value="">Type: All</option>
            <option value="gaming">Type: Gaming</option>
            <option value="office">Type: Office</option>
            <option value="rendering">Type: Rendering</option>
            <option value="streaming">Type: Streaming</option>
          </select>

          <select
            onChange={(e) => updateFilter("gpu_pref", e.target.value)}
            className="bg-secondary-light p-2 text-text outline-border focus:outline-1"
            value={filters["gpu_pref"] ?? ""}
          >
            <option value="">GPU: Any</option>
            <option value="nvidia">GPU: NVIDIA</option>
            <option value="amd">GPU: AMD</option>
            <option value="intel">GPU: INTEL</option>
          </select>

          <select
            onChange={(e) => updateFilter("cpu_pref", e.target.value)}
            className="bg-secondary-light p-2 text-text outline-border focus:outline-1"
            value={filters["cpu_pref"] ?? ""}
          >
            <option value="">CPU: Any</option>
            <option value="amd">CPU: AMD</option>
            <option value="intel">CPU: INTEL</option>
          </select>

          {/* TODO: add tags filter */}
        </div>

        <div>
          <label htmlFor="show" className="text-muted block">
            Show
          </label>
          <select
            className="w-full p-1 text-muted text-sm border hover:outline focus:outline outline-secondary-light"
            id="show"
            value={filters["show"] ?? ""}
            onChange={(e) => updateFilter("show", e.target.value || undefined)}
          >
            <option value="">All</option>
            <option value="liked">Liked</option>
            <option value="bookmarked">Bookmarked</option>
            <option value="personal">Personal</option>
          </select>
        </div>

        <button
          className="w-full p-4 bg-secondary hover:bg-secondary-dark transition cursor-pointer text-white"
          onClick={clearFilters}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default BuildFilters;
