/* eslint-disable */
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import SearchContent from "@/components/search-content";

export default function SearchPage() {
  return (
    <div className="container px-4 py-8 pt-24">
      <h1 className="text-3xl font-bold">Search Anime</h1>

      <Suspense fallback={<SearchSkeleton />}>
        <SearchContent />
      </Suspense>
    </div>
  );
}

function SearchSkeleton() {
  return (
    <div className="mt-6">
      <Skeleton className="h-10 w-full max-w-md mb-6" />

      <div className="mt-6 grid gap-6 md:grid-cols-[240px_1fr]">
        {/* Filters Sidebar Skeleton */}
        <Skeleton className="h-[600px] w-full rounded-lg" />

        {/* Results Skeleton */}
        <div>
          <Skeleton className="h-8 w-64 mb-4" />
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
        </div>
      </div>
    </div>
  );
}
