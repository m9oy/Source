import { useState } from "react";
import { User, Shield, Info, LogOut, Zap, Trash2, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useLocation, Link } from "wouter";
import { deleteAllMods } from "@/lib/firestore";

export default function Settings() {
  const { user, userProfile, logout } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [loggingOut, setLoggingOut] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    setLocation("/");
    toast({ title: "Signed out", description: "See you next time!" });
  };

  const handleDeleteAllMods = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    try {
      const count = await deleteAllMods();
      toast({ title: "Done", description: `Deleted ${count} mods successfully.` });
      setConfirmDelete(false);
    } catch {
      toast({ title: "Error", description: "Failed to delete mods.", variant: "destructive" });
    }
    setDeleting(false);
  };

  const avatarSrc = user?.photoURL;
  const displayName = user?.displayName || user?.email || "User";
  const initial = displayName[0].toUpperCase();

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-8">
        <h1 className="font-orbitron font-bold text-2xl text-white">
          <span className="text-gradient-red-orange">Settings</span>
        </h1>
      </div>

      {user ? (
        <div className="space-y-4">
          {/* Profile Card */}
          <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-xl p-5">
            <div className="flex items-center gap-4">
              {avatarSrc ? (
                <img src={avatarSrc} alt={displayName} className="w-14 h-14 rounded-full object-cover flex-shrink-0" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                  {initial}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-white truncate">{displayName}</h3>
                  {userProfile?.isAdmin && (
                    <span className="flex items-center gap-1 text-xs text-orange-400 font-semibold bg-orange-400/10 border border-orange-400/20 px-2 py-0.5 rounded-full">
                      <Zap size={10} /> Admin
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
                <p className="text-xs text-gray-600 mt-1">
                  Member since {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString("en") : "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-[#1a1a1a]">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Account</h3>
            </div>
            <Link href="/upload" className="w-full flex items-center gap-4 px-5 py-4 hover:bg-[#151515] transition-colors">
              <div className="w-9 h-9 rounded-lg bg-[#161616] flex items-center justify-center flex-shrink-0">
                <Zap size={16} className="text-orange-400" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-white">Publish a Mod</p>
                <p className="text-xs text-gray-500">Share your creation with the community</p>
              </div>
            </Link>
            <Link href="/favorites" className="w-full flex items-center gap-4 px-5 py-4 hover:bg-[#151515] transition-colors border-t border-[#131313]">
              <div className="w-9 h-9 rounded-lg bg-[#161616] flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-gray-400" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-white">Favorites</p>
                <p className="text-xs text-gray-500">
                  {userProfile?.favorites?.length ? `${userProfile.favorites.length} saved mods` : "No favorites yet"}
                </p>
              </div>
            </Link>
          </div>

          {/* Admin Panel */}
          {userProfile?.isAdmin && (
            <div className="bg-[#0e0e0e] border border-orange-500/20 rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-orange-500/10 bg-orange-500/5">
                <h3 className="text-xs font-semibold text-orange-400 uppercase tracking-wider flex items-center gap-2">
                  <Shield size={12} />
                  Admin Panel
                </h3>
              </div>
              <div className="px-5 py-4 space-y-4">
                <p className="text-xs text-gray-500">
                  Admin-only section. Proceed with caution.
                </p>

                <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Trash2 size={16} className="text-red-400" />
                    <div>
                      <p className="text-sm font-semibold text-white">Delete All Mods</p>
                      <p className="text-xs text-gray-500">This action cannot be undone</p>
                    </div>
                  </div>

                  {confirmDelete && (
                    <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-3">
                      <AlertTriangle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-red-400">
                        Are you sure? All mods will be permanently deleted from the database. Click again to confirm.
                      </p>
                    </div>
                  )}

                  <button
                    onClick={handleDeleteAllMods}
                    disabled={deleting}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-60 ${
                      confirmDelete
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-red-500/15 text-red-400 hover:bg-red-500/25 border border-red-500/30"
                    }`}
                  >
                    <Trash2 size={13} />
                    {deleting ? "Deleting..." : confirmDelete ? "Confirm Delete" : "Delete All Mods"}
                  </button>

                  {confirmDelete && !deleting && (
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="mt-2 text-xs text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* About */}
          <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-[#1a1a1a]">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">About</h3>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Version</span>
                <span className="text-gray-300 font-medium">1.0.0</span>
              </div>
              <div className="pt-2 border-t border-[#1a1a1a]">
                <p className="text-xs text-gray-600 leading-relaxed">
                  zeox. add ons - official website. All mod content is user-submitted.
                </p>
              </div>
            </div>
          </div>

          {/* Sign Out */}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/15 hover:border-red-500/30 transition-all disabled:opacity-60"
          >
            <LogOut size={15} />
            {loggingOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-xl p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[#161616] border border-[#222] flex items-center justify-center mx-auto mb-4">
              <User size={24} className="text-gray-500" />
            </div>
            <h3 className="font-semibold text-white mb-1">Not signed in</h3>
            <p className="text-gray-500 text-sm mb-4">Sign in to access your profile and settings.</p>
            <div className="flex gap-2 justify-center">
              <Link
                href="/login"
                className="px-5 py-2 rounded-lg text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg, #FF0000, #FF4500)" }}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 rounded-lg text-sm font-semibold bg-[#161616] border border-[#222] text-gray-300 hover:text-white hover:border-[#333] transition-all"
              >
                Register
              </Link>
            </div>
          </div>

          <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Info size={14} className="text-gray-500" />
              <h3 className="text-sm font-semibold text-white">About Zeox</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              zeox. add ons - official website. Browse and download mods, texture packs, maps, skins, and shaders for Java and Bedrock Edition.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
