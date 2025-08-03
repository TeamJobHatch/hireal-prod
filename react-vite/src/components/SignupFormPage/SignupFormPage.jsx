import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { thunkSignup } from "../../redux/session";
import GoogleLoginButton from "../LoginFormPage/GoogleLoginButton";

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
      navigate("/congratulations");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full flex">
        {/* Left Side - Form */}
        <div className="flex-1 p-8 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to <span className="text-orange-500">JobHatch</span>
          </h1>
          <p className="text-sm text-gray-600 mb-6">Create your account</p>

          {errors.server && (
            <div className="mb-4 text-red-600 text-sm">{errors.server}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && (
              <p className="text-red-600 text-xs">{errors.email}</p>
            )}

            <input
              type="text"
              placeholder="Username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            {errors.username && (
              <p className="text-red-600 text-xs">{errors.username}</p>
            )}

            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors.password && (
              <p className="text-red-600 text-xs">{errors.password}</p>
            )}

            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {errors.confirmPassword && (
              <p className="text-red-600 text-xs">{errors.confirmPassword}</p>
            )}

            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
            >
              Sign Up
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">or</span>
              </div>
            </div>

            {/* 替换为 GoogleLoginButton 组件 */}
            <div className="w-full">
              <GoogleLoginButton />
            </div>
          </form>

          <p className="mt-4 text-xs text-center text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-orange-500 hover:underline font-medium"
            >
              Log In
            </a>
          </p>
        </div>

        {/* Right Side - Decoration */}
        <div className="flex-1 bg-gradient-to-br from-blue-300 to-blue-500 hidden md:flex items-center justify-center">
          <img
            src="/images/homepage-chick-offer.png"
            alt="Decoration"
            className="w-64 h-64 object-contain"
          />
        </div>
      </div>
    </div>
  );
}

export default SignupFormPage;


