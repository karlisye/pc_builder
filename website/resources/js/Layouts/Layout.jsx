import React from "react";
import { Link, useForm, usePage } from "@inertiajs/react";

const Layout = ({ children }) => {
  const user = usePage().props.auth.user;
  const { post } = useForm();
  const { url } = usePage();
  return (
    <>
      <header>
        <nav className="flex items-center bg-background shadow">
          <Link
            className="py-4 px-6 bg-primary text-white font-semibold"
            href="/"
          >
            BUILDER
          </Link>
          {user ? (
            <>
              <Link
                className={`py-4 px-6 transition ${url === "/builder" ? "bg-primary hover:bg-primary-light text-muted" : "hover:bg-surface"}`}
                href="builder"
              >
                Build
              </Link>
              <Link
                className={`py-4 px-6 transition ${url === "/builds" ? "bg-primary hover:bg-primary-light text-muted" : "hover:bg-surface"}`}
                href="builds"
              >
                Saved
              </Link>

              <form
                className="ml-auto"
                onSubmit={(e) => {
                  e.preventDefault();
                  post("/logout");
                }}
              >
                <button className="py-4 px-6 hover:bg-danger/50 transition hover:cursor-pointer">
                  Sign Out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                className="py-4 px-6 hover:bg-surface transition ml-auto"
                href="login"
              >
                Sign In
              </Link>
            </>
          )}
        </nav>
      </header>
      <main className="h-screen">{children}</main>
    </>
  );
};

export default Layout;
