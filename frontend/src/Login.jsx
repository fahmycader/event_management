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
        // ✅ Save token & role
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);

        if (onLogin) onLogin(data.token, data.role);

        // ✅ Redirect based on role
        if (data.role === "planner") {
          navigate("/dashboard");
        } else {
          // ✅ attendee logic
          const pendingEvent = localStorage.getItem("pendingEvent");

          if (pendingEvent) {
            navigate(`/event/${pendingEvent}`);
            localStorage.removeItem("pendingEvent"); // clear after use
          } else {
            navigate("/"); // ✅ Redirect to home instead of events
          }
        }
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Network error");
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-white">
      {/* ✅ Left Section */}
      <div className="d-flex flex-column justify-content-center px-5 w-50">
        <div className="d-flex align-items-center gap-2 mb-4">
          <img src="/logo.png" alt="Logo" style={{ height: "32px" }} />
          <span className="fs-4 fw-semibold text-dark">EventMate</span>
        </div>

        <h2 className="fs-1 fw-bold text-dark mb-2">Welcome Back 👋</h2>
        <p className="text-muted mb-4">
          EventMate – Where Every Event Begins With Insight.
        </p>

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

          {/* ✅ Forgot Password Link */}
          <div className="text-end mt-1">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="btn btn-link p-0 text-decoration-none"
              style={{ fontSize: "14px", color: "#6366F1" }}
            >
              🔑 Forgot Password?
            </button>
          </div>

          {error && <div className="text-danger text-center small">{error}</div>}

          <button
            type="submit"
            className="btn btn-dark fw-semibold rounded py-2 mt-2"
          >
            Sign in
          </button>

          <button
            type="button"
            className="btn btn-outline-secondary fw-semibold rounded py-2 mt-2"
            onClick={() => navigate("/register")}
          >
            Don’t have an account? Create Account
          </button>
        </form>
      </div>

      {/* ✅ Right Section */}
      <div className="position-relative w-50 d-flex align-items-center justify-content-center p-3">
        <img
          src="/login-side-image.png"
          alt="EventMate"
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ objectFit: "cover", height: "90%", borderRadius: "30px" }}
        />
        <div className="position-relative z-1 text-center">
          <img src="/logo.png" alt="Logo" className="mb-3" style={{ height: "64px" }} />
          <h1 className="fw-bold text-dark" style={{ fontSize: "3rem" }}>EventMate</h1>
        </div>
      </div>
    </div>
  );
}

export default Login;
