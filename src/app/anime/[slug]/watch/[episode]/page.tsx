/* eslint-disable */
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Play, ChevronRight, Share2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Hls from "hls.js";

// Import the VideoPlayer component
import { VideoPlayer } from "@/components/ui/video-player";

// Function to fetch episode details
async function getEpisodeDetails(episodeId: string) {
  try {
    const response = await fetch(
      `https://sakura-api.andrepaiva.dev/anime/watch?episodeId=${episodeId}&server=vidcloud`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch episode details");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching episode details:", error);
    return null;
  }
}

// Function to fetch anime info
async function getAnimeInfo(animeId: string) {
  try {
    const response = await fetch(
      `https://sakura-api.andrepaiva.dev/anime/info?id=${animeId}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch anime info");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching anime info:", error);
    return null;
  }
}

export default function WatchPage({
  params,
}: {
  params: { slug: string; episode: string };
}) {
  const [episodeData, setEpisodeData] = useState<any>(null);
  const [animeInfo, setAnimeInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [activeTab, setActiveTab] = useState<"comments" | "episodes">(
    "episodes"
  );
  const [selectedSubtitle, setSelectedSubtitle] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Find current episode index and determine next/prev episodes
  const currentEpisodeIndex =
    animeInfo?.episodes?.findIndex((ep: any) =>
      ep.id.includes(params.episode)
    ) || -1;

  const prevEpisode =
    currentEpisodeIndex > 0
      ? animeInfo?.episodes[currentEpisodeIndex - 1]
      : null;
  const nextEpisode =
    currentEpisodeIndex < (animeInfo?.episodes?.length || 0) - 1
      ? animeInfo?.episodes[currentEpisodeIndex + 1]
      : null;

  // Get current episode
  const currentEpisode =
    currentEpisodeIndex >= 0 ? animeInfo?.episodes[currentEpisodeIndex] : null;

  // Fetch episode data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Construct the episodeId
        const episodeId = `${params.slug}$episode$${params.episode}`;
        const episodeData = await getEpisodeDetails(episodeId);
        const animeData = await getAnimeInfo(params.slug);

        if (episodeData && animeData) {
          setEpisodeData(episodeData);
          setAnimeInfo(animeData);

          // Set default subtitle if available
          if (episodeData.subtitles && episodeData.subtitles.length > 0) {
            const englishSub = episodeData.subtitles.find((sub: any) =>
              sub.lang.includes("English")
            );
            setSelectedSubtitle(
              englishSub ? englishSub.url : episodeData.subtitles[0].url
            );
          }
        } else {
          setError("Failed to load episode data");
        }
      } catch (err) {
        setError("An error occurred while loading the episode");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.slug, params.episode]);

  // Handle video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    const setupHls = () => {
      if (!video || !episodeData?.sources) return;

      // Find HLS source
      const hlsSource = episodeData.sources.find(
        (source: any) => source.isM3U8 || source.type === "hls"
      );

      if (hlsSource && Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
        });

        hls.loadSource(hlsSource.url);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (isPlaying) {
            video.play().catch((err) => {
              console.error("Error playing video:", err);
              setIsPlaying(false);
            });
          }
        });

        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.error("Network error, trying to recover...");
                hls?.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.error("Media error, trying to recover...");
                hls?.recoverMediaError();
                break;
              default:
                console.error("Unrecoverable error:", data);
                hls?.destroy();
                break;
            }
          }
        });
      } else if (
        video.canPlayType("application/vnd.apple.mpegurl") &&
        hlsSource
      ) {
        // For Safari which has native HLS support
        video.src = hlsSource.url;
      } else if (episodeData.sources.length > 0) {
        // Fallback to first available source
        video.src = episodeData.sources[0].url;
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);

      // Auto-skip intro if enabled
      if (
        episodeData?.intro &&
        video.currentTime >= episodeData.intro.start &&
        video.currentTime < episodeData.intro.end
      ) {
        const skipIntroButton = document.querySelector('[data-skip="intro"]');
        if (skipIntroButton) {
          skipIntroButton.classList.add("animate-pulse");
        }
      }

      // Auto-skip outro if enabled
      if (
        episodeData?.outro &&
        video.currentTime >= episodeData.outro.start &&
        video.currentTime < episodeData.outro.end
      ) {
        const skipOutroButton = document.querySelector('[data-skip="outro"]');
        if (skipOutroButton) {
          skipOutroButton.classList.add("animate-pulse");
        }
      }
    };

    const handleDurationChange = () => {
      setDuration(video.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);

      // Auto-play next episode if available
      if (nextEpisode) {
        setTimeout(() => {
          window.location.assign(
            `/anime/${params.slug}/watch/${getEpisodeIdFromFullId(
              nextEpisode.id
            )}`
          );
        }, 5000);
      }
    };

    setupHls();
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("durationchange", handleDurationChange);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("durationchange", handleDurationChange);
      video.removeEventListener("ended", handleEnded);

      if (hls) {
        hls.destroy();
      }
    };
  }, [
    episodeData,
    isPlaying,
    nextEpisode,
    params.slug,
    currentEpisodeIndex,
    animeInfo?.episodes,
  ]);

  // Handle play/pause
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.play().catch((err) => {
        console.error("Error playing video:", err);
        setIsPlaying(false);
      });
    } else {
      video.pause();
    }
  }, [isPlaying]);

  // Handle volume change
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // Handle controls visibility
  useEffect(() => {
    if (!isPlaying) {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      return;
    }

    if (showControls) {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }

      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [showControls, isPlaying]);

  // Handle mouse movement to show controls
  const handleMouseMove = () => {
    setShowControls(true);
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle seeking
  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = value[0];
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!videoContainerRef.current) return;

    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Skip intro/outro
  const skipSection = (type: "intro" | "outro") => {
    const video = videoRef.current;
    if (!video || !episodeData) return;

    if (type === "intro" && episodeData.intro) {
      video.currentTime = episodeData.intro.end;
    } else if (type === "outro" && episodeData.outro) {
      video.currentTime = episodeData.outro.end;
    }
  };

  // Calculate progress percentage
  //   const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Extract episode ID for navigation
  const getEpisodeIdFromFullId = (fullId: string) => {
    const parts = fullId.split("$episode$");
    return parts.length > 1 ? parts[1] : fullId;
  };

  if (loading) {
    return (
      <div className="flex flex-col">
        <div className="relative bg-black">
          <div className="relative aspect-video w-full">
            <Skeleton className="h-full w-full" />
          </div>
        </div>
        <div className="container px-4 py-6">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-full max-w-2xl mb-2" />
          <Skeleton className="h-4 w-full max-w-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-xl font-bold text-red-500">
          Error Loading Episode
        </h2>
        <p className="text-muted-foreground mt-2">{error}</p>
        <Button className="mt-4" asChild>
          <Link href={`/anime/${params.slug}`}>Back to Anime Page</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Video Player */}
      <div
        ref={videoContainerRef}
        className="relative bg-black"
        onMouseMove={handleMouseMove}
      >
        {episodeData?.sources && episodeData.sources.length > 0 ? (
          <VideoPlayer
            sources={episodeData.sources}
            subtitles={episodeData.subtitles || []}
            poster={`/placeholder.svg?height=720&width=1280&query=${animeInfo?.title} episode ${currentEpisode?.number} thumbnail`}
            intro={episodeData.intro}
            outro={episodeData.outro}
            onNextEpisode={
              nextEpisode
                ? () =>
                    window.location.assign(
                      `/anime/${params.slug}/watch/${getEpisodeIdFromFullId(
                        nextEpisode.id
                      )}`
                    )
                : undefined
            }
            onPrevEpisode={
              prevEpisode
                ? () =>
                    window.location.assign(
                      `/anime/${params.slug}/watch/${getEpisodeIdFromFullId(
                        prevEpisode.id
                      )}`
                    )
                : undefined
            }
            hasNextEpisode={!!nextEpisode}
            hasPrevEpisode={!!prevEpisode}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-black">
            <p className="text-white">No video sources available</p>
          </div>
        )}
      </div>

      {/* Episode Info & Episodes */}
      <div className="container px-4 py-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <div>
            <h1 className="text-2xl font-bold">
              {currentEpisode?.title || `Episode ${currentEpisode?.number}`}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {animeInfo?.description || "No description available."}
            </p>

            {/* Tabs */}
            <div className="mt-8 border-b">
              <div className="flex gap-4">
                <button
                  className={`border-b-2 pb-2 font-medium ${
                    activeTab === "comments"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground"
                  }`}
                  onClick={() => setActiveTab("comments")}
                >
                  Comments
                </button>
                <button
                  className={`border-b-2 pb-2 font-medium ${
                    activeTab === "episodes"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground"
                  }`}
                  onClick={() => setActiveTab("episodes")}
                >
                  Episodes
                </button>
              </div>
            </div>

            {/* Comments Section */}
            {activeTab === "comments" && (
              <div className="mt-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium">Comments</h2>
                  <Button variant="outline" size="sm">
                    Sort by: Latest
                  </Button>
                </div>

                <div className="flex gap-4">
                  <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
                    <Image
                      src="/vibrant-anime-student.png"
                      alt="Your avatar"
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <textarea
                      className="w-full rounded-lg border bg-background p-3 text-sm"
                      placeholder="Add a comment..."
                      rows={3}
                    />
                    <div className="mt-2 flex justify-end">
                      <Button size="sm">Post Comment</Button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center py-8">
                  <p className="text-muted-foreground">
                    Be the first to comment on this episode!
                  </p>
                </div>
              </div>
            )}

            {/* Episodes List */}
            {activeTab === "episodes" && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium">All Episodes</h2>
                </div>
                <div className="space-y-3">
                  {animeInfo?.episodes?.map((ep: any) => {
                    const episodeId = getEpisodeIdFromFullId(ep.id);
                    const isCurrent = episodeId === params.episode;

                    return (
                      <div
                        key={ep.id}
                        className={`flex overflow-hidden rounded-lg border ${
                          isCurrent
                            ? "border-primary bg-primary/5"
                            : "bg-card hover:bg-accent/50"
                        }`}
                      >
                        <div className="relative h-20 w-36 flex-shrink-0 overflow-hidden">
                          <Image
                            src={`/abstract-geometric-shapes.png?height=180&width=320&query=${animeInfo.title} episode ${ep.number} thumbnail`}
                            alt={`Episode ${ep.number}`}
                            fill
                            className="object-cover"
                          />
                          {isCurrent && (
                            <div className="absolute bottom-1 left-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground">
                              Current
                            </div>
                          )}
                        </div>
                        <div className="flex flex-1 items-center p-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                Episode {ep.number}
                              </span>
                              {ep.isSubbed && (
                                <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
                                  SUB
                                </span>
                              )}
                              {ep.isDubbed && (
                                <span className="text-xs bg-orange-500/20 text-orange-500 px-1.5 py-0.5 rounded-full">
                                  DUB
                                </span>
                              )}
                            </div>
                            <h3 className="mt-1 font-medium">
                              {ep.title || `Episode ${ep.number}`}
                            </h3>
                          </div>
                          <Link
                            href={`/anime/${params.slug}/watch/${episodeId}`}
                          >
                            <Button
                              size="sm"
                              variant={isCurrent ? "default" : "ghost"}
                              className="flex-shrink-0"
                            >
                              <Play className="h-4 w-4" fill="currentColor" />
                              <span className="sr-only">Watch</span>
                            </Button>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="rounded-lg border bg-card p-4">
              <h3 className="font-medium">Up Next</h3>
              {nextEpisode ? (
                <div className="mt-3">
                  <div className="relative aspect-video overflow-hidden rounded-md">
                    <Image
                      src={`/abstract-geometric-shapes.png?height=180&width=320&query=${animeInfo?.title} episode ${nextEpisode.number} thumbnail`}
                      alt={nextEpisode.title || `Episode ${nextEpisode.number}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity hover:opacity-100">
                      <Link
                        href={`/anime/${
                          params.slug
                        }/watch/${getEpisodeIdFromFullId(nextEpisode.id)}`}
                      >
                        <Button size="sm" variant="secondary" className="gap-2">
                          <Play className="h-4 w-4" fill="currentColor" /> Watch
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">
                        EP {nextEpisode.number}
                      </span>
                    </div>
                    <h3 className="mt-1 font-medium">
                      {nextEpisode.title || `Episode ${nextEpisode.number}`}
                    </h3>
                  </div>
                </div>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">
                  No more episodes available.
                </p>
              )}
            </div>

            <div className="mt-4 rounded-lg border bg-card p-4">
              <h3 className="font-medium">Share</h3>
              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-2">
                  <Share2 className="h-4 w-4" /> Copy Link
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* More Like This */}
        {animeInfo?.recommendations && animeInfo.recommendations.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">More Like This</h2>
              <Button variant="link" size="sm" className="gap-1">
                View All <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {animeInfo.recommendations.slice(0, 6).map((rec: any) => (
                <Link
                  key={rec.id}
                  href={`/anime/${rec.id}`}
                  className="group overflow-hidden rounded-lg border bg-card transition-all hover:shadow-md"
                >
                  <div className="relative aspect-[2/3] overflow-hidden">
                    <Image
                      src={rec.image || "/placeholder.svg"}
                      alt={rec.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium line-clamp-1">{rec.title}</h3>
                    <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{rec.type}</span>
                      <span>{rec.sub || rec.episodes || 0} EP</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
