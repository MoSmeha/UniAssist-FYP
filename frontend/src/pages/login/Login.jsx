import { useState } from "react";
import { Link } from "react-router-dom";
import useLogin from "../../hooks/useLogin";
// import "./Login.css";

const Login = () => {
  const [uniId, setuniId] = useState("");
  const [password, setPassword] = useState("");

  const { loading, login } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(uniId, password);
  };

  return (
    <div className="login-box">
      <h1 className="login-title">
        Login
        <span className="login-title-highlight"> ChatApp</span>
      </h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label className="label">
            <span className="label-text">uniId</span>
          </label>
          <input
            type="text"
            placeholder="Enter uniId"
            className="input"
            value={uniId}
            onChange={(e) => setuniId(e.target.value)}
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            placeholder="Enter Password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Link to="/signup" className="signup-link">
          {"Don't"} have an account?
        </Link>

        <div>
          <button className="login-button" disabled={loading}>
            {loading ? <span className="loading-spinner"></span> : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
