import React, { useState } from "react";

const Guide = () => {
  const [active, setActive] = useState("builder");

  return (
    <div className="h-full flex flex-wrap">
      <div className="w-full lg:w-120 bg-primary py-6 px-4">
        <h1 className="text-4xl font-semibold text-white">GUIDE</h1>
        <div className="space-y-4 mt-8">
          <button
            className={`p-4 border border-secondary w-full hover:bg-secondary text-white text-left transition-all cursor-pointer ${active === "builder" ? "border-l-10" : ""}`}
            onClick={() => setActive("builder")}
          >
            Building a PC
          </button>

          <button
            className={`p-4 border border-secondary w-full hover:bg-secondary text-white text-left transition-all cursor-pointer ${active === "auto" ? "border-l-10" : ""}`}
            onClick={() => setActive("auto")}
          >
            Automatic Builder
          </button>

          <button
            className={`p-4 border border-secondary w-full hover:bg-secondary text-white text-left transition-all cursor-pointer ${active === "saved" ? "border-l-10" : ""}`}
            onClick={() => setActive("saved")}
          >
            Managing Saved Builds
          </button>
        </div>
      </div>
    </div>
  );
};

export default Guide;
