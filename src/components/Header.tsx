import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Heart, Settings, Home, User, Menu, X, Upload, LogOut, Zap, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import logoPath from "@assets/zeox_logo.png";

interface HeaderProps {
  onSearch?: (q: string) => void;
  sidebarOpen?: boolean;
  onSidebarToggle?: () => void;
}

function Avatar({ photoURL, displayName, email, size = 7 }: { photoURL?: string | null; displayName?: string | null; email?: string | null; size?: number }) {
  const initial = (displayName || email || "U")[0].toUpperCase();
  const cls = `w-${size} h-${size} rounded-full flex-shrink-0 overflow-hidden`;
  if (photoURL) {
    return <img src={photoURL} alt={displayName || "User"} className={`${cls} object-cover`} referrerPolicy="no-referrer" />;
  }
  return (
    <div className={`${cls} bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center text-white text-xs font-bold`}>
      {initial}
    </div>
  );
}

export default function Header({ onSearch, sidebarOpen, onSidebarToggle }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const { user, userProfile, logout } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/search", label: "Search", icon: Search },
    { href: "/favorites", label: "Favorites", icon: Heart },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#050505] border-b border-[#1a1a1a]" style={{ boxShadow: "0 2px 20px rgba(255,0,0,0.08)" }}>
      <div className="flex items-center h-14 px-3 md:px-4 gap-3">
        <button
          onClick={onSidebarToggle}
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-gray-400 hover:text-white hover:bg-[#1a1a1a] transition-colors flex-shrink-0"
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
          <img src={logoPath} alt="Zeox" className="h-8 w-8 object-contain" />
          <span className="font-orbitron font-bold text-lg text-gradient-red-orange hidden sm:block group-hover:opacity-90 transition-opacity">
            ZEOX
          </span>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={15} />
            <input
              type="search"
              placeholder="Search mods..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#111] border border-[#222] rounded-lg pl-9 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/30 transition-all"
            />
          </div>
        </form>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                location === href
                  ? "text-red-500 bg-red-500/10"
                  : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
              }`}
            >
              <Icon size={15} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 flex-shrink-0 ml-auto md:ml-0">
          {user ? (
            <>
              <Link
                href="/upload"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-red-600 to-orange-500 text-white hover:opacity-90 transition-opacity"
              >
                <Upload size={14} />
                <span>Publish</span>
              </Link>
              <div className="relative group">
                <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#1a1a1a] transition-colors">
                  <Avatar photoURL={user.photoURL} displayName={user.displayName} email={user.email} size={7} />
                  <span className="hidden sm:block text-sm text-gray-300 max-w-[100px] truncate">
                    {user.displayName || user.email}
                  </span>
                  {userProfile?.isAdmin && (
                    <span className="hidden sm:flex items-center gap-0.5 text-xs text-orange-400 font-semibold">
                      <Zap size={10} /> Admin
                    </span>
                  )}
                </button>
                <div className="absolute right-0 top-full mt-1 w-52 bg-[#111] border border-[#222] rounded-xl shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="px-4 py-3 border-b border-[#1e1e1e]">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="text-sm text-white font-medium truncate">{user.displayName || user.email}</p>
                  </div>
                  <Link href="/settings" className="flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:bg-[#1a1a1a] hover:text-white transition-colors">
                    <Settings size={14} />
                    Settings
                  </Link>
                  <Link href="/upload" className="flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:bg-[#1a1a1a] hover:text-white transition-colors">
                    <Upload size={14} />
                    Publish Mod
                  </Link>
                  {userProfile?.isAdmin && (
                    <Link href="/settings" className="flex items-center gap-2 px-4 py-3 text-sm text-orange-400 hover:bg-orange-500/10 transition-colors">
                      <Shield size={14} />
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors border-t border-[#1e1e1e]"
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-red-600 to-orange-500 text-white hover:opacity-90 transition-opacity"
            >
              <User size={14} />
              <span>Sign In</span>
            </Link>
          )}

          <button
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-[#1a1a1a] transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#1a1a1a] bg-[#080808]">
          <nav className="flex flex-col p-2">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  location === href
                    ? "text-red-500 bg-red-500/10"
                    : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
            {user && (
              <Link
                href="/upload"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-orange-400 hover:bg-[#1a1a1a] transition-colors"
              >
                <Upload size={16} />
                Publish Mod
              </Link>
            )}
            {user && (
              <button
                onClick={async () => { setMobileMenuOpen(false); await logout(); }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-[#1a1a1a] transition-colors"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
