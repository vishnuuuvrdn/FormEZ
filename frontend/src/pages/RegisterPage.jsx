import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, FileText } from "lucide-react";
import { useAuth } from "../utils/useAuth";
import { useToast } from "../utils/useToast";
import Input from "../components/Input";
import Button from "../components/Button";
import { ROUTES } from "../utils/constants";

export const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await register(username, email, password);
      toast.success("Administrator account registered and logged in successfully!");
      navigate(ROUTES.ADMIN_DASHBOARD);
    } catch (err) {
      setError(err.message || "Registration failed. Try again.");
      toast.error("Failed to register administrator account.");
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
          Register Admin Account
        </h2>
        <p className="text-xs text-text-secondary max-w-xs mx-auto leading-relaxed">
          Create administrative credentials to secure and customize the government document guide.
        </p>
      </div>

      {/* Register Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Username"
          type="text"
          placeholder="e.g. administrator"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

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
          placeholder="•••••••• (Min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
            <UserPlus size={15} /> Create Admin Profile
          </div>
        </Button>
      </form>

      {/* Login Toggle Link */}
      <div className="text-center pt-2 select-none">
        <p className="text-xs text-text-secondary leading-relaxed">
          Already have credentials?{" "}
          <Link
            to={ROUTES.LOGIN}
            className="font-bold text-accent hover:text-accent-hover transition-colors underline min-h-[44px] inline-flex items-center justify-center px-1"
          >
            Sign-In Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
