'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/glass-card';
import { SectionHeader } from '@/components/section-header';
import PlatformBadge from '@/components/PlatformBadge';
import GlowButton from '@/components/GlowButton';
import { GeneratedIdea } from '@/lib/ai/ideaGenerator';

export default function IdeaGenerator() {
  const [selectedPlatform, setSelectedPlatform] = useState('YouTube');
  const [niche, setNiche] = useState('');
  const [tone, setTone] = useState('Educational');
  const [volume, setVolume] = useState(5);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [targetAudience, setTargetAudience] = useState('');
  const [contentLength, setContentLength] = useState('');
  const [hookStyle, setHookStyle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedIdeas, setGeneratedIdeas] = useState<any[]>([]);

  const platforms = [
    { name: 'YouTube', icon: '🎥' },
    { name: 'Instagram', icon: '📱' },
    { name: 'Twitter', icon: '🐦' },
    { name: 'LinkedIn', icon: '💼' },
    { name: 'TikTok', icon: '🎵' },
    { name: 'Newsletter', icon: '✉️' }
  ];

  const tones = ['Educational', 'Entertaining', 'Controversial', 'Inspirational', 'Behind-the-Scenes'];

  const handleGenerateClick = () => {
    setIsGenerating(true);
    // Simulate API call with timeout
    setTimeout(() => {
      const newIdeas = [];
      for (let i = 0; i < volume; i++) {
        newIdeas.push({
          id: i + 1,
          title: `${niche} ${i + 1}: ${platforms.find(p => p.name === selectedPlatform)?.icon || ''} ${tone} Content`,
          platform: selectedPlatform,
          hook: `Discover how to create amazing ${niche} content that ${tone.toLowerCase()} your audience on ${selectedPlatform}.`,
          aiScore: Math.floor(Math.random() * 40) + 60,
          status: 'idea',
          tags: [niche, selectedPlatform, tone]
        });
      }
      setGeneratedIdeas(newIdeas);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">ContentoX Idea Engine</h1>
        <p className="text-text-secondary">Generate high-quality content ideas tailored to your niche and platform</p>
      </div>

      {/* Generator Form */}
      <GlassCard>
        <div className="space-y-6">
          {/* Platform selector */}
          <div>
            <label className="block text-sm font-medium mb-2">Platform</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {platforms.map(platform => (
                <button
                  key={platform.name}
                  onClick={() => setSelectedPlatform(platform.name)}
                  className={`p-4 rounded-lg flex flex-col items-center justify-center transition-all duration-300 ${
                    selectedPlatform === platform.name
                      ? 'bg-accent-primary text-white scale-105'
                      : 'bg-bg-surface text-text-secondary border border-bg-border hover:bg-bg-elevated'
                  }`}
                >
                  <span className="text-2xl mb-2">{platform.icon}</span>
                  <span className="text-sm">{platform.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Niche input */}
          <div>
            <label className="block text-sm font-medium mb-2">Niche</label>
            <input
              type="text"
              placeholder="e.g., Tech, AI, Finance, Fitness, Lifestyle, Gaming"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="input w-full"
            />
          </div>

          {/* Tone selector */}
          <div>
            <label className="block text-sm font-medium mb-2">Tone</label>
            <div className="flex flex-wrap gap-2">
              {tones.map(toneOption => (
                <button
                  key={toneOption}
                  onClick={() => setTone(toneOption)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    tone === toneOption
                      ? 'bg-accent-primary text-white'
                      : 'bg-bg-surface text-text-secondary border border-bg-border'
                  }`}
                >
                  {toneOption}
                </button>
              ))}
            </div>
          </div>

          {/* Volume selector */}
          <div>
            <label className="block text-sm font-medium mb-2">Give me</label>
            <div className="flex gap-2">
              {[3, 5, 10].map(num => (
                <button
                  key={num}
                  onClick={() => setVolume(num)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    volume === num
                      ? 'bg-accent-primary text-white'
                      : 'bg-bg-surface text-text-secondary border border-bg-border'
                  }`}
                >
                  {num} ideas
                </button>
              ))}
            </div>
          </div>

          {/* Advanced options toggle */}
          <div>
            <button
              onClick={() => setAdvancedOpen(!advancedOpen)}
              className="text-sm text-text-secondary hover:text-white flex items-center gap-1"
            >
              {advancedOpen ? 'Hide' : 'Show'} advanced options
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" className={`transform transition-transform ${advancedOpen ? 'rotate-180' : ''}`}>
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Advanced options */}
          {advancedOpen && (
            <div className="space-y-4 pt-4 border-t border-bg-border">
              <div>
                <label className="block text-sm font-medium mb-2">Target Audience</label>
                <input
                  type="text"
                  placeholder="e.g., Beginners, Professionals, Students"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="input w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Content Length</label>
                <input
                  type="text"
                  placeholder="e.g., Short, Medium, Long"
                  value={contentLength}
                  onChange={(e) => setContentLength(e.target.value)}
                  className="input w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Hook Style</label>
                <input
                  type="text"
                  placeholder="e.g., Question, Statement, Story"
                  value={hookStyle}
                  onChange={(e) => setHookStyle(e.target.value)}
                  className="input w-full"
                />
              </div>
            </div>
          )}

          {/* Generate button */}
          <div className="pt-4">
            <GlowButton
              onClick={handleGenerateClick}
              disabled={isGenerating || !niche}
              className="w-full"
            >
              {isGenerating ? 'Generating Ideas...' : 'Generate Ideas →'}
            </GlowButton>
          </div>
        </div>
      </GlassCard>

      {/* Results area */}
      {generatedIdeas.length > 0 && (
        <div className="mt-8">
          <SectionHeader
            title="Generated Ideas"
            description="Here are your custom-generated content ideas"
          />
          <div className="space-y-4">
            {generatedIdeas.map((idea, index) => (
              <div
                key={idea.id}
                className="card animate-typewriter-fade"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{idea.title}</h3>
                  <PlatformBadge platform={idea.platform} />
                </div>

                <p className="text-text-secondary text-sm italic mb-3">{idea.hook}</p>

                <div className="flex items-center gap-3 mb-3">
                  <div className="text-xs bg-bg-border px-2 py-1 rounded-full">{idea.tags.join(', ')}</div>
                </div>

                <div className="flex gap-2">
                  <button className="btn btn-primary">Save to Lab</button>
                  <button className="btn">Discuss this idea</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}