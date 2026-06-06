import { Link } from "wouter";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <div className="font-orbitron font-black text-8xl mb-4" style={{ background: "linear-gradient(135deg, #FF0000, #FFA500)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          404
        </div>
        <h1 className="font-rajdhani font-bold text-2xl text-white mb-2">Page Not Found</h1>
        <p className="text-gray-500 text-sm mb-8 max-w-sm">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #FF0000, #FF4500)" }}
        >
          <Home size={16} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
