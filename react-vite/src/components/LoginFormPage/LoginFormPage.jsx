import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import GoogleLoginButton from "./GoogleLoginButton";
import "./LoginFormPage.css";

function LoginFormPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  if (sessionUser) return <Navigate to="/" replace={true} />;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      navigate("/userhome");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Log In</h1>

        {errors.server && (
          <div className="login-error">{errors.server}</div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="Email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && <p className="login-input-error">{errors.email}</p>}

          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errors.password && <p className="login-input-error">{errors.password}</p>}

          <button type="submit" className="login-button">
            Log In
          </button>
        </form>

        <div className="login-divider">
          <div className="login-divider-line">
            <div className="login-divider-border" />
          </div>
          <div className="login-divider-text">
            <span className="login-divider-bg">or</span>
          </div>
        </div>

        <div className="login-google-container">
          <GoogleLoginButton />
        </div>
      </div>
    </div>
  );
}

export default LoginFormPage;

