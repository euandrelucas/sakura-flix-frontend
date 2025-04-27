import { Suspense } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import FeaturedCarousel from "@/components/featured-carousel";
import AnimeRow from "@/components/anime-row";
// import GenreSelector from "@/components/genre-selector";
import { Skeleton } from "@/components/ui/skeleton";

// Loading fallback component
function AnimeRowSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex-shrink-0 w-[180px]">
          <Skeleton className="aspect-[2/3] w-full rounded-md" />
          <div className="mt-2 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Hero Section with Featured Carousel */}
      <section className="pt-16">
        <Suspense
          fallback={<Skeleton className="h-[70vh] min-h-[500px] w-full" />}
        >
          <FeaturedCarousel />
        </Suspense>
      </section>

      {/* Genre Selector */}
      {/* <section className="container px-4">
        <h2 className="text-2xl font-bold mb-4">Browse by Genre</h2>
        <GenreSelector />
      </section> */}

      {/* Recently Added Section */}
      <section className="container px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Recently Added</h2>
          <Button variant="link" size="sm" className="gap-1">
            View All <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Suspense fallback={<AnimeRowSkeleton />}>
          <AnimeRow category="recent" />
        </Suspense>
      </section>

      {/* Top Rated Section */}
      <section className="container px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Top Rated</h2>
          <Button variant="link" size="sm" className="gap-1">
            View All <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Suspense fallback={<AnimeRowSkeleton />}>
          <AnimeRow category="top-rated" />
        </Suspense>
      </section>

      {/* Subscription CTA */}
      <section className="container px-4 py-12">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-900 to-orange-900">
          <div className="absolute inset-0 opacity-20 mix-blend-overlay">
            <Image
              src="/vibrant-anime-mashup.png"
              alt="Anime collage"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative z-10 px-6 py-12 text-center md:py-16 md:px-12">
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              Unlimited Anime, Ad-Free Experience
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
              Stream thousands of anime shows and movies in HD quality. Cancel
              anytime.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600"
              >
                Start Your Free Trial
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 bg-white/10 text-white hover:bg-white/20"
              >
                View Plans
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
