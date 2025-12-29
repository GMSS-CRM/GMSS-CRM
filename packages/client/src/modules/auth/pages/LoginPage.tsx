import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { loginWithEmailPassword } from "../services/auth.service";
import { useAuth } from "../../../app/providers/AuthProvider";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      await loginWithEmailPassword(email, password);
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <p>Checking authentication...</p>;

  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div style={{ maxWidth: 360, margin: "100px auto" }}>
      <h2>GMSS CRM Login</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}
