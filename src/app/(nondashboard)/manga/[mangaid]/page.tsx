"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Heart,
  Share2,
  Star,
  BookMarked,
  Calendar,
  Eye,
  MessageSquare,
} from "lucide-react";
import { allManga } from "@/data/mockData";
import MangaGrid from "@/components/manga/MangaGrid";
import { useParams } from "next/navigation";

const MangaDetails = () => {
  const params = useParams();
  const mangaid = params.mangaid as string;
  const manga = allManga.find((m) => m.id === mangaid);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  // Related manga - just grab some random ones for demo
  const relatedManga = allManga
    .filter((m) => m.id !== mangaid)
    .filter((m) => manga && m.genres.some((g) => manga.genres.includes(g)))
    .slice(0, 5);

  if (!manga) {
    return (
      <div className="container py-20 text-center">
        <h1 className="mb-4 text-2xl font-bold">Manga Not Found</h1>
        <p className="mb-6">The manga you're looking for doesn't exist.</p>
        <Button asChild>
          <Link href="/library">Back to Library</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* Banner Image */}
      <div className="bg-card relative h-[40vh] w-full overflow-hidden">
        <div className="from-background via-background/80 absolute inset-0 z-10 bg-gradient-to-t to-transparent" />
        <img
          src={manga.bannerImage || manga.coverImage}
          alt={manga.title}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="container py-6 md:py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4">
          {/* Left Column - Cover & Metadata */}
          <div className="col-span-1">
            <div className="sticky top-20">
              {/* Cover Image */}
              <div className="border-border mb-6 overflow-hidden rounded-lg border">
                <img
                  src={manga.coverImage}
                  alt={manga.title}
                  className="aspect-[3/4] w-full object-cover"
                />
              </div>

              {/* Info Box */}
              <div className="bg-card border-border mb-6 rounded-lg border p-4">
                <h3 className="mb-3 text-lg font-medium">Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Status</span>
                    <span className="capitalize">{manga.status}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Author</span>
                    <span>{manga.author}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Artist</span>
                    <span>{manga.artist}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Released</span>
                    <span>{manga.publicationYear}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Chapters</span>
                    <span>{manga.chapters}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  className="bg-manga-600 hover:bg-manga-700 w-full"
                  asChild
                >
                  <Link href={`/${mangaid}/read`}>
                    <BookOpen className="mr-2 h-4 w-4" /> Start Reading
                  </Link>
                </Button>
                <div className="grid grid-cols-3 gap-3">
                  <Button variant="outline" className="w-full">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full">
                    <BookMarked className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details & Tabs */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <div className="mb-6">
              <h1 className="mb-2 text-3xl font-bold md:text-4xl">
                {manga.title}
              </h1>

              {/* Statistics */}
              <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                <div className="flex items-center">
                  <Star className="mr-1 h-4 w-4 text-yellow-400" />
                  <span>{manga.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="text-manga-400 mr-1 h-4 w-4" />
                  <span>{manga.chapters} chapters</span>
                </div>
                <div className="flex items-center">
                  <Eye className="text-muted-foreground mr-1 h-4 w-4" />
                  <span>{(manga.views / 1000).toFixed(0)}k views</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="text-muted-foreground mr-1 h-4 w-4" />
                  <span>{manga.publicationYear}</span>
                </div>
              </div>

              {/* Genres */}
              <div className="mb-4 flex flex-wrap gap-2">
                {manga.genres.map((genre) => (
                  <Badge key={genre} variant="outline">
                    {genre}
                  </Badge>
                ))}
              </div>

              {/* Synopsis */}
              <div className="bg-card border-border mb-6 rounded-lg border p-4">
                <h3 className="mb-2 font-medium">Synopsis</h3>
                <p
                  className={`text-muted-foreground ${
                    !isDescExpanded && "line-clamp-4"
                  }`}
                >
                  {manga.synopsis}
                </p>
                {manga.synopsis.length > 100 && (
                  <Button
                    variant="link"
                    className="text-manga-400 mt-1 h-auto p-0"
                    onClick={() => setIsDescExpanded(!isDescExpanded)}
                  >
                    {isDescExpanded ? "Show Less" : "Read More"}
                  </Button>
                )}
              </div>

              {/* Tabs */}
              <Tabs defaultValue="chapters" className="w-full">
                <TabsList className="bg-card border-border w-full justify-start rounded-none border-b">
                  <TabsTrigger value="chapters" className="flex-1 md:flex-none">
                    Chapters
                  </TabsTrigger>
                  <TabsTrigger value="comments" className="flex-1 md:flex-none">
                    Comments
                  </TabsTrigger>
                  <TabsTrigger value="related" className="flex-1 md:flex-none">
                    Related
                  </TabsTrigger>
                </TabsList>

                {/* Chapters Tab */}
                <TabsContent value="chapters" className="pt-4">
                  <div className="space-y-4">
                    {Array.from({ length: 15 }, (_, i) => manga.chapters - i)
                      .filter((num) => num > 0)
                      .map((chapterNum) => (
                        <div
                          key={chapterNum}
                          className="bg-card border-border hover:border-manga-500 rounded-lg border p-4 transition-colors"
                        >
                          <Link
                            href={`/manga/${mangaid}/chapters/${chapterNum}`}
                            className="flex items-center justify-between"
                          >
                            <div>
                              <h4 className="font-medium">
                                Chapter {chapterNum}
                              </h4>
                              <p className="text-muted-foreground text-sm">
                                {new Date(
                                  Date.now() - chapterNum * 24 * 60 * 60 * 1000,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <Button variant="ghost" size="sm">
                              <BookOpen className="mr-2 h-4 w-4" /> Read
                            </Button>
                          </Link>
                        </div>
                      ))}
                  </div>
                </TabsContent>

                {/* Comments Tab */}
                <TabsContent value="comments" className="pt-4">
                  <div className="bg-card border-border mb-4 rounded-lg border p-4">
                    <div className="mb-6 flex items-center gap-x-4">
                      <MessageSquare className="text-manga-400 h-5 w-5" />
                      <h3 className="font-medium">Discussion</h3>
                    </div>

                    <div className="py-6 text-center">
                      <p className="text-muted-foreground mb-4">
                        Join the conversation about {manga.title}
                      </p>
                      <Button className="bg-manga-600 hover:bg-manga-700">
                        Sign In to Comment
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* Related Tab */}
                <TabsContent value="related" className="pt-4">
                  <MangaGrid manga={relatedManga} columns={4} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MangaDetails;
