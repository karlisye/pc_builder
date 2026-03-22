import axios from "axios";
import React from "react";
import { useBuilder } from "../../Contexts/BuilderContext";

const BuildGenerator = () => {
  const { selectedComponents, setSelectedComponents } = useBuilder();
  const handleGenerate = async () => {
    try {
      const selected = Object.fromEntries(
        Object.entries(selectedComponents)
          .filter(([_, component]) => component !== null)
          .map(([type, component]) => [type, component.id]),
      );

      const res = await axios.post("/api/builder", {
        selected,
        budget: 10000,
      });

      if (res.data.success) {
        setSelectedComponents((prev) => ({
          ...prev,
          ...res.data.build,
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <button
      className="p-4 w-full bg-secondary-light text-text mt-4 cursor-pointer hover:bg-secondary-light/50 transition"
      onClick={handleGenerate}
    >
      Genererate
    </button>
  );
};

export default BuildGenerator;
