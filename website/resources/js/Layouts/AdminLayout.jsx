import { Link, usePage } from "@inertiajs/react";
import React, { useEffect, useRef, useState } from "react";
import { MenuIcon } from "../Pages/Components/Common/Icons";

const AdminLayout = ({ children }) => {
  const { url } = usePage();
  const [menuActive, setMenuActive] = useState(false);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);

  const navLinkClass = (path) => {
    const isActive = url.startsWith(path);
    return `py-4 px-6 transition ${
      isActive
        ? "bg-primary text-white hover:bg-primary-light"
        : "hover:bg-surface text-text"
    }`;
  };

  const menuLinkClass = (path) => {
    const isActive = url.startsWith(path);
    return `block py-3 px-4 transition ${
      isActive
        ? "bg-primary text-white hover:bg-primary-light"
        : "hover:bg-surface text-text"
    }`;
  };

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setMenuActive(false);
      }
    };

    if (menuActive) {
      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [menuActive]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header>
        <nav className="flex items-center bg-background shadow">
          <Link
            className="py-4 px-6 bg-primary text-white font-semibold hover:bg-primary-light transition"
            href="/admin"
          >
            DASHBOARD
          </Link>

          <div className="hidden md:flex">
            <Link
              className={navLinkClass("/admin/scrape")}
              href="/admin/scrape"
            >
              Scraper
            </Link>

            <Link
              className={navLinkClass("/admin/history")}
              href="/admin/history"
            >
              History
            </Link>
          </div>

          <button
            ref={menuButtonRef}
            className={`md:hidden py-4 px-6 transition flex items-center gap-2 ${
              menuActive
                ? "bg-primary text-white"
                : "hover:bg-surface text-text"
            }`}
            onClick={() => setMenuActive((prev) => !prev)}
          >
            <MenuIcon />
          </button>

          <div
            ref={menuRef}
            className={`md:hidden absolute left-0 top-14 w-screen bg-background overflow-hidden transition-all shadow z-50 ${
              menuActive ? "h-24" : "h-0"
            }`}
          >
            <Link
              className={menuLinkClass("/admin/scrape")}
              href="/admin/scrape"
              onClick={() => setMenuActive(false)}
            >
              Scraper
            </Link>

            <Link
              className={menuLinkClass("/admin/history")}
              href="/admin/history"
              onClick={() => setMenuActive(false)}
            >
              History
            </Link>
          </div>

          <div className="ml-auto">
            <Link
              className="hover:bg-danger/50 text-text py-4 px-8 transition flex items-center"
              href="/"
            >
              Exit
            </Link>
          </div>
        </nav>
      </header>

      <div className="flex flex-col flex-1 overflow-y-auto">
        <main className="flex-1">{children}</main>

        <footer className="bg-primary border-t border-primary-light">
          <div className="max-w-348 mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col items-center sm:items-start">
              <span className="font-bold text-white">
                BUILDER ADMIN DASHBOARD
              </span>
            </div>

            <div className="flex gap-6 text-sm text-surface">
              <Link
                href="/admin/scrape"
                className="hover:text-white transition"
              >
                Scraper
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
