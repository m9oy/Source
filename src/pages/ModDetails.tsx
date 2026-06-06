import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import {
  Download, Heart, Share2, Flag, Shield, Coffee, Monitor,
  HardDrive, Tag, User, Calendar, Layers, Trash2, ChevronLeft
} from "lucide-react";
import ImageGallery from "@/components/ImageGallery";
import ModCard from "@/components/ModCard";
import { getMod, getRelatedMods, incrementDownloads, toggleFavorite, deleteMod, Mod } from "@/lib/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function ModDetails() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { user, userProfile } = useAuth();
  const { toast } = useToast();

  const [mod, setMod] = useState<Mod | null>(null);
  const [related, setRelated] = useState<Mod[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchMod = async () => {
      setLoading(true);
      try {
        const [modData, relatedData] = await Promise.all([
          getMod(id),
          getMod(id).then(m => m ? getRelatedMods(m) : []),
        ]);
        setMod(modData);
        setRelated(relatedData);
        if (modData && userProfile?.favorites?.includes(modData.id)) {
          setIsFav(true);
        }
      } catch {
        toast({ title: "Error", description: "Failed to load mod", variant: "destructive" });
      }
      setLoading(false);
    };
    fetchMod();
  }, [id, userProfile]);

  const handleDownload = async () => {
    if (!mod) return;
    setDownloading(true);
    try {
      await incrementDownloads(mod.id);
      if (mod.downloadUrl) {
        window.open(mod.downloadUrl, "_blank");
      }
      toast({ title: "Download started!", description: `Downloading ${mod.title}` });
    } catch {
      toast({ title: "Error", description: "Download failed", variant: "destructive" });
    }
    setDownloading(false);
  };

  const handleFav = async () => {
    if (!user || !mod) {
      toast({ title: "Sign in required", description: "Please sign in to save favorites" });
      return;
    }
    const newFav = !isFav;
    setIsFav(newFav);
    try {
      await toggleFavorite(user.uid, mod.id, newFav);
      toast({ title: newFav ? "Added to favorites" : "Removed from favorites" });
    } catch {
      setIsFav(!newFav);
    }
  };

  const handleShare = async () => {
    if (!mod) return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast({ title: "Link copied!", description: "Share link copied to clipboard" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Link", description: window.location.href });
    }
  };

  const handleDelete = async () => {
    if (!mod || !userProfile?.isAdmin) return;
    if (!confirm(`Delete "${mod.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await deleteMod(mod.id);
      toast({ title: "Mod deleted", description: `${mod.title} has been removed` });
      setLocation("/");
    } catch {
      toast({ title: "Error", description: "Failed to delete mod", variant: "destructive" });
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto animate-pulse space-y-4">
        <div className="h-8 bg-[#161616] rounded w-1/3" />
        <div className="aspect-video bg-[#161616] rounded-xl" />
        <div className="h-6 bg-[#161616] rounded w-1/2" />
        <div className="h-4 bg-[#161616] rounded w-full" />
        <div className="h-4 bg-[#161616] rounded w-3/4" />
      </div>
    );
  }

  if (!mod) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-6xl mb-4">😵</div>
        <h2 className="text-xl font-bold text-white mb-2">Mod not found</h2>
        <p className="text-gray-500 mb-6">This mod may have been removed or doesn't exist.</p>
        <Link href="/" className="text-red-500 hover:text-orange-400 flex items-center gap-2 transition-colors">
          <ChevronLeft size={16} /> Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back button */}
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white mb-6 transition-colors group">
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Mods
      </Link>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left: Gallery + Description */}
        <div className="md:col-span-2 space-y-6">
          <ImageGallery images={mod.images || []} title={mod.title} />

          {/* Description */}
          <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-xl p-5">
            <h3 className="font-rajdhani font-bold text-lg text-white mb-3 flex items-center gap-2">
              <div className="w-1 h-5 bg-gradient-to-b from-red-600 to-orange-500 rounded-full" />
              Description
            </h3>
            <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
              {mod.description || "No description provided."}
            </div>
          </div>

          {/* Related Mods */}
          {related.length > 0 && (
            <div>
              <h3 className="font-rajdhani font-bold text-lg text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-red-600 to-orange-500 rounded-full" />
                Related Mods
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {related.map(m => <ModCard key={m.id} mod={m} />)}
              </div>
            </div>
          )}
        </div>

        {/* Right: Info Panel */}
        <div className="space-y-4">
          {/* Title & Type */}
          <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-xl p-5">
            <div className="flex items-start justify-between gap-2 mb-3">
              <span className={`text-xs px-2 py-1 rounded-md font-semibold border ${
                mod.platform === "Java" ? "tag-java" : mod.platform === "Bedrock" ? "tag-bedrock" : "tag-both"
              }`}>
                {mod.platform === "Java" ? "☕" : mod.platform === "Bedrock" ? "⬜" : "⚡"} {mod.platform}
              </span>
              <span className="text-xs px-2 py-1 rounded-md bg-orange-400/10 border border-orange-400/20 text-orange-400 font-medium">
                {mod.type}
              </span>
            </div>
            <h1 className="font-bold text-xl text-white mb-2 leading-tight">{mod.title}</h1>
            {mod.verified && (
              <div className="flex items-center gap-1.5 text-green-400 text-xs font-medium mb-3">
                <Shield size={13} />
                <span>Verified by Zeox</span>
              </div>
            )}

            {/* Download Button */}
            <button
              data-testid="button-download"
              onClick={handleDownload}
              disabled={downloading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white text-sm transition-all glow-red"
              style={{ background: "linear-gradient(135deg, #FF0000, #FF4500)" }}
            >
              {downloading ? (
                <span className="animate-pulse">Downloading...</span>
              ) : (
                <>
                  <Download size={16} />
                  Download{mod.price !== "Free" ? ` — ${mod.price}` : " — Free"}
                </>
              )}
            </button>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-3">
              <button
                data-testid="button-favorite"
                onClick={handleFav}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium border transition-all ${
                  isFav
                    ? "bg-red-500/15 border-red-500/30 text-red-400"
                    : "bg-[#111] border-[#222] text-gray-400 hover:text-red-400 hover:border-red-500/30"
                }`}
              >
                <Heart size={14} fill={isFav ? "currentColor" : "none"} />
                {isFav ? "Saved" : "Save"}
              </button>
              <button
                data-testid="button-share"
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium bg-[#111] border border-[#222] text-gray-400 hover:text-white hover:border-[#333] transition-all"
              >
                <Share2 size={14} />
                {copied ? "Copied!" : "Share"}
              </button>
              <button
                data-testid="button-report"
                title="Report mod"
                className="w-10 flex items-center justify-center rounded-lg text-sm font-medium bg-[#111] border border-[#222] text-gray-500 hover:text-yellow-500 hover:border-yellow-500/30 transition-all"
              >
                <Flag size={14} />
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-xl p-5 space-y-3">
            <h3 className="font-rajdhani font-bold text-base text-white">Details</h3>
            {[
              { icon: HardDrive, label: "File Size", value: mod.fileSize || "Unknown" },
              { icon: Tag, label: "Price", value: mod.price || "Free" },
              { icon: Download, label: "Downloads", value: (mod.downloads || 0).toLocaleString() },
              { icon: User, label: "Author", value: mod.authorName || "Unknown" },
              {
                icon: Calendar,
                label: "Uploaded",
                value: mod.createdAt?.toDate?.()
                  ? new Date(mod.createdAt.toDate()).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                  : "Recently",
              },
              { icon: Layers, label: "Gallery", value: `${(mod.images || []).length} photos` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <Icon size={13} />
                  {label}
                </div>
                <span className="text-gray-200 font-medium">{value}</span>
              </div>
            ))}
          </div>

          {/* Admin: Delete */}
          {userProfile?.isAdmin && (
            <button
              data-testid="button-admin-delete"
              onClick={handleDelete}
              disabled={deleting}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all"
            >
              <Trash2 size={14} />
              {deleting ? "Deleting..." : "Delete Mod (Admin)"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
