import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("attendee"); // ✅ Default role
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }), // ✅ send role to backend
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(`✅ Registration successful as ${role}! Please login.`);
        setEmail("");
        setPassword("");
        setRole("attendee");
      } else {
        setError(data.error || "Registration failed");
      }
    } catch {
      setError("Network error");
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-white">
      <div className="d-flex flex-column justify-content-center px-5 w-50">
        <div className="d-flex align-items-center gap-2 mb-4">
          <img src="/logo.png" alt="Logo" style={{ height: "32px" }} />
          <span className="fs-4 fw-semibold text-dark">Eventure</span>
        </div>

        <h2 className="fs-1 fw-bold text-dark mb-2">Create Account ✨</h2>
        <p className="text-muted mb-4">Join Eventure today and plan or attend events.</p>

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

          {/* ✅ Role Selection */}
          <div>
            <label className="form-label">Role</label>
            <select
              className="form-control rounded"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="attendee">🎟 Attendee</option>
              <option value="planner">📅 Event Planner</option>
            </select>
          </div>

          {error && <div className="alert alert-danger py-1 text-center">{error}</div>}
          {success && <div className="alert alert-success py-1 text-center">{success}</div>}

          <button type="submit" className="btn btn-primary fw-semibold rounded py-2 mt-2">
            Register
          </button>

          <button
            type="button"
            className="btn btn-outline-secondary fw-semibold rounded py-2 mt-2"
            onClick={() => navigate("/login")}
          >
            Already have an account? Log in
          </button>
        </form>
      </div>

      <div className="position-relative w-50 d-flex align-items-center justify-content-center p-3">
        <img src="/login-side-image.png" alt="Eventure" className="position-absolute top-0 start-0 w-100 h-100" style={{ objectFit: "cover", height: "90%", borderRadius: "30px" }} />
        <div className="position-relative z-1 text-center">
          <img src="/logo.png" alt="Logo" className="mb-3" style={{ height: "64px" }} />
          <h1 className="fw-bold text-dark" style={{ fontSize: "3rem" }}>Eventure</h1>
        </div>
      </div>
    </div>
  );
}

export default Register;
