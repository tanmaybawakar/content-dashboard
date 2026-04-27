'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatCard from '@/components/StatCard';
import IdeaCard from '@/components/IdeaCard';
import CompetitorRow from '@/components/CompetitorRow';
import CalendarGrid from '@/components/CalendarGrid';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import MiniSparkline from '@/components/MiniSparkline';
import { useIdeas } from '@/hooks/useIdeas';
import { useCompetitors } from '@/hooks/useCompetitors';
import { useCalendar } from '@/hooks/useCalendar';
import { useTrends } from '@/hooks/useTrends';

// Define types for our data
interface Stat {
  value: number;
  title: string;
  trend: 'up' | 'down';
  sparklineData: number[];
}

interface TrendReport {
  id: string;
  title: string;
  summary: string;
  topics: string[];
  score: number;
}

export default function Home() {
  const { ideas, loading: ideasLoading } = useIdeas();
  const { competitors, loading: competitorsLoading } = useCompetitors();
  const { events, loading: eventsLoading } = useCalendar();
  const { trends, loading: trendsLoading } = useTrends();

  // Calculate stats for the top bar
  const stats: Stat[] = [
    {
      value: ideas.length,
      title: 'Total Content Ideas',
      trend: 'up',
      sparklineData: [10, 15, 12, 18, 20, 25, 30],
    },
    {
      value: ideas.filter(idea =>
        new Date(idea.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length,
      title: 'Ideas This Week',
      trend: 'up',
      sparklineData: [5, 3, 7, 6, 8, 9, 10],
    },
    {
      value: competitors.length,
      title: 'Competitors Tracked',
      trend: 'up',
      sparklineData: [2, 3, 4, 5, 6, 7, 8],
    },
    {
      value: events.filter(event =>
        new Date(event.date).getMonth() === new Date().getMonth()
      ).length,
      title: 'Scheduled This Month',
      trend: 'up',
      sparklineData: [3, 5, 4, 6, 7, 8, 9],
    },
  ];

  // Get trending now data
  const trendingNow = trends.slice(0, 3);

  // Get competitor pulse data
  const competitorPulse = competitors.slice(0, 3).map(competitor => ({
    ...competitor,
    status: new Date().getTime() - new Date(competitor.lastScrapedAt || '').getTime() < 24 * 60 * 60 * 1000 ? 'green' : 'yellow',
  }));

  // Get upcoming scheduled data
  const upcomingScheduled = events.filter(event =>
    new Date(event.date) >= new Date() &&
    new Date(event.date) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="p-6">
      {/* Top Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            trend={stat.trend}
          >
            <div className="mt-2 h-10">
              <MiniSparkline data={stat.sparklineData} width={100} height={40} />
            </div>
          </StatCard>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left column - Content Pipeline */}
        <div className="lg:col-span-2">
          <Card className="bg-[var(--bg-surface)] border-[var(--bg-border)]">
            <CardHeader>
              <CardTitle>Content Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              {ideasLoading ? (
                <LoadingSkeleton count={3} height="120px" />
              ) : (
                <div className="flex space-x-4 overflow-x-auto pb-4">
                  {/* Idea status lanes */}
                  {['idea', 'drafted', 'scheduled', 'published'].map(status => (
                    <div key={status} className="min-w-[250px]">
                      <h3 className="text-sm font-semibold mb-3 capitalize">{status}</h3>
                      <div className="space-y-3">
                        {ideas
                          .filter(idea => idea.status === status)
                          .slice(0, 4)
                          .map(idea => (
                            <IdeaCard key={idea.id} idea={idea} />
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column - Trending Now & Competitor Pulse */}
        <div className="space-y-6">
          {/* Trending Now */}
          <Card className="bg-[var(--bg-surface)] border-[var(--bg-border)]">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Trending Now</CardTitle>
                <button className="text-sm text-[var(--accent-secondary)] hover:text-[var(--accent-primary)]">
                  Refresh
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {trendsLoading ? (
                <LoadingSkeleton count={3} height="80px" />
              ) : (
                <div className="space-y-3">
                  {trendingNow.map(trend => (
                    <div key={trend.id} className="p-3 rounded-lg bg-[var(--bg-elevated)]">
                      <h4 className="font-semibold mb-1">{trend.title}</h4>
                      <p className="text-sm text-[var(--text-secondary)] mb-2">{trend.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {trend.relatedTopics?.slice(0, 3).map(topic => (
                          <span key={topic} className="px-2 py-1 text-xs bg-[var(--accent-secondary)]/20 text-[var(--accent-secondary)] rounded-full">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Competitor Pulse */}
          <Card className="bg-[var(--bg-surface)] border-[var(--bg-border)]">
            <CardHeader>
              <CardTitle>Competitor Pulse</CardTitle>
            </CardHeader>
            <CardContent>
              {competitorsLoading ? (
                <LoadingSkeleton count={3} height="60px" />
              ) : (
                <div className="space-y-3">
                  {competitorPulse.map(competitor => (
                    <CompetitorRow key={competitor.id} competitor={competitor} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom row - Upcoming Scheduled */}
      <div className="mb-6">
        <Card className="bg-[var(--bg-surface)] border-[var(--bg-border)]">
          <CardHeader>
            <CardTitle>Upcoming Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            {eventsLoading ? (
              <LoadingSkeleton count={1} height="100px" />
            ) : (
              <div className="flex space-x-4 overflow-x-auto pb-4">
                {upcomingScheduled.map(event => (
                  <div key={event.id} className="min-w-[120px] p-3 rounded-lg bg-[var(--bg-elevated)]">
                    <div className="text-sm font-semibold mb-1">{new Date(event.date).toLocaleDateString()}</div>
                    <div className="text-xs text-[var(--text-secondary)] mb-1">{event.title}</div>
                    <div className="flex items-center gap-1">
                      <div className={`w-3 h-3 rounded-full ${event.platform === 'YouTube' ? 'bg-red-500' : event.platform === 'Instagram' ? 'bg-purple-500' : event.platform === 'Twitter' ? 'bg-blue-500' : event.platform === 'LinkedIn' ? 'bg-blue-700' : 'bg-black'}`}></div>
                      <span className="text-xs">{event.platform}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}