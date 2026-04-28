import React, { useState, useRef, useEffect } from "react";
import { Link, useForm, usePage } from "@inertiajs/react";

const Layout = ({ children }) => {
  const user = usePage().props.auth.user;
  const { post } = useForm();
  const { url } = usePage();

  const [profileActive, setProfileActive] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

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
    };

    if (profileActive) {
      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [profileActive]);

  const navLinkClass = (path) => {
    const isActive = url.startsWith(path);
    return `py-4 px-6 transition ${
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
              <Link className={navLinkClass("/builder")} href="/builder">
                Build
              </Link>

              <Link className={navLinkClass("/builds")} href="/builds">
                Saved
              </Link>

              <Link className={navLinkClass("/guide")} href="/guide">
                Guide
              </Link>

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
                  <svg
                    className={`w-4 h-4 transition ${
                      profileActive ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
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
