'use client';

import { useState, useEffect } from 'react';

interface ChatMessageProps {
  message: {
    id: number;
    sender: 'user' | 'ai';
    content: string;
    timestamp: string;
  };
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`chat-message ${message.sender} ${isVisible ? 'animate-fade-in' : ''}`}
      style={{ animationDelay: `${message.id * 100}ms` }}
    >
      <div className="mb-1">
        <span className="text-xs text-text-secondary">{message.timestamp}</span>
      </div>
      <div className="whitespace-pre-wrap">{message.content}</div>
    </div>
  );
}