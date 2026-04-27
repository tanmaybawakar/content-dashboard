'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/glass-card';
import { SectionHeader } from '@/components/section-header';
import ChatMessage from '@/components/ChatMessage';
import TypingIndicator from '@/components/TypingIndicator';
import { AIDiscussion } from '@/types';

export default function DiscussPage() {
  const [messages, setMessages] = useState<{ id: number; sender: 'user' | 'ai'; content: string; timestamp: string }[]>([
    {
      id: 1,
      sender: 'ai' as const,
      content: "Hi there! I'm your AI content strategist. How can I help you with your content strategy today?",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedDiscussion, setSelectedDiscussion] = useState<AIDiscussion | null>(null);
  const [discussions, setDiscussions] = useState<any[]>([
    {
      id: "1",
      title: "Content Strategy Analysis",
      preview: "Analyzed current content performance and suggested improvements...",
      date: "2026-04-25"
    },
    {
      id: "2",
      title: "Hook Generation Ideas",
      preview: "Generated 5 compelling hooks for your next YouTube video...",
      date: "2026-04-23"
    },
    {
      id: "3",
      title: "Weekly Content Plan",
      preview: "Created a detailed weekly content calendar for all platforms...",
      date: "2026-04-20"
    }
  ]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      sender: 'user' as const,
      content: inputValue,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');

    // Simulate AI response
    setIsTyping(true);
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        sender: 'ai' as const,
        content: "I've analyzed your request and have some great suggestions for you. Based on your current content strategy, I recommend focusing on short-form video content that highlights your unique perspective. Would you like me to elaborate on this recommendation?",
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

   const handleDiscussionClick = (discussion: AIDiscussion) => {
     setSelectedDiscussion(discussion);
     // In a real app, this would load the conversation history for this discussion
   };

  const handleNewDiscussion = () => {
    setSelectedDiscussion(null);
    setMessages([
      {
        id: 1,
        sender: 'ai',
        content: "Hi there! I'm your AI content strategist. How can I help you with your content strategy today?",
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  };

  const starterPrompts = [
    "Analyze my content strategy",
    "Help me write hooks",
    "What should I post this week?",
    "Critique my content ideas"
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Left panel - Discussion History */}
      <div className="lg:col-span-1">
        <GlassCard>
          <div className="flex justify-between items-center mb-4">
            <SectionHeader
              title="Discussions"
              description="Your past conversations with AI"
            />
            <button onClick={handleNewDiscussion} className="text-text-secondary hover:text-white text-sm">New</button>
          </div>

          <div className="space-y-3">
            {discussions.map(discussion => (
              <div
                key={discussion.id}
                onClick={() => handleDiscussionClick(discussion)}
                className={`p-3 rounded-md cursor-pointer transition-all duration-300 ${
                  selectedDiscussion?.id === discussion.id
                    ? 'bg-bg-elevated border-l-3 border-accent-primary'
                    : 'bg-bg-surface hover:bg-bg-elevated'
                }`}
              >
                <div className="font-medium">{discussion.title}</div>
                <div className="text-xs text-text-secondary mt-1 line-clamp-1">{discussion.preview}</div>
                <div className="text-xs text-text-secondary mt-1">{discussion.date}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Right panel - Active Chat */}
      <div className="lg:col-span-3">
        <GlassCard>
          <div className="h-[600px] flex flex-col">
            {/* Chat area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(message => (
                <ChatMessage
                  key={message.id}
                  message={message}
                />
              ))}
              {isTyping && (
                <div className="p-4">
                  <TypingIndicator />
                </div>
              )}
            </div>

            {/* Input area */}
            <div className="border-t border-bg-border p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="input flex-1"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className={`btn btn-primary ${!inputValue.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Send
                </button>
              </div>

              {/* Context chips */}
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="text-xs bg-bg-border px-2 py-1 rounded-full">Attach idea</span>
                <span className="text-xs bg-bg-border px-2 py-1 rounded-full">Attach competitor analysis</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}