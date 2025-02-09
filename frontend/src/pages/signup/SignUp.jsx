import { useState } from "react";
import { Link } from "react-router-dom";
import GenderCheckbox from "./GenderCheckbox";
import useSignup from "../../hooks/useSignup";
import "./SignUp.css"; // Import the CSS file

const SignUp = () => {
  const [inputs, setInputs] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const { loading, signup } = useSignup();

  const handleCheckboxChange = (gender) => {
    setInputs({ ...inputs, gender });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(inputs);
  };

  return (
    <div className="signup-form-container">
      <h1 className="signup-title">
        Sign Up <span className="signup-title-span">ChatApp</span>
      </h1>

      <form onSubmit={handleSubmit} className="signup-form">
        <div>
          <label className="signup-label">
            <span className="signup-label-text">Full Name</span>
          </label>
          <input
            type="text"
            className="signup-input"
            placeholder="First + Last Name"
            value={inputs.fullName}
            onChange={(e) => setInputs({ ...inputs, fullName: e.target.value })}
          />
        </div>

        <div>
          <label className="signup-label">
            <span className="signup-label-text">Username</span>
          </label>
          <input
            type="text"
            placeholder="e.g: john_doe"
            className="signup-input"
            value={inputs.username}
            onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
          />
        </div>

        <div>
          <label className="signup-label">
            <span className="signup-label-text">Password</span>
          </label>
          <input
            type="password"
            placeholder="Something Unique..."
            className="signup-input"
            value={inputs.password}
            onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
          />
        </div>

        <div>
          <label className="signup-label">
            <span className="signup-label-text">Confirm Password</span>
          </label>
          <input
            type="password"
            placeholder="Confirm Password"
            className="signup-input"
            value={inputs.confirmPassword}
            onChange={(e) =>
              setInputs({ ...inputs, confirmPassword: e.target.value })
            }
          />
        </div>

        <GenderCheckbox
          onCheckboxChange={handleCheckboxChange}
          selectedGender={inputs.gender}
        />

        <Link to="/login" className="signIn-link">
          Already have an account?
        </Link>

        <div>
          <button className="signup-button" disabled={loading}>
            {loading ? <span className="loading-spinner"></span> : "Sign Up"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
