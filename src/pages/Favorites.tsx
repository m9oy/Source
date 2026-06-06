import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Heart, LogIn } from "lucide-react";
import ModCard from "@/components/ModCard";
import { getFavoriteMods, Mod } from "@/lib/firestore";
import { useAuth } from "@/contexts/AuthContext";

export default function Favorites() {
  const { user, userProfile } = useAuth();
  const [mods, setMods] = useState<Mod[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFavs = async () => {
    if (!userProfile?.favorites?.length) {
      setMods([]);
      return;
    }
    setLoading(true);
    try {
      const favMods = await getFavoriteMods(userProfile.favorites);
      setMods(favMods);
    } catch {
      setMods([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user && userProfile) fetchFavs();
  }, [user, userProfile]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
            <Heart size={32} className="text-red-400" />
          </div>
          <h2 className="font-rajdhani font-bold text-xl text-white mb-2">Your Favorites</h2>
          <p className="text-gray-500 text-sm mb-6">Sign in to save and view your favorite mods.</p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm"
            style={{ background: "linear-gradient(135deg, #FF0000, #FF4500)" }}
          >
            <LogIn size={16} />
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-orbitron font-bold text-2xl text-white mb-1">
            <span className="text-gradient-red-orange">My</span> Favorites
          </h1>
          <p className="text-gray-500 text-sm">{mods.length} saved mod{mods.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20">
          <Heart size={18} className="text-red-400" fill="currentColor" />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-xl overflow-hidden animate-pulse">
              <div className="aspect-[16/10] bg-[#161616]" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-[#161616] rounded w-3/4" />
                <div className="h-3 bg-[#161616] rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : mods.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Heart size={48} className="text-gray-700 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No favorites yet</h3>
          <p className="text-gray-500 text-sm max-w-sm mb-6">
            Browse mods and tap the heart icon to save them here.
          </p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm"
            style={{ background: "linear-gradient(135deg, #FF0000, #FF4500)" }}
          >
            Browse Mods
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {mods.map(mod => (
            <ModCard key={mod.id} mod={mod} onFavoriteToggle={fetchFavs} />
          ))}
        </div>
      )}
    </div>
  );
}
