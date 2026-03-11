import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Download, ExternalLink } from 'lucide-react';
import { getEvents } from '@/lib/events';
import type { EventType } from '@/lib/types';

const EVENT_TYPE_COLOURS: Record<EventType, string> = {
  'Networking':  'text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950',
  'Panel':       'text-violet-800 dark:text-violet-300 bg-violet-50 dark:bg-violet-950',
  'Workshop':    'text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950',
  'Social':      'text-orange-800 dark:text-orange-300 bg-orange-50 dark:bg-orange-950',
  'Career Fair': 'text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950',
};

function formatFullDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params;
  const store = await getEvents();
  const event = store?.events.find((e) => e.id === id);

  if (!event) {
    notFound();
  }

  const dateDisplay = formatFullDate(event.date);
  const dateTimeDisplay = event.time ? `${dateDisplay} · ${event.time}` : dateDisplay;
  const locationDisplay = event.venue
    ? `${event.venue}, ${event.city}`
    : `${event.city} · Venue TBC`;

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Back link */}
      <Link
        href="/events"
        className="text-caption text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 transition-colors mb-6 inline-block"
      >
        &larr; All events
      </Link>

      <article className="max-w-2xl">
        {/* Event type tag */}
        <span className={`inline-block rounded-chrome px-2 py-0.5 text-label font-medium mb-4 ${EVENT_TYPE_COLOURS[event.eventType]}`}>
          {event.eventType}
        </span>

        {/* Title */}
        <h1 className="font-serif text-heading font-bold text-stone-900 dark:text-stone-100 mb-4 leading-tight">
          {event.title}
        </h1>

        {/* Date + time */}
        <p className="text-body text-stone-600 dark:text-stone-400 mb-1">
          {dateTimeDisplay}
        </p>

        {/* Location */}
        <p className="text-body text-stone-600 dark:text-stone-400 mb-6">
          {locationDisplay}
        </p>

        {/* Meta: organiser */}
        <div className="flex flex-col gap-2 mb-6 pb-6 border-b border-stone-200 dark:border-stone-800">
          <div>
            <span className="section-label text-stone-400 block mb-0.5">Organiser</span>
            <span className="text-body text-stone-700 dark:text-stone-300">{event.organiser}</span>
          </div>
          <div>
            <span className="section-label text-stone-400 block mb-0.5">Eligibility</span>
            <span className="text-body text-stone-700 dark:text-stone-300">{event.eligibility}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-body text-stone-700 dark:text-stone-300 mb-6 leading-relaxed">
          {event.description}
        </p>

        {/* Why attend */}
        <blockquote className="border-l-2 border-stone-300 dark:border-stone-600 pl-4 mb-8">
          <p className="italic text-body text-stone-600 dark:text-stone-400 leading-relaxed">
            {event.whyAttend}
          </p>
        </blockquote>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3">
          {/* .ics download */}
          <a
            href={`/api/events?id=${event.id}&format=ics`}
            download
            className="inline-flex items-center gap-2 rounded-chrome border border-stone-300 dark:border-stone-600 px-4 py-2 text-label text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
          >
            <Download size={14} />
            Add to calendar
          </a>

          {/* External registration */}
          <a
            href={event.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-chrome bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 px-4 py-2 text-label hover:bg-stone-700 dark:hover:bg-stone-300 transition-colors"
          >
            Register / Find Out More
            <ExternalLink size={14} />
          </a>
        </div>
      </article>
    </main>
  );
}
