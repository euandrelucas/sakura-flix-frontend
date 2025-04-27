"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Episode {
  id: string;
  number: number;
  title: string;
  isFiller?: boolean;
  isSubbed?: boolean;
  isDubbed?: boolean;
  url?: string;
}

interface EpisodeListProps {
  animeId: string;
  episodes: Episode[];
}

export default function EpisodeList({ animeId, episodes }: EpisodeListProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Extract the episode slug from the episode ID
  const getEpisodeSlug = (episodeId: string) => {
    const parts = episodeId.split("$episode$");
    return parts.length > 1 ? parts[1] : episodeId;
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-end gap-2">
        <Button
          variant={viewMode === "grid" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("grid")}
          className="w-24"
        >
          Grid
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("list")}
          className="w-24"
        >
          List
        </Button>
      </div>

      {episodes.length === 0 ? (
        <div className="flex justify-center items-center py-12">
          <p className="text-muted-foreground">No episodes available</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {episodes.map((episode) => (
            <div
              key={episode.id}
              className="group relative overflow-hidden rounded-lg border bg-card"
            >
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={`/bustling-anime-street.png?height=180&width=320&query=anime episode ${episode.number} thumbnail`}
                  alt={episode.title || `Episode ${episode.number}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                  <Link
                    href={`/anime/${animeId}/watch/${getEpisodeSlug(
                      episode.id
                    )}`}
                  >
                    <Button size="sm" variant="secondary" className="gap-2">
                      <Play className="h-4 w-4" fill="currentColor" /> Watch
                    </Button>
                  </Link>
                </div>
                <div className="absolute bottom-2 right-2 rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm">
                  24:00
                </div>
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    EP {episode.number}
                  </span>
                  {episode.isSubbed && (
                    <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
                      SUB
                    </span>
                  )}
                  {episode.isDubbed && (
                    <span className="text-xs bg-orange-500/20 text-orange-500 px-1.5 py-0.5 rounded-full">
                      DUB
                    </span>
                  )}
                </div>
                <h3 className="mt-1 font-medium line-clamp-1">
                  {episode.title || `Episode ${episode.number}`}
                </h3>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {episodes.map((episode) => (
            <div
              key={episode.id}
              className="group flex overflow-hidden rounded-lg border bg-card hover:bg-accent/50"
            >
              <div className="relative h-20 w-36 flex-shrink-0 overflow-hidden sm:h-24 sm:w-44">
                <Image
                  src={`/bustling-anime-street.png?height=180&width=320&query=anime episode ${episode.number} thumbnail`}
                  alt={episode.title || `Episode ${episode.number}`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 items-center p-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      Episode {episode.number}
                    </span>
                    {episode.isSubbed && (
                      <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
                        SUB
                      </span>
                    )}
                    {episode.isDubbed && (
                      <span className="text-xs bg-orange-500/20 text-orange-500 px-1.5 py-0.5 rounded-full">
                        DUB
                      </span>
                    )}
                  </div>
                  <h3 className="mt-1 font-medium">
                    {episode.title || `Episode ${episode.number}`}
                  </h3>
                </div>
                <Link
                  href={`/anime/${animeId}/watch/${getEpisodeSlug(episode.id)}`}
                >
                  <Button size="sm" variant="ghost" className="flex-shrink-0">
                    <Play className="h-4 w-4" fill="currentColor" />
                    <span className="sr-only">Watch</span>
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {episodes.length > 10 && (
        <div className="mt-6 flex justify-center">
          <Button variant="outline" size="lg">
            Load More Episodes
          </Button>
        </div>
      )}
    </div>
  );
}
