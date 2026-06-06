import { Link, useLocation } from "wouter";
import {
  Layers, Package, Map, Shirt, Sparkles, Cpu, Home,
  Flame, TrendingUp, Star, Grid3X3, Coffee, Monitor
} from "lucide-react";

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

const categories = [
  { label: "All", href: "/", icon: Home },
  { label: "Java", href: "/?platform=Java", icon: Coffee },
  { label: "Bedrock", href: "/?platform=Bedrock", icon: Monitor },
  { label: "Add-ons", href: "/?type=Add-on", icon: Package },
  { label: "Textures", href: "/?type=Texture Pack", icon: Layers },
  { label: "Maps", href: "/?type=Map", icon: Map },
  { label: "Skins", href: "/?type=Skin", icon: Shirt },
  { label: "Shaders", href: "/?type=Shader", icon: Sparkles },
  { label: "Mods", href: "/?type=Mod", icon: Cpu },
];

const featured = [
  { label: "Latest", href: "/?sort=latest", icon: Star },
  { label: "Popular", href: "/?sort=popular", icon: Flame },
  { label: "Trending", href: "/?sort=trending", icon: TrendingUp },
  { label: "All Mods", href: "/search", icon: Grid3X3 },
];

export default function Sidebar({ open = true, onClose }: SidebarProps) {
  const [location] = useLocation();

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.includes(href.replace("/", ""));
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-30 top-14"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-14 left-0 bottom-0 z-40 bg-[#080808] border-r border-[#151515] 
        transition-transform duration-300 overflow-y-auto scrollbar-thin
        ${open ? "translate-x-0" : "-translate-x-full"}
        w-56 md:w-[72px] md:translate-x-0 md:flex md:flex-col
      `}>
        <div className="p-3 space-y-1">
          {/* Mobile: show labels */}
          <div className="md:hidden">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider px-3 mb-2">Browse</p>
            {categories.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                data-testid={`link-sidebar-${label.toLowerCase()}`}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive(href)
                    ? "bg-red-500/15 text-red-400 font-medium"
                    : "text-gray-400 hover:bg-[#151515] hover:text-white"
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider px-3 mb-2 mt-4">Featured</p>
            {featured.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive(href)
                    ? "bg-orange-500/15 text-orange-400 font-medium"
                    : "text-gray-400 hover:bg-[#151515] hover:text-white"
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop: icon only */}
          <div className="hidden md:flex flex-col items-center gap-1">
            {categories.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                data-testid={`link-sidebar-icon-${label.toLowerCase()}`}
                title={label}
                className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all group relative ${
                  isActive(href)
                    ? "bg-red-500/20 text-red-400"
                    : "text-gray-500 hover:bg-[#151515] hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span className="absolute left-full ml-2 px-2 py-1 bg-[#1a1a1a] text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl">
                  {label}
                </span>
              </Link>
            ))}
            <div className="w-8 h-px bg-[#222] my-1" />
            {featured.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                title={label}
                className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all group relative ${
                  isActive(href)
                    ? "bg-orange-500/20 text-orange-400"
                    : "text-gray-500 hover:bg-[#151515] hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span className="absolute left-full ml-2 px-2 py-1 bg-[#1a1a1a] text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
