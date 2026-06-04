import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, FileText } from "lucide-react";
import { useAuth } from "../utils/useAuth";
import { useToast } from "../utils/useToast";
import Input from "../components/Input";
import Button from "../components/Button";
import { ROUTES } from "../utils/constants";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back! Admin session initialized successfully.");
      navigate(ROUTES.ADMIN_DASHBOARD);
    } catch (err) {
      setError(err.message || "Failed to login. Please check credentials.");
      toast.error("Authentication failed. Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="text-center space-y-2 select-none">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-accent/10 border border-accent/20 rounded-2xl text-accent mb-2">
          <FileText size={22} strokeWidth={2.5} />
        </div>
        <h2 className="text-2xl font-serif font-black text-text-primary">
          Admin Portal Sign-In
        </h2>
        <p className="text-xs text-text-secondary max-w-xs mx-auto leading-relaxed">
          Access the FormEZ administrative control center to manage government guide documents.
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="e.g. admin@formez.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <div className="bg-[#FBF1F1] border border-danger/30 text-danger px-4 py-2.5 rounded-xl text-xs font-semibold leading-relaxed animate-fade-in">
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          loading={loading}
        >
          <div className="flex items-center justify-center gap-2">
            <LogIn size={15} /> Authenticate
          </div>
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
