import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShieldCheck, Mail, Lock, Eye, EyeOff, CircleAlert as AlertCircle, Loader as Loader2 } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const isSignup = location.pathname === "/signup";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/", { replace: true });
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate("/", { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Authentication failed";
      setError(msg === "Invalid login credentials" ? "Invalid email or password" : msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-bg-grid" />
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h1>SentinelIoT</h1>
            <p>Defence-Grade IoT Security Monitor</p>
          </div>
        </div>

        <div className="auth-security-badge">
          <span className="pill pill-success"><span className="pill-dot" />Classified — Authorized Personnel Only</span>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <h2>{isSignup ? "Create Operator Account" : "Secure Operator Login"}</h2>
          <p className="auth-subtitle">
            {isSignup
              ? "Register a new defence operator account"
              : "Authentication is required to access the monitoring system"}
          </p>

          {error && (
            <div className="auth-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="auth-field">
            <label>Operator Email</label>
            <div className="auth-input-wrap">
              <Mail size={16} className="auth-input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@defence.mil"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="auth-field">
            <label>Password</label>
            <div className="auth-input-wrap">
              <Lock size={16} className="auth-input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                minLength={6}
                autoComplete={isSignup ? "new-password" : "current-password"}
              />
              <button
                type="button"
                className="auth-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? <Loader2 size={18} className="spin" /> : isSignup ? "Create Account" : "Secure Login"}
          </button>

          <div className="auth-switch">
            {isSignup ? (
              <span>Already have an account? <button type="button" onClick={() => navigate("/login")}>Sign in</button></span>
            ) : (
              <span>Need operator access? <button type="button" onClick={() => navigate("/signup")}>Request account</button></span>
            )}
          </div>
        </form>

        <div className="auth-footer">
          <div className="auth-footer-item"><ShieldCheck size={13} /> End-to-end encrypted</div>
          <div className="auth-footer-item">Federated learning — no raw data leaves the edge</div>
        </div>
      </div>
    </div>
  );
}
