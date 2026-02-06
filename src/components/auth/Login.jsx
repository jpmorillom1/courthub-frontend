import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { ImageWithFallback } from "../common/ImageWithFallback";
import { useAuth } from "../../context/AuthContext";

export function Login() {
  const navigate = useNavigate();
  const { login, startGoogleOAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error || "Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    // start OAuth flow
    if (typeof startGoogleOAuth === "function") startGoogleOAuth();
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Column - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">
          {/* Logo centered */}
          <div className="flex justify-center mb-6">
            <ImageWithFallback
              src="https://aka-cdn.uce.edu.ec/ares/tmp/SIIU/anuncios/sello_400.png"
              alt="Sello UCE"
              className="w-24 h-24 object-contain"
            />
          </div>

          {/* Title centered */}
          <div className="mb-6 text-center">
            <h1 className="text-[#003f8f] text-2xl font-semibold mb-2">
              Sign in
            </h1>
            <p className="text-gray-600">
              Welcome back! Please enter your details.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm text-gray-700 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu.email@uce.edu.ec"
                  required
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cbab42] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cbab42] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-[#cbab42] border-gray-300 rounded focus:ring-[#cbab42]"
                />
                <span className="text-sm text-gray-700">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-[#003f8f] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#cbab42] hover:bg-[#b89935] text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            {/* Google login button */}
            <button
              type="button"
              onClick={handleGoogle}
              className="w-full py-3 bg-white border border-gray-300 text-gray-800 rounded-lg transition-colors hover:bg-gray-50"
            >
              Continue with Google
            </button>

            {/* Register Link */}
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-[#003f8f] hover:underline">
                Create account
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right Column - Illustration */}
      <div className="hidden lg:flex flex-1 bg-[#003f8f] items-center justify-center p-12 relative overflow-hidden">
        <div className="relative z-10 max-w-lg text-center">
          <div className="relative w-full h-[420px] md:h-[580px]">
            <ImageWithFallback
              src="https://i.ibb.co/Kc4Yx5rZ/Chat-GPT-Image-23-dic-2025-07-51-26-p-m.png"
              alt="Illustration"
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#cbab42]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#cbab42]/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
