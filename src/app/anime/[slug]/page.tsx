/* eslint-disable */
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Play,
  Plus,
  Share2,
  Star,
  Calendar,
  Clock,
  Tag,
  ChevronRight,
} from "lucide-react";
import EpisodeList from "@/components/episode-list";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// Function to fetch anime details from the API
async function getAnimeDetails(slug: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/anime/info?id=${slug}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch anime details");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching anime details:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const anime = await getAnimeDetails(params.slug);

  if (!anime) {
    return {
      title: "Anime não encontrado",
      description: "Este anime não foi encontrado ou não está disponível.",
    };
  }

  return {
    title: `${anime.title} - Assista agora | SakuraFlix`,
    description: anime.description?.slice(0, 160) || "Assista agora em HD.",
    openGraph: {
      title: `${anime.title} - SakuraFlix`,
      description: anime.description?.slice(0, 160),
      images: [
        {
          url: anime.image || "/placeholder.svg",
          width: 800,
          height: 1200,
          alt: anime.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${anime.title} - SakuraFlix`,
      description: anime.description?.slice(0, 160),
      images: [anime.image || "/placeholder.svg"],
    },
  };
}

export default async function AnimePage({
  params,
}: {
  params: { slug: string };
}) {
  const anime = await getAnimeDetails(params.slug);

  if (!anime) {
    notFound();
  }

  return (
    <div className="flex flex-col">
      {/* Hero Banner */}
      <div className="relative h-[50vh] min-h-[400px] w-full">
        <Image
          src={anime.image || "/placeholder.svg"}
          alt={anime.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-transparent" />
      </div>

      {/* Anime Details */}
      <div className="container px-4 -mt-32 relative z-10">
        <div className="grid gap-6 md:grid-cols-[250px_1fr] lg:grid-cols-[300px_1fr] lg:gap-12">
          {/* Poster */}
          <div className="relative aspect-[2/3] overflow-hidden rounded-lg border shadow-lg">
            <Image
              src={anime.image || "/placeholder.svg"}
              alt={anime.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-3xl font-bold md:text-4xl">{anime.title}</h1>
              <p className="text-lg text-muted-foreground">
                {anime.japaneseTitle}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {anime.genres?.map((genre: string) => (
                <Link
                  key={genre}
                  href={`/genre/${genre.toLowerCase()}`}
                  className="rounded-full bg-muted px-3 py-1 text-xs hover:bg-primary/20"
                >
                  {genre}
                </Link>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">8.7</span>{" "}
                {/* API doesn't provide ratings */}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{anime.season || "Unknown"}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{anime.duration || "24 min per ep"}</span>
              </div>
              <div className="flex items-center gap-1">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span>{anime.type}</span>
              </div>
            </div>

            <p className="text-muted-foreground">{anime.description}</p>

            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                className="gap-2 bg-primary hover:bg-primary/90"
              >
                <Play className="h-5 w-5" fill="currentColor" /> Watch Now
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <Plus className="h-5 w-5" /> Add to List
              </Button>
              <Button size="lg" variant="ghost" className="gap-2">
                <Share2 className="h-5 w-5" /> Share
              </Button>
            </div>

            {anime.status === "Ongoing" && (
              <div className="mt-2 rounded-md bg-muted p-3">
                <p className="text-sm">
                  <span className="font-medium">Status:</span> {anime.status}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Episodes */}
        <div className="mt-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Episodes</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                All Episodes
              </Button>
            </div>
          </div>
          <EpisodeList animeId={anime.id} episodes={anime.episodes || []} />
        </div>

        {/* Recommendations */}
        {anime.recommendations && anime.recommendations.length > 0 && (
          <div className="mt-12 pb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Recommendations</h2>
              <Button variant="link" size="sm" className="gap-1">
                View All <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {anime.recommendations.slice(0, 12).map((rec: any) => (
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

        {/* Related Anime */}
        {anime.relatedAnime && anime.relatedAnime.length > 0 && (
          <div className="mt-12 pb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Related Anime</h2>
              <Button variant="link" size="sm" className="gap-1">
                View All <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {anime.relatedAnime.slice(0, 12).map((related: any) => (
                <Link
                  key={related.id}
                  href={`/anime/${related.id}`}
                  className="group overflow-hidden rounded-lg border bg-card transition-all hover:shadow-md"
                >
                  <div className="relative aspect-[2/3] overflow-hidden">
                    <Image
                      src={related.image || "/placeholder.svg"}
                      alt={related.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium line-clamp-1">
                      {related.title}
                    </h3>
                    <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{related.type}</span>
                      <span>{related.sub || related.episodes || 0} EP</span>
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
