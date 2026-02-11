import React from 'react';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <>
      <header>
        <nav className="p-2 border">
          <div>
            <Link to="/">Home</Link>
            <Link to="/build">Build</Link>
          </div>
        </nav>
      </header>
      <main>{children}</main>
    </>
  );
};

export default Layout;
