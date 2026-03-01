import React, { useEffect, useState } from "react";
import { useBuild } from "../contexts/BuildContext";
import LoadingSpinner from "./LoadingSpinner";
import axios from "axios";

const AddCurrComp = () => {
  const { currCompToAdd, setIsAddActive } = useBuild();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const handleRemove = () => {
    setIsAddActive(false);
  };

  const fetchComponent = async () => {
    const component = currCompToAdd.toLowerCase().replace(/\s+/g, "");
    console.log(component);
    const res = await axios.get(`/components/${component}`);
    setData(res.data[component].data);

    console.log(res.data[component].data);
  };

  useEffect(() => {
    fetchComponent();
  }, []);

  return (
    <div className="p-2 rounded-lg bg-primary flex flex-col">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-semibold text-white">{currCompToAdd}</h2>
        <button
          className="w-6 h-6 text-secondary hover:cursor-pointer"
          onClick={handleRemove}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z"
                fill="currentColor"
              ></path>{" "}
            </g>
          </svg>
        </button>
      </div>

      <div>{loading ? <LoadingSpinner /> : ""}</div>
    </div>
  );
};

export default AddCurrComp;
