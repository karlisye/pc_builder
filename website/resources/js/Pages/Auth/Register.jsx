import { Link, useForm } from "@inertiajs/react";
import { useState } from "react";

const Register = () => {
  const { data, errors, post, setData, processing } = useForm({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [clientErrors, setClientErrors] = useState({});

  const validate = () => {
    const e = {};

    if (!data.name.trim()) e.name = "Name is required.";
    else if (data.name.trim().length < 3)
      e.name = "Name must be at least 3 characters.";

    if (!data.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      e.email = "Please enter a valid email address.";

    if (!data.password) e.password = "Password is required.";
    else if (data.password.length < 8)
      e.password = "Password must be at least 8 characters.";
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/.test(data.password))
      e.password =
        "Password must contain uppercase, lowercase, a number, and a symbol.";

    if (!data.password_confirmation)
      e.password_confirmation = "Please confirm your password.";
    else if (data.password !== data.password_confirmation)
      e.password_confirmation = "Passwords do not match.";

    setClientErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) post("/register");
  };

  const err = (field) => clientErrors[field] || errors[field];

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="w-full md:w-200 px-8">
        <h1 className="text-3xl font-semibold mb-1">Sign Up</h1>
        <div className="flex w-full shadow">
          <div className="w-full md:w-1/2 transition-all duration-300 bg-background">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col my-2 mx-4">
                <label className="text-text" htmlFor="name">
                  Name
                </label>
                <input
                  className={`bg-surface flex-1 p-2 ${clientErrors.name ? "outline-1 outline-danger" : "focus: outline-border"}`}
                  id="name"
                  type="text"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                />
                {err("name") && <p className="text-danger">{err("name")}</p>}
              </div>

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

              <div className="flex flex-col my-2 mx-4">
                <label className="text-text" htmlFor="password_confirmation">
                  Confirm password
                </label>
                <input
                  className={`bg-surface flex-1 p-2 ${clientErrors.password_confirmation ? "outline-1 outline-danger" : "focus: outline-border"}`}
                  id="password_confirmation"
                  type="password"
                  value={data.password_confirmation}
                  onChange={(e) =>
                    setData("password_confirmation", e.target.value)
                  }
                />
                {err("password_confirmation") && (
                  <p className="text-danger">{err("password_confirmation")}</p>
                )}
              </div>

              <div className="flex flex-col mx-4 my-4">
                <Link className="text-info" href="/login">
                  Already have an account?
                </Link>
                <button
                  className="bg-primary hover:bg-primary-light transition cursor-pointer text-white p-4"
                  disabled={processing}
                >
                  Sign Up
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

export default Register;
