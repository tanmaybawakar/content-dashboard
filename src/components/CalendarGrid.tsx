'use client';

import { useState } from 'react';
import PlatformBadge from './PlatformBadge';

interface CalendarGridProps {
  days: (number | null)[];
  currentMonth: Date;
  scheduledContent: {
    date: string;
    platform: string;
    title: string;
  }[];
  onDateClick: (date: number) => void;
}

export default function CalendarGrid({ days, currentMonth, scheduledContent, onDateClick }: CalendarGridProps) {
  const [hoveredDate, setHoveredDate] = useState<number | null>(null);

  const getDayName = (dayIndex: number) => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return dayNames[dayIndex];
  };

  const getMonthName = (date: Date) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[date.getMonth()];
  };

  const getYear = (date: Date) => {
    return date.getFullYear();
  };

  const getDateString = (day: number) => {
    return `${currentMonth.getFullYear()}-${(currentMonth.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  };

  const getContentForDate = (day: number) => {
    const dateString = getDateString(day);
    return scheduledContent.filter(content => content.date === dateString);
  };

  return (
    <div className="calendar-grid">
      {/* Day headers */}
      <div className="flex justify-between text-sm font-medium text-text-secondary">
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} className="text-center py-2">
            {getDayName(i)}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1 mt-2">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="h-20 bg-bg-surface rounded-md" />;
          }

          const content = getContentForDate(day);
          const isToday = new Date().toDateString() === new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toDateString();
          const isHovered = hoveredDate === day;

          return (
            <div
              key={day}
              className={`calendar-day ${isToday ? 'bg-accent-primary text-white' : ''} ${isHovered ? 'bg-bg-elevated' : ''}`}
              onMouseEnter={() => setHoveredDate(day)}
              onMouseLeave={() => setHoveredDate(null)}
              onClick={() => onDateClick(day)}
            >
              <div className="flex justify-between items-start">
                <span className={isToday ? 'font-bold' : ''}>{day}</span>
                {content.length > 0 && (
                  <div className="flex gap-1">
                    {content.slice(0, 2).map((item, idx) => (
                      <PlatformBadge key={idx} platform={item.platform} />
                    ))}
                    {content.length > 2 && (
                      <span className="text-xs text-text-secondary">+{content.length - 2}</span>
                    )}
                  </div>
                )}
              </div>
              {content.length > 0 && (
                <div className="mt-1 space-y-1">
                  {content.slice(0, 2).map((item, idx) => (
                    <div key={idx} className="text-xs truncate">
                      {item.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}