import React from "react";
import { Link, useForm, usePage } from "@inertiajs/react";

const Layout = ({ children }) => {
  const user = usePage().props.auth.user;
  const { post } = useForm();
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
            <form
              onSubmit={(e) => {
                e.preventDefault();
                post("/logout");
              }}
            >
              <button className="py-4 px-6 hover:bg-danger/50 transition hover:cursor-pointer">
                Sign Out
              </button>
            </form>
          ) : (
            <>
              <Link
                className="py-4 px-6 hover:bg-surface transition"
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
