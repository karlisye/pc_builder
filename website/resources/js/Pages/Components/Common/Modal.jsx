import React from "react";

const Modal = ({ children, close }) => {
  return (
    <div
      className="fixed backdrop-blur-xs top-0 bottom-0 left-0 right-0 flex items-center justify-center z-10"
      onClick={close}
    >
      <div
        className="relative bg-background px-10 py-8"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
