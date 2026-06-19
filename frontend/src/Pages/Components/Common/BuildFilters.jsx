import React from "react";
import { useTranslation } from "react-i18next";

const BuildFilters = ({
  search,
  setSearch,
  sort,
  setSort,
  filters,
  setFilters,
  expanded,
}) => {
  const { t } = useTranslation("pages");
  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setSearch("");
    setSort("");
    setFilters({});
  };

  return (
    <>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("components.buildFilters.searchPlaceholder")}
          className="bg-secondary text-white p-2 flex-1 outline-border focus:outline-1"
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-secondary-light p-2 text-text outline-border focus:outline-1"
        >
          <option value="date_asc">{t("components.buildFilters.sort.dateNewest")}</option>
          <option value="date_desc">{t("components.buildFilters.sort.dateOldest")}</option>
          <option value="price_asc">{t("components.buildFilters.sort.priceLowHigh")}</option>
          <option value="price_desc">{t("components.buildFilters.sort.priceHighLow")}</option>
          <option value="likes_asc">{t("components.buildFilters.sort.likesLowHigh")}</option>
          <option value="likes_desc">{t("components.buildFilters.sort.likesHighLow")}</option>
          <option value="rating_asc">{t("components.buildFilters.sort.ratingLowHigh")}</option>
          <option value="rating_desc">{t("components.buildFilters.sort.ratingHighLow")}</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          id="minPrice"
          className="bg-secondary p-2 text-white outline-border focus:outline-1"
          placeholder={t("components.buildFilters.minPricePlaceholder")}
          value={filters["min_price"] ?? ""}
          onChange={(e) =>
            updateFilter("min_price", e.target.value || undefined)
          }
        />

        <input
          type="number"
          id="maxPrice"
          className="bg-secondary p-2 text-white outline-border focus:outline-1"
          placeholder={t("components.buildFilters.maxPricePlaceholder")}
          value={filters["max_price"] ?? ""}
          onChange={(e) =>
            updateFilter("max_price", e.target.value || undefined)
          }
        />

        <select
          value={filters["rating"] ?? ""}
          onChange={(e) => updateFilter("rating", e.target.value || undefined)}
          className="bg-secondary-light p-2 text-text outline-border focus:outline-1"
        >
          <option value="">{t("components.buildFilters.rating.any")}</option>
          <option value="1">{t("components.buildFilters.rating.star1")}</option>
          <option value="2">{t("components.buildFilters.rating.star2")}</option>
          <option value="3">{t("components.buildFilters.rating.star3")}</option>
          <option value="4">{t("components.buildFilters.rating.star4")}</option>
          <option value="5">{t("components.buildFilters.rating.star5")}</option>
        </select>

        <select
          value={filters["type"] ?? ""}
          onChange={(e) => updateFilter("type", e.target.value || undefined)}
          className="bg-secondary-light p-2 text-text outline-border focus:outline-1"
        >
          <option value="">{t("components.buildFilters.type.all")}</option>
          <option value="gaming">{t("components.buildFilters.type.gaming")}</option>
          <option value="office">{t("components.buildFilters.type.office")}</option>
          <option value="rendering">{t("components.buildFilters.type.rendering")}</option>
          <option value="streaming">{t("components.buildFilters.type.streaming")}</option>
        </select>

        <select
          onChange={(e) => updateFilter("gpu_pref", e.target.value)}
          className="bg-secondary-light p-2 text-text outline-border focus:outline-1"
          value={filters["gpu_pref"] ?? ""}
        >
          <option value="">{t("components.buildFilters.gpu.any")}</option>
          <option value="nvidia">{t("components.buildFilters.gpu.nvidia")}</option>
          <option value="amd">{t("components.buildFilters.gpu.amd")}</option>
          <option value="intel">{t("components.buildFilters.gpu.intel")}</option>
        </select>

        <select
          onChange={(e) => updateFilter("cpu_pref", e.target.value)}
          className="bg-secondary-light p-2 text-text outline-border focus:outline-1"
          value={filters["cpu_pref"] ?? ""}
        >
          <option value="">{t("components.buildFilters.cpu.any")}</option>
          <option value="amd">{t("components.buildFilters.cpu.amd")}</option>
          <option value="intel">{t("components.buildFilters.cpu.intel")}</option>
        </select>
      </div>

      <div className="mt-2">
        <label htmlFor="show" className="text-muted block">
          {t("components.buildFilters.show.label")}
        </label>
        <select
          className="w-full p-1 text-muted text-sm border hover:outline focus:outline outline-secondary-light"
          id="show"
          value={filters["show"] ?? ""}
          onChange={(e) => updateFilter("show", e.target.value || undefined)}
        >
          <option value="">{t("components.buildFilters.show.all")}</option>
          <option value="liked">{t("components.buildFilters.show.liked")}</option>
          <option value="bookmarked">{t("components.buildFilters.show.bookmarked")}</option>
          <option value="personal">{t("components.buildFilters.show.personal")}</option>
        </select>
      </div>

      <button
        className="w-full mt-4 p-4 bg-secondary hover:bg-secondary-dark transition cursor-pointer text-white"
        onClick={clearFilters}
      >
        {t("components.buildFilters.clearFilters")}
      </button>
    </>
  );
};

export default BuildFilters;
