'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, Square, Loader2, Download } from 'lucide-react';
import type { Briefing } from '@/lib/types';

const CHARS_PER_MINUTE = 650;
const SPEEDS = [0.75, 1, 1.25, 1.5, 2];
const VOICE_ID = 'onwK4e9ZLuTAKqWW03F9'; // Daniel (British, Broadcaster)

const WAVEFORM_HEIGHTS = [12, 28, 18, 40, 24, 36, 16, 44, 20, 32, 14, 38, 22, 48, 18, 34, 26, 42, 16, 30, 20, 44, 14, 36, 24, 40, 18, 28];

function getBestVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang === 'en-GB' && v.localService) ??
    voices.find((v) => v.lang === 'en-GB') ??
    voices.find((v) => v.lang === 'en-US' && v.localService) ??
    voices.find((v) => v.lang.startsWith('en') && v.localService) ??
    voices.find((v) => v.lang.startsWith('en')) ??
    null
  );
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function PodcastPlayer({ briefing }: { briefing: Briefing }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'playing' | 'paused' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [supported, setSupported] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState<number | null>(null);
  const [audioReady, setAudioReady] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const scriptRef = useRef<string | null>(null);
  const hasElevenLabsRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const charIndexRef = useRef(0);
  const statusRef = useRef<'idle' | 'loading' | 'playing' | 'paused' | 'error'>('idle');
  const progressBarRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const speedRef = useRef(1);
  const [speed, setSpeed] = useState(1);

  function updateStatus(s: typeof status) {
    statusRef.current = s;
    setStatus(s);
  }

  // ── Init ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    setSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);

    fetch(`/api/podcast-audio?date=${briefing.date}&voiceId=${VOICE_ID}&check=true`)
      .then((r) => r.json())
      .then((d: { exists: boolean }) => { if (d.exists) setAudioReady(true); })
      .catch(() => {});

    return () => {
      window.speechSynthesis?.cancel();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [briefing.date]);

  // ── Script fetching ───────────────────────────────────────────────────────

  async function fetchScript(): Promise<{ script: string; hasElevenLabs: boolean }> {
    if (scriptRef.current) {
      return { script: scriptRef.current, hasElevenLabs: hasElevenLabsRef.current };
    }
    const res = await fetch('/api/podcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: briefing.date }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? 'Failed to generate script');
    scriptRef.current = data.script;
    hasElevenLabsRef.current = data.hasElevenLabs;
    return { script: data.script, hasElevenLabs: data.hasElevenLabs };
  }

  // ── ElevenLabs path ───────────────────────────────────────────────────────

  async function playWithElevenLabs(voiceId: string) {
    const res = await fetch('/api/podcast-audio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: briefing.date, voiceId }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`ElevenLabs error ${res.status}: ${text.slice(0, 120)}`);
    }

    // Production returns { url } JSON (Blob CDN), dev returns raw MP3 binary
    let audioUrl: string;
    const contentType = res.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      const data = await res.json();
      audioUrl = data.url;
    } else {
      const blob = await res.blob();
      audioUrl = URL.createObjectURL(blob);
    }

    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.ontimeupdate = () => {
      if (audio.duration && isFinite(audio.duration)) {
        setProgress(audio.currentTime / audio.duration);
      }
    };
    audio.onloadedmetadata = () => {
      if (isFinite(audio.duration)) setDuration(audio.duration);
    };
    audio.onended = () => {
      updateStatus('idle');
      setProgress(0);
      audioRef.current = null;
      if (audioUrl.startsWith('blob:')) URL.revokeObjectURL(audioUrl);
      setAudioReady(true);
    };
    audio.onerror = () => {
      updateStatus('error');
      setErrorMsg('Audio playback failed.');
      audioRef.current = null;
      if (audioUrl.startsWith('blob:')) URL.revokeObjectURL(audioUrl);
    };

    audio.playbackRate = speedRef.current;
    await audio.play();
    updateStatus('playing');
    if (audio.duration && isFinite(audio.duration)) setDuration(audio.duration);
  }

  // ── Browser TTS path ──────────────────────────────────────────────────────

  const playTTSFromChar = useCallback((script: string, startChar: number) => {
    const remaining = script.slice(startChar);
    const utterance = new SpeechSynthesisUtterance(remaining);

    const applyVoice = () => {
      const voice = getBestVoice();
      if (voice) utterance.voice = voice;
    };
    if (window.speechSynthesis.getVoices().length > 0) {
      applyVoice();
    } else {
      window.speechSynthesis.onvoiceschanged = applyVoice;
    }

    utterance.rate = speedRef.current * 0.95;
    utterance.onboundary = (event) => {
      const absolute = startChar + event.charIndex;
      charIndexRef.current = absolute;
      setProgress(absolute / script.length);
    };
    utterance.onend = () => {
      statusRef.current = 'idle';
      setStatus('idle');
      setProgress(1);
    };
    utterance.onerror = () => {
      statusRef.current = 'idle';
      setStatus('idle');
    };

    window.speechSynthesis.speak(utterance);
    statusRef.current = 'playing';
    setStatus('playing');
  }, []);

  // ── Controls ──────────────────────────────────────────────────────────────

  async function handlePlay() {
    setErrorMsg(null);

    if (status === 'paused') {
      if (audioRef.current) {
        await audioRef.current.play();
      } else {
        window.speechSynthesis.resume();
      }
      updateStatus('playing');
      return;
    }

    updateStatus('loading');
    let script: string;
    let hasElevenLabs: boolean;
    try {
      ({ script, hasElevenLabs } = await fetchScript());
    } catch (err) {
      updateStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Failed to generate script.');
      return;
    }

    if (hasElevenLabs) {
      setDuration((script.length / CHARS_PER_MINUTE) * 60);
      try {
        await playWithElevenLabs(VOICE_ID);
        setAudioReady(true);
      } catch (err) {
        updateStatus('error');
        setErrorMsg(err instanceof Error ? err.message : 'ElevenLabs playback failed.');
      }
    } else {
      charIndexRef.current = 0;
      setProgress(0);
      setDuration((script.length / CHARS_PER_MINUTE) * 60);
      window.speechSynthesis.cancel();
      playTTSFromChar(script, 0);
    }
  }

  function handlePause() {
    if (audioRef.current) {
      audioRef.current.pause();
    } else {
      window.speechSynthesis.pause();
    }
    updateStatus('paused');
  }

  function handleStop() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    window.speechSynthesis.cancel();
    updateStatus('idle');
    setProgress(0);
    setErrorMsg(null);
    charIndexRef.current = 0;
  }

  // ── Speed control ─────────────────────────────────────────────────────────

  function cycleSpeed() {
    const idx = SPEEDS.indexOf(speedRef.current);
    const next = SPEEDS[(idx + 1) % SPEEDS.length];
    speedRef.current = next;
    setSpeed(next);
    // Apply immediately to whichever playback path is active
    if (audioRef.current) {
      audioRef.current.playbackRate = next;
    } else if (statusRef.current === 'playing' && scriptRef.current) {
      // Restart TTS from current char position with new rate
      window.speechSynthesis.cancel();
      playTTSFromChar(scriptRef.current, charIndexRef.current);
    }
  }

  // ── Progress bar drag ─────────────────────────────────────────────────────

  function getFraction(clientX: number): number {
    if (!progressBarRef.current) return 0;
    const rect = progressBarRef.current.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  }

  function seekAudioTo(fraction: number) {
    if (audioRef.current && audioRef.current.duration && isFinite(audioRef.current.duration)) {
      audioRef.current.currentTime = fraction * audioRef.current.duration;
    }
    setProgress(fraction);
  }

  function commitTTSSeek(fraction: number) {
    if (!scriptRef.current) return;
    const charIndex = Math.floor(fraction * scriptRef.current.length);
    charIndexRef.current = charIndex;
    setProgress(fraction);
    if (statusRef.current !== 'idle' && statusRef.current !== 'error') {
      window.speechSynthesis.cancel();
      playTTSFromChar(scriptRef.current, charIndex);
    }
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.preventDefault();
    isDraggingRef.current = true;
    progressBarRef.current?.setPointerCapture(e.pointerId);
    const fraction = getFraction(e.clientX);
    if (audioRef.current) {
      seekAudioTo(fraction);
    } else {
      setProgress(fraction);
      if (scriptRef.current) charIndexRef.current = Math.floor(fraction * scriptRef.current.length);
    }
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDraggingRef.current) return;
    const fraction = getFraction(e.clientX);
    if (audioRef.current) {
      seekAudioTo(fraction);
    } else {
      setProgress(fraction);
      if (scriptRef.current) charIndexRef.current = Math.floor(fraction * scriptRef.current.length);
    }
  }

  function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const fraction = getFraction(e.clientX);
    if (audioRef.current) {
      seekAudioTo(fraction);
    } else {
      commitTTSSeek(fraction);
    }
  }

  function handlePointerCancel() {
    isDraggingRef.current = false;
  }

  // ── Download ──────────────────────────────────────────────────────────────

  async function handleDownload() {
    setIsDownloading(true);
    try {
      const res = await fetch('/api/podcast-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: briefing.date, voiceId: VOICE_ID }),
      });
      if (!res.ok) {
        setErrorMsg('Download failed — try playing the audio first.');
        return;
      }

      const contentType = res.headers.get('content-type') ?? '';
      if (contentType.includes('application/json')) {
        // Production: got Blob CDN URL — trigger download via link
        const data = await res.json();
        const a = document.createElement('a');
        a.href = data.url;
        a.download = `folio-${briefing.date}.mp3`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        // Dev: got raw MP3 binary
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `folio-${briefing.date}.mp3`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
      setAudioReady(true);
    } catch {
      setErrorMsg('Download failed.');
    } finally {
      setIsDownloading(false);
    }
  }

  // ── Derived values ────────────────────────────────────────────────────────

  const isPlaying = status === 'playing';
  const isActive = status === 'playing' || status === 'paused';
  const isLoading = status === 'loading';
  const elapsed = duration != null ? progress * duration : null;

  // ── Helpers ───────────────────────────────────────────────────────────────

  function formatCoverDate(dateStr: string): string {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-0">

      {/* ── Hero block ─────────────────────────────────────────────────────── */}
      <div className="bg-stone-900 text-stone-50 px-6 pt-8 pb-6">
        {/* Overline */}
        <p className="section-label text-stone-500 mb-3">Folio Daily Briefing</p>

        {/* Episode title */}
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-stone-50 leading-tight tracking-tight mb-5">
          {formatCoverDate(briefing.date)}
        </h1>

        {/* Decorative waveform bars */}
        <div className="flex items-end gap-[3px] h-12 mb-6">
          {WAVEFORM_HEIGHTS.map((h, i) => (
            <div
              key={i}
              style={{ height: h }}
              className="w-[3px] rounded-sm bg-white/20 flex-shrink-0"
            />
          ))}
        </div>

        {/* Play / Pause button */}
        {status === 'error' ? (
          <button
            onClick={() => { updateStatus('idle'); setErrorMsg(null); handlePlay(); }}
            className="flex items-center gap-1.5 text-[12px] font-sans font-semibold text-rose-400 hover:text-rose-300 transition-colors"
          >
            <Play className="w-4 h-4" /> Retry
          </button>
        ) : (
          <button
            onClick={isPlaying ? handlePause : handlePlay}
            disabled={isLoading}
            className="w-14 h-14 rounded-full bg-white text-stone-900 flex items-center justify-center hover:bg-stone-100 disabled:opacity-40 transition-colors shadow-md"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 translate-x-[1px]" />
            )}
          </button>
        )}

        {/* Loading status */}
        {isLoading && (
          <p className="section-label text-stone-500 mt-2">Loading...</p>
        )}
      </div>

      {/* ── Controls strip ─────────────────────────────────────────────────── */}
      <div className="bg-stone-950 px-6 py-3">
        {/* Progress scrubber */}
        <div
          ref={progressBarRef}
          className="relative h-1.5 bg-stone-800 cursor-pointer select-none touch-none group mb-2"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
        >
          <div
            className="absolute inset-y-0 left-0 bg-stone-400 group-hover:bg-stone-300 transition-colors"
            style={{ width: `${progress * 100}%` }}
          />
          {/* Scrubber thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-stone-100 shadow opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1/2"
            style={{ left: `${progress * 100}%` }}
          />
        </div>

        {/* Time stamps + controls row */}
        <div className="flex items-center gap-4">
          {/* Elapsed */}
          <span className="text-[10px] font-sans tabular-nums text-stone-500">
            {elapsed != null ? formatTime(elapsed) : '0:00'}
          </span>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Speed */}
          <button
            onClick={cycleSpeed}
            className="text-[12px] font-sans font-semibold text-stone-500 hover:text-stone-300 transition-colors tabular-nums"
            aria-label="Change playback speed"
            title="Playback speed"
          >
            {speed}&times;
          </button>

          {/* Stop (only when active) */}
          {isActive && (
            <button
              onClick={handleStop}
              className="text-stone-500 hover:text-stone-300 transition-colors"
              aria-label="Stop"
            >
              <Square className="w-4 h-4" />
            </button>
          )}

          {/* Download */}
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="text-stone-500 hover:text-stone-300 transition-colors disabled:opacity-40"
            aria-label="Download audio"
            title={audioReady ? 'Download MP3' : 'Generate and download MP3'}
          >
            {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          </button>

          {/* Duration */}
          <span className="text-[10px] font-sans tabular-nums text-stone-500">
            {duration != null ? formatTime(duration) : '--:--'}
          </span>
        </div>

        {/* Error message */}
        {errorMsg && (
          <p className="text-[11px] font-sans text-rose-400 mt-1 break-all">{errorMsg}</p>
        )}
      </div>

      {/* ── Briefing notes panel ───────────────────────────────────────────── */}
      <div className="border border-stone-200 dark:border-stone-800 rounded-card mt-6 overflow-hidden">
        {/* Panel header */}
        <div className="px-6 py-4 border-b border-stone-100 dark:border-stone-800">
          <p className="section-label text-stone-400">Briefing Notes</p>
        </div>

        {/* Story list */}
        {briefing.stories.map((story, index) => (
          <div
            key={story.id}
            className="relative px-6 py-5 border-b border-stone-100 dark:border-stone-800 last:border-0 overflow-hidden"
          >
            {/* Background number */}
            <span className="absolute right-4 top-2 font-mono text-6xl font-bold text-stone-900 dark:text-stone-100 opacity-[0.06] select-none leading-none">
              {String(index + 1).padStart(2, '0')}
            </span>

            {/* Content */}
            <div className="relative">
              <p className="section-label text-stone-400 mb-1">{story.topic}</p>
              <p className="font-serif text-base font-semibold text-stone-900 dark:text-stone-100 leading-snug mb-1">
                {story.headline}
              </p>
              <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                {story.talkingPoints?.soundbite ?? story.talkingPoint}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
