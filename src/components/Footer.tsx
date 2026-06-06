import { Link } from "wouter";
import { SiTiktok, SiTelegram, SiDiscord, SiYoutube, SiX } from "react-icons/si";
import logoPath from "@assets/zeox_logo.png";

export default function Footer() {
  const social = [
    { icon: SiTiktok, href: "#", label: "TikTok" },
    { icon: SiTelegram, href: "#", label: "Telegram" },
    { icon: SiDiscord, href: "#", label: "Discord" },
    { icon: SiYoutube, href: "#", label: "YouTube" },
    { icon: SiX, href: "#", label: "X / Twitter" },
  ];

  return (
    <footer className="mt-16 border-t border-[#151515] bg-[#050505]">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src={logoPath} alt="Zeox" className="w-8 h-8 object-contain" />
              <span className="font-orbitron font-bold text-lg text-gradient-red-orange">ZEOX</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              The community-driven Minecraft mods hub. Browse, download, and share mods for Java and Bedrock Edition.
            </p>
            <div className="flex items-center gap-2">
              {social.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  title={label}
                  data-testid={`link-social-${label.toLowerCase().replace(/\s+/g, "-")}`}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#111] border border-[#1a1a1a] text-gray-500 hover:text-white hover:border-red-500/30 hover:bg-red-500/10 transition-all"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-rajdhani font-bold text-sm text-white uppercase tracking-wider mb-3">Browse</h4>
            <div className="space-y-2">
              {[
                { label: "Java Edition", href: "/?platform=Java" },
                { label: "Bedrock Edition", href: "/?platform=Bedrock" },
                { label: "Texture Packs", href: "/search?type=Texture+Pack" },
                { label: "Maps", href: "/search?type=Map" },
                { label: "Skins", href: "/search?type=Skin" },
                { label: "Shaders", href: "/search?type=Shader" },
              ].map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="block text-sm text-gray-600 hover:text-red-400 transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* App Download */}
          <div>
            <h4 className="font-rajdhani font-bold text-sm text-white uppercase tracking-wider mb-3">Download App</h4>
            <p className="text-sm text-gray-600 mb-4">
              Get the Zeox mobile app to browse mods on the go.
            </p>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#111] border border-[#1a1a1a] hover:border-red-500/30 transition-all group">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-orange-500">
                  <span className="text-white text-xs font-bold">Z</span>
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-500">Coming soon on</p>
                  <p className="text-sm font-semibold text-white group-hover:text-red-400 transition-colors">Google Play</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#111] border border-[#1a1a1a] hover:border-red-500/30 transition-all group">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-orange-500">
                  <span className="text-white text-xs font-bold">Z</span>
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-500">Coming soon on</p>
                  <p className="text-sm font-semibold text-white group-hover:text-red-400 transition-colors">App Store</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-[#151515] pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-700">
            © 2025 <span className="font-rajdhani font-bold text-gradient-red-orange">Zeox</span>. zeox. add ons - official website.
          </p>
          <p className="text-xs text-gray-700">
            Not affiliated with Mojang or Microsoft.
          </p>
        </div>
      </div>
    </footer>
  );
}
