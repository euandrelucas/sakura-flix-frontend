"use client";
import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Play,
  Calendar,
  Clock,
  Star,
  ChevronRight,
  Settings,
  Bell,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock user data
const userData = {
  name: "Anime Fan",
  email: "user@example.com",
  avatar: "/vibrant-anime-student.png",
  plan: "Premium",
  joinDate: "January 2023",
  watchTime: "120 hours",
  watchlist: [
    {
      id: 1,
      title: "Demon Slayer",
      image: "/demon-slayer-inspired-team.png",
      progress: 75,
      episodesWatched: 18,
      totalEpisodes: 24,
      slug: "demon-slayer",
    },
    {
      id: 2,
      title: "Attack on Titan",
      image:
        "/placeholder.svg?height=400&width=300&query=attack on titan anime poster",
      progress: 45,
      episodesWatched: 40,
      totalEpisodes: 87,
      slug: "attack-on-titan",
    },
    {
      id: 3,
      title: "Jujutsu Kaisen",
      image:
        "/placeholder.svg?height=400&width=300&query=jujutsu kaisen anime poster",
      progress: 30,
      episodesWatched: 7,
      totalEpisodes: 24,
      slug: "jujutsu-kaisen",
    },
    {
      id: 4,
      title: "My Hero Academia",
      image:
        "/placeholder.svg?height=400&width=300&query=my hero academia anime poster",
      progress: 60,
      episodesWatched: 70,
      totalEpisodes: 113,
      slug: "my-hero-academia",
    },
  ],
  history: [
    {
      id: 1,
      title: "Demon Slayer",
      episode: "Episode 18: A Forged Bond",
      image:
        "/placeholder.svg?height=180&width=320&query=demon slayer episode thumbnail",
      watchedAt: "Today, 2:30 PM",
      progress: 75,
      slug: "demon-slayer",
      episodeSlug: "episode-18",
    },
    {
      id: 2,
      title: "Attack on Titan",
      episode: "Episode 40: Old Story",
      image:
        "/placeholder.svg?height=180&width=320&query=attack on titan episode thumbnail",
      watchedAt: "Yesterday, 8:15 PM",
      progress: 100,
      slug: "attack-on-titan",
      episodeSlug: "episode-40",
    },
    {
      id: 3,
      title: "Jujutsu Kaisen",
      episode: "Episode 7: Assault",
      image:
        "/placeholder.svg?height=180&width=320&query=jujutsu kaisen episode thumbnail",
      watchedAt: "2 days ago, 10:45 PM",
      progress: 100,
      slug: "jujutsu-kaisen",
      episodeSlug: "episode-7",
    },
  ],
  recommendations: [
    {
      id: 1,
      title: "Chainsaw Man",
      image:
        "/placeholder.svg?height=400&width=300&query=chainsaw man anime poster",
      rating: 8.8,
      year: 2022,
      episodes: 12,
      slug: "chainsaw-man",
    },
    {
      id: 2,
      title: "Spy x Family",
      image:
        "/placeholder.svg?height=400&width=300&query=spy family anime poster",
      rating: 8.6,
      year: 2022,
      episodes: 25,
      slug: "spy-x-family",
    },
    {
      id: 3,
      title: "Tokyo Revengers",
      image:
        "/placeholder.svg?height=400&width=300&query=tokyo revengers anime poster",
      rating: 8.3,
      year: 2021,
      episodes: 24,
      slug: "tokyo-revengers",
    },
    {
      id: 4,
      title: "Vinland Saga",
      image: "/vinland-journey.png",
      rating: 8.8,
      year: 2019,
      episodes: 24,
      slug: "vinland-saga",
    },
  ],
};

export default function UserDashboard() {
  return (
    <div className="container px-4 py-8 pt-24">
      <div className="flex flex-col gap-8">
        {/* User Profile Section */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
          <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-primary/20">
            <Image
              src={userData.avatar || "/placeholder.svg"}
              alt={userData.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-1 flex-col text-center sm:text-left">
            <h1 className="text-2xl font-bold">{userData.name}</h1>
            <p className="text-muted-foreground">{userData.email}</p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-4 sm:justify-start">
              <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <span>{userData.plan} Plan</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>Joined {userData.joinDate}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>{userData.watchTime} watched</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </Button>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <Tabs defaultValue="watchlist" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="recommendations">For You</TabsTrigger>
          </TabsList>

          {/* Watchlist Tab */}
          <TabsContent value="watchlist" className="mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">My Watchlist</h2>
              <Button variant="link" size="sm" className="gap-1">
                View All <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {userData.watchlist.map((anime) => (
                <Card key={anime.id} className="overflow-hidden">
                  <div className="relative aspect-[2/3] overflow-hidden">
                    <Image
                      src={anime.image || "/placeholder.svg"}
                      alt={anime.title}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity hover:opacity-100">
                      <Button size="sm" variant="secondary" className="gap-2">
                        <Play className="h-4 w-4" fill="currentColor" />{" "}
                        Continue
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium line-clamp-1">{anime.title}</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {anime.episodesWatched} / {anime.totalEpisodes}{" "}
                          Episodes
                        </span>
                        <span>{anime.progress}%</span>
                      </div>
                      <Progress value={anime.progress} className="h-1.5" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Watch History</h2>
              <Button variant="link" size="sm" className="gap-1">
                View All <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-4 space-y-4">
              {userData.history.map((item) => (
                <div
                  key={item.id}
                  className="flex overflow-hidden rounded-lg border bg-card hover:bg-accent/50"
                >
                  <div className="relative h-24 w-44 flex-shrink-0 overflow-hidden">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity hover:opacity-100">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 rounded-full p-0"
                      >
                        <Play className="h-4 w-4" fill="currentColor" />
                        <span className="sr-only">Play</span>
                      </Button>
                    </div>
                    {item.progress < 100 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-center p-4">
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.episode}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.watchedAt}
                    </p>
                  </div>
                  <div className="flex items-center p-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full"
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
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="12" cy="5" r="1" />
                            <circle cx="12" cy="19" r="1" />
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Remove from history</DropdownMenuItem>
                        <DropdownMenuItem>Mark as unwatched</DropdownMenuItem>
                        <DropdownMenuItem>Add to watchlist</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Recommended For You</h2>
              <Button variant="link" size="sm" className="gap-1">
                View All <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {userData.recommendations.map((anime) => (
                <Link
                  key={anime.id}
                  href={`/anime/${anime.slug}`}
                  className="group overflow-hidden rounded-lg border bg-card transition-all hover:shadow-md"
                >
                  <div className="relative aspect-[2/3] overflow-hidden">
                    <Image
                      src={anime.image || "/placeholder.svg"}
                      alt={anime.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute bottom-2 right-2 rounded-full bg-black/70 px-2 py-1 text-xs font-medium backdrop-blur-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {anime.rating}
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium line-clamp-1">{anime.title}</h3>
                    <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{anime.year}</span>
                      <span>{anime.episodes} EP</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
