import React from "react";

const Modal = ({ children, close }) => {
  return (
    <div
      className="fixed w-full h-full backdrop-blur-xs top-0 flex items-center justify-center"
      onClick={close}
    >
      <div
        className="relative bg-background px-10 pt-10 pb-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-text hover:text-primary-light transition cursor-pointer"
          onClick={close}
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
            <line x1="5" y1="5" x2="19" y2="19" />
            <line x1="19" y1="5" x2="5" y2="19" />
          </svg>
        </button>

        {children}
      </div>
    </div>
  );
};

export default Modal;
