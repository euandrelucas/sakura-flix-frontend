/* eslint-disable */
"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

// Function to search anime
async function searchAnime(query: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/anime/search?q=${encodeURIComponent(
        query
      )}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch search results");
    }
    return await response.json();
  } catch (error) {
    console.error("Error searching anime:", error);
    return { results: [] };
  }
}

export default function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Perform search when query changes
  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      try {
        const data = await searchAnime(query);
        setSearchResults(data.results || []);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search to avoid too many requests
    const debounceTimer = setTimeout(() => {
      performSearch();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL with search query
    const url = new URL(window.location.href);
    url.searchParams.set("q", query);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <>
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mt-6 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for anime, movies, genres..."
            className="pl-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Button type="submit">Search</Button>
        <Button
          variant="outline"
          size="icon"
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={showFilters ? "bg-muted" : ""}
        >
          <Filter className="h-4 w-4" />
          <span className="sr-only">Filter</span>
        </Button>
      </form>

      <div className="mt-6 grid gap-6 md:grid-cols-[240px_1fr]">
        {/* Filters Sidebar - Always visible on desktop, toggleable on mobile */}
        <div
          className={`${
            showFilters ? "block" : "hidden md:block"
          } rounded-lg border bg-card p-4 shadow-sm`}
        >
          <h2 className="mb-4 font-medium">Filters</h2>

          <Accordion
            type="single"
            collapsible
            defaultValue="genre"
            className="w-full"
          >
            <AccordionItem value="genre">
              <AccordionTrigger className="text-sm font-medium">
                Genre
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {[
                    "Action",
                    "Adventure",
                    "Comedy",
                    "Drama",
                    "Fantasy",
                    "Horror",
                    "Romance",
                    "Sci-Fi",
                    "Slice of Life",
                  ].map((genre) => (
                    <div key={genre} className="flex items-center space-x-2">
                      <Checkbox id={`genre-${genre}`} />
                      <Label
                        htmlFor={`genre-${genre}`}
                        className="text-sm font-normal"
                      >
                        {genre}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="year">
              <AccordionTrigger className="text-sm font-medium">
                Year
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {[
                    "2023",
                    "2022",
                    "2021",
                    "2020",
                    "2019",
                    "2018",
                    "2017",
                    "2016",
                    "2015",
                    "2010-2014",
                    "2000-2009",
                    "Before 2000",
                  ].map((year) => (
                    <div key={year} className="flex items-center space-x-2">
                      <Checkbox id={`year-${year}`} />
                      <Label
                        htmlFor={`year-${year}`}
                        className="text-sm font-normal"
                      >
                        {year}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="status">
              <AccordionTrigger className="text-sm font-medium">
                Status
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {["Airing", "Completed", "Upcoming"].map((status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox id={`status-${status}`} />
                      <Label
                        htmlFor={`status-${status}`}
                        className="text-sm font-normal"
                      >
                        {status}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="type">
              <AccordionTrigger className="text-sm font-medium">
                Type
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {["TV", "Movie", "OVA", "ONA", "Special"].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox id={`type-${type}`} />
                      <Label
                        htmlFor={`type-${type}`}
                        className="text-sm font-normal"
                      >
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="mt-6 flex gap-2">
            <Button className="flex-1">Apply Filters</Button>
            <Button variant="outline">Reset</Button>
          </div>
        </div>

        {/* Search Results */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {loading
                ? "Searching..."
                : `${searchResults.length} results ${
                    query && `for "${query}"`
                  }`}
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="relevance">
                <SelectTrigger className="h-8 w-[150px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="rating">Highest Rating</SelectItem>
                  <SelectItem value="popularity">Popularity</SelectItem>
                </SelectContent>
              </Select>
              <Tabs defaultValue="grid" className="h-8">
                <TabsList className="h-8">
                  <TabsTrigger
                    value="grid"
                    className="h-8 px-2"
                    onClick={() => setViewMode("grid")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <rect width="7" height="7" x="3" y="3" rx="1" />
                      <rect width="7" height="7" x="14" y="3" rx="1" />
                      <rect width="7" height="7" x="14" y="14" rx="1" />
                      <rect width="7" height="7" x="3" y="14" rx="1" />
                    </svg>
                    <span className="sr-only">Grid view</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="list"
                    className="h-8 px-2"
                    onClick={() => setViewMode("list")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <line x1="8" x2="21" y1="6" y2="6" />
                      <line x1="8" x2="21" y1="12" y2="12" />
                      <line x1="8" x2="21" y1="18" y2="18" />
                      <line x1="3" x2="3" y1="6" y2="6" />
                      <line x1="3" x2="3" y1="12" y2="12" />
                      <line x1="3" x2="3" y1="18" y2="18" />
                    </svg>
                    <span className="sr-only">List view</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-lg border bg-card"
                >
                  <Skeleton className="aspect-[2/3] w-full" />
                  <div className="p-3">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && query && searchResults.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No results found</h3>
              <p className="text-muted-foreground mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          )}

          {/* Grid View */}
          {!loading && viewMode === "grid" && searchResults.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {searchResults.map((anime) => (
                <Link
                  key={anime.id}
                  href={`/anime/${anime.id}`}
                  className="group overflow-hidden rounded-lg border bg-card transition-all hover:shadow-md"
                >
                  <div className="relative aspect-[2/3] overflow-hidden">
                    <Image
                      src={anime.image || "/placeholder.svg"}
                      alt={anime.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    {anime.nsfw && (
                      <div className="absolute top-2 right-2 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-medium text-white">
                        NSFW
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium line-clamp-1">{anime.title}</h3>
                    <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{anime.type || "Unknown"}</span>
                      <span>{anime.sub || anime.episodes || 0} EP</span>
                    </div>
                    {anime.japaneseTitle &&
                      anime.japaneseTitle !== anime.title && (
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                          {anime.japaneseTitle}
                        </p>
                      )}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* List View */}
          {!loading && viewMode === "list" && searchResults.length > 0 && (
            <div className="space-y-3">
              {searchResults.map((anime) => (
                <Link
                  key={anime.id}
                  href={`/anime/${anime.id}`}
                  className="flex overflow-hidden rounded-lg border bg-card hover:bg-accent/50"
                >
                  <div className="relative h-24 w-16 flex-shrink-0 overflow-hidden sm:h-32 sm:w-24">
                    <Image
                      src={anime.image || "/placeholder.svg"}
                      alt={anime.title}
                      fill
                      className="object-cover"
                    />
                    {anime.nsfw && (
                      <div className="absolute top-1 right-1 rounded-full bg-red-500 px-1.5 py-0.5 text-[8px] font-medium text-white">
                        NSFW
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 items-center p-3">
                    <div className="flex-1">
                      <h3 className="font-medium">{anime.title}</h3>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{anime.type || "Unknown"}</span>
                        <span>•</span>
                        <span>{anime.sub || anime.episodes || 0} Episodes</span>
                        {anime.duration && (
                          <>
                            <span>•</span>
                            <span>{anime.duration}</span>
                          </>
                        )}
                      </div>
                      {anime.japaneseTitle &&
                        anime.japaneseTitle !== anime.title && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {anime.japaneseTitle}
                          </p>
                        )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Empty State - No Query */}
          {!loading && !query && (
            <div className="flex flex-col items-center justify-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Search for anime</h3>
              <p className="text-muted-foreground mt-1">
                Enter a search term to find anime
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
