import React from "react";

const PaginationControls = ({ pagination, setPage }) => {
  return (
    <div className="flex justify-between items-center mt-4">
      <button
        disabled={pagination.currentPage === 1}
        onClick={() => setPage((p) => p - 1)}
        className="text-muted hover:text-text disabled:opacity-30 transition cursor-pointer"
      >
        Previous
      </button>
      <span className="text-muted text-sm">
        Page {pagination.currentPage} of {pagination.lastPage}
      </span>
      <button
        disabled={pagination.currentPage === pagination.lastPage}
        onClick={() => setPage((p) => p + 1)}
        className="text-muted hover:text-text disabled:opacity-30 transition cursor-pointer"
      >
        Next
      </button>
    </div>
  );
};

export default PaginationControls;
