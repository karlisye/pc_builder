import React, { useState } from "react";
import { ArrowIcon } from "./Icons";

const ClosedSection = ({ children, title }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex justify-between items-center text-secondary-light hover:text-surface transition cursor-pointer"
      >
        <span className="text-sm">{title}</span>
        <ArrowIcon active={open} />
      </button>

      <div
        className={`grid transition-all overflow-hidden ${open ? "grid-rows-[1fr] mt-3" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden space-y-4 p-px">{children}</div>
      </div>
    </>
  );
};

export default ClosedSection;
