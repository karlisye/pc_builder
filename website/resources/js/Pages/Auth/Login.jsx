import { Link, useForm } from "@inertiajs/react";

const Login = () => {
  const { data, errors, post, setData, processing } = useForm({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post("/login");
  };

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
          {errors.email && <p>{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={data.password}
            onChange={(e) => setData("password", e.target.value)}
          />
          {errors.password && <p>{errors.password}</p>}
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
