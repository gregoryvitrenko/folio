import { TabBar } from './TabBar';
import { NewspaperGrid } from './NewspaperGrid';
import { ALL_TOPICS } from '@/lib/topics';
import type { Story, TopicCategory } from '@/lib/types';

interface StoryGridProps {
  stories: Story[];
  date: string;
  subscribed?: boolean;
}

export function StoryGrid({ stories, date, subscribed = false }: StoryGridProps) {
  const presentTopics = ALL_TOPICS.filter((t: TopicCategory) => stories.some(s => s.topic === t));

  return (
    <div>
      <TabBar presentTopics={presentTopics} />
      <NewspaperGrid stories={stories} date={date} subscribed={subscribed} />
    </div>
  );
}
