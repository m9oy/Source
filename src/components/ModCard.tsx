import { useState } from "react";
import { Link } from "wouter";
import { Download, Heart, Shield, Coffee, Monitor, Layers } from "lucide-react";
import { Mod, toggleFavorite } from "@/lib/firestore";
import { useAuth } from "@/contexts/AuthContext";

interface ModCardProps {
  mod: Mod;
  onFavoriteToggle?: () => void;
}

const typeColors: Record<string, string> = {
  "Texture Pack": "text-orange-400 bg-orange-400/10 border-orange-400/20",
  "Add-on": "text-red-400 bg-red-400/10 border-red-400/20",
  "Map": "text-blue-400 bg-blue-400/10 border-blue-400/20",
  "Skin": "text-purple-400 bg-purple-400/10 border-purple-400/20",
  "Shader": "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
  "Mod": "text-green-400 bg-green-400/10 border-green-400/20",
  "Other": "text-gray-400 bg-gray-400/10 border-gray-400/20",
};

export default function ModCard({ mod, onFavoriteToggle }: ModCardProps) {
  const { user, userProfile } = useAuth();
  const [isFav, setIsFav] = useState(
    userProfile?.favorites?.includes(mod.id) ?? false
  );
  const [favLoading, setFavLoading] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleFav = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    setFavLoading(true);
    const newFav = !isFav;
    setIsFav(newFav);
    try {
      await toggleFavorite(user.uid, mod.id, newFav);
      onFavoriteToggle?.();
    } catch {
      setIsFav(!newFav);
    }
    setFavLoading(false);
  };

  const typeClass = typeColors[mod.type] || typeColors["Other"];

  const placeholderImg = `https://placehold.co/400x240/111111/333333?text=${encodeURIComponent(mod.type)}`;

  return (
    <Link
      href={`/mod/${mod.id}`}
      data-testid={`card-mod-${mod.id}`}
      className="block group"
    >
      <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-xl overflow-hidden card-hover cursor-pointer">
        {/* Thumbnail */}
        <div className="relative aspect-[16/10] overflow-hidden bg-[#111]">
          <img
            src={imgError ? placeholderImg : (mod.images?.[0] || placeholderImg)}
            alt={mod.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Platform badge */}
          <div className="absolute top-2 left-2">
            {mod.platform === "Java" ? (
              <span className="tag-java flex items-center gap-1 text-xs px-2 py-0.5 rounded-md font-medium">
                <Coffee size={10} /> Java
              </span>
            ) : mod.platform === "Bedrock" ? (
              <span className="tag-bedrock flex items-center gap-1 text-xs px-2 py-0.5 rounded-md font-medium">
                <Monitor size={10} /> Bedrock
              </span>
            ) : (
              <span className="tag-both flex items-center gap-1 text-xs px-2 py-0.5 rounded-md font-medium">
                <Layers size={10} /> Both
              </span>
            )}
          </div>
          {/* Favorite btn */}
          {user && (
            <button
              data-testid={`button-fav-${mod.id}`}
              onClick={handleFav}
              disabled={favLoading}
              className={`absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-lg backdrop-blur-sm transition-all ${
                isFav
                  ? "bg-red-500/90 text-white"
                  : "bg-black/60 text-gray-400 hover:text-red-400 hover:bg-black/80"
              }`}
            >
              <Heart size={14} fill={isFav ? "currentColor" : "none"} />
            </button>
          )}
          {/* Download count overlay */}
          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-md px-2 py-0.5 text-xs text-gray-300">
            <Download size={10} />
            {(mod.downloads || 0).toLocaleString()}
          </div>
        </div>

        {/* Info */}
        <div className="p-3">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="text-sm font-semibold text-white leading-tight line-clamp-2 group-hover:text-red-400 transition-colors">
              {mod.title}
            </h3>
            {mod.verified && (
              <Shield size={13} className="text-green-400 flex-shrink-0 mt-0.5" />
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className={`text-xs px-2 py-0.5 rounded-md border font-medium ${typeClass}`}>
              {mod.type}
            </span>
            <span className="text-xs text-gray-500">{mod.authorName}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
