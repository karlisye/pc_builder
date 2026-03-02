import React, { useState } from "react";
import { useBuild } from "../contexts/BuildContext";
import PcListView from "./PcListView";
import AddCurrComp from "./AddCurrComp";

const PcAddComponentModal = () => {
  const { setIsAddModalActive, isAddActive, setIsAddActive } = useBuild();
  const handleLeave = () => {
    setIsAddModalActive(false);
    setIsAddActive(false);
  };

  return (
    <div
      className="fixed top-0 bottom-0 left-0 right-0 backdrop-blur-xs"
      onClick={handleLeave}
    >
      <div
        className="fixed top-1/2 left-1/2 transform -translate-1/2 bg-primary-dark p-4 shadow-lg rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between">
          <h2 className="font-bold text-3xl mb-6 bg-primary-light px-6 py-1 rounded-md text-secondary">
            Add a Component
          </h2>
          <button
            className="w-8 h-8 text-secondary hover:cursor-pointer"
            onClick={handleLeave}
          >
            ✕
          </button>
        </div>

        {isAddActive ? <AddCurrComp /> : <PcListView />}
      </div>
    </div>
  );
};

export default PcAddComponentModal;
