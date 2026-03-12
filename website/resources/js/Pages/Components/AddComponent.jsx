import React, { useEffect, useState } from "react";
import { useBuilder } from "../../Contexts/BuilderContext";
import axios from "axios";
import AddComponentSkeleton from "./Skeletons/AddComponentSkeleton";

const AddComponent = () => {
  const {
    currentCompToAdd,
    setCurrentCompToAdd,
    selectedComponents,
    search,
    filters,
    sort,
  } = useBuilder();
  const [components, setComponents] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!currentCompToAdd) return;
    setPage(1);
    fetchComponents(1);
  }, [currentCompToAdd, search, filters, sort]);

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

  const handleSelect = (component) => {
    // add later
    console.log("selected", component);
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
          <svg viewBox="0 0 24 24" fill="none">
            <g strokeWidth="0"></g>
            <g strokeLinecap="round" strokeLinejoin="round"></g>
            <g>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z"
                fill="currentColor"
              ></path>
            </g>
          </svg>
        </button>
      </div>

      {loading && <AddComponentSkeleton />}
      {error && <p className="text-danger mt-4">{error}</p>}

      {!loading && !error && (
        <div className="mt-4 flex flex-col gap-2">
          {components.map((component) => (
            <div
              key={component.id}
              onClick={() => handleSelect(component)}
              className="flex justify-between items-center p-3 border border-border bg-surface hover:bg-secondary-light cursor-pointer transition"
            >
              <span className="text-text font-medium">{component.name}</span>
              <span className="text-muted">€{component.price}</span>
            </div>
          ))}
        </div>
      )}

      {pagination && pagination.lastPage > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={pagination.currentPage === 1}
            onClick={() => setPage((p) => p - 1)}
            className="text-muted hover:text-text disabled:opacity-30 transition"
          >
            Previous
          </button>
          <span className="text-muted text-sm">
            Page {pagination.currentPage} of {pagination.lastPage}
          </span>
          <button
            disabled={pagination.currentPage === pagination.lastPage}
            onClick={() => setPage((p) => p + 1)}
            className="text-muted hover:text-text disabled:opacity-30 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AddComponent;
