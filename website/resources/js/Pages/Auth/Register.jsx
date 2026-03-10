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

  // Client errors take priority — server errors shown as fallback
  const err = (field) => clientErrors[field] || errors[field];

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={data.name}
            onChange={(e) => setData("name", e.target.value)}
          />
          {err("name") && <p>{err("name")}</p>}
        </div>

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
          <label htmlFor="password_confirmation">Confirm password</label>
          <input
            id="password_confirmation"
            type="password"
            value={data.password_confirmation}
            onChange={(e) => setData("password_confirmation", e.target.value)}
          />
          {err("password_confirmation") && (
            <p>{err("password_confirmation")}</p>
          )}
        </div>

        <div>
          <Link href="/login">Already have an account?</Link>
          <button disabled={processing}>Sign up</button>
        </div>
      </form>
    </div>
  );
};

export default Register;
