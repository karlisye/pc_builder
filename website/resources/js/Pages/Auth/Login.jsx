import { Link, useForm } from "@inertiajs/react";
import { useState } from "react";

const Login = () => {
  const { data, errors, post, setData, processing } = useForm({
    email: "",
    password: "",
  });

  const [clientErrors, setClientErrors] = useState({});

  const validate = () => {
    const e = {};

    if (!data.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      e.email = "Please enter a valid email address.";

    if (!data.password) e.password = "Password is required.";

    setClientErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    post("/login");
  };

  const err = (field) => clientErrors[field] || errors[field];

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="w-full md:w-200 px-8">
        <h1 className="text-3xl font-semibold mb-1">Sign In</h1>
        <div className="flex w-full shadow">
          <div className="w-full md:w-1/2 transition-all duration-300 bg-background">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col my-2 mx-4">
                <label className="text-text" htmlFor="email">
                  Email
                </label>
                <input
                  className={`bg-surface flex-1 p-2 ${clientErrors.email ? "outline-1 outline-danger" : "focus: outline-border"}`}
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(e) => setData("email", e.target.value)}
                />
                {err("email") && <p className="text-danger">{err("email")}</p>}
              </div>

              <div className="flex flex-col my-2 mx-4">
                <label className="text-text" htmlFor="password">
                  Password
                </label>
                <input
                  className={`bg-surface flex-1 p-2 ${clientErrors.password ? "outline-1 outline-danger" : "focus: outline-border"}`}
                  id="password"
                  type="password"
                  value={data.password}
                  onChange={(e) => setData("password", e.target.value)}
                />
                {err("password") && (
                  <p className="text-danger">{err("password")}</p>
                )}
              </div>

              <div className="flex flex-col mx-4 my-4">
                <Link className="text-info" href="/register">
                  Create an account
                </Link>
                <button
                  className="bg-primary hover:bg-primary-light transition cursor-pointer text-white p-4"
                  disabled={processing}
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>
          <div className="w-0 md:w-1/2 transition-all duration-300 bg-primary"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
