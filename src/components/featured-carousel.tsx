"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Play, ChevronLeft, ChevronRight, Star } from "lucide-react";
import Link from "next/link";

// Mock featured anime data
const featuredAnime = [
  {
    id: "demon-slayer-kimetsu-no-yaiba-47",
    title: "Demon Slayer: Kimetsu no Yaiba",
    description:
      "Tanjiro Kamado's peaceful life is shattered when his family is slaughtered by a demon. His sister Nezuko is the sole survivor, but she has been transformed into a demon herself.",
    image: "/demon-slayer-landscape.png",
    genres: ["Action", "Fantasy", "Historical"],
    rating: 9.2,
    year: 2019,
    slug: "demon-slayer",
  },
  {
    id: "attack-on-titan-final-season-part-1-15548",
    title: "Attack on Titan: Final Season",
    description:
      "With Eren and company now at the shoreline, the truth of the world outside the walls is finally revealed. Will humanity's freedom be worth the cost?",
    image: "/titan-battlefield.png",
    genres: ["Action", "Drama", "Fantasy"],
    rating: 9.5,
    year: 2020,
    slug: "attack-on-titan",
  },
  {
    id: "jujutsu-kaisen-2nd-season-18413",
    title: "Jujutsu Kaisen",
    description:
      "A boy swallows a cursed talisman - the finger of a demon - and becomes cursed himself. He enters a shaman school to be able to locate the demon's other body parts and thus exorcise himself.",
    image: "/cursed-energy-vista.png",
    genres: ["Action", "Supernatural"],
    rating: 8.9,
    year: 2020,
    slug: "jujutsu-kaisen",
  },
];

export default function FeaturedCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) =>
      prev === featuredAnime.length - 1 ? 0 : prev + 1
    );
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) =>
      prev === 0 ? featuredAnime.length - 1 : prev - 1
    );
  }, []);

  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  return (
    <div
      className="relative h-[70vh] min-h-[500px] w-full overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Slides */}
      <div className="relative h-full w-full">
        {featuredAnime.map((anime, index) => (
          <div
            key={anime.id}
            className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ${
              index === currentSlide
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={anime.image || "/placeholder.svg"}
                alt={anime.title}
                fill
                priority={index === currentSlide}
                className="object-cover"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-transparent" />
            </div>

            {/* Content */}
            <div className="container relative z-10 flex h-full items-center px-4">
              <div className="max-w-2xl pt-24">
                <div className="mb-4 flex items-center gap-2">
                  <span className="rounded bg-primary/20 px-2 py-1 text-xs font-medium text-primary">
                    Featured
                  </span>
                  <span className="flex items-center gap-1 text-sm text-yellow-400">
                    <Star className="h-4 w-4 fill-yellow-400" /> {anime.rating}
                  </span>
                </div>
                <h1 className="mb-2 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                  {anime.title}
                </h1>
                <div className="mb-4 flex flex-wrap gap-2">
                  {anime.genres.map((genre) => (
                    <span
                      key={genre}
                      className="rounded-full bg-muted px-3 py-1 text-xs"
                    >
                      {genre}
                    </span>
                  ))}
                  <span className="rounded-full bg-muted px-3 py-1 text-xs">
                    {anime.year}
                  </span>
                </div>
                <p className="mb-6 max-w-lg text-muted-foreground md:text-lg">
                  {anime.description}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href={`/anime/${anime.id}`} passHref>
                    <Button
                      size="lg"
                      className="gap-2 bg-primary hover:bg-primary/90"
                    >
                      <Play className="h-5 w-5" /> Watch Now
                    </Button>
                  </Link>
                  {/* <Button size="lg" variant="outline" className="gap-2">
                    <Info className="h-5 w-5" /> More Info
                  </Button> */}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className="absolute inset-y-0 left-4 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-full bg-background/20 text-white backdrop-blur-sm hover:bg-background/40"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="sr-only">Previous</span>
        </Button>
      </div>
      <div className="absolute inset-y-0 right-4 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-full bg-background/20 text-white backdrop-blur-sm hover:bg-background/40"
          onClick={nextSlide}
        >
          <ChevronRight className="h-6 w-6" />
          <span className="sr-only">Next</span>
        </Button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
        {featuredAnime.map((_, index) => (
          <button
            key={index}
            className={`h-1.5 rounded-full transition-all ${
              index === currentSlide
                ? "w-8 bg-primary"
                : "w-3 bg-white/50 hover:bg-white/80"
            }`}
            onClick={() => setCurrentSlide(index)}
          >
            <span className="sr-only">Slide {index + 1}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
