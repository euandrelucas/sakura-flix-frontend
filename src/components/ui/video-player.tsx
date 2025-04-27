/* eslint-disable */
"use client";

import { useState, useEffect, useRef } from "react";
import Hls from "hls.js";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  SkipBack,
  SkipForward,
  Subtitles,
  FastForward,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface VideoSource {
  url: string;
  isM3U8?: boolean;
  type?: string;
  quality?: string;
}

interface VideoSubtitle {
  url: string;
  lang: string;
}

interface VideoMarker {
  start: number;
  end: number;
}

interface VideoPlayerProps {
  sources: VideoSource[];
  subtitles?: VideoSubtitle[];
  poster?: string;
  intro?: VideoMarker;
  outro?: VideoMarker;
  onNextEpisode?: () => void;
  onPrevEpisode?: () => void;
  hasNextEpisode?: boolean;
  hasPrevEpisode?: boolean;
}

class M3U8FixLoader extends Hls.DefaultConfig.loader {
  constructor(config: any) {
    super(config);

    const originalLoad = this.load.bind(this);

    this.load = (context, config, callbacks) => {
      const proxyBase = "https://sakura-api.andrepaiva.dev/proxy?url=";

      // Se a URL for relativa, resolve ela
      if (!context.url.startsWith("http")) {
        const fullUrl = new URL(context.url, window.location.href).toString();
        context.url = fullUrl;
      }

      // Sempre proxificar
      if (!context.url.startsWith(proxyBase)) {
        context.url = `${proxyBase}${encodeURIComponent(context.url)}`;
      }

      const onSuccess = callbacks.onSuccess;
      callbacks.onSuccess = (response, stats, contextType) => {
        // Se for um m3u8, corrigir o conteúdo
        if (context.url.includes(".m3u8")) {
          const originalText = response.data;
          const baseOriginalUrl = new URL(
            decodeURIComponent(context.url.replace(proxyBase, ""))
          );

          const fixedText = (
            typeof originalText === "string" ? originalText : ""
          )
            .split("\n")
            .map((line) => {
              line = line.trim();
              if (line && !line.startsWith("#") && !line.startsWith("http")) {
                const absolute = new URL(line, baseOriginalUrl).toString();
                return absolute;
              }
              return line;
            })
            .join("\n");

          response.data = fixedText;
        }

        onSuccess(response, stats, contextType, callbacks);
      };

      originalLoad(context, config, callbacks);
    };
  }
}

