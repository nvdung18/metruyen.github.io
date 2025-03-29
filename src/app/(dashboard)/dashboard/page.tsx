'use client';
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { ArrowUpRight, BarChart3, BookOpen, Layers, Users } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import UsersSection from '@/components/dashboard/UsersSection';
import MangaSection from '@/components/dashboard/MangaSection';
import RevenueSection from '@/components/dashboard/RevenueSection';
import { useAppSelector } from '@/lib/redux/hook';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6">
      <DashboardHeader />

      {/* Overview Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/50 border-manga-600/20 hover:border-manga-500/50 hover:shadow-manga-500/10 shadow-lg backdrop-blur-sm transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-lg">
              <span>Total Manga</span>
              <BookOpen className="text-manga-400 h-4 w-4" />
            </CardTitle>
            <CardDescription>Collection size</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-manga-400 text-3xl font-bold">1,248</div>
            <div className="mt-2 flex items-center text-xs text-green-500">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              <span>12% growth</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-manga-600/20 hover:border-manga-500/50 hover:shadow-manga-500/10 shadow-lg backdrop-blur-sm transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-lg">
              <span>Categories</span>
              <Layers className="text-manga-400 h-4 w-4" />
            </CardTitle>
            <CardDescription>Active genres</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-manga-400 text-3xl font-bold">36</div>
            <div className="mt-2 flex items-center text-xs text-green-500">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              <span>4 new this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-manga-600/20 hover:border-manga-500/50 hover:shadow-manga-500/10 shadow-lg backdrop-blur-sm transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-lg">
              <span>Active Users</span>
              <Users className="text-manga-400 h-4 w-4" />
            </CardTitle>
            <CardDescription>User base</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-manga-400 text-3xl font-bold">24,587</div>
            <div className="mt-2 flex items-center text-xs text-green-500">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              <span>18% increase</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-manga-600/20 hover:border-manga-500/50 hover:shadow-manga-500/10 shadow-lg backdrop-blur-sm transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-lg">
              <span>Revenue</span>
              <BarChart3 className="text-manga-400 h-4 w-4" />
            </CardTitle>
            <CardDescription>Monthly income</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-manga-400 text-3xl font-bold">$12,845</div>
            <div className="mt-2 flex items-center text-xs text-green-500">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              <span>8% growth</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator className="bg-manga-600/20 my-6" />

      {/* Main Content Tabs */}

      <RevenueSection />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <UsersSection mini={true} />
        <MangaSection mini={true} />
      </div>
    </div>
  );
};

export default DashboardPage;
