import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Upload, Plus, X, AlertCircle, CheckCircle, Image, Link2, Coffee, Monitor, Layers } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { createMod } from "@/lib/firestore";
import { useToast } from "@/hooks/use-toast";

const MOD_TYPES = ["Add-on", "Texture Pack", "Map", "Skin", "Shader", "Mod", "Other"];
const PLATFORMS = [
  { value: "Java", label: "Java Edition", icon: Coffee },
  { value: "Bedrock", label: "Bedrock Edition", icon: Monitor },
  { value: "Both", label: "Both Editions", icon: Layers },
];

export default function UploadMod() {
  const { user, userProfile } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Add-on");
  const [platform, setPlatform] = useState<"Java" | "Bedrock" | "Both">("Bedrock");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [price, setPrice] = useState("Free");
  const [imageUrls, setImageUrls] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl p-10 max-w-sm w-full">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
            <Upload size={24} className="text-red-400" />
          </div>
          <h2 className="font-rajdhani font-bold text-xl text-white mb-2">Sign In Required</h2>
          <p className="text-gray-500 text-sm mb-6">You must be signed in to publish mods.</p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm"
            style={{ background: "linear-gradient(135deg, #FF0000, #FF4500)" }}
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const addImageUrl = () => setImageUrls(prev => [...prev, ""]);
  const removeImageUrl = (i: number) => setImageUrls(prev => prev.filter((_, idx) => idx !== i));
  const updateImageUrl = (i: number, val: string) => setImageUrls(prev => prev.map((u, idx) => idx === i ? val : u));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) { setError("Title is required."); return; }
    if (!description.trim()) { setError("Description is required."); return; }
    if (title.trim().length < 3) { setError("Title must be at least 3 characters."); return; }
    if (description.trim().length < 20) { setError("Description must be at least 20 characters."); return; }

    setLoading(true);
    try {
      const validImages = imageUrls.filter(u => u.trim() && (u.startsWith("http://") || u.startsWith("https://")));

      const id = await createMod({
        title: title.trim(),
        description: description.trim(),
        type: type as never,
        platform: platform as never,
        images: validImages,
        downloadUrl: downloadUrl.trim(),
        fileSize: fileSize.trim() || "Unknown",
        price: price.trim() || "Free",
        authorId: user.uid,
        authorName: user.displayName || user.email || "Anonymous",
      });

      setSuccess(true);
      toast({ title: "Mod published!", description: `${title} is now live on Zeox.` });
      setTimeout(() => setLocation(`/mod/${id}`), 1500);
    } catch (err) {
      console.error(err);
      setError("Failed to publish mod. Please try again.");
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-400" />
          </div>
          <h2 className="font-orbitron font-bold text-2xl text-white mb-2">Published!</h2>
          <p className="text-gray-400 text-sm">Your mod is now live. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="font-orbitron font-bold text-2xl text-white mb-1">
          <span className="text-gradient-red-orange">Publish</span> a Mod
        </h1>
        <p className="text-gray-500 text-sm">Share your Minecraft creation with the community.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-6 text-sm text-red-400">
          <AlertCircle size={15} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-xl p-5 space-y-4">
          <h3 className="font-rajdhani font-bold text-base text-white">Basic Info</h3>

          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1.5">Mod Title *</label>
            <input
              data-testid="input-mod-title"
              type="text"
              placeholder="e.g. Ultra Realistic Shaders v2.0"
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={100}
              required
              className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/20 transition-all"
            />
            <p className="text-xs text-gray-600 mt-1">{title.length}/100</p>
          </div>

          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1.5">Description *</label>
            <textarea
              data-testid="input-mod-description"
              placeholder="Describe your mod in detail. What does it do? What's included? Any requirements?"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={5}
              required
              className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/20 transition-all resize-none"
            />
            <p className="text-xs text-gray-600 mt-1">Min. 20 characters</p>
          </div>
        </div>

        {/* Type + Platform */}
        <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-xl p-5 space-y-4">
          <h3 className="font-rajdhani font-bold text-base text-white">Category</h3>

          <div>
            <label className="text-xs text-gray-500 font-medium block mb-2">Mod Type *</label>
            <div className="flex flex-wrap gap-2">
              {MOD_TYPES.map(t => (
                <button
                  key={t}
                  type="button"
                  data-testid={`button-type-${t.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={() => setType(t)}
                  className={`text-sm px-4 py-2 rounded-lg border font-medium transition-all ${
                    type === t
                      ? "bg-orange-500/20 border-orange-500/40 text-orange-400"
                      : "bg-[#111] border-[#222] text-gray-400 hover:text-white hover:border-[#333]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 font-medium block mb-2">Platform *</label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  data-testid={`button-platform-${value.toLowerCase()}`}
                  onClick={() => setPlatform(value as never)}
                  className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg border font-medium transition-all ${
                    platform === value
                      ? "bg-red-500/20 border-red-500/40 text-red-400"
                      : "bg-[#111] border-[#222] text-gray-400 hover:text-white hover:border-[#333]"
                  }`}
                >
                  <Icon size={13} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-rajdhani font-bold text-base text-white flex items-center gap-2">
              <Image size={16} className="text-gray-500" />
              Screenshots (URLs)
            </h3>
            <button
              type="button"
              onClick={addImageUrl}
              className="flex items-center gap-1.5 text-xs text-red-400 hover:text-orange-400 transition-colors"
            >
              <Plus size={12} /> Add Image
            </button>
          </div>

          <p className="text-xs text-gray-600">Add image URLs (Imgur, Discord CDN, etc.) for screenshots of your mod.</p>

          <div className="space-y-2">
            {imageUrls.map((url, i) => (
              <div key={i} className="flex gap-2">
                <div className="relative flex-1">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={13} />
                  <input
                    type="url"
                    placeholder="https://i.imgur.com/..."
                    value={url}
                    onChange={e => updateImageUrl(i, e.target.value)}
                    className="w-full bg-[#111] border border-[#222] rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/20 transition-all"
                  />
                </div>
                {imageUrls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageUrl(i)}
                    className="w-10 flex items-center justify-center rounded-xl bg-[#111] border border-[#222] text-gray-500 hover:text-red-400 hover:border-red-500/30 transition-all"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Download + Pricing */}
        <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-xl p-5 space-y-4">
          <h3 className="font-rajdhani font-bold text-base text-white">Download Info</h3>

          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1.5">Download URL</label>
            <input
              data-testid="input-download-url"
              type="url"
              placeholder="https://mediafire.com/..."
              value={downloadUrl}
              onChange={e => setDownloadUrl(e.target.value)}
              className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/20 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1.5">File Size</label>
              <input
                data-testid="input-file-size"
                type="text"
                placeholder="e.g. 2.5 MB"
                value={fileSize}
                onChange={e => setFileSize(e.target.value)}
                className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/20 transition-all"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1.5">Price</label>
              <input
                data-testid="input-price"
                type="text"
                placeholder="Free"
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/20 transition-all"
              />
            </div>
          </div>
        </div>

        <button
          data-testid="button-publish"
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90 disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #FF0000, #FF4500)" }}
        >
          {loading ? (
            <span className="animate-pulse">Publishing...</span>
          ) : (
            <>
              <Upload size={16} />
              Publish Mod
            </>
          )}
        </button>
      </form>
    </div>
  );
}