export function VideoPlayer({
  sources,
  subtitles = [],
  poster,
  intro,
  outro,
  onNextEpisode,
  onPrevEpisode,
  hasNextEpisode = false,
  hasPrevEpisode = false,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [selectedSubtitle, setSelectedSubtitle] = useState<string | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<string | null>(null);
  const [availableQualities, setAvailableQualities] = useState<string[]>([]);
  const [isBuffering, setIsBuffering] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  // Initialize HLS player
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !sources.length) return;

    // Clean up previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Find HLS source
    const hlsSource = sources.find(
      (source) => source.isM3U8 || source.type === "hls"
    );

    if (hlsSource && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        loader: M3U8FixLoader,
      });

      hlsRef.current = hls;

      hls.loadSource(hlsSource.url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        // Extract available qualities
        const qualities = data.levels
          .map((level) => `${level.height}p`)
          .reverse();
        setAvailableQualities(qualities);

        if (qualities.length > 0) {
          setSelectedQuality(qualities[0]);
        }

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
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error("Media error, trying to recover...");
              hls.recoverMediaError();
              break;
            default:
              console.error("Unrecoverable error:", data);
              hls.destroy();
              break;
          }
        }
      });

      // Handle quality selection
      hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
        const level = hls.levels[data.level];
        if (level) {
          setSelectedQuality(`${level.height}p`);
        }
      });

      // Handle buffering states
      hls.on(Hls.Events.BUFFER_CREATED, () => setIsBuffering(true));
      hls.on(Hls.Events.FRAG_BUFFERED, () => setIsBuffering(false));
    } else if (
      video.canPlayType("application/vnd.apple.mpegurl") &&
      hlsSource
    ) {
      // For Safari which has native HLS support
      video.src = hlsSource.url;
    } else if (sources.length > 0) {
      // Fallback to first available source
      video.src = sources[0].url;
    }

    // Set default subtitle if available
    if (subtitles.length > 0) {
      const englishSub = subtitles.find((sub) => sub.lang.includes("English"));
      setSelectedSubtitle(englishSub ? englishSub.url : subtitles[0].url);
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [sources, subtitles]);

  // Handle video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleDurationChange = () => {
      setDuration(video.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);

      // Auto-play next episode if available
      if (hasNextEpisode && onNextEpisode) {
        setTimeout(() => {
          onNextEpisode();
        }, 5000);
      }
    };

    const handleWaiting = () => {
      setIsBuffering(true);
    };

    const handlePlaying = () => {
      setIsBuffering(false);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("durationchange", handleDurationChange);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("playing", handlePlaying);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("durationchange", handleDurationChange);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("playing", handlePlaying);
    };
  }, [hasNextEpisode, onNextEpisode]);

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

  // Handle subtitle change
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    for (let i = 0; i < video.textTracks.length; i++) {
      const track = video.textTracks[i];
      if (!selectedSubtitle) {
        track.mode = "disabled"; // Desativa todas se estiver sem legenda
      } else {
        const trackSrc = (
          video.children[i + sources.length] as HTMLTrackElement
        )?.src;
        if (trackSrc === selectedSubtitle) {
          track.mode = "showing"; // Ativa a legenda selecionada
        } else {
          track.mode = "disabled"; // Desativa as outras
        }
      }
    }
  }, [selectedSubtitle, sources.length]);

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
    } else {
      document.exitFullscreen();
    }
  };

  // Skip intro/outro
  const skipSection = (type: "intro" | "outro") => {
    const video = videoRef.current;
    if (!video) return;

    if (type === "intro" && intro) {
      video.currentTime = intro.end;
    } else if (type === "outro" && outro) {
      video.currentTime = outro.end;
    }
  };

  // Set quality
  const setQuality = (quality: string) => {
    if (!hlsRef.current || !quality) return;

    const levels = hlsRef.current.levels;
    const levelIndex = levels.findIndex(
      (level) => `${level.height}p` === quality
    );

    if (levelIndex !== -1) {
      hlsRef.current.currentLevel = levelIndex;
      setSelectedQuality(quality);
    }
  };

  // Calculate progress percentage
  //   const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={videoContainerRef}
      className="relative bg-black"
      onMouseMove={handleMouseMove}
    >
      <div className="relative aspect-video w-full">
        {sources.length > 0 ? (
          <video
            ref={videoRef}
            className="h-full w-full"
            poster={poster}
            controls={false}
            playsInline
            crossOrigin="anonymous"
          >
            {/* Fallback sources for browsers that don't support HLS.js */}
            {sources
              .filter((source) => !source.isM3U8 && source.type !== "hls")
              .map((source, index) => (
                <source key={index} src={source.url} type="video/mp4" />
              ))}
            {subtitles.map((subtitle, index) => (
              <track
                key={index}
                kind="subtitles"
                src={subtitle.url}
                srcLang={subtitle.lang.slice(0, 2).toLowerCase()} // ex: "en", "pt"
                label={subtitle.lang}
                default={index === 0} // primeira legenda como padrão
              />
            ))}
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-black">
            <p className="text-white">No video sources available</p>
          </div>
        )}

        {/* Buffering Indicator */}
        {isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        )}

        {/* Video Controls Overlay */}
        <div
          className={`absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/80 via-transparent to-black/40 p-4 transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <span className="font-medium">Video Player</span>
            </div>
            <div className="flex items-center gap-2">
              {intro &&
                currentTime < intro.end &&
                currentTime > intro.start && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                    onClick={() => skipSection("intro")}
                    data-skip="intro"
                  >
                    <FastForward className="h-4 w-4 mr-2" />
                    Skip Intro
                  </Button>
                )}
              {outro &&
                currentTime < outro.end &&
                currentTime > outro.start && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                    onClick={() => skipSection("outro")}
                    data-skip="outro"
                  >
                    <FastForward className="h-4 w-4 mr-2" />
                    Skip Outro
                  </Button>
                )}
              {subtitles.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                    >
                      <Subtitles className="h-5 w-5" />
                      <span className="sr-only">Subtitles</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Subtitles</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setSelectedSubtitle(null)}
                      className={
                        !selectedSubtitle
                          ? "bg-accent text-accent-foreground"
                          : ""
                      }
                    >
                      Off
                    </DropdownMenuItem>
                    {subtitles.map((sub, index) => (
                      <DropdownMenuItem
                        key={index}
                        onClick={() => setSelectedSubtitle(sub.url)}
                        className={
                          selectedSubtitle === sub.url
                            ? "bg-accent text-accent-foreground"
                            : ""
                        }
                      >
                        {sub.lang}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {availableQualities.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                    >
                      <Settings className="h-5 w-5" />
                      <span className="sr-only">Quality</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Quality</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {availableQualities.map((quality, index) => (
                      <DropdownMenuItem
                        key={index}
                        onClick={() => setQuality(quality)}
                        className={
                          selectedQuality === quality
                            ? "bg-accent text-accent-foreground"
                            : ""
                        }
                      >
                        {quality}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuItem
                      onClick={() => setQuality("auto")}
                      className={
                        selectedQuality === "auto"
                          ? "bg-accent text-accent-foreground"
                          : ""
                      }
                    >
                      Auto
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={toggleFullscreen}
              >
                <Maximize className="h-5 w-5" />
                <span className="sr-only">Fullscreen</span>
              </Button>
            </div>
          </div>

          {/* Center Play Button */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Button
              variant="ghost"
              size="icon"
              className="h-16 w-16 rounded-full bg-black/30 text-white backdrop-blur-sm hover:bg-black/50"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <Pause className="h-8 w-8" />
              ) : (
                <Play className="h-8 w-8" fill="currentColor" />
              )}
            </Button>
          </div>

          {/* Bottom Controls */}
          <div className="space-y-2">
            {/* Progress Bar */}
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="h-1.5 cursor-pointer"
            />

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/20"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" fill="currentColor" />
                  )}
                </Button>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white hover:bg-white/20"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? (
                      <VolumeX className="h-5 w-5" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                  </Button>
                  <Slider
                    value={[isMuted ? 0 : volume * 100]}
                    max={100}
                    step={1}
                    className="w-24 h-1.5"
                    onValueChange={(value) => {
                      const newVolume = value[0] / 100;
                      setVolume(newVolume);
                      setIsMuted(newVolume === 0);
                    }}
                  />
                </div>
                <span className="text-sm text-white">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/20"
                  disabled={!hasPrevEpisode}
                  onClick={onPrevEpisode}
                >
                  <SkipBack className="h-5 w-5" />
                  <span className="sr-only">Previous Episode</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/20"
                  disabled={!hasNextEpisode}
                  onClick={onNextEpisode}
                >
                  <SkipForward className="h-5 w-5" />
                  <span className="sr-only">Next Episode</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
