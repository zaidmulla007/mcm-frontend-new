"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Influencers", href: "/influencers" },
  { name: "Cryptocurrencies", href: "/cryptocurrencies" },
  { name: "Leaderboard", href: "/leaderboard" },
  { name: "Insights / Blog", href: "/blog" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function ClientHeader() {
  const pathname = usePathname();
  
  return (
    <header className="sticky top-0 z-30 w-full bg-[#19162b]/95 backdrop-blur border-b border-[#232042] shadow-sm">
      <div className=" mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          {/* <Image src="/images/MCMLOGO.png" alt="Logo" width={70} height={70} /> */}
          <Image src="/images/mcm_logo.png" alt="Logo" width={70} height={70}  className="logo-img"/>
          {/* <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent hidden sm:inline">
            MCM
          </span> */}
        </Link>
        {/* Navigation */}
        <nav className="hidden md:flex gap-6 ml-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition relative ${
                  isActive
                    ? 'text-purple-400'
                    : 'text-gray-200 hover:text-purple-400'
                } ${
                  isActive
                    ? 'after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-0.5 after:bg-purple-400'
                    : ''
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
        {/* Search + Auth */}
        <div className="flex items-center gap-4 ml-auto">
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search..."
              className="bg-[#232042] text-sm text-white rounded-full px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 w-48"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </span>
          </div>
          <Link
            href="/login"
            className="bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2 rounded-lg font-semibold text-sm shadow hover:scale-105 transition"
          >
            Login / Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}