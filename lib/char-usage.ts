import fs from 'fs';
import path from 'path';

export const MONTHLY_LIMIT = 100_000;

const USAGE_FILE = path.join(process.cwd(), 'data', 'el-usage.json');

function getMonthKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

// ─── Backend detection ─────────────────────────────────────────────────────────
// Mirrors the pattern in lib/storage.ts — Redis in production, filesystem in dev.

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

// ─── Redis backend ─────────────────────────────────────────────────────────────

async function redisGetUsed(): Promise<number> {
  const redis = getRedis();
  const val = await redis.get(`elevenlabs:chars:${getMonthKey()}`);
  if (val === null || val === undefined) return 0;
  return typeof val === 'number' ? val : parseInt(String(val), 10);
}

async function redisIncrUsed(chars: number): Promise<void> {
  const redis = getRedis();
  // INCRBY is atomic — safe under concurrent requests (no read-modify-write race)
  await redis.incrby(`elevenlabs:chars:${getMonthKey()}`, chars);
}

// ─── Filesystem backend ────────────────────────────────────────────────────────

function fsReadUsage(): Record<string, number> {
  try {
    return JSON.parse(fs.readFileSync(USAGE_FILE, 'utf-8')) as Record<string, number>;
  } catch {
    return {};
  }
}

function fsWriteUsage(data: Record<string, number>): void {
  const dir = path.dirname(USAGE_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(USAGE_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function fsGetUsed(): number {
  return fsReadUsage()[getMonthKey()] ?? 0;
}

function fsIncrUsed(chars: number): void {
  const data = fsReadUsage();
  const key = getMonthKey();
  data[key] = (data[key] ?? 0) + chars;
  fsWriteUsage(data);
}

// ─── Public API ────────────────────────────────────────────────────────────────
// All three functions are async so callers must await them.

export async function getMonthlyUsage(): Promise<{
  used: number;
  remaining: number;
  limit: number;
  month: string;
}> {
  const key = getMonthKey();
  const used = useRedis() ? await redisGetUsed() : fsGetUsed();
  return { used, remaining: Math.max(0, MONTHLY_LIMIT - used), limit: MONTHLY_LIMIT, month: key };
}

export async function recordUsage(chars: number): Promise<void> {
  if (useRedis()) {
    await redisIncrUsed(chars);
  } else {
    fsIncrUsed(chars);
  }
}

export async function hasCapacity(chars: number): Promise<boolean> {
  const { remaining } = await getMonthlyUsage();
  return chars <= remaining;
}
