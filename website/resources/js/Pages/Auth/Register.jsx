import { Link, useForm } from "@inertiajs/react";

const Register = () => {
  const { data, errors, post, setData, processing } = useForm({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post("/register");
  };

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
          {errors.name && <p>{errors.name}</p>}
        </div>

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
          <label htmlFor="password_confirmation">Confirm password</label>
          <input
            id="password_confirmation"
            type="password"
            value={data.password_confirmation}
            onChange={(e) => setData("password_confirmation", e.target.value)}
          />
          {errors.password_confirmation && (
            <p>{errors.password_confirmation}</p>
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

Register.layout = (page) => page;

export default Register;
