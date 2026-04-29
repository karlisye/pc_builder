import React, { useState, useRef, useEffect } from "react";
import { Link, useForm, usePage } from "@inertiajs/react";
import { ArrowIcon, MenuIcon } from "../Pages/Components/Common/Icons";

const Layout = ({ children }) => {
  const user = usePage().props.auth.user;
  const { post } = useForm();
  const { url } = usePage();

  const [profileActive, setProfileActive] = useState(false);
  const [menuActive, setMenuActive] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setProfileActive(false);
      }
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setMenuActive(false);
      }
    };

    if (profileActive || menuActive) {
      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [profileActive, menuActive]);

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

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header>
        <nav className="flex items-center bg-background shadow">
          <Link
            className="py-4 px-6 bg-primary text-white font-semibold hover:bg-primary-light transition"
            href="/"
          >
            BUILDER
          </Link>

          {user ? (
            <>
              <div className="hidden md:flex">
                <Link className={navLinkClass("/builder")} href="/builder">
                  Build
                </Link>

                <Link className={navLinkClass("/builds")} href="/builds">
                  Saved
                </Link>

                <Link className={navLinkClass("/guide")} href="/guide">
                  Guide
                </Link>

                <Link className={navLinkClass("/shared")} href="/shared">
                  Shared
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
                className={`md:hidden absolute left-0 top-14 w-screen bg-background overflow-hidden transition-all shadow z-10 ${
                  menuActive ? "h-36" : "h-0"
                }`}
              >
                <Link
                  className={menuLinkClass("/builder")}
                  href="/builder"
                  onClick={() => setMenuActive(false)}
                >
                  Build
                </Link>

                <Link
                  className={menuLinkClass("/builds")}
                  href="/builds"
                  onClick={() => setMenuActive(false)}
                >
                  Saved
                </Link>

                <Link
                  className={menuLinkClass("/guide")}
                  href="/guide"
                  onClick={() => setMenuActive(false)}
                >
                  Guide
                </Link>
              </div>

              {/* profile element */}
              <div className="ml-auto relative">
                <button
                  ref={buttonRef}
                  className={`py-4 px-6 transition flex items-center gap-2 font-medium ${
                    profileActive
                      ? "bg-primary text-white"
                      : "hover:bg-surface text-text"
                  }`}
                  onClick={() => setProfileActive((prev) => !prev)}
                >
                  <span className="w-6 h-6 rounded-full bg-secondary-light flex items-center justify-center text-xs font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                  <ArrowIcon active={profileActive} />
                </button>

                {/* dropdown */}
                <div
                  ref={dropdownRef}
                  className={`absolute right-0 sm:w-80 w-screen bg-background overflow-hidden transition-all shadow z-10 ${
                    profileActive ? "h-32" : "h-0"
                  }`}
                >
                  <div className="px-4 py-3 bg-surface">
                    <p className="text-text font-semibold uppercase">
                      Hello, {user.name}
                    </p>
                  </div>

                  <div>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-text hover:bg-secondary-light transition"
                    >
                      Profile
                    </Link>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        post("/logout");
                      }}
                    >
                      <button className="w-full px-4 py-2 text-danger hover:bg-danger/50 transition text-left cursor-pointer">
                        Sign Out
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <Link
              className="py-4 px-6 hover:bg-surface transition ml-auto"
              href="/login"
            >
              Sign In
            </Link>
          )}
        </nav>
      </header>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
};

export default Layout;
