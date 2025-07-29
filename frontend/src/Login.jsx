import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        onLogin(data.token);
        navigate("/dashboard"); //  redirect to dashboard
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Network error");
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-white">
      
      {/* ✅ LEFT SIDE - Login Form */}
      <div className="d-flex flex-column justify-content-center px-5 w-50">
        
        {/* 🔹 Logo & App Name */}
        <div className="d-flex align-items-center gap-2 mb-4">
          <img src="/logo.png" alt="Logo" style={{ height: "32px", width: "auto" }} />
          <span className="fs-4 fw-semibold text-dark">Eventure</span>
        </div>

        {/* 🔹 Title & Welcome Text */}
        <h2 className="fs-1 fw-bold text-dark mb-2">Welcome Back 👋</h2>
        <p className="text-muted mb-4">
          Eventure – Where Every Event Begins With Insight.
        </p>

        {/* 🔹 Login Form */}
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <div>
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control rounded"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control rounded"
              placeholder="at least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Forgot Password */}
          <div className="text-end">
            <a href="/forgot-password" className="text-decoration-none text-primary">
              Forgot Password?
            </a>
          </div>

          {/* Error Message */}
          {error && <div className="text-danger text-center small">{error}</div>}

          {/* Sign in Button */}
          <button type="submit" className="btn btn-dark fw-semibold rounded py-2 mt-2">
            Sign in
          </button>

          {/* ✅ Link to Register */}
          <button
            type="button"
            className="btn btn-outline-secondary fw-semibold rounded py-2 mt-2"
            onClick={() => navigate("/register")}
          >
            Don’t have an account? Create Account
          </button>
        </form>

        {/* 🔹 Footer */}
        <p className="mt-5 text-muted small">© 2025 ALL RIGHTS RESERVED</p>
      </div>

      {/* ✅ RIGHT SIDE - Image & Overlay */}
      <div className="position-relative w-50 d-flex align-items-center justify-content-center p-3">
        <img
          src="/login-side-image.png"
          alt="Eventure"
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            objectFit: "cover",
            height: "90%",
            borderRadius: "30px",
          }}
        />
        <div className="position-relative z-1 text-center">
          <img src="/logo.png" alt="Logo" className="mb-3" style={{ height: "64px", width: "auto" }} />
          <h1 className="fw-bold text-dark" style={{ fontSize: "3rem" }}>Eventure</h1>
        </div>
      </div>
    </div>
  );
}

export default Login;
