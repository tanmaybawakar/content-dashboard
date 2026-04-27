'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Filter, ArrowUp, ArrowDown, X } from 'lucide-react';
import { GlassCard } from '@/components/glass-card';
import { SectionHeader } from '@/components/section-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import IdeaCard from '@/components/IdeaCard';
import Drawer from '@/components/Drawer';
import { useIdeas } from '@/hooks/useIdeas';
import LoadingSkeleton from '@/components/LoadingSkeleton';

// Define types for our data
interface Idea {
  id: string;
  title: string;
  platform: string;
  caption: string;
  postType: string;
  status: string;
  scheduledAt?: string;
  publishedAt?: string;
  tags: string[];
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface PlatformFilter {
  name: string;
  value: string;
  color: string;
}

interface StatusFilter {
  name: string;
  value: string;
  color: string;
}

export default function IdeasPage() {
  const { ideas, loading, error, refetch, createIdea, updateIdea, deleteIdea } = useIdeas();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [sortBy, setSortBy] = useState<'title' | 'createdAt' | 'updatedAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Platform filters
  const platformFilters: PlatformFilter[] = [
    { name: 'All', value: '', color: 'bg-gray-500' },
    { name: 'YouTube', value: 'YouTube', color: 'bg-red-500' },
    { name: 'Instagram', value: 'Instagram', color: 'bg-purple-500' },
    { name: 'Twitter', value: 'Twitter', color: 'bg-blue-500' },
    { name: 'LinkedIn', value: 'LinkedIn', color: 'bg-blue-700' },
    { name: 'TikTok', value: 'TikTok', color: 'bg-black' },
    { name: 'Newsletter', value: 'Newsletter', color: 'bg-indigo-500' },
  ];

  // Status filters
  const statusFilters: StatusFilter[] = [
    { name: 'All', value: '', color: 'bg-gray-500' },
    { name: 'Idea', value: 'idea', color: 'bg-purple-500' },
    { name: 'Drafted', value: 'drafted', color: 'bg-cyan-500' },
    { name: 'Scheduled', value: 'scheduled', color: 'bg-yellow-500' },
    { name: 'Published', value: 'published', color: 'bg-green-500' },
    { name: 'Archived', value: 'archived', color: 'bg-gray-600' },
  ];

  // Filter and sort ideas
  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPlatform = !selectedPlatform || idea.platform === selectedPlatform;
    const matchesStatus = !selectedStatus || idea.status === selectedStatus;

    return matchesSearch && matchesPlatform && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'title') {
      return sortOrder === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
    } else if (sortBy === 'createdAt') {
      return sortOrder === 'asc' ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === 'updatedAt') {
      return sortOrder === 'asc' ? new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime() : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
    return 0;
  });

  // Handle idea selection for drawer
  const handleIdeaClick = (idea: Idea) => {
    setSelectedIdea(idea);
    setShowDrawer(true);
  };

  // Handle drawer close
  const handleDrawerClose = () => {
    setShowDrawer(false);
    setSelectedIdea(null);
  };

  // Handle sorting change
  const handleSortChange = (newSortBy: 'title' | 'createdAt' | 'updatedAt') => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <SectionHeader
        title="Ideas Lab"
        description="Manage your content ideas across all platforms."
        actions={
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Generate Ideas
          </Button>
        }
      />

      {/* Filters bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]" />
          <Input
            placeholder="Search ideas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Platform filters */}
        <div className="flex flex-wrap gap-2">
          {platformFilters.map(filter => (
            <Badge
              key={filter.value}
              variant={selectedPlatform === filter.value ? 'default' : 'outline'}
              className={`cursor-pointer ${selectedPlatform === filter.value ? filter.color : ''}`}
              onClick={() => setSelectedPlatform(selectedPlatform === filter.value ? null : filter.value)}
            >
              {filter.name}
            </Badge>
          ))}
        </div>

        {/* Status filters */}
        <div className="flex flex-wrap gap-2">
          {statusFilters.map(filter => (
            <Badge
              key={filter.value}
              variant={selectedStatus === filter.value ? 'default' : 'outline'}
              className={`cursor-pointer ${selectedStatus === filter.value ? filter.color : ''}`}
              onClick={() => setSelectedStatus(selectedStatus === filter.value ? null : filter.value)}
            >
              {filter.name}
            </Badge>
          ))}
        </div>

        {/* Sort options */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--text-secondary)]">Sort by:</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSortChange('title')}
            className={sortBy === 'title' ? 'text-[var(--accent-primary)]' : ''}
          >
            Title
            {sortBy === 'title' && (
              sortOrder === 'asc' ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSortChange('createdAt')}
            className={sortBy === 'createdAt' ? 'text-[var(--accent-primary)]' : ''}
          >
            Created
            {sortBy === 'createdAt' && (
              sortOrder === 'asc' ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSortChange('updatedAt')}
            className={sortBy === 'updatedAt' ? 'text-[var(--accent-primary)]' : ''}
          >
            Updated
            {sortBy === 'updatedAt' && (
              sortOrder === 'asc' ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Ideas Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <LoadingSkeleton key={i} height="200px" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIdeas.map(idea => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              onClick={() => handleIdeaClick(idea)}
            />
          ))}
        </div>
      )}

      {/* Drawer for editing idea details */}
      <Drawer
        isOpen={showDrawer}
        onClose={handleDrawerClose}
        title={selectedIdea?.title || 'Idea Details'}
      >
        {selectedIdea && (
          <div className="p-4">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={selectedIdea.title}
                onChange={(e) => setSelectedIdea({...selectedIdea, title: e.target.value})}
                className="w-full p-2 border border-[var(--bg-border)] rounded-md bg-[var(--bg-surface)] text-[var(--text-primary)]"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Platform</label>
              <select
                value={selectedIdea.platform}
                onChange={(e) => setSelectedIdea({...selectedIdea, platform: e.target.value})}
                className="w-full p-2 border border-[var(--bg-border)] rounded-md bg-[var(--bg-surface)] text-[var(--text-primary)]"
              >
                <option value="YouTube">YouTube</option>
                <option value="Instagram">Instagram</option>
                <option value="Twitter">Twitter</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="TikTok">TikTok</option>
                <option value="Newsletter">Newsletter</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Caption</label>
              <textarea
                value={selectedIdea.caption}
                onChange={(e) => setSelectedIdea({...selectedIdea, caption: e.target.value})}
                className="w-full p-2 border border-[var(--bg-border)] rounded-md bg-[var(--bg-surface)] text-[var(--text-primary)]"
                rows={4}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={selectedIdea.status}
                onChange={(e) => setSelectedIdea({...selectedIdea, status: e.target.value})}
                className="w-full p-2 border border-[var(--bg-border)] rounded-md bg-[var(--bg-surface)] text-[var(--text-primary)]"
              >
                <option value="idea">Idea</option>
                <option value="drafted">Drafted</option>
                <option value="scheduled">Scheduled</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Tags</label>
              <input
                type="text"
                value={selectedIdea.tags.join(', ')}
                onChange={(e) => setSelectedIdea({...selectedIdea, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)})}
                className="w-full p-2 border border-[var(--bg-border)] rounded-md bg-[var(--bg-surface)] text-[var(--text-primary)]"
                placeholder="Enter tags separated by commas"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  updateIdea(selectedIdea.id, selectedIdea);
                  handleDrawerClose();
                }}
                className="flex-1"
              >
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={handleDrawerClose}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}