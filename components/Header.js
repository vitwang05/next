import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { GET_CATEGORIES } from "../graphql/queries/categories";
import { useState } from "react";

export default function Header() {
  const { data } = useQuery(GET_CATEGORIES);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBrandOpen, setIsBrandOpen] = useState(false);

  const categories = data?.productCategories?.nodes || [];

  return (
    <header className="bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-full bg-gray-900 text-white grid place-items-center font-semibold">S</div>
              <span className="font-semibold text-gray-900 group-hover:text-gray-700 transition hidden sm:inline">Shop</span>
            </Link>
          </div>

          {/* Center: Nav (desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/" className="text-gray-700 hover:text-gray-900 transition">Home</Link>
            <Link href="/shop" className="text-gray-700 hover:text-gray-900 transition">Shop</Link>
            <div className="relative">
              <button
                className="inline-flex items-center gap-1 text-gray-700 hover:text-gray-900 transition"
                onClick={() => setIsBrandOpen((v) => !v)}
                onBlur={() => setTimeout(() => setIsBrandOpen(false), 150)}
              >
                Danh mục
                <svg className={`w-4 h-4 transition ${isBrandOpen ? "rotate-180" : "rotate-0"}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                </svg>
              </button>
              {isBrandOpen && (
                <div className="absolute left-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-lg p-2 max-h-80 overflow-auto">
                  {categories.length === 0 ? (
                    <div className="px-3 py-2 text-gray-500 text-sm">Không có mục nào</div>
                  ) : (
                    categories.map((c) => (
                      <Link key={c.id} href={`/shop?category=${c.slug}`} className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
                        {c.name}
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>
          </nav>

          {/* Right: Icons */}
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setIsMenuOpen((v) => !v)} aria-label="Toggle Menu">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* User icon */}
            <Link href="/account" className="p-2 rounded-lg hover:bg-gray-100">
              <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5Z" />
                <path d="M3 22c0-4.971 4.029-9 9-9s9 4.029 9 9" />
              </svg>
            </Link>

            {/* Cart icon */}
            <Link href="/cart" className="p-2 rounded-lg hover:bg-gray-100">
              <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 3h2l.4 2M7 13h10l3-8H6.4" />
                <circle cx="9" cy="19" r="2" />
                <circle cx="17" cy="19" r="2" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            <Link href="/" className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">Home</Link>
            <Link href="/" className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">Shop</Link>
            <details className="px-1">
              <summary className="cursor-pointer list-none px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center justify-between">
                Danh mục
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" /></svg>
              </summary>
              <div className="mt-2 pl-2">
                {(categories || []).map((c) => (
                  <Link key={c.id} href={`/shop?category=${c.slug}`} className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
                    {c.name}
                  </Link>
                ))}
                {categories.length === 0 && (
                  <div className="px-3 py-2 text-gray-500 text-sm">Không có mục nào</div>
                )}
              </div>
            </details>
          </div>
        </div>
      )}
    </header>
  );
}


