"use client";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  Settings,
  BookOpen,
  BookMarked,
  Clock,
  Edit,
  Save,
  Eye,
  Bell,
  Moon,
  Sun,
  Shield,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { allManga } from "@/data/mockData";
import { toast } from "sonner";

interface Manga {
  id: string;
  title: string;
  coverImage: string;
  progress?: string;
}

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("Manga Enthusiast");
  const [bio, setBio] = useState(
    "I love reading manga, especially fantasy and action genres!",
  );
  const [darkMode, setDarkMode] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [recentlyRead, setRecentlyRead] = useState<Manga[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Generate data only on client-side
  useEffect(() => {
    // Generate the random data only on client
    const mangaWithProgress: Manga[] = allManga.slice(0, 4).map((manga) => ({
      ...manga,
      progress: `Chapter ${Math.floor(Math.random() * 30) + 1}/${Math.floor(Math.random() * 50) + 30}`,
    }));

    setRecentlyRead(mangaWithProgress);
    setIsLoaded(true);
  }, []);

  const favorites = allManga.slice(4, 12);

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast("Your profile information has been updated successfully.");
  };

  return (
    <div className="animate-fade-in container mx-auto px-4 py-8 md:px-6">
      <h1 className="manga-heading mb-8 text-3xl md:text-4xl">My Profile</h1>

      {/* Profile Header */}
      <div className="bg-card mb-8 rounded-lg p-6">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
          <div className="relative">
            <div className="bg-manga-600 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full text-4xl text-white">
              {!isEditing ? (
                <User size={48} />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Edit size={24} />
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="max-w-md"
                  />
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Input
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="max-w-md"
                  />
                </div>
              </div>
            ) : (
              <>
                <h2 className="mb-2 text-2xl font-bold">{displayName}</h2>
                <p className="text-muted-foreground mb-4">{bio}</p>
                <p className="text-muted-foreground text-sm">
                  Member since January 2023
                </p>
              </>
            )}
          </div>

          <div>
            <Button
              onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
              className="bg-manga-600 hover:bg-manga-700"
            >
              {isEditing ? (
                <>
                  <Save className="mr-2 h-4 w-4" /> Save
                </>
              ) : (
                <>
                  <Edit className="mr-2 h-4 w-4" /> Edit Profile
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="reading" className="w-full">
        <TabsList className="bg-card mb-8 grid h-auto w-full grid-cols-4 gap-4 p-1">
          <TabsTrigger
            value="reading"
            className="data-[state=active]:bg-manga-600/20 py-3"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Reading History</span>
            <span className="sm:hidden">History</span>
          </TabsTrigger>
          <TabsTrigger
            value="favorites"
            className="data-[state=active]:bg-manga-600/20 py-3"
          >
            <BookMarked className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Favorites</span>
            <span className="sm:hidden">Favs</span>
          </TabsTrigger>
          <TabsTrigger
            value="stats"
            className="data-[state=active]:bg-manga-600/20 py-3"
          >
            <Clock className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Statistics</span>
            <span className="sm:hidden">Stats</span>
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="data-[state=active]:bg-manga-600/20 py-3"
          >
            <Settings className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
            <span className="sm:hidden">Set</span>
          </TabsTrigger>
        </TabsList>

        {/* Reading History */}
        <TabsContent value="reading" className="bg-card rounded-lg p-6">
          <h3 className="mb-6 text-xl font-semibold">Recently Read</h3>
          <div className="space-y-4">
            {recentlyRead.map((manga) => (
              <div
                key={manga.id}
                className="hover:bg-accent flex items-center gap-4 rounded-lg p-2 transition-colors"
              >
                <img
                  src={manga.coverImage}
                  alt={manga.title}
                  className="h-24 w-16 rounded-md object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{manga.title}</h4>
                  <p className="text-sm">{manga.progress}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs"
                  onClick={() =>
                    (window.location.href = `/manga/${manga.id}/chapter/1`)
                  }
                >
                  <Eye className="mr-1 h-3 w-3" /> Continue
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Favorites */}
        <TabsContent value="favorites" className="bg-card rounded-lg p-6">
          <h3 className="mb-6 text-xl font-semibold">My Favorites</h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {favorites.map((manga) => (
              <div key={manga.id} className="group relative">
                <img
                  src={manga.coverImage}
                  alt={manga.title}
                  className="aspect-[3/4] w-full rounded-md object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-md bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="absolute right-0 bottom-0 left-0 p-3">
                    <p className="text-sm font-medium text-white">
                      {manga.title}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/20 text-xs text-white hover:bg-white/10"
                        onClick={() =>
                          (window.location.href = `/manga/${manga.id}`)
                        }
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs text-white hover:bg-white/10"
                        onClick={() =>
                          toast.success(
                            `${manga.title} has been removed from your favorites.`,
                          )
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Statistics */}
        <TabsContent value="stats" className="bg-card rounded-lg p-6">
          <h3 className="mb-6 text-xl font-semibold">
            Your Reading Statistics
          </h3>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="bg-accent rounded-lg p-4 text-center">
              <h4 className="text-muted-foreground mb-2">Manga Read</h4>
              <p className="text-manga-500 text-4xl font-bold">42</p>
            </div>

            <div className="bg-accent rounded-lg p-4 text-center">
              <h4 className="text-muted-foreground mb-2">Chapters Read</h4>
              <p className="text-manga-500 text-4xl font-bold">873</p>
            </div>

            <div className="bg-accent rounded-lg p-4 text-center">
              <h4 className="text-muted-foreground mb-2">Reading Time</h4>
              <p className="text-manga-500 text-4xl font-bold">164h</p>
            </div>
          </div>

          <div className="mt-8">
            <h4 className="mb-4 font-medium">Top Genres</h4>
            <div className="space-y-3">
              {["Action", "Fantasy", "Romance", "Adventure"].map(
                (genre, index) => (
                  <div key={genre} className="flex items-center">
                    <div className="w-24 text-sm">{genre}</div>
                    <div className="bg-accent h-4 flex-1 overflow-hidden rounded-full">
                      <div
                        className="bg-manga-600 h-full"
                        style={{ width: `${100 - index * 15}%` }}
                      ></div>
                    </div>
                    <div className="w-12 text-right text-sm">
                      {100 - index * 15}%
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings" className="bg-card rounded-lg p-6">
          <h3 className="mb-6 text-xl font-semibold">Account Settings</h3>

          <div className="space-y-6">
            <div>
              <h4 className="mb-4 font-medium">Appearance</h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {darkMode ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                  <span>Dark Mode</span>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="mb-4 font-medium">Notifications</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    <span>Email Notifications</span>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    <span>Push Notifications</span>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="mb-4 font-medium">Security</h4>
              <div className="space-y-4">
                <Button variant="outline" className="w-full md:w-auto">
                  <Shield className="mr-2 h-4 w-4" /> Change Password
                </Button>
                <div>
                  <Button
                    variant="outline"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 w-full md:w-auto"
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
