"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Search, Bell, User, Menu, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { useOnClickOutside } from "@/hooks/use-click-outside";

interface AnimeSearchResult {
  id: string;
  title: string;
  image?: string;
  releaseDate?: string;
  type?: string;
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<AnimeSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();

  // Close suggestions when clicking outside
  useOnClickOutside(searchContainerRef, () => {
    setShowSuggestions(false);
  });

  // Handle navbar background change on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch search suggestions with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }

    const debounceTimer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/anime/search?q=${encodeURIComponent(
            searchQuery
          )}`
        );
        if (!response.ok) throw new Error("Failed to fetch search results");
        const data = await response.json();
        setSearchResults(data.results || []);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || searchResults.length === 0) return;

    // Arrow down
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < searchResults.length - 1 ? prev + 1 : 0
      );
    }
    // Arrow up
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : searchResults.length - 1
      );
    }
    // Enter
    else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0) {
        handleSelectSuggestion(searchResults[selectedIndex]);
      } else {
        handleSearch(e);
      }
    }
    // Escape
    else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (anime: AnimeSearchResult) => {
    router.push(`/anime/${anime.id}`);
    setSearchQuery("");
    setShowSuggestions(false);
    setIsSearchOpen(false);
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Anime", href: "/anime" },
    { name: "Movies", href: "/movies" },
    { name: "New Releases", href: "/new" },
    { name: "My List", href: "/my-list" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
    setSearchQuery("");
    setShowSuggestions(false);
    setIsSearchOpen(false);
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-sm shadow-md"
          : "bg-gradient-to-b from-background/80 to-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold bg-gradient-to-r from-purple-500 to-orange-500 bg-clip-text text-transparent">
            SakuraFlix
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {isSearchOpen ? (
            <div ref={searchContainerRef} className="relative">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  ref={searchInputRef}
                  type="search"
                  placeholder="Search anime..."
                  className="w-[200px] lg:w-[300px] h-9 bg-muted/50"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => {
                    if (searchQuery.trim() && searchResults.length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                />
                <div className="absolute right-0 top-0 flex">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-9 w-9">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : (
                    <Button
                      type="submit"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery("");
                      setShowSuggestions(false);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </form>

              {/* Search Suggestions Dropdown */}
              {showSuggestions && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 max-h-[70vh] overflow-auto rounded-md border bg-background shadow-lg z-50">
                  <div className="p-1">
                    {searchResults.map((anime, index) => (
                      <div
                        key={anime.id}
                        className={`flex items-center gap-3 px-3 py-2 rounded-sm cursor-pointer ${
                          selectedIndex === index
                            ? "bg-accent"
                            : "hover:bg-accent/50"
                        }`}
                        onClick={() => handleSelectSuggestion(anime)}
                        onMouseEnter={() => setSelectedIndex(index)}
                      >
                        <div className="relative h-10 w-16 flex-shrink-0 overflow-hidden rounded">
                          {anime.image ? (
                            <Image
                              src={anime.image || "/placeholder.svg"}
                              alt={anime.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-muted flex items-center justify-center">
                              <Search className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {anime.title}
                          </p>
                          {anime.type && (
                            <p className="text-xs text-muted-foreground">
                              {anime.type}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          )}

          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/vibrant-anime-student.png" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            size="sm"
            className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600"
          >
            Sign In
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setIsSearchOpen(!isSearchOpen);
              if (isSearchOpen) {
                setSearchQuery("");
                setShowSuggestions(false);
              }
            }}
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isMobile && isSearchOpen && (
        <div
          ref={searchContainerRef}
          className="px-4 py-2 bg-background/95 border-b border-border relative"
        >
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="search"
              placeholder="Search anime..."
              className="w-full h-9 pr-10"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className="absolute right-0 top-0">
              {isLoading ? (
                <div className="flex items-center justify-center h-9 w-9">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                >
                  <Search className="h-4 w-4" />
                </Button>
              )}
            </div>
          </form>

          {/* Mobile Search Suggestions */}
          {showSuggestions && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 mt-1 max-h-[60vh] overflow-auto bg-background border-t border-border shadow-lg z-50">
              <div className="p-2">
                {searchResults.map((anime, index) => (
                  <div
                    key={anime.id}
                    className={`flex items-center gap-3 px-3 py-2 rounded-sm ${
                      selectedIndex === index ? "bg-accent" : ""
                    }`}
                    onClick={() => handleSelectSuggestion(anime)}
                  >
                    <div className="relative h-12 w-20 flex-shrink-0 overflow-hidden rounded">
                      {anime.image ? (
                        <Image
                          src={anime.image || "/placeholder.svg"}
                          alt={anime.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-muted flex items-center justify-center">
                          <Search className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {anime.title}
                      </p>
                      {anime.type && (
                        <p className="text-xs text-muted-foreground">
                          {anime.type}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mobile Menu */}
      {isMobile && isMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-background/95 backdrop-blur-sm animate-in fade-in">
          <nav className="container flex flex-col gap-4 p-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-lg font-medium py-2 transition-colors hover:text-primary ${
                  pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="h-px bg-border my-2" />
            <Button
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600"
            >
              Sign In
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
