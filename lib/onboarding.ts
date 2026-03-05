/**
 * onboarding.ts
 *
 * Stores and retrieves per-user onboarding preferences (stage + target firms).
 * Dual-backend: Upstash Redis (prod) / data/onboarding.json (dev).
 */

import fs from 'fs';
import path from 'path';

// ─── Types ────────────────────────────────────────────────────────────────────

export type OnboardingStage = 'first-year' | 'vs' | 'tc';

export interface OnboardingData {
  stage: OnboardingStage;
  targetFirms: string[];  // firm slugs, up to 5
  completedAt: string;    // ISO 8601
}

// ─── Config ───────────────────────────────────────────────────────────────────

const ONBOARDING_FILE = path.join(process.cwd(), 'data', 'onboarding.json');

// ─── Backend detection ────────────────────────────────────────────────────────

function useRedis(): boolean {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

function getRedis() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Redis } = require('@upstash/redis');
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

// ─── Filesystem backend ───────────────────────────────────────────────────────

function fsReadAll(): Record<string, OnboardingData> {
  try {
    if (!fs.existsSync(ONBOARDING_FILE)) return {};
    return JSON.parse(fs.readFileSync(ONBOARDING_FILE, 'utf-8'));
  } catch {
    return {};
  }
}

function fsWrite(data: Record<string, OnboardingData>): void {
  const dir = path.dirname(ONBOARDING_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(ONBOARDING_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function getOnboarding(userId: string): Promise<OnboardingData | null> {
  if (useRedis()) {
    const redis = getRedis();
    const data = await redis.get(`onboarding:${userId}`);
    if (!data) return null;
    return typeof data === 'string' ? JSON.parse(data) : (data as OnboardingData);
  }
  const all = fsReadAll();
  return all[userId] ?? null;
}

export async function setOnboarding(userId: string, data: OnboardingData): Promise<void> {
  if (useRedis()) {
    const redis = getRedis();
    await redis.set(`onboarding:${userId}`, JSON.stringify(data));
    return;
  }
  const all = fsReadAll();
  all[userId] = data;
  fsWrite(all);
}
