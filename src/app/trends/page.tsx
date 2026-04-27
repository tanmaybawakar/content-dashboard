'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/glass-card';
import { SectionHeader } from '@/components/section-header';
import TagCloud from '@/components/tag-cloud';
import GlowButton from '@/components/GlowButton';

export default function TrendsPage() {
  const [selectedNiche, setSelectedNiche] = useState('Tech');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [isFetching, setIsFetching] = useState(false);
const [trendsData, setTrendsData] = useState<{
  whatIsHot: Array<{ title: string; engagement: string }>;
  risingTopics: string[];
  analysisSummary: string;
  contentOpportunities: string[];
}>({
  whatIsHot: [],
  risingTopics: [],
  analysisSummary: '',
  contentOpportunities: []
});

  const niches = ['Tech', 'AI', 'Finance', 'Fitness', 'Lifestyle', 'Gaming'];
  const platforms = ['All', 'YouTube', 'Instagram', 'Twitter', 'LinkedIn', 'TikTok'];

  const handleFetchTrends = () => {
    setIsFetching(true);
    // Simulate API call with timeout
    setTimeout(() => {
      setTrendsData({
        whatIsHot: [
          { title: 'AI Video Generation', engagement: '+23%' },
          { title: 'Short-form Content', engagement: '+18%' },
          { title: 'Interactive Stories', engagement: '+31%' }
        ],
        risingTopics: [
          'AI Ethics', 'Sustainable Tech', 'Remote Work Tools', 'Personal Finance', 'Health Tech', 'Gaming Communities'
        ],
        analysisSummary: "The current trend landscape shows a strong shift towards interactive and personalized content. AI-generated videos are gaining significant traction, particularly when combined with educational or how-to formats. Short-form content continues to dominate engagement metrics across all platforms, with TikTok leading the charge. Interactive stories that encourage audience participation are showing the highest completion rates.",
        contentOpportunities: [
          "Create AI-generated video tutorials that explain complex concepts in simple terms",
          "Develop short-form content series that build on each other for higher retention",
          "Design interactive stories that ask viewers to make choices affecting the outcome"
        ]
      });
      setIsFetching(false);
    }, 2000);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <SectionHeader
          title="Trend Intelligence"
          description="Stay ahead of the curve with real-time trend data"
        />
        <GlowButton onClick={handleFetchTrends} disabled={isFetching}>
          {isFetching ? 'Fetching Trends...' : 'Fetch Trends'}
        </GlowButton>
      </div>

      {/* Filters */}
      <GlassCard>
        <div className="flex flex-wrap gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Niche</label>
            <select
              value={selectedNiche}
              onChange={(e) => setSelectedNiche(e.target.value)}
              className="input w-full"
            >
              {niches.map(niche => (
                <option key={niche} value={niche}>{niche}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Platform</label>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="input w-full"
            >
              {platforms.map(platform => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Results */}
      {trendsData.whatIsHot.length > 0 && (
        <div className="space-y-6">
          {/* What's Hot */}
          <GlassCard>
            <SectionHeader title="What's Hot" description="Top trending topics right now" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {trendsData.whatIsHot.map((trend, index) => (
                <div
                  key={index}
                  className="p-4 bg-bg-elevated rounded-md border-l-4 border-accent-hot"
                >
                  <h3 className="font-bold text-lg">{trend.title}</h3>
                  <div className="text-xs text-text-secondary mt-1">{trend.engagement} engagement</div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Rising Topics */}
          <GlassCard>
            <SectionHeader title="Rising Topics" description="Emerging trends to watch" />
            <TagCloud>
              {trendsData.risingTopics.map((topic, index) => (
                <span key={index} className="tag tag-trending">
                  {topic}
                </span>
              ))}
            </TagCloud>
          </GlassCard>

          {/* Analysis Summary */}
          <GlassCard>
            <SectionHeader title="Analysis Summary" description="Our AI-generated insights" />
            <p className="text-text-secondary">
              {trendsData.analysisSummary}
            </p>
          </GlassCard>

          {/* Content Opportunities */}
          <GlassCard>
            <SectionHeader title="Content Opportunities" description="Actionable ideas based on current trends" />
            <div className="space-y-3">
              {trendsData.contentOpportunities.map((opportunity, index) => (
                <div key={index} className="p-3 bg-bg-elevated rounded-md">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-accent-green rounded-full mt-2"></div>
                    <div>{opportunity}</div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}