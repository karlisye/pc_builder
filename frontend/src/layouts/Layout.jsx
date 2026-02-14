import React from 'react';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <>
      <header className="max-w-360 mx-auto">
        <nav className="border border-primary-light">
          <div>
            <h1 className="p-4 text-3xl font-bold">PC BUILDER</h1>
          </div>

          <div className="flex items-center space-x-2 bg-linear-to-b from-primary-light to-primary text-white px-6 rounded-lg -mx-2">
            <Link className="text-sm py-1 px-2 border-r border-primary-light" to="/">
              Home
            </Link>
            <Link className="text-sm py-1" to="/build">
              Build
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-360 mx-auto border">{children}</main>
    </>
  );
};

export default Layout;
