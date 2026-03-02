import React, { useEffect, useState, useCallback, useRef } from "react";
import { useBuild } from "../contexts/BuildContext";
import LoadingSpinner from "./LoadingSpinner";
import axios from "axios";

const AddCurrComp = () => {
  const { currCompToAdd, setIsAddActive, setSelectedComponent, setIsComponentModalActive } = useBuild();
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const bottomRef = useRef(null);
  const scrollRef = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleScroll = () => {
    setShowScrollTop(scrollRef.current?.scrollTop > 200);
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRemove = () => setIsAddActive(false);

  const handleSeeMore = (component) => {
    setSelectedComponent(component);
    setIsComponentModalActive(true);
  };

  const fetchComponent = useCallback(async (searchQuery = "", pageNum = 1) => {
    pageNum === 1 ? setLoading(true) : setLoadingMore(true);
    const component = currCompToAdd.toLowerCase().replace(/\s+/g, "");

    try {
      const res = await axios.get(`/components/${component}`, {
        params: { search: searchQuery, page: pageNum },
      });

      const payload = res.data[component];

      setData((prev) => pageNum === 1 ? payload.data : [...prev, ...payload.data]);
      setLastPage(payload.last_page);
      setPage(pageNum);
    } catch (error) {
      console.error(`Failed to load ${component}:`, error);
      if (pageNum === 1) setData([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [currCompToAdd]);

  useEffect(() => {
    if (currCompToAdd) {
      setSearch("");
      setPage(1);
      fetchComponent("", 1);
    }
  }, [currCompToAdd]);

  useEffect(() => {
    if (!bottomRef.current) return;
    if (!search) handleSearch();

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && page < lastPage && !loadingMore) {
          fetchComponent(search, page + 1);
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [page, lastPage, loadingMore, search]);

  const handleSearch = () => {
    setPage(1);
    fetchComponent(search, 1);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="relative p-6 rounded-xl mx-auto min-h-[80vh] max-h-[80vh] overflow-y-auto w-3xl"
    >
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <h2 className="text-2xl font-bold text-white">Add {currCompToAdd}</h2>
          <button className="w-8 h-8 text-secondary flex items-center justify-center" onClick={handleRemove}>
            ✕
          </button>
        </div>

        <div className="flex-1 flex relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Search ${currCompToAdd?.toLowerCase()}...`}
            className="bg-primary w-full border border-primary-lighter text-white placeholder-primary-light rounded-full pl-4 pr-10 py-2 text-sm focus:outline-none focus:border-secondary"
          />
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-light hover:text-secondary hover:cursor-pointer"
            onClick={handleSearch}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
          {search ? `No results for "${search}"` : `No compatible ${currCompToAdd?.toLowerCase()} found`}
        </div>
      ) : (
        <div className="w-full flex flex-col justify-center rounded-lg gap-4">
          {data.map((component) => (
            <div key={component.id} className="bg-primary p-2 rounded-md flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-success-dark/50 text-success-light text-sm font-semibold rounded-full">
                  {component.price}€
                </span>
                <h3 className="text-white">{component.name}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button className="border-2 rounded-md p-2 text-primary-lighter hover:cursor-pointer hover:bg-primary-dark" onClick={() => handleSeeMore(component)}>
                  See more
                </button>
                <button className="bg-primary border-primary-lighter border-2 rounded-md p-2 text-primary-lighter hover:bg-primary-dark hover:cursor-pointer" title="Add a specific component">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
              <span className="text-primary-light text-sm">End of components</span>
            )}
          </div>
          
          {showScrollTop && (
            <button
              onClick={scrollToTop}
              className="sticky bottom-4 ml-auto flex items-center justify-center w-10 h-10 rounded-full bg-secondary hover:bg-secondary-dark text-primary-dark shadow-lg hover:cursor-pointer transition-opacity"
              title="Scroll to top"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
