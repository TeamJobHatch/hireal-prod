import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkSignup } from "../../redux/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setErrors({
        confirmPassword:
          "Confirm Password field must be the same as the Password field",
      });
    }

    const serverResponse = await dispatch(
      thunkSignup({
        email,
        username,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  return (
    <div className="signup-modal-container">
      <h1 className="signup-modal-title">Sign Up</h1>
      {errors.server && <p className="signup-server-error">{errors.server}</p>}
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="signup-form-group">
          <label className="signup-form-label">Email</label>
          <input
            type="text"
            className="signup-form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && <p className="signup-error-message">{errors.email}</p>}
        </div>
        <div className="signup-form-group">
          <label className="signup-form-label">Username</label>
          <input
            type="text"
            className="signup-form-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {errors.username && <p className="signup-error-message">{errors.username}</p>}
        </div>
        <div className="signup-form-group">
          <label className="signup-form-label">Password</label>
          <input
            type="password"
            className="signup-form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errors.password && <p className="signup-error-message">{errors.password}</p>}
        </div>
        <div className="signup-form-group">
          <label className="signup-form-label">Confirm Password</label>
          <input
            type="password"
            className="signup-form-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {errors.confirmPassword && <p className="signup-error-message">{errors.confirmPassword}</p>}
        </div>
        <button type="submit" className="signup-submit-button">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;
