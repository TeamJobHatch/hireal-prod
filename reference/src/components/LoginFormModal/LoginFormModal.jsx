import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

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
      closeModal();
    }
  };

  return (
    <div className="login-modal-container">
      <h1 className="login-modal-title">Log In</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="login-form-group">
          <label className="login-form-label">Email</label>
          <input
            type="text"
            className="login-form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && <p className="login-error-message">{errors.email}</p>}
        </div>
        <div className="login-form-group">
          <label className="login-form-label">Password</label>
          <input
            type="password"
            className="login-form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errors.password && <p className="login-error-message">{errors.password}</p>}
        </div>
        <button type="submit" className="login-submit-button">Log In</button>
      </form>
    </div>
  );
}

export default LoginFormModal;
