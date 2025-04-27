"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

// Mock genre data
const genres = [
  {
    id: 1,
    name: "Action",
    image: "/placeholder.svg?height=200&width=300&query=anime action scene",
    slug: "action",
  },
  {
    id: 2,
    name: "Romance",
    image: "/placeholder.svg?height=200&width=300&query=anime romance scene",
    slug: "romance",
  },
  {
    id: 3,
    name: "Fantasy",
    image: "/placeholder.svg?height=200&width=300&query=anime fantasy scene",
    slug: "fantasy",
  },
  {
    id: 4,
    name: "Sci-Fi",
    image: "/placeholder.svg?height=200&width=300&query=anime sci-fi scene",
    slug: "sci-fi",
  },
  {
    id: 5,
    name: "Horror",
    image: "/placeholder.svg?height=200&width=300&query=anime horror scene",
    slug: "horror",
  },
  {
    id: 6,
    name: "Comedy",
    image: "/placeholder.svg?height=200&width=300&query=anime comedy scene",
    slug: "comedy",
  },
  {
    id: 7,
    name: "Slice of Life",
    image:
      "/placeholder.svg?height=200&width=300&query=anime slice of life scene",
    slug: "slice-of-life",
  },
  {
    id: 8,
    name: "Sports",
    image: "/placeholder.svg?height=200&width=300&query=anime sports scene",
    slug: "sports",
  },
];

export default function GenreSelector() {
  const [activeGenre, setActiveGenre] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8">
      {genres.map((genre) => (
        <Link
          key={genre.id}
          href={`/genre/${genre.slug}`}
          className={cn(
            "group relative overflow-hidden rounded-lg transition-transform hover:scale-105",
            activeGenre === genre.id &&
              "ring-2 ring-primary ring-offset-2 ring-offset-background"
          )}
          onClick={(e) => {
            e.preventDefault();
            setActiveGenre(genre.id);
          }}
        >
          <div className="aspect-square relative">
            <Image
              src={genre.image || "/placeholder.svg"}
              alt={genre.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-2 text-center">
              <span className="text-sm font-medium text-white">
                {genre.name}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
