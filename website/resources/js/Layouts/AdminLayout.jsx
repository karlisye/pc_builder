import { Link } from "@inertiajs/react";
import React from "react";

const AdminLayout = ({ children }) => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header>
        <nav className="flex items-center bg-background shadow"></nav>
      </header>

      <div className="flex flex-col flex-1 overflow-y-auto">
        <main className="flex-1">{children}</main>

        <footer className="bg-primary border-t border-primary-light">
          <div className="max-w-348 mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col items-center sm:items-start">
              <span className="font-bold text-white">BUILDER</span>
              <p className="text-surface text-sm mt-1">
                Build and share your PC.
              </p>
            </div>

            <div className="flex gap-6 text-sm text-surface">
              <Link href="/builder" className="hover:text-white transition">
                Build
              </Link>
              <Link href="/builds" className="hover:text-white transition">
                Saved
              </Link>
              <Link href="/guide" className="hover:text-white transition">
                Guide
              </Link>
              <Link href="/shared" className="hover:text-white transition">
                Shared
              </Link>
            </div>

            <a
              href="https://github.com/karlisye"
              target="_blank"
              className="text-surface hover:text-white transition text-sm"
            >
              @karlisye
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
