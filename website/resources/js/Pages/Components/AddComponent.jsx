import React, { useEffect, useState } from "react";
import { useBuilder } from "../../Contexts/BuilderContext";
import axios from "axios";

const AddComponent = () => {
  const { currentCompToAdd, setCurrentCompToAdd, selectedComponents } =
    useBuilder();
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentCompToAdd) return;
    setPage(1);
    fetchComponents(1);
  }, [currentCompToAdd]);

  useEffect(() => {
    if (!currentCompToAdd || page === 1) return;
    fetchComponents(page);
  }, [page]);

  const fetchComponents = async (pageNum = 1) => {
    setLoading(true);
    setError("");

    try {
      const selected = Object.fromEntries(
        Object.entries(selectedComponents).map(([type, component]) => [
          type,
          component?.id,
        ]),
      );

      const res = await axios.get(
        `/api/components/${currentCompToAdd.toLowerCase()}`,
        {
          params: {
            selected: JSON.stringify(selected),
            page: pageNum,
          },
        },
      );

      console.log(res.data);
    } catch (error) {
      setError(error);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLeave = () => {
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
    </div>
  );
};

export default AddComponent;
