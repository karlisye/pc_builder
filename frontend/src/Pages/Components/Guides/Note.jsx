import React from "react";

const Note = ({ children }) => {
  return (
    <div className="border border-border p-4 bg-background text-sm text-muted mt-1.5 shadow">
      <span className="font-medium text-text">Note: </span>
      {children}
    </div>
  );
};

export default Note;
