import React, { useEffect, useState } from "react";
import { useBuilder } from "../../../Contexts/BuilderContext";
import axios from "axios";
import AddComponentSkeleton from "../Skeletons/AddComponentSkeleton";
import ComponentInfo from "../ComponentInfo";
import { CloseIcon } from "../Common/Icons";
import PaginationControls from "../Common/PaginationControls";

const AddComponent = () => {
  const {
    currentCompToAdd,
    setCurrentCompToAdd,
    selectedComponents,
    search,
    filters,
    sort,
    setSelectedComponents,
    debouncedSearch,
  } = useBuilder();
  const [components, setComponents] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (!currentCompToAdd) return;
    setPage(1);
    fetchComponents(1);
  }, [currentCompToAdd, debouncedSearch, filters, sort]);

  useEffect(() => {
    if (!currentCompToAdd || page === 1) return;
    fetchComponents(page);
  }, [page]);

  const fetchComponents = async (pageNum = 1) => {
    setLoading(true);
    setError("");

    try {
      const selected = Object.fromEntries(
        Object.entries(selectedComponents)
          .filter(([_, component]) => component !== null)
          .map(([type, component]) => [type, component.id]),
      );

      const res = await axios.get(
        `/api/components/${currentCompToAdd.toLowerCase()}`,
        {
          params: {
            selected: JSON.stringify(selected),
            page: pageNum,
            search: search || undefined,
            sort: sort || undefined,
            ...filters,
          },
        },
      );

      setComponents(res.data.data);
      setPagination({
        currentPage: res.data.current_page,
        lastPage: res.data.last_page,
        total: res.data.total,
      });
    } catch (err) {
      setError(err.response?.data?.error ?? "Failed to fetch components");
    } finally {
      setLoading(false);
    }
  };

  const handleLeave = () => {
    setCurrentCompToAdd(null);
  };

  const handleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleSelect = (component) => {
    setSelectedComponents((prev) => ({
      ...prev,
      [currentCompToAdd.toLowerCase()]: component,
    }));
    setCurrentCompToAdd(null);
  };

  return (
    <div className="border border-border w-full hover:bg-background transition p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-semibold text-text">
          Add {currentCompToAdd}
        </h2>
        <button
          className="w-10 h-10 text-muted hover:cursor-pointer bg-surface hover:bg-secondary-light transition p-2"
          onClick={handleLeave}
        >
          <CloseIcon />
        </button>
      </div>

      {loading && <AddComponentSkeleton />}
      {error && <p className="text-danger mt-4">{error}</p>}

      {!loading && !error && (
        <div className="mt-4 flex flex-col gap-2">
          {components.length === 0 ? (
            <div className="mx-auto text-center">
              <p className="text-2xl font-semibold text-text">
                No Components Found
              </p>
              <span className="text-muted">Try adjusting your filters</span>
            </div>
          ) : (
            components.map((component) => (
              <div key={component.id} className="border border-border">
                <div
                  key={component.id}
                  onClick={() => handleExpand(component.id)}
                  className="flex justify-between items-center p-3 bg-surface hover:bg-secondary-light cursor-pointer transition"
                >
                  <span className="text-text font-medium">
                    {component.name}
                  </span>
                  <span className="text-muted">€{component.price}</span>
                </div>
                <div
                  className={`bg-background transition-all overflow-hidden grid ${
                    expandedId === component.id
                      ? "grid-rows-[1fr]"
                      : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="p-3">
                      <ComponentInfo component={component} />

                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleSelect(component)}
                          className="p-4 bg-primary text-white hover:bg-primary-light transition cursor-pointer flex-1"
                        >
                          Select
                        </button>

                        <a
                          href={component.url}
                          target="_blank"
                          className="p-4 bg-surface text-text hover:bg-secondary-light transition cursor-pointer"
                        >
                          See in Shop
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {pagination && pagination.lastPage > 1 && (
        <PaginationControls pagination={pagination} setPage={setPage} />
      )}
    </div>
  );
};

export default AddComponent;
