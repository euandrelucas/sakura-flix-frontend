/* eslint-disable */
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AnimeRowProps {
  category: string;
  withProgress?: boolean;
}

// Replace the entire getAnimeByCategory function with this real API implementation
const getAnimeByCategory = async (category: string, count = 10) => {
  try {
    const response = await fetch("http://154.53.33.246:45678/anime/recent");
    if (!response.ok) {
      throw new Error("Failed to fetch anime data");
    }
    const data = await response.json();
    return data.results.slice(0, count).map((anime: any) => ({
      id: anime.id,
      title: anime.title,
      image: anime.image,
      rating: (Math.random() * 2 + 7).toFixed(1), // API doesn't provide ratings, so we generate random ones
      year: anime.season
        ? Number.parseInt(anime.season.split(" ")[1]) ||
          new Date().getFullYear()
        : new Date().getFullYear(),
      episodes: anime.episodes || anime.sub || 0,
      progress: Math.floor(Math.random() * 100), // For demo purposes
      slug: anime.id,
      nsfw: anime.nsfw || Math.random() > 0.8, // Randomly assign NSFW for demo purposes
    }));
  } catch (error) {
    console.error("Error fetching anime data:", error);
    return [];
  }
};

// Update the AnimeRow component to use async data
export default function AnimeRow({
  category,
  withProgress = false,
}: AnimeRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [animeList, setAnimeList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnime = async () => {
      setLoading(true);
      const data = await getAnimeByCategory(category);
      setAnimeList(data);
      setLoading(false);
    };

    fetchAnime();
  }, [category]);

  const scroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.8;

      const newScrollLeft =
        direction === "left"
          ? scrollLeft - scrollAmount
          : scrollLeft + scrollAmount;

      rowRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });

      // Update arrow visibility after scroll
      setTimeout(() => {
        if (rowRef.current) {
          setShowLeftArrow(rowRef.current.scrollLeft > 0);
          setShowRightArrow(
            rowRef.current.scrollLeft + rowRef.current.clientWidth <
              rowRef.current.scrollWidth - 10
          );
        }
      }, 300);
    }
  };

  // Handle scroll event to update arrow visibility
  const handleScroll = () => {
    if (rowRef.current) {
      setShowLeftArrow(rowRef.current.scrollLeft > 0);
      setShowRightArrow(
        rowRef.current.scrollLeft + rowRef.current.clientWidth <
          rowRef.current.scrollWidth - 10
      );
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex-shrink-0 w-[180px]">
            <div className="relative aspect-[2/3] bg-muted animate-pulse rounded-md"></div>
            <div className="mt-2 space-y-2">
              <div className="h-4 bg-muted animate-pulse rounded"></div>
              <div className="h-3 bg-muted animate-pulse rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* Left scroll button */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "absolute left-0 top-1/2 z-10 h-12 w-12 -translate-y-1/2 rounded-full bg-background/80 text-foreground backdrop-blur-sm opacity-0 transition-opacity group-hover:opacity-100",
          showLeftArrow ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => scroll("left")}
      >
        <ChevronLeft className="h-6 w-6" />
        <span className="sr-only">Scroll left</span>
      </Button>

      {/* Anime row */}
      <div
        ref={rowRef}
        className="flex gap-4 overflow-x-auto pb-4 pt-1 scrollbar-hide snap-x"
        onScroll={handleScroll}
      >
        {animeList.map((anime) => (
          <div
            key={anime.id}
            className="relative flex-shrink-0 w-[180px] snap-start transition-transform duration-300 hover:scale-105"
          >
            <Link href={`/anime/${anime.slug}`} className="block">
              <div className="relative aspect-[2/3] overflow-hidden rounded-md">
                {/* {anime.nsfw ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 text-white">
                    <div className="absolute top-2 right-2 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                      NSFW
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 text-center">
                      <span className="text-xs font-medium text-red-400">
                        Age-restricted content
                      </span>
                    </div>
                  </div>
                ) : (
                  <Image
                    src={anime.image || "/placeholder.svg"}
                    alt={anime.title}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-110"
                  />
                )} */}
                <Image
                  src={anime.image || "/placeholder.svg"}
                  alt={anime.title}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-110"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity hover:opacity-100">
                  <div className="flex flex-col items-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-9 w-9 rounded-full p-0"
                    >
                      <Play className="h-5 w-5" fill="currentColor" />
                      <span className="sr-only">Play</span>
                    </Button>
                    <span className="text-xs font-medium text-white">Play</span>
                  </div>
                </div>

                {/* Progress bar */}
                {withProgress && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${anime.progress}%` }}
                    />
                  </div>
                )}
              </div>
            </Link>

            <div className="mt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium line-clamp-1">
                  {anime.title}
                </h3>
                <div className="flex items-center text-xs text-yellow-400">
                  <Star className="mr-1 h-3 w-3 fill-yellow-400" />
                  {anime.rating}
                </div>
              </div>
              <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                <span>{anime.year}</span>
                <span>{anime.episodes} EP</span>
                {anime.nsfw && (
                  <span className="rounded-full bg-red-500/10 px-1.5 py-0.5 text-[10px] font-medium text-red-500">
                    NSFW
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right scroll button */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "absolute right-0 top-1/2 z-10 h-12 w-12 -translate-y-1/2 rounded-full bg-background/80 text-foreground backdrop-blur-sm opacity-0 transition-opacity group-hover:opacity-100",
          showRightArrow ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => scroll("right")}
      >
        <ChevronRight className="h-6 w-6" />
        <span className="sr-only">Scroll right</span>
      </Button>
    </div>
  );
}
