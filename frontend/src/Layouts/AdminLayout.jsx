import { Link, useLocation, Outlet } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { MenuIcon } from "../Pages/Components/Common/Icons";
import LanguageSwitcher from "../Pages/Components/Common/LanguageSwitcher";

const AdminLayout = () => {
  const { t } = useTranslation("layout");
  const { pathname } = useLocation();
  const [menuActive, setMenuActive] = useState(false);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);

  const navLinkClass = (path) => {
    const isActive = pathname.startsWith(path);
    return `py-4 px-6 transition ${
      isActive
        ? "bg-primary text-white hover:bg-primary-light"
        : "hover:bg-surface text-text"
    }`;
  };

  const menuLinkClass = (path) => {
    const isActive = pathname.startsWith(path);
    return `block py-3 px-4 transition ${
      isActive
        ? "bg-primary text-white hover:bg-primary-light"
        : "hover:bg-surface text-text"
    }`;
  };

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
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [menuActive]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header>
        <nav className="flex items-center bg-background shadow">
          <Link
            className="py-4 px-6 bg-primary text-white font-semibold hover:bg-primary-light transition"
            to="/admin"
          >
            {t("admin.dashboardTitle")}
          </Link>

          <div className="hidden lg:flex">
            <Link className={navLinkClass("/admin/scrape")} to="/admin/scrape">{t("admin.scraper")}</Link>
            <Link className={navLinkClass("/admin/history")} to="/admin/history">{t("admin.history")}</Link>
            <Link className={navLinkClass("/admin/test")} to="/admin/test">{t("admin.test")}</Link>
          </div>

          <button
            ref={menuButtonRef}
            className={`lg:hidden py-4 px-6 transition flex items-center gap-2 ${
              menuActive ? "bg-primary text-white" : "hover:bg-surface text-text"
            }`}
            onClick={() => setMenuActive((prev) => !prev)}
          >
            <MenuIcon />
          </button>

          <div
            ref={menuRef}
            className={`lg:hidden absolute left-0 top-14 w-screen bg-background overflow-hidden transition-all shadow z-50 ${
              menuActive ? "h-36" : "h-0"
            }`}
          >
            <Link className={menuLinkClass("/admin/scrape")} to="/admin/scrape" onClick={() => setMenuActive(false)}>{t("admin.scraper")}</Link>
            <Link className={menuLinkClass("/admin/history")} to="/admin/history" onClick={() => setMenuActive(false)}>{t("admin.history")}</Link>
            <Link className={menuLinkClass("/admin/test")} to="/admin/test" onClick={() => setMenuActive(false)}>{t("admin.test")}</Link>
          </div>

          <div className="ml-auto flex items-center">
            <LanguageSwitcher className="mr-2" />
            <Link
              className="hover:bg-danger/50 text-text py-4 px-8 transition flex items-center"
              to="/"
            >
              {t("admin.exit")}
            </Link>
          </div>
        </nav>
      </header>

      <div className="flex flex-col flex-1 overflow-y-auto">
        <main className="flex-1">
          <Outlet />
        </main>

        <footer className="bg-primary border-t border-primary-light">
          <div className="max-w-348 mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col items-center sm:items-start">
              <span className="font-bold text-white">{t("admin.footerTitle")}</span>
            </div>
            <div className="flex gap-6 text-sm text-surface">
              <Link to="/admin/scrape" className="hover:text-white transition">{t("admin.scraper")}</Link>
              <Link to="/admin/history" className="hover:text-white transition">{t("admin.history")}</Link>
              <Link to="/admin/test" className="hover:text-white transition">{t("admin.test")}</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
