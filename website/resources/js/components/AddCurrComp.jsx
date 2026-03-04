import React from "react";
import { useBuild } from "../contexts/BuildContext";
import LoadingSpinner from "./LoadingSpinner";
import { useComponentSearch } from "./add-component/useComponentSearch";

const AddCurrComp = () => {
  const {
    activePicker,
    setActivePicker,
    setSelectedComponent,
    setIsComponentModalActive,
    locked,
    setLocked,
  } = useBuild();

  const {
    loading,
    loadingMore,
    data,
    search,
    setSearch,
    bottomRef,
    scrollRef,
    showScrollTop,
    handleScroll,
    scrollToTop,
    handleSearch,
    handleKeyDown,
    page,
    lastPage
  } = useComponentSearch(activePicker, locked);

  const handleRemove = () => setActivePicker(null);

  const handleSeeMore = (component) => {
    setSelectedComponent(component);
    setIsComponentModalActive(true);
  };

  const typeMap = {
    processor: "cpu",
    motherboard: "motherboard",
    ram: "ram",
    cooler: "cooler",
    "graphics card": "gpu",
    ssd: "ssd",
    "power supply": "psu",
    case: "case",
    fans: "fans",
  };

  const handleAddComponent = (component) => {
    const type = typeMap[activePicker.toLowerCase()];
    if (!type) return;
    setLocked((prev) => ({
      ...prev,
      [type]: component,
    }));
    setActivePicker(null);
  };

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="relative p-6 rounded-xl mx-auto min-h-[80vh] max-h-[80vh] overflow-y-auto w-full"
    >
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <h2 className="text-2xl font-bold text-white">Add {activePicker}</h2>
          <button
            className="w-8 h-8 text-secondary flex items-center justify-center"
            onClick={handleRemove}
          >
            ✕
          </button>
        </div>

        <div className="flex-1 flex relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Search ${activePicker?.toLowerCase()}...`}
            className="bg-primary w-full border border-primary-lighter text-white placeholder-primary-light rounded-full pl-4 pr-10 py-2 text-sm focus:outline-none focus:border-secondary"
          />
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-light hover:text-secondary hover:cursor-pointer"
            onClick={handleSearch}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="22" y2="22" />
            </svg>
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : data.length === 0 ? (
        <div className="text-center py-12 text-secondary">
          {search
            ? `No results for "${search}"`
            : `No compatible ${activePicker?.toLowerCase()} found`}
        </div>
      ) : (
        <div className="w-full flex flex-col justify-center rounded-lg gap-4">
          {data.map((component) => (
            <div
              key={component.id}
              className="bg-primary p-2 rounded-md flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-success-dark/50 text-success-light text-sm font-semibold rounded-full">
                  {component.price}€
                </span>
                <h3 className="text-white truncate max-w-xs">
                  {component.name}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="border-2 rounded-md p-2 text-primary-lighter hover:cursor-pointer hover:bg-primary-dark"
                  onClick={() => handleSeeMore(component)}
                >
                  See more
                </button>
                <button
                  className="bg-primary border-primary-lighter border-2 rounded-md p-2 text-primary-lighter hover:bg-primary-dark hover:cursor-pointer"
                  title="Add this component to build"
                  onClick={() => handleAddComponent(component)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}

          <div ref={bottomRef} className="py-2 flex justify-center">
            {loadingMore && <LoadingSpinner />}
            {!loadingMore && page >= lastPage && (
              <span className="text-primary-light text-sm">
                End of components
              </span>
            )}
          </div>

          {showScrollTop && (
            <button
              onClick={scrollToTop}
              className="sticky bottom-4 ml-auto flex items-center justify-center w-10 h-10 rounded-full bg-secondary hover:bg-secondary-dark text-primary-dark shadow-lg hover:cursor-pointer transition-opacity"
              title="Scroll to top"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AddCurrComp;
