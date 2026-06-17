import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  const set = (field) => (e) => setData((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!data.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      e.email = "Please enter a valid email address.";
    if (!data.password) e.password = "Password is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setProcessing(true);
    try {
      await login(data.email, data.password);
      navigate("/");
    } catch (err) {
      const serverErrors = err.response?.data?.errors ?? {};
      setErrors(serverErrors);
    } finally {
      setProcessing(false);
    }
  };

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
                  className={`bg-surface flex-1 p-2 ${errors.email ? "outline-1 outline-danger" : "focus: outline-border"}`}
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={set("email")}
                />
                {errors.email && <p className="text-danger">{errors.email}</p>}
              </div>

              <div className="flex flex-col my-2 mx-4">
                <label className="text-text" htmlFor="password">
                  Password
                </label>
                <input
                  className={`bg-surface flex-1 p-2 ${errors.password ? "outline-1 outline-danger" : "focus: outline-border"}`}
                  id="password"
                  type="password"
                  value={data.password}
                  onChange={set("password")}
                />
                {errors.password && (
                  <p className="text-danger">{errors.password}</p>
                )}
              </div>

              <div className="flex flex-col mx-4 my-4">
                <Link className="text-info" to="/register">
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

          <div className="w-0 md:w-1/2 transition-all duration-300 bg-primary flex flex-col overflow-hidden">
            <div className="border-4 border-secondary m-2 h-full flex items-center justify-center p-2">
              <span className="text-7xl font-bold text-surface">
                PC BUILDER
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
