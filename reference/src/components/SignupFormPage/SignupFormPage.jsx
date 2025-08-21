import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { thunkSignup } from "../../redux/session";
import GoogleLoginButton from "../LoginFormPage/GoogleLoginButton";
import "./SignupFormPage.css";

function SignupFormPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  if (sessionUser) return <Navigate to="/" replace={true} />;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setErrors({
        confirmPassword: "Confirm Password must match Password.",
      });
    }

    const res = await dispatch(thunkSignup({ email, username, password }));

    if (res) {
      setErrors(res);
    } else {
      navigate("/userhome");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        {/* Left Side - Form */}
        <div className="signup-form-section">
          <h1 className="signup-title">
            Welcome to <span className="signup-brand">JobHatch</span>
          </h1>
          <p className="signup-subtitle">Create your account</p>

          {errors.server && (
            <div className="signup-error">{errors.server}</div>
          )}

          <form onSubmit={handleSubmit} className="signup-form">
            <input
              type="email"
              placeholder="Email"
              className="signup-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && (
              <p className="signup-input-error">{errors.email}</p>
            )}

            <input
              type="text"
              placeholder="Username"
              className="signup-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            {errors.username && (
              <p className="signup-input-error">{errors.username}</p>
            )}

            <input
              type="password"
              placeholder="Password"
              className="signup-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors.password && (
              <p className="signup-input-error">{errors.password}</p>
            )}

            <input
              type="password"
              placeholder="Confirm Password"
              className="signup-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {errors.confirmPassword && (
              <p className="signup-input-error">{errors.confirmPassword}</p>
            )}

            <button
              type="submit"
              className="signup-button"
            >
              Sign Up
            </button>

            <div className="signup-divider">
              <div className="signup-divider-line">
                <div className="signup-divider-border" />
              </div>
              <div className="signup-divider-text">
                <span className="signup-divider-bg">or</span>
              </div>
            </div>

            <div className="signup-google-container">
              <GoogleLoginButton />
            </div>
          </form>

          <p className="signup-login-link">
            Already have an account?{" "}
            <a
              href="/login"
              className="signup-link"
            >
              Log In
            </a>
          </p>
        </div>

        {/* Right Side - Decoration */}
        <div className="signup-decoration">
          <img
            src="/images/homepage-chick-offer.png"
            alt="Decoration"
            className="signup-decoration-image"
          />
        </div>
      </div>
    </div>
  );
}

export default SignupFormPage;


