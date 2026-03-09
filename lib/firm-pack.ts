/**
 * firm-pack.ts
 *
 * Generates and caches per-firm interview packs:
 *   - 10 practice interview questions
 *   - 3–4 "Why this firm?" crib sheet bullets (deal-anchored talking points)
 *
 * Cache TTL: 7 days — stale packs are regenerated on next page visit.
 * Storage: Redis (prod) / data/firms/{slug}-pack.json (dev).
 */

import fs from 'fs';
import path from 'path';
import Anthropic from '@anthropic-ai/sdk';
import type { FirmProfile } from './types';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FirmInterviewPack {
  firmSlug: string;
  generatedAt: string;          // ISO 8601
  practiceQuestions: string[];   // exactly 10
  whyThisFirm?: string[];        // 3–4 deal-anchored talking points (absent in old cached packs)
}

// ─── Config ───────────────────────────────────────────────────────────────────

const FIRMS_DIR = path.join(process.cwd(), 'data', 'firms');
const PACK_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// ─── Helpers ──────────────────────────────────────────────────────────────────

function useRedis(): boolean {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

function getRedis() {
  const { Redis } = require('@upstash/redis');
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

function isStale(pack: FirmInterviewPack): boolean {
  // Also treat packs without whyThisFirm as stale so they regenerate once
  if (!pack.whyThisFirm || pack.whyThisFirm.length === 0) return true;
  return Date.now() - new Date(pack.generatedAt).getTime() > PACK_TTL_MS;
}

// ─── Filesystem backend ───────────────────────────────────────────────────────

function fsPackPath(slug: string): string {
  return path.join(FIRMS_DIR, `${slug}-pack.json`);
}

function fsGetPack(slug: string): FirmInterviewPack | null {
  try {
    const content = fs.readFileSync(fsPackPath(slug), 'utf-8');
    return JSON.parse(content) as FirmInterviewPack;
  } catch {
    return null;
  }
}

function fsSavePack(pack: FirmInterviewPack): void {
  if (!fs.existsSync(FIRMS_DIR)) fs.mkdirSync(FIRMS_DIR, { recursive: true });
  fs.writeFileSync(fsPackPath(pack.firmSlug), JSON.stringify(pack, null, 2), 'utf-8');
}

// ─── Redis backend ────────────────────────────────────────────────────────────

async function redisGetPack(slug: string): Promise<FirmInterviewPack | null> {
  const redis = getRedis();
  const data = await redis.get(`firm-pack:${slug}`);
  if (!data) return null;
  return typeof data === 'string' ? JSON.parse(data) : data;
}

async function redisSavePack(pack: FirmInterviewPack): Promise<void> {
  const redis = getRedis();
  // TTL slightly longer than PACK_TTL_MS so Redis doesn't expire before we check staleness
  await redis.set(`firm-pack:${pack.firmSlug}`, JSON.stringify(pack), {
    ex: 8 * 24 * 60 * 60,
  });
}

// ─── Generation ───────────────────────────────────────────────────────────────

async function generatePack(
  firm: FirmProfile,
  recentHeadlines: string[],
): Promise<FirmInterviewPack> {
  const client = new Anthropic();

  const headlinesBlock =
    recentHeadlines.length > 0
      ? `Recent news stories mentioning ${firm.shortName} (use for specific deal references):\n${recentHeadlines
          .slice(0, 8)
          .map((h, i) => `${i + 1}. ${h}`)
          .join('\n')}`
      : `No recent stories tagged to ${firm.shortName} this week — base on the firm's profile and market position.`;

  const prompt = `You are helping a UK law student prepare for a ${firm.name} (${firm.tier}) training contract interview.

Firm profile:
- Full name: ${firm.name}
- Known for: ${firm.knownFor}
- Key practice areas: ${firm.practiceAreas.join(', ')}
- Culture: ${firm.culture}
- Interview focus: ${firm.interviewFocus}

${headlinesBlock}

Produce two things and return them as a single JSON object:

1. "whyThisFirm": An array of 3–4 concise bullet points (1–2 sentences each) a student can use to answer "Why ${firm.shortName}?" in an interview. Rules:
   - Each bullet must be SPECIFIC to this firm — not generic statements applicable to any firm.
   - Where recent stories are provided, at least one bullet must reference a specific deal or matter from those headlines, naming the transaction and why it is relevant to what this firm does.
   - Cover a mix of: distinctive market position, a specific recent deal/matter, training quality or practice area strength, and (if applicable) culture or pro bono.
   - Write as objective facts/observations the student can deploy as evidence (NOT as "I feel..." or "I believe..." — the student will adapt to their own voice).
   - Each bullet should be a standalone talking point, not a flowing essay.

2. "practiceQuestions": An array of exactly 10 interview practice questions for this specific firm. Mix:
   - 2 "Why ${firm.shortName}?" questions — specific to this firm's identity or recent developments
   - 3 commercial awareness questions — tied to the firm's practice areas and/or the recent stories
   - 2 culture and working style questions — specific to this firm's environment
   - 2 deal or market awareness questions — ask the candidate to analyse a transaction or regulatory development this firm handles
   - 1 harder probing question — tests genuine depth of commercial knowledge

Rules for questions:
- Every question must be specific to ${firm.shortName}. No generic questions.
- Phrase as an interviewer asking directly (second person).
- No numbering, no bullet points, no labels — just the question text.

Return ONLY valid JSON in this exact format, no other text:
{
  "whyThisFirm": ["bullet 1", "bullet 2", "bullet 3"],
  "practiceQuestions": ["question 1", "question 2", ...]
}`;

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1400,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = message.content[0].type === 'text' ? message.content[0].text.trim() : '{}';

  // Parse JSON response
  let parsed: { whyThisFirm?: string[]; practiceQuestions?: string[] } = {};
  try {
    // Strip possible markdown code fences
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/, '').trim();
    parsed = JSON.parse(cleaned);
  } catch {
    // Fallback: try to extract questions from raw text if JSON parse fails
    parsed = { practiceQuestions: [], whyThisFirm: [] };
  }

  const questions = (parsed.practiceQuestions ?? [])
    .map((l) => String(l).replace(/^\d+[\.\)]\s*/, '').replace(/^[-•]\s*/, '').trim())
    .filter((l) => l.length > 15)
    .slice(0, 10);

  const whyBullets = (parsed.whyThisFirm ?? [])
    .map((l) => String(l).trim())
    .filter((l) => l.length > 20)
    .slice(0, 4);

  return {
    firmSlug: firm.slug,
    generatedAt: new Date().toISOString(),
    practiceQuestions: questions,
    whyThisFirm: whyBullets,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns the cached interview pack for a firm, regenerating if stale or absent.
 * Throws if generation fails — callers should wrap in try/catch.
 */
export async function getFirmInterviewPack(
  firm: FirmProfile,
  recentHeadlines: string[],
): Promise<FirmInterviewPack> {
  // 1. Check cache
  const cached = useRedis()
    ? await redisGetPack(firm.slug)
    : fsGetPack(firm.slug);

  if (cached && !isStale(cached)) {
    return cached;
  }

  // 2. Generate fresh pack
  const pack = await generatePack(firm, recentHeadlines);

  // 3. Persist
  if (useRedis()) {
    await redisSavePack(pack);
  } else {
    fsSavePack(pack);
  }

  return pack;
}
