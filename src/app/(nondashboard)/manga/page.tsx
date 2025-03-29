'use client';
import MangaGrid from '@/components/manga/MangaGrid';
import { Button } from '@/components/ui/button';
import { ChevronRight, TrendingUp } from 'lucide-react';
import FeaturedManga from '@/components/manga/FeatureManga';
import Link from 'next/link';
import {
  useGetAllMangaQuery,
  useGetLatestUpdatesQuery,
  useGetNewReleasesQuery,
  useGetPopularMangaQuery
} from '@/services/api';
import { useState } from 'react';
import { useAppSelector } from '@/lib/redux/hook';
import { processMangaData, sortMangaData } from '@/lib/utils';

const Index = () => {
  const [sortOption, setSortOption] = useState('popularity');
  const [isAscending, setIsAscending] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const authState = useAppSelector((state) => state.auth);
  console.log(authState);
  const { data, error, isLoading } = useGetAllMangaQuery({
    page,
    limit
  });

  const { data: popularManga, isLoading: isPopularLoading } =
    useGetPopularMangaQuery({ limit: 20 });

  const { data: latestUpdates, isLoading: isLatestLoading } =
    useGetLatestUpdatesQuery({ limit: 20 });

  const { data: newReleases, isLoading: isNewLoading } = useGetNewReleasesQuery(
    { limit: 20 }
  );

  const mangaData = processMangaData(popularManga, latestUpdates, newReleases, {
    sortBy: sortOption,
    ascending: isAscending,
    limit: 20
  });

  console.log('Mangadata', mangaData);

  return (
    <>
      <FeaturedManga />
      <div className="flex flex-col items-center">
        <section className="manga-section container">
          <MangaGrid
            title="Popular Manga"
            manga={mangaData.popular || []}
            action={
              <Button
                variant="link"
                className="text-manga-400 hover:text-manga-300"
                asChild
              >
                <Link href="/manga/list" className="flex items-center">
                  <TrendingUp className="mr-1 h-4 w-4" />
                  View All <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            }
          />
        </section>

        <section className="manga-section bg-accent/30 container py-12">
          <div className="container">
            <MangaGrid
              title="Latest Updates"
              manga={mangaData.latest || []}
              isLoading={isLatestLoading}
              action={
                <Button
                  variant="link"
                  className="text-manga-400 hover:text-manga-300"
                  asChild
                >
                  <Link href="/updates" className="flex items-center">
                    View All <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              }
            />
          </div>
        </section>

        <section className="manga-section container">
          <MangaGrid
            title="New Releases"
            manga={mangaData.newReleases || []}
            isLoading={isNewLoading}
            action={
              <Button
                variant="link"
                className="text-manga-400 hover:text-manga-300"
                asChild
              >
                <Link href="/new" className="flex items-center">
                  View All <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            }
          />
        </section>

        <section className="bg-manga-800 flex w-full flex-col items-center py-16 text-white">
          <div className="container text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Join Our Manga Community
            </h2>
            <p className="mx-auto mb-8 max-w-3xl text-lg">
              Create an account to track your favorite manga, get personalized
              recommendations, and join discussions with fellow manga
              enthusiasts.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-manga-600 hover:bg-manga-700"
                asChild
              >
                <Link href="/register">Sign Up Now</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-manga-500 text-manga-300 hover:bg-manga-900"
                asChild
              >
                <Link href="/library">Browse Manga Library</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Index;
