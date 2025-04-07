"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, X } from "lucide-react";

const navigationItems = [
  { label: "Home", href: "/" },
  { label: "Inspiratie", href: "/themas" },
  { label: "Blogs", href: "/blogs" },
  { label: "Verhuren", href: "/groepsaccommodatie-verhuren" },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        closeSearch();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeMenu, closeSearch]);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo-groepen-nl.png"
              alt="Groepen.nl Logo"
              width={200}
              height={50}
              className="object-contain"
              priority
            />
          </Link>
          <div className="hidden md:flex items-center justify-center flex-grow">
            {navigationItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {isSearchOpen ? (
              <div ref={searchRef} className="relative">
                <Input
                  type="text"
                  placeholder="Zoeken..."
                  className="w-64 pl-10 pr-4 py-2 rounded-md border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                />
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <button
                  onClick={closeSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary focus:outline-none"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <button
                onClick={toggleSearch}
                className="text-gray-600 hover:text-primary p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <Search size={20} />
              </button>
            )}
            <Button
              variant="outline"
              className="ml-4 text-primary border-primary hover:bg-primary hover:text-white"
            >
              Inloggen
            </Button>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
          aria-hidden="true"
        >
          <div
            ref={menuRef}
            className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Menu</h2>
              <button
                onClick={closeMenu}
                className="text-gray-600 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
              >
                <X size={24} />
              </button>
            </div>
            <div className="relative mb-6">
              <Input
                type="text"
                placeholder="Zoeken..."
                className="w-full pl-10 pr-4 py-2 rounded-md border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
            <div className="mt-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                  onClick={closeMenu}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                className="w-full text-primary border-primary hover:bg-primary hover:text-white"
              >
                Inloggen
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
