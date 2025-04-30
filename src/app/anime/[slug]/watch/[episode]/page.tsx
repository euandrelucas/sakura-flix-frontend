import { Metadata } from "next";
import WatchClient from "./WatchClient";

async function getEpisodeAndAnime(slug: string, episode: string) {
  const episodeId = `${slug}$episode$${episode}`;
  const [episodeData, animeData] = await Promise.all([
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/anime/watch?episodeId=${episodeId}`,
      { cache: "no-store" }
    ).then((r) => (r.ok ? r.json() : null)),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/anime/info?id=${slug}`, {
      cache: "no-store",
    }).then((r) => (r.ok ? r.json() : null)),
  ]);

  return { animeData, episodeData };
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string; episode: string };
}): Promise<Metadata> {
  const { animeData, episodeData } = await getEpisodeAndAnime(
    params.slug,
    params.episode
  );

  if (!animeData || !episodeData) {
    return {
      title: "Episódio não encontrado - SakuraFlix",
      description: "Este episódio não está disponível ou não foi encontrado.",
    };
  }

  const episodeTitle = episodeData?.title || `Episode ${params.episode}`;
  const animeTitle = animeData?.title || params.slug;

  return {
    title: `${episodeTitle} - ${animeTitle} | SakuraFlix`,
    description:
      animeData.description?.slice(0, 160) ||
      "Assista agora gratuitamente com qualidade HD.",
    openGraph: {
      title: `${episodeTitle} - ${animeTitle} | SakuraFlix`,
      description: animeData.description?.slice(0, 160),
      images: [
        {
          url: animeData.image || "/placeholder.svg",
          width: 800,
          height: 1200,
          alt: `${animeTitle} poster`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${episodeTitle} - ${animeTitle}`,
      description: animeData.description?.slice(0, 160),
      images: [animeData.image || "/placeholder.svg"],
    },
    alternates: {
      canonical: `https://sakuraflix.com/anime/${params.slug}/watch/${params.episode}`,
    },
  };
}

// Página principal (server component)
export default async function EpisodePage({
  params,
}: {
  params: { slug: string; episode: string };
}) {
  const { animeData, episodeData } = await getEpisodeAndAnime(
    params.slug,
    params.episode
  );

  if (!animeData || !episodeData) {
    // Use um componente de fallback ou `notFound()`
    return (
      <div className="p-6 text-center text-red-500">
        Episódio não encontrado.
      </div>
    );
  }

  return (
    <WatchClient
      params={params}
    />
  );
}
