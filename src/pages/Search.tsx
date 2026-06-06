import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { Search, Filter, SlidersHorizontal, Coffee, Monitor, X } from "lucide-react";
import ModCard from "@/components/ModCard";
import { searchModsByTitle, getMods, Mod } from "@/lib/firestore";

const MOD_TYPES = ["All", "Texture Pack", "Add-on", "Map", "Skin", "Shader", "Mod", "Other"];
const PLATFORMS = ["All", "Java", "Bedrock", "Both"];

export default function SearchPage() {
  const [location] = useLocation();
  const params = new URLSearchParams(location.includes("?") ? location.split("?")[1] : "");
  const initialQuery = params.get("q") || "";
  const initialSort = params.get("sort") || "latest";
  const initialPlatform = params.get("platform") || "All";
  const initialType = params.get("type") || "All";

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [platform, setPlatform] = useState(initialPlatform);
  const [type, setType] = useState(initialType);
  const [sort, setSort] = useState(initialSort);
  const [mods, setMods] = useState<Mod[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const fetchMods = async () => {
      setLoading(true);
      try {
        let results: Mod[];
        if (debouncedQuery.trim()) {
          results = await searchModsByTitle(debouncedQuery);
        } else {
          results = await getMods({
            limitCount: 100,
            orderByField: sort === "popular" ? "downloads" : "createdAt",
            platform: platform !== "All" ? platform as "Java" | "Bedrock" : undefined,
            type: type !== "All" ? type : undefined,
          });
        }

        // Client-side filtering
        let filtered = results;
        if (platform !== "All") {
          filtered = filtered.filter(m => m.platform === platform || m.platform === "Both");
        }
        if (type !== "All") {
          filtered = filtered.filter(m => m.type === type);
        }

        // Sort
        if (sort === "popular") {
          filtered.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
        } else {
          filtered.sort((a, b) => {
            const ta = a.createdAt?.toDate?.()?.getTime?.() || 0;
            const tb = b.createdAt?.toDate?.()?.getTime?.() || 0;
            return tb - ta;
          });
        }

        setMods(filtered);
      } catch (e) {
        console.error("Search error:", e);
        setMods([]);
      }
      setLoading(false);
    };
    fetchMods();
  }, [debouncedQuery, platform, type, sort]);

  const clearFilters = () => {
    setQuery("");
    setPlatform("All");
    setType("All");
    setSort("latest");
  };

  const hasFilters = platform !== "All" || type !== "All" || sort !== "latest" || query;

  return (
    <div>
      {/* Search Header */}
      <div className="mb-6">
        <h1 className="font-orbitron font-bold text-2xl text-white mb-4">
          <span className="text-gradient-red-orange">Browse</span> Mods
        </h1>

        <div className="flex gap-3">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              data-testid="input-main-search"
              type="search"
              placeholder="Search mods, textures, maps..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full bg-[#0e0e0e] border border-[#222] rounded-xl pl-10 pr-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/20 transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <button
            data-testid="button-toggle-filters"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border transition-all ${
              showFilters || hasFilters
                ? "bg-red-500/15 border-red-500/30 text-red-400"
                : "bg-[#0e0e0e] border-[#222] text-gray-400 hover:text-white hover:border-[#333]"
            }`}
          >
            <SlidersHorizontal size={15} />
            <span className="hidden sm:block">Filters</span>
            {hasFilters && <span className="w-1.5 h-1.5 rounded-full bg-red-500" />}
          </button>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="mt-3 bg-[#0e0e0e] border border-[#1a1a1a] rounded-xl p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Platform */}
              <div>
                <label className="text-xs text-gray-500 font-medium mb-2 block">Platform</label>
                <div className="flex flex-wrap gap-1.5">
                  {PLATFORMS.map(p => (
                    <button
                      key={p}
                      data-testid={`button-platform-${p.toLowerCase()}`}
                      onClick={() => setPlatform(p)}
                      className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                        platform === p
                          ? "bg-red-500/20 border-red-500/40 text-red-400"
                          : "bg-[#111] border-[#222] text-gray-400 hover:text-white hover:border-[#333]"
                      }`}
                    >
                      {p === "Java" && <Coffee size={10} />}
                      {p === "Bedrock" && <Monitor size={10} />}
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type */}
              <div className="sm:col-span-1">
                <label className="text-xs text-gray-500 font-medium mb-2 block">Type</label>
                <div className="flex flex-wrap gap-1.5">
                  {MOD_TYPES.map(t => (
                    <button
                      key={t}
                      data-testid={`button-type-${t.toLowerCase().replace(/\s+/g, "-")}`}
                      onClick={() => setType(t)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
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

              {/* Sort */}
              <div>
                <label className="text-xs text-gray-500 font-medium mb-2 block">Sort By</label>
                <div className="flex gap-1.5">
                  {[
                    { value: "latest", label: "Latest" },
                    { value: "popular", label: "Most Downloaded" },
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setSort(value)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                        sort === value
                          ? "bg-red-500/20 border-red-500/40 text-red-400"
                          : "bg-[#111] border-[#222] text-gray-400 hover:text-white hover:border-[#333]"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-gray-500 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <X size={12} /> Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {loading ? "Searching..." : `${mods.length} mod${mods.length !== 1 ? "s" : ""} found`}
        </p>
        {debouncedQuery && (
          <p className="text-sm text-gray-500">
            Results for <span className="text-red-400">"{debouncedQuery}"</span>
          </p>
        )}
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {Array.from({ length: 15 }).map((_, i) => (
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
          <Search size={48} className="text-gray-700 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No mods found</h3>
          <p className="text-gray-500 text-sm max-w-sm">
            {debouncedQuery
              ? `No results for "${debouncedQuery}". Try different keywords or clear filters.`
              : "No mods match the selected filters. Try adjusting your search."}
          </p>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="mt-4 text-sm text-red-500 hover:text-orange-400 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {mods.map(mod => (
            <ModCard key={mod.id} mod={mod} />
          ))}
        </div>
      )}
    </div>
  );
}
