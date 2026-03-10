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
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => setData("email", e.target.value)}
          />
          {err("email") && <p>{err("email")}</p>}
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={data.password}
            onChange={(e) => setData("password", e.target.value)}
          />
          {err("password") && <p>{err("password")}</p>}
        </div>

        <div>
          <Link href="/register">Create an account</Link>
          <button disabled={processing}>Log in</button>
        </div>
      </form>
    </div>
  );
};

Login.layout = (page) => page;

export default Login;
