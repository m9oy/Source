import { useRef } from "react";
import { Link } from "wouter";
import { ChevronRight, ChevronLeft } from "lucide-react";
import ModCard from "./ModCard";
import { Mod } from "@/lib/firestore";

interface ModSectionProps {
  title: string;
  mods: Mod[];
  viewAllHref?: string;
  loading?: boolean;
}

function ModCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-52 md:w-60">
      <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-xl overflow-hidden animate-pulse">
        <div className="aspect-[16/10] bg-[#161616]" />
        <div className="p-3 space-y-2">
          <div className="h-4 bg-[#161616] rounded w-3/4" />
          <div className="flex justify-between">
            <div className="h-3 bg-[#161616] rounded w-1/3" />
            <div className="h-3 bg-[#161616] rounded w-1/4" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ModSection({ title, mods, viewAllHref, loading }: ModSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = dir === "right" ? 260 : -260;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section className="mb-8" data-testid={`section-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      {/* Section header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="font-rajdhani font-bold text-xl text-white tracking-wide">
          <span className="text-gradient-red-orange">{title.split(" ")[0]}</span>{" "}
          {title.split(" ").slice(1).join(" ")}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#111] border border-[#222] text-gray-400 hover:text-white hover:border-red-500/40 transition-all"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#111] border border-[#222] text-gray-400 hover:text-white hover:border-red-500/40 transition-all"
          >
            <ChevronRight size={14} />
          </button>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              data-testid={`link-viewall-${title.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-xs font-medium text-red-500 hover:text-orange-400 flex items-center gap-1 transition-colors ml-1"
            >
              View All <ChevronRight size={12} />
            </Link>
          )}
        </div>
      </div>

      {/* Horizontal scroll */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide pb-2"
      >
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <ModCardSkeleton key={i} />)
          : mods.length === 0
          ? (
            <div className="flex items-center justify-center w-full py-12 text-gray-600 text-sm">
              No mods found in this section yet
            </div>
          )
          : mods.map(mod => (
            <div key={mod.id} className="flex-shrink-0 w-52 md:w-60">
              <ModCard mod={mod} />
            </div>
          ))
        }
      </div>
    </section>
  );
}
