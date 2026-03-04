import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import type { Briefing } from '@/lib/types';

const DATA_DIR = path.join(process.cwd(), 'data', 'briefings');

function scriptFile(date: string): string {
  return path.join(DATA_DIR, `${date}-podcast.txt`);
}

export function getCachedScript(date: string): string | null {
  try {
    return fs.readFileSync(scriptFile(date), 'utf-8');
  } catch {
    return null;
  }
}

export function saveScript(date: string, script: string): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(scriptFile(date), script, 'utf-8');
}

/**
 * Generates a podcast script for the given briefing and saves it to disk.
 * Returns the script string, or throws on failure.
 * No-ops if a cached script already exists for that date.
 */
export async function generateAndSavePodcastScript(briefing: Briefing): Promise<string> {
  const cached = getCachedScript(briefing.date);
  if (cached) return cached;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not configured');

  const dateStr = new Date(briefing.date + 'T00:00:00').toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const storiesJson = JSON.stringify(
    briefing.stories.map((s) => ({
      topic: s.topic,
      headline: s.headline,
      summary: s.summary,
      whyItMatters: s.whyItMatters,
    })),
    null,
    2
  );

  const prompt = `You are writing a podcast script for "Commercial Awareness Daily", a morning briefing for law students targeting Magic Circle, Silver Circle and elite US law firms — modelled closely on the FT News Briefing.

Write a 3–4 minute podcast script (roughly 450–550 words of spoken content) based on the stories below for ${dateStr}.

Style guide:
- Natural spoken language, not written prose — write exactly as it would be said aloud
- Warm but authoritative tone, like an FT News Briefing presenter
- Crisp intro: greet the listener, give the date, say how many stories
- Lead with the standout story: "The biggest story this morning is..."
- Smooth transitions between topics: "Turning now to the capital markets...", "Meanwhile, on the regulatory front...", "Across the Atlantic..."
- Never say "Story 1", "Story 2" or number stories
- Weave in why each story matters for law firms naturally — don't label it, just include the angle
- Close with Sector Watch and One to Follow as a "what to watch this week" segment
- Sign off: "That's your Commercial Awareness Daily for ${dateStr}. Good morning."
- No music cues, stage directions, or brackets — plain spoken text only

Today's stories:
${storiesJson}

Sector Watch: ${briefing.sectorWatch}
One to Follow: ${briefing.oneToFollow}`;

  const anthropic = new Anthropic({ apiKey });
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  });

  const block = message.content[0];
  const script = block.type === 'text' ? block.text : '';
  if (!script) throw new Error('Script generation returned empty');

  saveScript(briefing.date, script);
  return script;
}
