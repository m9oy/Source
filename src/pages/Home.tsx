import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Flame, Star, Download, Coffee, Monitor, TrendingUp } from "lucide-react";
import ModSection from "@/components/ModSection";
import { getMods, Mod } from "@/lib/firestore";

export default function Home() {
  const [location] = useLocation();
  const params = new URLSearchParams(location.includes("?") ? location.split("?")[1] : "");
  const platform = params.get("platform") as "Java" | "Bedrock" | null;
  const type = params.get("type") || undefined;
  const sort = params.get("sort");

  const [latestMods, setLatestMods] = useState<Mod[]>([]);
  const [popularMods, setPopularMods] = useState<Mod[]>([]);
  const [javaMods, setJavaMods] = useState<Mod[]>([]);
  const [bedrockMods, setBedrockMods] = useState<Mod[]>([]);
  const [textureMods, setTextureMods] = useState<Mod[]>([]);
  const [mapMods, setMapMods] = useState<Mod[]>([]);
  const [skinMods, setSkinMods] = useState<Mod[]>([]);
  const [addonMods, setAddonMods] = useState<Mod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [latest, popular, java, bedrock, textures, maps, skins, addons] = await Promise.all([
          getMods({ limitCount: 12, orderByField: "createdAt", platform: platform || undefined }),
          getMods({ limitCount: 12, orderByField: "downloads", platform: platform || undefined }),
          getMods({ limitCount: 12, platform: "Java" }),
          getMods({ limitCount: 12, platform: "Bedrock" }),
          getMods({ limitCount: 12, type: "Texture Pack" }),
          getMods({ limitCount: 12, type: "Map" }),
          getMods({ limitCount: 12, type: "Skin" }),
          getMods({ limitCount: 12, type: "Add-on" }),
        ]);
        setLatestMods(latest);
        setPopularMods(popular);
        setJavaMods(java);
        setBedrockMods(bedrock);
        setTextureMods(textures);
        setMapMods(maps);
        setSkinMods(skins);
        setAddonMods(addons);
      } catch (e) {
        console.error("Failed to fetch mods:", e);
      }
      setLoading(false);
    };
    fetchAll();
  }, [platform, type, sort]);

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl mb-8 bg-[#0a0a0a] border border-[#1a1a1a]" style={{ background: "linear-gradient(135deg, #0a0000 0%, #150000 50%, #0a0000 100%)" }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(ellipse at 20% 50%, #FF0000 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, #FFA500 0%, transparent 60%)" }}
        />
        <div className="relative z-10 px-6 py-10 md:py-14 max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-orange-400 bg-orange-400/10 border border-orange-400/20 px-3 py-1 rounded-full">
              <TrendingUp size={12} /> Trending Mods
            </span>
          </div>
          <h1 className="font-orbitron text-3xl md:text-4xl font-bold text-white mb-3">
            Discover the Best
            <span className="text-gradient-red-orange block">Minecraft Mods</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-6">
            Download thousands of mods, texture packs, maps, and skins for Java and Bedrock Edition. Created by the community.
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-300 bg-[#111] border border-[#222] rounded-lg px-4 py-2.5">
              <Coffee size={14} className="text-orange-400" /> Java Edition
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300 bg-[#111] border border-[#222] rounded-lg px-4 py-2.5">
              <Monitor size={14} className="text-red-400" /> Bedrock Edition
            </div>
          </div>
        </div>
        {/* Decorative orbs */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden md:block opacity-20">
          <div className="w-48 h-48 rounded-full" style={{ background: "radial-gradient(circle, #FF4400 0%, transparent 70%)" }} />
        </div>
      </div>

      {/* Active filter indicator */}
      {(platform || type) && (
        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm text-gray-400">Filtering:</span>
          {platform && (
            <span className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border ${platform === "Java" ? "tag-java" : "tag-bedrock"}`}>
              {platform === "Java" ? <Coffee size={11} /> : <Monitor size={11} />}
              {platform} Edition
            </span>
          )}
          {type && (
            <span className="text-xs px-3 py-1 rounded-full border border-orange-400/30 text-orange-400 bg-orange-400/10">
              {type}
            </span>
          )}
        </div>
      )}

      {/* Sections */}
      <ModSection
        title="Latest Mods"
        mods={latestMods}
        viewAllHref="/search?sort=latest"
        loading={loading}
      />

      <ModSection
        title="Most Downloaded"
        mods={popularMods}
        viewAllHref="/search?sort=popular"
        loading={loading}
      />

      {!platform && (
        <>
          <ModSection
            title="Java Edition"
            mods={javaMods}
            viewAllHref="/search?platform=Java"
            loading={loading}
          />

          <ModSection
            title="Bedrock Edition"
            mods={bedrockMods}
            viewAllHref="/search?platform=Bedrock"
            loading={loading}
          />
        </>
      )}

      <ModSection
        title="Latest Textures"
        mods={textureMods}
        viewAllHref="/search?type=Texture+Pack"
        loading={loading}
      />

      <ModSection
        title="Latest Maps"
        mods={mapMods}
        viewAllHref="/search?type=Map"
        loading={loading}
      />

      <ModSection
        title="Latest Skins"
        mods={skinMods}
        viewAllHref="/search?type=Skin"
        loading={loading}
      />

      <ModSection
        title="Latest Add-ons"
        mods={addonMods}
        viewAllHref="/search?type=Add-on"
        loading={loading}
      />
    </div>
  );
}
