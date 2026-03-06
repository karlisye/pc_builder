import React from "react";

const Layout = ({ children }) => {
  return (
    <>
      <header>
        <nav></nav>
      </header>
      <main>{children}</main>
    </>
  );
};

export default Layout;
