import React from "react";
import { Link, useForm, usePage } from "@inertiajs/react";

const Layout = ({ children }) => {
  const user = usePage().props.auth.user;
  const { post } = useForm();
  return (
    <>
      <header>
        <nav>
          <Link href="/">Home</Link>
          {user ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                post("/logout");
              }}
            >
              <button>logout</button>
            </form>
          ) : (
            <>
              <Link href="login">Login</Link>
            </>
          )}
        </nav>
      </header>
      <main>{children}</main>
    </>
  );
};

export default Layout;
