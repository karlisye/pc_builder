import React, { useEffect, useState } from "react";
import { useBuild } from "../contexts/BuildContext";
import LoadingSpinner from "./LoadingSpinner";
import axios from "axios";

const AddCurrComp = () => {
  const { currCompToAdd, setIsAddActive, setSelectedComponent, setIsComponentModalActive } = useBuild();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const handleRemove = () => {
    setIsAddActive(false);
  };

  const handleSeeMore = (component) => {
    setSelectedComponent(component);
    setIsComponentModalActive(true);
  };

  const fetchComponent = async () => {
    setLoading(true);
    const component = currCompToAdd.toLowerCase().replace(/\s+/g, "");

    try {
      const res = await axios.get(`/components/${component}`);
      setData(res.data[component].data || []);
    } catch (error) {
      console.error(`Failed to load ${component}:`, error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currCompToAdd) {
      fetchComponent();
    }
  }, [currCompToAdd]);

  return (
    <div className="p-6 rounded-xl mx-auto max-h-[80vh] overflow-y-auto w-3xl">
      <div className="flex items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Add {currCompToAdd}</h2>
        <button
          className="w-8 h-8 text-secondary flex items-center justify-center"
          onClick={handleRemove}
        >
          ✕
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : data.length === 0 ? (
        <div className="text-center py-12 text-secondary">
          No compatible {currCompToAdd.toLowerCase()} found
        </div>
      ) : (
        <div className="w-full flex flex-col justify-center rounded-lg gap-4">
          {data.map((component) => (
            <div key={component.id} className="bg-primary p-2 rounded-md flex justify-between items-center">
              <span className="text-white">{component.name}</span>

              <div className="flex items-center gap-2">
                <button className="border-2 rounded-md p-2 text-primary-lighter hover:cursor-pointer hover:bg-primary-dark" onClick={() => handleSeeMore(component)}>
                  See more
                </button>
                <button
                  className="bg-primary border-primary-lighter border-2 rounded-md p-2 text-primary-lighter hover:bg-primary-dark hover:cursor-pointer"
                  title="Add a specific component"
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
        </div>
      )}
    </div>
  );
};

export default AddCurrComp;
