import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Eye, EyeOff, UserPlus, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import logoPath from "@assets/zeox_logo.png";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
      <path d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z" fill="#FFC107"/>
      <path d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" fill="#FF3D00"/>
      <path d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.4 35.4 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" fill="#4CAF50"/>
      <path d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.4 4.2-4.4 5.5l6.2 5.2C36.9 37.2 44 32 44 24c0-1.2-.1-2.3-.4-3.5z" fill="#1976D2"/>
    </svg>
  );
}

export default function Register() {
  const [, setLocation] = useLocation();
  const { signUp, signInWithGoogle } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (displayName.trim().length < 2) {
      setError("Username must be at least 2 characters.");
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password, displayName.trim());
      setLocation("/");
    } catch (err: unknown) {
      const e = err as { code?: string };
      if (e?.code === "auth/email-already-in-use") {
        setError("This email is already in use. Try signing in.");
      } else if (e?.code === "auth/invalid-email") {
        setError("Invalid email address.");
      } else if (e?.code === "auth/weak-password") {
        setError("Password is too weak. Use at least 6 characters.");
      } else {
        setError("Registration failed. Please try again.");
      }
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      setLocation("/");
    } catch (err: unknown) {
      const e = err as { code?: string };
      if (e?.code !== "auth/popup-closed-by-user") {
        setError("Google sign-in failed. Please try again.");
      }
    }
    setGoogleLoading(false);
  };

  const passwordStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabels = ["", "Weak", "Good", "Strong"];
  const strengthColors = ["", "text-red-400", "text-yellow-400", "text-green-400"];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <img src={logoPath} alt="Zeox" className="w-16 h-16 object-contain mb-3" />
          <h1 className="font-orbitron font-bold text-2xl text-gradient-red-orange">ZEOX</h1>
          <p className="text-gray-500 text-sm mt-1">Join the community</p>
        </div>

        <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl p-6">
          <h2 className="font-rajdhani font-bold text-xl text-white mb-5">Create Account</h2>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 mb-4 text-sm text-red-400">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl font-bold text-white text-sm border border-[#2a2a2a] bg-[#111] hover:bg-[#181818] transition-all disabled:opacity-60 mb-4"
          >
            {googleLoading ? (
              <span className="animate-pulse">Signing in...</span>
            ) : (
              <>
                <GoogleIcon />
                Sign up with Google
              </>
            )}
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-[#1e1e1e]" />
            <span className="text-xs text-gray-600">or with email</span>
            <div className="flex-1 h-px bg-[#1e1e1e]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1.5">Username</label>
              <input
                type="text"
                placeholder="YourUsername"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                required
                className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/20 transition-all"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1.5">Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/20 transition-all"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-3 pr-10 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {password && (
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3].map(level => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          passwordStrength >= level
                            ? level === 1 ? "bg-red-500" : level === 2 ? "bg-yellow-500" : "bg-green-500"
                            : "bg-[#222]"
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-xs font-medium ${strengthColors[passwordStrength]}`}>
                    {strengthLabels[passwordStrength]}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1.5">Confirm Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Repeat password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  required
                  className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-3 pr-10 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/20 transition-all"
                />
                {confirm && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {confirm === password ? (
                      <CheckCircle size={15} className="text-green-400" />
                    ) : (
                      <AlertCircle size={15} className="text-red-400" />
                    )}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90 disabled:opacity-60 mt-2"
              style={{ background: "linear-gradient(135deg, #FF0000, #FF4500)" }}
            >
              {loading ? (
                <span className="animate-pulse">Creating account...</span>
              ) : (
                <>
                  <UserPlus size={16} />
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-[#1a1a1a] text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="text-red-400 hover:text-orange-400 font-medium transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-700 mt-6">
          zeox. add ons - official website
        </p>
      </div>
    </div>
  );
}
