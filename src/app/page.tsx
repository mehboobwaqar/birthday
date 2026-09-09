"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { createPortal } from "react-dom";

// ─── Birthday Config ───
const BIRTHDAY_NAME = "Laiba Ahmad";
const BIRTHDAY_DATE = new Date("2003-09-10");
const BIRTHDAY_YEAR = 2026;
const SECRET_PASSWORD = "nono";

// ─── Audio Tone Effects (Web Audio API) ───
type AudioCueType =
  | "envelopeOpen"
  | "candleBlow"
  | "cakeSlice"
  | "giftOpen"
  | "letterOpen"
  | "cardFlip"
  | "revealAll"
  | "cameraShutter"
  | "skipTimer"
  | "kiss"
  | "twinkle"
  | "heartPop"
  | "success"
  | "wrong"
  | "funnyBoing"
  | "quizYes"
  | "fireworkLaunch"
  | "fireworkBurst"
  | "royalVictory";

let sharedAudioCtx: AudioContext | null = null;

function playAudioCue(type: AudioCueType) {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    if (!sharedAudioCtx || sharedAudioCtx.state === "closed") {
      sharedAudioCtx = new AudioCtx();
    }
    const ctx = sharedAudioCtx;
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    if (type === "envelopeOpen") {
      // 🌟 Grand Entrance / Envelope Reveal: Ascending harp arpeggio + triumphant sparkle chord
      const harp = [523.25, 659.25, 783.99, 987.77, 1046.5, 1318.51, 1567.98];
      harp.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        const start = ctx.currentTime + idx * 0.08;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.25, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.9);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.9);
      });
      // Golden sparkle flourish
      [2093.0, 2637.02, 3135.96].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        const start = ctx.currentTime + 0.55 + idx * 0.09;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.14, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.6);
      });
    } else if (type === "candleBlow") {
      // 💨 Candle Blow: Realistic whoosh of breath blowing out candles + magical wish granted bell chimes
      const bufferSize = Math.floor(ctx.sampleRate * 0.45);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.8;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.45);
      filter.Q.setValueAtTime(2.0, ctx.currentTime);
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.35, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start();
      noise.stop(ctx.currentTime + 0.45);

      // Magical wish chime bells right after blow
      const wishChimes = [880, 1174.66, 1479.98, 1760];
      wishChimes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        const start = ctx.currentTime + 0.35 + idx * 0.08;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.18, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.85);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.85);
      });
    } else if (type === "cakeSlice") {
      // 🔪 Knife slice whoosh + sweet celebratory chimes
      const oscWhoosh = ctx.createOscillator();
      const gainWhoosh = ctx.createGain();
      oscWhoosh.type = "triangle";
      oscWhoosh.frequency.setValueAtTime(680, ctx.currentTime);
      oscWhoosh.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.18);
      gainWhoosh.gain.setValueAtTime(0.3, ctx.currentTime);
      gainWhoosh.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      oscWhoosh.connect(gainWhoosh);
      gainWhoosh.connect(ctx.destination);
      oscWhoosh.start();
      oscWhoosh.stop(ctx.currentTime + 0.2);

      [783.99, 1046.5, 1318.51].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        const start = ctx.currentTime + 0.15 + idx * 0.08;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.2, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.6);
      });
    } else if (type === "giftOpen") {
      // 🎁 Surprise Gift Open: Cheerful box pop + joyful ascending fanfare
      const oscPop = ctx.createOscillator();
      const gainPop = ctx.createGain();
      oscPop.type = "sine";
      oscPop.frequency.setValueAtTime(220, ctx.currentTime);
      oscPop.frequency.exponentialRampToValueAtTime(650, ctx.currentTime + 0.08);
      gainPop.gain.setValueAtTime(0.28, ctx.currentTime);
      gainPop.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);
      oscPop.connect(gainPop);
      gainPop.connect(ctx.destination);
      oscPop.start();
      oscPop.stop(ctx.currentTime + 0.09);

      // Joyful gift bells
      [587.33, 739.99, 880, 1174.66].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        const start = ctx.currentTime + 0.08 + idx * 0.07;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.22, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.7);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.7);
      });
    } else if (type === "letterOpen") {
      // 💌 Love Letter Seal Break & Unfold: Romantic acoustic harmonic chime chord
      const popOsc = ctx.createOscillator();
      const popGain = ctx.createGain();
      popOsc.type = "sine";
      popOsc.frequency.setValueAtTime(480, ctx.currentTime);
      popOsc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.12);
      popGain.gain.setValueAtTime(0.2, ctx.currentTime);
      popGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      popOsc.connect(popGain);
      popGain.connect(ctx.destination);
      popOsc.start();
      popOsc.stop(ctx.currentTime + 0.12);

      // Romantic chord
      [523.25, 659.25, 783.99, 987.77, 1046.5].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        const start = ctx.currentTime + 0.09 + idx * 0.06;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.18, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 1.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 1.1);
      });
    } else if (type === "cardFlip") {
      // 📸 Card Flip: Cute crisp sparkle flip
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(980, ctx.currentTime + 0.07);
      gain.gain.setValueAtTime(0.24, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);

      const bell = ctx.createOscillator();
      const bellGain = ctx.createGain();
      bell.type = "triangle";
      bell.frequency.setValueAtTime(1567.98, ctx.currentTime + 0.05);
      bellGain.gain.setValueAtTime(0.16, ctx.currentTime + 0.05);
      bellGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      bell.connect(bellGain);
      bellGain.connect(ctx.destination);
      bell.start(ctx.currentTime + 0.05);
      bell.stop(ctx.currentTime + 0.35);
    } else if (type === "revealAll") {
      // ✨ Reveal All: Grand cascading multi-tone ripple of stars
      [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98, 2093].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        const start = ctx.currentTime + idx * 0.05;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.2, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.6);
      });
    } else if (type === "cameraShutter") {
      // 📷 Camera click / Memory chapter open
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.setValueAtTime(420, ctx.currentTime + 0.025);
      gain.gain.setValueAtTime(0.14, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.07);

      // Subtle chime note
      const chime = ctx.createOscillator();
      const cGain = ctx.createGain();
      chime.type = "sine";
      chime.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.04);
      cGain.gain.setValueAtTime(0.15, ctx.currentTime + 0.04);
      cGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      chime.connect(cGain);
      cGain.connect(ctx.destination);
      chime.start(ctx.currentTime + 0.04);
      chime.stop(ctx.currentTime + 0.3);
    } else if (type === "skipTimer") {
      // ⏩ Skip Countdown: Warp-in swoosh + bright rising chime
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(240, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1280, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.26, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.36);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.36);

      [1318.51, 1760].forEach((freq, idx) => {
        const sOsc = ctx.createOscillator();
        const sGain = ctx.createGain();
        sOsc.type = "triangle";
        const start = ctx.currentTime + 0.2 + idx * 0.08;
        sOsc.frequency.setValueAtTime(freq, start);
        sGain.gain.setValueAtTime(0.18, start);
        sGain.gain.exponentialRampToValueAtTime(0.001, start + 0.55);
        sOsc.connect(sGain);
        sGain.connect(ctx.destination);
        sOsc.start(start);
        sOsc.stop(start + 0.55);
      });
    } else if (type === "heartPop") {
      // 💖 Cute Heart Pop
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(280, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(720, ctx.currentTime + 0.07);
      gain.gain.setValueAtTime(0.26, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } else if (type === "kiss") {
      // 💋 Sweet kiss "mwah" smack pop sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(360, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + 0.07);
      osc.frequency.exponentialRampToValueAtTime(460, ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.28, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } else if (type === "twinkle") {
      // 🌸 Gentle sparkling fairy chime
      const notes = [1318.51, 1567.98];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        const startTime = ctx.currentTime + idx * 0.06;
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.18, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.32);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.32);
      });
    } else if (type === "wrong") {
      // 🚫 Funny buzzer / boing sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(280, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(75, ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === "funnyBoing") {
      // 🤪 Funny cartoon spring boing & slip sound when runaway button flees!
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(170, now);
      osc.frequency.linearRampToValueAtTime(620, now + 0.07);
      osc.frequency.linearRampToValueAtTime(240, now + 0.14);
      osc.frequency.linearRampToValueAtTime(540, now + 0.21);
      osc.frequency.linearRampToValueAtTime(320, now + 0.28);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.44);
      gain.gain.setValueAtTime(0.38, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.44);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.44);

      // High pitch funny cartoon squeak
      const squeak = ctx.createOscillator();
      const sGain = ctx.createGain();
      squeak.type = "triangle";
      squeak.frequency.setValueAtTime(750, now);
      squeak.frequency.exponentialRampToValueAtTime(1650, now + 0.08);
      squeak.frequency.exponentialRampToValueAtTime(380, now + 0.19);
      sGain.gain.setValueAtTime(0.26, now);
      sGain.gain.exponentialRampToValueAtTime(0.001, now + 0.19);
      squeak.connect(sGain);
      sGain.connect(ctx.destination);
      squeak.start(now);
      squeak.stop(now + 0.19);
    } else if (type === "quizYes") {
      // ✨ Celebratory Joyful Chime & Fanfare when YES / Qabool Hai is clicked!
      const chord = [523.25, 659.25, 783.99, 1046.5, 1318.51];
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        const start = ctx.currentTime + idx * 0.055;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.32, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.95);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.95);
      });
      // Sparkling bell accent
      const bell = ctx.createOscillator();
      const bGain = ctx.createGain();
      bell.type = "sine";
      bell.frequency.setValueAtTime(2093.0, ctx.currentTime + 0.25);
      bGain.gain.setValueAtTime(0.24, ctx.currentTime + 0.25);
      bGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.95);
      bell.connect(bGain);
      bGain.connect(ctx.destination);
      bell.start(ctx.currentTime + 0.25);
      bell.stop(ctx.currentTime + 0.95);
    } else if (type === "fireworkLaunch") {
      // 🚀 Rocket Launch: Upward sweeping whistling whoosh
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(260 + Math.random() * 80, now);
      osc.frequency.exponentialRampToValueAtTime(950 + Math.random() * 250, now + 0.38);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === "fireworkBurst") {
      // 💥 Firework Detonation: Deep low-frequency thump + crackling sizzle
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(130 + Math.random() * 30, now);
      osc.frequency.exponentialRampToValueAtTime(25, now + 0.35);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.38);

      // Crackle sizzle
      const length = Math.floor(ctx.sampleRate * 0.28);
      const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.08));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.setValueAtTime(1400, now);
      const nGain = ctx.createGain();
      nGain.gain.setValueAtTime(0.14, now);
      nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      noise.connect(filter);
      filter.connect(nGain);
      nGain.connect(ctx.destination);
      noise.start(now);
      noise.stop(now + 0.28);
    } else {
      // 👑 Royal victory chord (C5, E5, G5, C6)
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        const startTime = ctx.currentTime + idx * 0.08;
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.9);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.9);
      });
    }
  } catch {
    // Ignore audio policy restrictions
  }
}

function getNextBirthday() {
  const now = new Date();
  const thisYear = now.getFullYear();
  const bday = new Date(thisYear, BIRTHDAY_DATE.getMonth(), BIRTHDAY_DATE.getDate());
  if (now > bday) {
    bday.setFullYear(thisYear + 1);
  }
  return bday;
}

function getMidnightTarget() {
  // Target: September 10, BIRTHDAY_YEAR at 00:00:00 (Midnight)
  return new Date(BIRTHDAY_YEAR, 8, 10, 0, 0, 0);
}

function isMidnightPassed() {
  if (typeof window === "undefined") return false;
  try {
    if (sessionStorage.getItem("miang_midnight_bypassed") === "true") {
      return true;
    }
  } catch { }
  const now = new Date();
  const target = getMidnightTarget();
  return now.getTime() >= target.getTime();
}

function getAge() {
  return BIRTHDAY_YEAR - BIRTHDAY_DATE.getFullYear();
}

function getOrdinal(n: number) {
  if (n === 1 || n === 21 || n === 31) return "st";
  if (n === 2 || n === 22) return "nd";
  if (n === 3 || n === 23) return "rd";
  return "th";
}

// ─── Star Field Background (Optimized) ───
function StarField() {
  const stars = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: Math.floor(Math.random() * 100),
        top: Math.floor(Math.random() * 100),
        duration: 3 + (i % 4),
        delay: (i % 5) * 0.7,
        size: 1.5 + (i % 2),
      })),
    []
  );

  return (
    <div className="starfield" aria-hidden="true">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Floating Hearts Component (Optimized for Mobile) ───
function FloatingHearts() {
  const hearts = ["💖", "💕", "✨", "🌸", "🌹", "💫", "💝", "🎀", "💗", "🌷"];
  const items = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        emoji: hearts[i % hearts.length],
        left: 5 + (i * 8) % 90,
        delay: i * 1.1,
        duration: 12 + (i % 5) * 2,
        size: 0.9 + (i % 3) * 0.3,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div className="particles-container" aria-hidden="true">
      {items.map((item) => (
        <span
          key={item.id}
          className="floating-heart"
          style={{
            left: `${item.left}%`,
            animationDelay: `${item.delay}s`,
            animationDuration: `${item.duration}s`,
            fontSize: `${item.size}rem`,
          }}
        >
          {item.emoji}
        </span>
      ))}
    </div>
  );
}

// ─── Midnight Countdown Gate ───
function MidnightCountdownGate({ onUnlock }: { onUnlock: () => void }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isReady, setIsReady] = useState(false);
  const [autoUnlocked, setAutoUnlocked] = useState(false);

  useEffect(() => {
    function calculate() {
      const now = new Date();
      const target = getMidnightTarget();
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setIsReady(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        if (!autoUnlocked) {
          setAutoUnlocked(true);
          try {
            playAudioCue("success");
            import("canvas-confetti").then((m) => {
              m.default({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
            });
          } catch { }
          setTimeout(() => {
            onUnlock();
          }, 1500);
        }
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [autoUnlocked, onUnlock]);

  const handleManualPreview = () => {
    playAudioCue("skipTimer");
    try {
      sessionStorage.setItem("miang_midnight_bypassed", "true");
    } catch { }
    onUnlock();
  };

  return (
    <div className="midnight-gate-overlay">
      <div className="midnight-stars" />
      <div className="midnight-gate-card">
        <div className="midnight-crown-icon" onDoubleClick={handleManualPreview} style={{ cursor: "default", userSelect: "none" }}>👑</div>
        <span className="midnight-badge">🔐 BIRTHDAY SURPRISE VAULT</span>

        <h2 className="midnight-title">Shhh.... Sabar Meri Jaan! 🤫💖</h2>

        <p className="midnight-subtitle">
          Wifey G Aapka secret birthday surprise lock hai!
          <br />
          <strong>When your time start </strong> this door will be open automatically... 🎂✨
        </p>

        {/* ─── Glowing Countdown Grid ─── */}
        <div className="midnight-timer-grid">
          {[
            { value: timeLeft.days, label: "Days" },
            { value: timeLeft.hours, label: "Hours" },
            { value: timeLeft.minutes, label: "Minutes" },
            { value: timeLeft.seconds, label: "Seconds" },
          ].map((unit) => (
            <div className="midnight-timer-box" key={unit.label}>
              <div className="midnight-timer-num">
                {String(unit.value).padStart(2, "0")}
              </div>
              <div className="midnight-timer-label">{unit.label}</div>
            </div>
          ))}
        </div>

        <div className="midnight-romantic-note">
          <p className="note-urdu">
            &ldquo;Waqt aahista chal raha hai kyunke khushi bohot badi hai... bas thora sa intezar <span className="note-highlight">meri Wifey!</span>&rdquo; 🥺❤️
          </p>
          <div className="midnight-pulse-heart">💓</div>
        </div>

        {isReady && (
          <div className="midnight-unlocked-banner">
            🎉 IT&apos;S FINALLY 12:00 AM! Opening Your Surprises... 💖
          </div>
        )}

        {/* Skip Timer Button */}
        <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
          <button
            type="button"
            onClick={handleManualPreview}
            className="midnight-skip-btn"
            style={{
              background: "linear-gradient(135deg, #ff4081, #9c27b0)",
              border: "none",
              color: "#fff",
              padding: "10px 24px",
              borderRadius: "25px",
              fontSize: "0.95rem",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(255, 64, 129, 0.4)",
              transition: "all 0.3s ease",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>⏩</span>
            <span>Skip Timer &amp; Open Website ✨</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Qualities Section (Interactive Cute Reactions: 🌸, 😘, 🥰, 💖) ───
interface ScreenReactionItem {
  id: string;
  emoji: string;
  subEmoji?: string;
  x: number;
  y: number;
  scale: number;
  delay: number;
}

function QualitiesSection() {
  const qualities = [
    { emoji: "💍", word: "Laiba Mehboob" },
    { emoji: "👑", word: "Wifey G" },
    { emoji: "🎀", word: "Cutie Puttitiee" },
    { emoji: "🌹", word: "Moiii Bagam" },
    { emoji: "🥰", word: "Baybooo" },
    { emoji: "🦋", word: "Lailaaaaa" },
    { emoji: "👸", word: "Princess" },
    { emoji: "🍠", word: "Sweet potato" },
    { emoji: "🥺", word: "Mara Bacha" },
    { emoji: "🌟", word: "My Proud" },
    { emoji: "🕊️", word: "Moiii Sakoon" },
    { emoji: "🐥", word: "Sonu kaka" },
  ];

  const [activeReactions, setActiveReactions] = useState<ScreenReactionItem[]>([]);
  const [clickedCardIdx, setClickedCardIdx] = useState<number | null>(null);
  const reactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCardClick = (idx: number) => {
    setClickedCardIdx(idx);
    setTimeout(() => setClickedCardIdx(null), 500);

    // 4 cute themes (Ak card click par in ma sa AK hi aayega):
    // 1. Pink Flower (🌸)
    // 2. Emoji Wali Kiss (😘)
    // 3. Cute Face with Hearts (🥰)
    // 4. Heart (💖)
    const themes = [
      { emoji: "🌸", subEmoji: "✨", sound: "twinkle" as const },
      { emoji: "😘", subEmoji: "💖", sound: "kiss" as const },
      { emoji: "🥰", subEmoji: "💕", sound: "heartPop" as const },
      { emoji: "💖", subEmoji: "✨", sound: "heartPop" as const },
    ];
    const chosen = themes[Math.floor(Math.random() * themes.length)];

    // Random count: kabhi 1, kabhi 2 ya 3, kabhi 3 ya 4
    const rand = Math.random();
    let count = 1;
    if (rand < 0.3) {
      count = 1;
    } else if (rand < 0.7) {
      count = Math.random() < 0.5 ? 2 : 3;
    } else {
      count = Math.random() < 0.5 ? 3 : 4;
    }

    // Play appropriate sound cue matching count
    playAudioCue(chosen.sound);
    if (count > 1) {
      setTimeout(() => playAudioCue(chosen.sound), 140);
    }
    if (count > 2) {
      setTimeout(() => playAudioCue(chosen.sound), 280);
    }

    // Generate positions for 1, 2, 3, or 4 of ONLY the chosen emoji
    const now = Date.now();
    let newItems: ScreenReactionItem[] = [];
    const jitter = () => (Math.random() - 0.5) * 8;

    if (count === 1) {
      newItems = [
        { id: `${now}-0`, emoji: chosen.emoji, subEmoji: chosen.subEmoji, x: 50 + jitter(), y: 46 + jitter(), scale: 1.15, delay: 0 },
      ];
    } else if (count === 2) {
      newItems = [
        { id: `${now}-0`, emoji: chosen.emoji, subEmoji: chosen.subEmoji, x: 38 + jitter(), y: 45 + jitter(), scale: 1.05, delay: 0 },
        { id: `${now}-1`, emoji: chosen.emoji, subEmoji: chosen.subEmoji, x: 62 + jitter(), y: 48 + jitter(), scale: 1.08, delay: 0.14 },
      ];
    } else if (count === 3) {
      newItems = [
        { id: `${now}-0`, emoji: chosen.emoji, subEmoji: chosen.subEmoji, x: 30 + jitter(), y: 44 + jitter(), scale: 1.0, delay: 0 },
        { id: `${now}-1`, emoji: chosen.emoji, subEmoji: chosen.subEmoji, x: 70 + jitter(), y: 46 + jitter(), scale: 1.05, delay: 0.12 },
        { id: `${now}-2`, emoji: chosen.emoji, subEmoji: chosen.subEmoji, x: 50 + jitter(), y: 36 + jitter(), scale: 1.1, delay: 0.24 },
      ];
    } else {
      // 4 items
      newItems = [
        { id: `${now}-0`, emoji: chosen.emoji, subEmoji: chosen.subEmoji, x: 28 + jitter(), y: 40 + jitter(), scale: 0.95, delay: 0 },
        { id: `${now}-1`, emoji: chosen.emoji, subEmoji: chosen.subEmoji, x: 72 + jitter(), y: 43 + jitter(), scale: 1.0, delay: 0.1 },
        { id: `${now}-2`, emoji: chosen.emoji, subEmoji: chosen.subEmoji, x: 42 + jitter(), y: 54 + jitter(), scale: 1.05, delay: 0.22 },
        { id: `${now}-3`, emoji: chosen.emoji, subEmoji: chosen.subEmoji, x: 58 + jitter(), y: 33 + jitter(), scale: 1.0, delay: 0.32 },
      ];
    }

    setActiveReactions(newItems);

    if (reactionTimeoutRef.current) clearTimeout(reactionTimeoutRef.current);
    reactionTimeoutRef.current = setTimeout(() => {
      setActiveReactions([]);
    }, 2200);
  };

  return (
    <section className="qualities-section" id="qualities">
      <h2 className="section-title">👑 Words That Describe You 👑</h2>
      <div className="section-divider" />
      <p className="qualities-hint">
        ✨ Tap any card for cute surprises! <span className="hint-kiss">🌸 😘 🥰 💖</span>
      </p>
      <div className="qualities-grid">
        {qualities.map((q, i) => (
          <div
            className={`quality-card ${clickedCardIdx === i ? "card-kissed" : ""}`}
            key={i}
            onClick={() => handleCardClick(i)}
            role="button"
            tabIndex={0}
            title={`Tap for surprises for ${q.word}! ✨`}
          >
            <span className="card-tap-kiss" aria-hidden="true">✨</span>
            <span className="quality-emoji">{q.emoji}</span>
            <span className="quality-word">{q.word}</span>
          </div>
        ))}
      </div>

      {/* Full Screen Cute Reaction Overlay (One theme: 🌸 / 😘 / 🥰 / 💖) */}
      {activeReactions.length > 0 && (
        <div className="screen-kiss-overlay" aria-hidden="true">
          {activeReactions.map((item) => (
            <div
              key={item.id}
              className="screen-kiss-item"
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                animationDelay: `${item.delay}s`,
                transform: `translate(-50%, -50%) scale(${item.scale})`,
              }}
            >
              <span className="screen-kiss-face">{item.emoji}</span>
              {item.subEmoji && <span className="screen-kiss-heart">{item.subEmoji}</span>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Realistic 3D Birthday Cake Section with 4 Proper Slices (4 Clicks) ───
function CakeSection() {
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [slicesCut, setSlicesCut] = useState(0); // 0, 1, 2, 3, 4
  const [isSlicing, setIsSlicing] = useState(false);
  const age = getAge();

  const handleBlowCandles = useCallback(() => {
    if (candlesBlown) {
      playAudioCue("twinkle");
      return;
    }
    playAudioCue("candleBlow");
    setCandlesBlown(true);

    import("canvas-confetti")
      .then((mod) => {
        const confetti = mod.default;
        for (let i = 0; i < 4; i++) {
          setTimeout(() => {
            confetti({
              particleCount: 70,
              spread: 90 + i * 20,
              origin: { y: 0.55, x: 0.3 + Math.random() * 0.4 },
              colors: ["#ff0080", "#ffd700", "#ff6b9d", "#ce93d8", "#00f5ff"],
            });
          }, i * 250);
        }
      })
      .catch(() => {});
  }, [candlesBlown]);

  const handleSliceCake = useCallback(() => {
    setSlicesCut((prev) => (prev >= 4 ? 4 : prev + 1));
    setIsSlicing(true);
    setTimeout(() => {
      setIsSlicing(false);
    }, 600);

    playAudioCue("cakeSlice");

    import("canvas-confetti")
      .then((mod) => {
        const confetti = mod.default;
        confetti({
          particleCount: 65,
          spread: 80,
          origin: { y: 0.58, x: 0.5 },
          colors: ["#ffd700", "#ff0080", "#ff4081", "#ffffff", "#ce93d8"],
        });
      })
      .catch(() => {});
  }, []);

  const handleRelight = useCallback(() => {
    playAudioCue("twinkle");
    setCandlesBlown(false);
    setSlicesCut(0);
  }, []);

  // Realistic candles (rendered only when !candlesBlown)
  const candleCoords = [
    { x: 135, y: 146 },
    { x: 158, y: 136 },
    { x: 182, y: 130 },
    { x: 206, y: 130 },
    { x: 230, y: 136 },
    { x: 252, y: 146 },
    { x: 194, y: 154 },
  ];

  return (
    <section className="cake-section" id="cake">
      <h2 className="section-title">🎂 Make a Wish & Slice the Cake! 🎂</h2>
      <div className="section-divider" />

      {/* Realistic 3D Birthday Cake Stage (Click on cake is disabled; only button cuts) */}
      <div className="realistic-cake-stage">
        <svg className="realistic-cake-svg" viewBox="0 0 380 300">
          <defs>
            {/* Golden Stand Shading */}
            <linearGradient id="goldStandGrad" x1="0%" y1="0%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#b8860b" />
              <stop offset="25%" stopColor="#ffd700" />
              <stop offset="45%" stopColor="#fff8e1" />
              <stop offset="70%" stopColor="#d4af37" />
              <stop offset="100%" stopColor="#8c6b12" />
            </linearGradient>

            {/* Cake Cylinder 3D Shading */}
            <linearGradient id="cakeSideRealGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#660d2e" />
              <stop offset="20%" stopColor="#ad1457" />
              <stop offset="50%" stopColor="#ec407a" />
              <stop offset="80%" stopColor="#c2185b" />
              <stop offset="100%" stopColor="#4a0520" />
            </linearGradient>

            {/* Biscuit Crust Bottom */}
            <linearGradient id="biscuitBaseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#5d4037" />
              <stop offset="50%" stopColor="#8d6e63" />
              <stop offset="100%" stopColor="#3e2723" />
            </linearGradient>

            {/* Cake Top Frosting Ellipse */}
            <radialGradient id="cakeTopRealGrad" cx="45%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#ff80ab" />
              <stop offset="60%" stopColor="#f06292" />
              <stop offset="100%" stopColor="#c2185b" />
            </radialGradient>

            {/* Dripping Strawberry Glaze */}
            <linearGradient id="dripGlazeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ff4081" />
              <stop offset="100%" stopColor="#880e4f" />
            </linearGradient>

            {/* Strawberry Fruit Gradient */}
            <radialGradient id="strawberryGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ff5252" />
              <stop offset="65%" stopColor="#d50000" />
              <stop offset="100%" stopColor="#880e4f" />
            </radialGradient>

            {/* Whipped Cream Rosette */}
            <radialGradient id="creamRosetteGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="70%" stopColor="#fff8e1" />
              <stop offset="100%" stopColor="#ffe082" />
            </radialGradient>

            {/* Inside Sponge Cross Section when cut */}
            <linearGradient id="insideSpongeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff9c4" />
              <stop offset="25%" stopColor="#f8bbd0" />
              <stop offset="50%" stopColor="#ad1457" />
              <stop offset="75%" stopColor="#f8bbd0" />
              <stop offset="100%" stopColor="#5d4037" />
            </linearGradient>
          </defs>

          {/* 1. Floor Shadow */}
          <ellipse cx="190" cy="272" rx="145" ry="22" fill="rgba(0,0,0,0.5)" filter="blur(8px)" />

          {/* 2. Golden Cake Stand Base */}
          <ellipse cx="190" cy="252" rx="150" ry="32" fill="url(#goldStandGrad)" stroke="#ffe082" strokeWidth="2.5" />
          <ellipse cx="190" cy="248" rx="142" ry="28" fill="#2a0535" stroke="rgba(255,215,0,0.4)" strokeWidth="1.5" />

          {/* 3. 4 PROPER CAKE SLICES (Cut 1-by-1 across 4 clicks: Front slices first, then back slices) */}
          <g className="cake-slices-4-wrapper">
            {/* ─── SLICE 4: BACK-LEFT QUADRANT (Cuts on Click 4) ─── */}
            <g
              className={`cake-slice-quadrant ${slicesCut >= 4 ? "cut-slice-4" : ""}`}
              transform={slicesCut >= 4 ? "translate(-26, -18)" : "translate(0, 0)"}
              style={{
                transform: slicesCut >= 4 ? "translate(-26px, -18px)" : "translate(0px, 0px)",
              }}
            >
              {/* Back wall of Back-Left Slice */}
              <path
                d="M 80 155 A 110 40 0 0 1 190 115 L 190 190 A 110 40 0 0 0 80 230 Z"
                fill="url(#cakeSideRealGrad)"
                opacity="0.88"
              />
              {/* Exposed cut wall along horizontal cut (visible when front-left slice moves on click 2) */}
              {slicesCut >= 2 && (
                <g>
                  <path d="M 80 155 L 190 155 L 190 230 L 80 230 Z" fill="url(#insideSpongeGrad)" stroke="#ffd700" strokeWidth="1" />
                  <line x1="80" y1="180" x2="190" y2="180" stroke="#fffde7" strokeWidth="3" />
                  <line x1="80" y1="195" x2="190" y2="195" stroke="#d81b60" strokeWidth="3.5" />
                  <line x1="80" y1="210" x2="190" y2="210" stroke="#fffde7" strokeWidth="3" />
                </g>
              )}
              {/* Top frosted surface quadrant */}
              <path
                d="M 190 155 L 80 155 A 110 40 0 0 1 190 115 Z"
                fill="url(#cakeTopRealGrad)"
                stroke={slicesCut >= 4 ? "#ffd700" : "none"}
                strokeWidth={slicesCut >= 4 ? "1.5" : "0"}
              />
              {/* Cream swirls on this quadrant */}
              <circle cx="118" cy="142" r="7.5" fill="url(#creamRosetteGrad)" />
              <circle cx="150" cy="132" r="7.5" fill="url(#creamRosetteGrad)" />
              {/* Strawberry */}
              <g transform="translate(142, 142) scale(0.95)">
                <path d="M 0 -7 C 8 -7, 10 3, 0 12 C -10 3, -8 -7, 0 -7 Z" fill="url(#strawberryGrad)" />
                <path d="M 0 -7 L -3 -11 L -1 -7 L 3 -11 L 1 -7 Z" fill="#4caf50" />
              </g>
            </g>

            {/* ─── SLICE 3: BACK-RIGHT QUADRANT (Cuts on Click 3) ─── */}
            <g
              className={`cake-slice-quadrant ${slicesCut >= 3 ? "cut-slice-3" : ""}`}
              transform={slicesCut >= 3 ? "translate(26, -18)" : "translate(0, 0)"}
              style={{
                transform: slicesCut >= 3 ? "translate(26px, -18px)" : "translate(0px, 0px)",
              }}
            >
              {/* Back wall of Back-Right Slice */}
              <path
                d="M 190 115 A 110 40 0 0 1 300 155 L 300 230 A 110 40 0 0 0 190 190 Z"
                fill="url(#cakeSideRealGrad)"
                opacity="0.88"
              />
              {/* Exposed cut wall along horizontal cut (visible when front-right slice moves on click 1) */}
              {slicesCut >= 1 && (
                <g>
                  <path d="M 190 155 L 300 155 L 300 230 L 190 230 Z" fill="url(#insideSpongeGrad)" stroke="#ffd700" strokeWidth="1" />
                  <line x1="190" y1="180" x2="300" y2="180" stroke="#fffde7" strokeWidth="3" />
                  <line x1="190" y1="195" x2="300" y2="195" stroke="#d81b60" strokeWidth="3.5" />
                  <line x1="190" y1="210" x2="300" y2="210" stroke="#fffde7" strokeWidth="3" />
                </g>
              )}
              {/* Top frosted surface quadrant */}
              <path
                d="M 190 155 L 190 115 A 110 40 0 0 1 300 155 Z"
                fill="url(#cakeTopRealGrad)"
                stroke={slicesCut >= 3 ? "#ffd700" : "none"}
                strokeWidth={slicesCut >= 3 ? "1.5" : "0"}
              />
              {/* Cream swirls on this quadrant */}
              <circle cx="230" cy="132" r="7.5" fill="url(#creamRosetteGrad)" />
              <circle cx="262" cy="142" r="7.5" fill="url(#creamRosetteGrad)" />
              {/* Strawberry */}
              <g transform="translate(232, 142) scale(0.95)">
                <path d="M 0 -7 C 8 -7, 10 3, 0 12 C -10 3, -8 -7, 0 -7 Z" fill="url(#strawberryGrad)" />
                <path d="M 0 -7 L -3 -11 L -1 -7 L 3 -11 L 1 -7 Z" fill="#4caf50" />
              </g>
            </g>

            {/* ─── SLICE 2: FRONT-LEFT QUADRANT (Cuts on Click 2) ─── */}
            <g
              className={`cake-slice-quadrant ${slicesCut >= 2 ? "cut-slice-2" : ""}`}
              transform={slicesCut >= 2 ? "translate(-32, 22)" : "translate(0, 0)"}
              style={{
                transform: slicesCut >= 2 ? "translate(-32px, 22px)" : "translate(0px, 0px)",
              }}
            >
              {/* Front curved wall */}
              <path
                d="M 80 155 A 110 40 0 0 0 190 195 L 190 270 C 130 270, 80 258, 80 230 Z"
                fill="url(#cakeSideRealGrad)"
              />
              {/* Bottom biscuit crust */}
              <path
                d="M 80 218 C 80 245, 130 255, 190 255 L 190 270 C 130 270, 80 258, 80 230 Z"
                fill="url(#biscuitBaseGrad)"
              />
              {/* Whipped cream divider line */}
              <path d="M 82 195 C 82 225, 135 236, 190 236" fill="none" stroke="#fffde7" strokeWidth="3.5" strokeDasharray="6 3" />
              {/* Dripping glaze */}
              <path
                d="M 80 155 C 95 178, 105 186, 115 172 C 128 198, 138 205, 148 174 C 160 210, 172 216, 185 170 L 190 195 L 80 155 Z"
                fill="url(#dripGlazeGrad)"
              />
              {/* Exposed cut wall along vertical cut (visible when front-right moves on click 1 or this moves on click 2) */}
              {slicesCut >= 1 && (
                <g>
                  <path d="M 190 155 L 190 195 L 190 270 L 190 230 Z" fill="url(#insideSpongeGrad)" stroke="#ffd700" strokeWidth="1" />
                  <line x1="190" y1="180" x2="190" y2="255" stroke="#fffde7" strokeWidth="3" />
                  <line x1="190" y1="195" x2="190" y2="260" stroke="#d81b60" strokeWidth="3.5" />
                </g>
              )}
              {/* Top frosted surface quadrant */}
              <path
                d="M 190 155 L 190 195 A 110 40 0 0 1 80 155 Z"
                fill="url(#cakeTopRealGrad)"
                stroke={slicesCut >= 2 ? "#ffd700" : "none"}
                strokeWidth={slicesCut >= 2 ? "1.5" : "0"}
              />
              {/* Cream swirls on this quadrant */}
              <circle cx="95" cy="154" r="7.5" fill="url(#creamRosetteGrad)" />
              <circle cx="120" cy="168" r="7.5" fill="url(#creamRosetteGrad)" />
              <circle cx="155" cy="176" r="7.5" fill="url(#creamRosetteGrad)" />
              {/* Strawberry */}
              <g transform="translate(140, 162) scale(1)">
                <path d="M 0 -7 C 8 -7, 10 3, 0 12 C -10 3, -8 -7, 0 -7 Z" fill="url(#strawberryGrad)" />
                <path d="M 0 -7 L -3 -11 L -1 -7 L 3 -11 L 1 -7 Z" fill="#4caf50" />
              </g>
            </g>

            {/* ─── SLICE 1: FRONT-RIGHT QUADRANT (Cuts FIRST on Click 1) ─── */}
            <g
              className={`cake-slice-quadrant ${slicesCut >= 1 ? "cut-slice-1" : ""}`}
              transform={slicesCut >= 1 ? "translate(32, 22)" : "translate(0, 0)"}
              style={{
                transform: slicesCut >= 1 ? "translate(32px, 22px)" : "translate(0px, 0px)",
              }}
            >
              {/* Front curved wall */}
              <path
                d="M 190 195 A 110 40 0 0 0 300 155 L 300 230 C 300 258, 250 270, 190 270 Z"
                fill="url(#cakeSideRealGrad)"
              />
              {/* Bottom biscuit crust */}
              <path
                d="M 190 255 C 250 255, 300 245, 300 218 L 300 230 C 300 258, 250 270, 190 270 Z"
                fill="url(#biscuitBaseGrad)"
              />
              {/* Whipped cream divider line */}
              <path d="M 190 236 C 245 236, 298 225, 298 195" fill="none" stroke="#fffde7" strokeWidth="3.5" strokeDasharray="6 3" />
              {/* Dripping glaze */}
              <path
                d="M 190 195 L 198 170 C 210 204, 222 210, 235 172 C 248 194, 258 200, 268 170 C 280 190, 290 184, 300 155 L 190 195 Z"
                fill="url(#dripGlazeGrad)"
              />
              {/* Exposed cut wall along vertical cut (facing left towards center) */}
              {slicesCut >= 1 && (
                <g>
                  <path d="M 190 155 L 190 195 L 190 270 L 190 230 Z" fill="url(#insideSpongeGrad)" stroke="#ffd700" strokeWidth="1" />
                  <line x1="190" y1="180" x2="190" y2="255" stroke="#fffde7" strokeWidth="3" />
                  <line x1="190" y1="195" x2="190" y2="260" stroke="#d81b60" strokeWidth="3.5" />
                </g>
              )}
              {/* Exposed cut wall along horizontal cut (facing back towards center) */}
              {slicesCut >= 1 && (
                <g>
                  <path d="M 190 155 L 300 155 L 300 230 L 190 230 Z" fill="url(#insideSpongeGrad)" stroke="#ffd700" strokeWidth="1" />
                  <line x1="190" y1="180" x2="300" y2="180" stroke="#fffde7" strokeWidth="3" />
                  <line x1="190" y1="195" x2="300" y2="195" stroke="#d81b60" strokeWidth="3.5" />
                  <line x1="190" y1="210" x2="300" y2="210" stroke="#fffde7" strokeWidth="3" />
                </g>
              )}
              {/* Top frosted surface quadrant */}
              <path
                d="M 190 155 L 300 155 A 110 40 0 0 1 190 195 Z"
                fill="url(#cakeTopRealGrad)"
                stroke={slicesCut >= 1 ? "#ffd700" : "none"}
                strokeWidth={slicesCut >= 1 ? "1.5" : "0"}
              />
              {/* Cream swirls on this quadrant */}
              <circle cx="285" cy="154" r="7.5" fill="url(#creamRosetteGrad)" />
              <circle cx="260" cy="168" r="7.5" fill="url(#creamRosetteGrad)" />
              <circle cx="225" cy="176" r="7.5" fill="url(#creamRosetteGrad)" />
              {/* Strawberry */}
              <g transform="translate(235, 162) scale(1)">
                <path d="M 0 -7 C 8 -7, 10 3, 0 12 C -10 3, -8 -7, 0 -7 Z" fill="url(#strawberryGrad)" />
                <path d="M 0 -7 L -3 -11 L -1 -7 L 3 -11 L 1 -7 Z" fill="#4caf50" />
              </g>
            </g>
          </g>

          {/* Center Rosette Cream & Strawberry (visible before cutting) */}
          {slicesCut === 0 && (
            <g transform="translate(190, 155)">
              <circle cx="0" cy="0" r="10" fill="url(#creamRosetteGrad)" />
              <g transform="translate(0, -4) scale(1.05)">
                <path d="M 0 -7 C 8 -7, 10 3, 0 12 C -10 3, -8 -7, 0 -7 Z" fill="url(#strawberryGrad)" />
                <path d="M 0 -7 L -3 -11 L -1 -7 L 3 -11 L 1 -7 Z" fill="#4caf50" />
              </g>
            </g>
          )}

          {/* 4. REALISTIC CANDLES: ONLY RENDERED WHEN NOT BLOWN */}
          {!candlesBlown && (
            <g className="realistic-candles-layer">
              {candleCoords.map((c, i) => (
                <g key={`candle-${i}`}>
                  {/* Candle shadow */}
                  <ellipse cx={c.x} cy={c.y + 2} rx="4" ry="1.5" fill="rgba(0,0,0,0.3)" />

                  {/* Candle stick (striped cylinder) */}
                  <rect
                    x={c.x - 3}
                    y={c.y - 20}
                    width="6"
                    height="22"
                    rx="2"
                    fill="#ffffff"
                    stroke="#ffd700"
                    strokeWidth="0.8"
                  />
                  {/* Candy stripes */}
                  <line x1={c.x - 3} y1={c.y - 15} x2={c.x + 3} y2={c.y - 12} stroke="#ff4081" strokeWidth="2" />
                  <line x1={c.x - 3} y1={c.y - 8} x2={c.x + 3} y2={c.y - 5} stroke="#ff4081" strokeWidth="2" />

                  {/* Candle Wick */}
                  <line x1={c.x} y1={c.y - 20} x2={c.x} y2={c.y - 24} stroke="#212121" strokeWidth="1" />

                  {/* Flame Glow Halo */}
                  <circle
                    cx={c.x}
                    cy={c.y - 28}
                    r="10"
                    fill="rgba(255, 215, 0, 0.5)"
                    className="candle-flame-glow"
                  />

                  {/* Realistic Teardrop Flame */}
                  <ellipse
                    cx={c.x}
                    cy={c.y - 28}
                    rx="3.5"
                    ry="6.5"
                    fill="#ff9800"
                    className="candle-flame-glow"
                  />
                  <ellipse
                    cx={c.x}
                    cy={c.y - 27}
                    rx="2"
                    ry="4"
                    fill="#fffde7"
                  />
                </g>
              ))}
            </g>
          )}
        </svg>

        {/* Animated Knife Slash across Cake when Slicing */}
        {isSlicing && <div key={`knife-${slicesCut}`} className="knife-slicing-animation">🔪</div>}
      </div>

      <div className="age-badge">{age}</div>

      {/* ─── SINGLE ACTION BUTTON (Clean & Simple) ─── */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.8rem", marginTop: "0.5rem" }}>
        {/* BEFORE BLOW: ONLY Blow the Candles button */}
        {!candlesBlown && (
          <button className="blow-candles-btn" onClick={handleBlowCandles}>
            💨 Blow the Candles!
          </button>
        )}

        {/* AFTER BLOW & BEFORE ALL 4 SLICES ARE CUT: ONLY Slice the Cake button */}
        {candlesBlown && slicesCut < 4 && (
          <div className="cake-actions-wrap">
            <button
              className={`slice-cake-btn ${isSlicing ? "slicing" : ""}`}
              onClick={handleSliceCake}
            >
              <span>Slice the Cake! 🔪🎂</span>
            </button>
          </div>
        )}

        {/* AFTER ALL 4 SLICES CUT: Simple Relight & Cut Again button (NO feed bite button, NO dialog) */}
        {candlesBlown && slicesCut === 4 && (
          <div className="cake-actions-wrap">
            <button className="cake-relight-btn" onClick={handleRelight}>
              🔄 Relight Candles & Cut Again
            </button>
          </div>
        )}
      </div>

      <p className="cake-message" style={{ marginTop: "1.2rem" }}>
        {slicesCut === 4
          ? `Happy Birthday, my sweet potato Wifey! 🎂💖 All 4 slices are cut for you!`
          : slicesCut > 0
          ? `Slice cut with love! Click again to cut the next slice! 🍰✨`
          : candlesBlown
          ? `Candles are blown! Now click "Slice the Cake! 🔪🎂" below to cut the cake! 🌟`
          : `Close your eyes, make a wish, and blow out the candles! ✨ You deserve every dream come true! 💫`}
      </p>
    </section>
  );
}

// ─── Reasons to Love Section ───
function ReasonsSection() {
  const reasons = [
    { text: "Start 'This way 😘' se hua tha, aur aaj aap meri poori duniya aur lifeline ban chuki ho", emoji: "💍" },
    { text: "Aap ke saath jo sukoon, peace aur vibe milti hai, wo duniya ke kisi aur kone me nahi hai", emoji: "🕊️" },
    { text: "Mera Gollluu Motlluu Panda 🐼 — aap ke bagair meri life bilkul adhoori hai, ek pal bhi aap ke bina nahi reh sakta", emoji: "🥺" },
    { text: "You are the greatest blessing of my life — aap ke aane ke baad meri zindagi itni haseen ho gayi ke shukar karte thakta nahi", emoji: "🌸" },
    { text: "Chahe jitna bhi naraz ho jao, aap ko manana aur aap ke har khwaab ke liye duniya se ladna meri responsibility hai", emoji: "😇" },
    { text: "Hamari memories itni achi hain ke jab bhi socho dil khush ho jata hai — 'Majjjaa a gyaaaa Yaar life ka!'", emoji: "🥰" },
    { text: "Aap ke chehre ki hansi aur ronak dekh kar dil ko jo chain milta hai, that is my entire world", emoji: "✨" },
    { text: "Har birthday aap ke saath aese manana hai jaise pehli baar ho — full josh aur 'Mahol pura wavy' ke sath!", emoji: "💃" },
    { text: "Zoiiii ki Mama, Shahzain ki Chachi, meri Cutie Puttitieee — har roop me aap meri absolute Queen ho", emoji: "👑" },
    { text: "Poori life aap ke saath guzarni hai — proud and blessed to call you Laiba Mehboob", emoji: "❤️" },
  ];

  return (
    <section className="reasons-section" id="reasons">
      <h2 className="section-title">💕 10 Reasons To Fall In Love With You 💕</h2>
      <div className="section-divider" />
      <div className="reasons-container">
        {reasons.map((reason, i) => (
          <div
            className="reason-item"
            key={i}
            onClick={() => playAudioCue(i % 2 === 0 ? "heartPop" : "twinkle")}
            style={{ cursor: "pointer" }}
            title="Tap for love sparkle ✨"
          >
            <span className="reason-number">{i + 1}.</span>
            <span className="reason-text">{reason.text}</span>
            <span className="reason-emoji">{reason.emoji}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Cute Interactive Love Letter Section ───
function LoveLetter() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const age = getAge();

  const handleOpen = useCallback(async () => {
    if (isOpen) return;
    setIsOpening(true);
    playAudioCue("letterOpen");

    // Burst of heart & golden confetti
    try {
      const confetti = (await import("canvas-confetti")).default;
      const heart = confetti.shapeFromPath({
        path: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
      });
      confetti({
        shapes: [heart],
        particleCount: 50,
        spread: 80,
        origin: { y: 0.6 },
        scalar: 2,
        colors: ["#ff0080", "#ff6b9d", "#ffd700", "#ff1744"],
      });
    } catch (_) { }

    setTimeout(() => {
      setIsOpen(true);
      setIsOpening(false);
    }, 550);
  }, [isOpen]);

  const handleClose = () => {
    playAudioCue("cardFlip");
    setIsOpen(false);
  };

  return (
    <section className="letter-section" id="letter">
      <h2 className="section-title">💌 A Letter From My Heart 💌</h2>
      <div className="section-divider" />

      {!isOpen ? (
        /* ─── Cute Realistic 3D Love Envelope ─── */
        <div className="envelope-interactive-zone">
          <div
            className={`envelope-container ${isOpening ? "unsealing" : ""}`}
            onClick={handleOpen}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleOpen()}
            aria-label="Open Love Letter"
          >
            {/* Triangular Top Flap */}
            <div className="envelope-top-flap" />

            {/* Diagonal Left & Right Fold Lines */}
            <div className="envelope-fold-left" />
            <div className="envelope-fold-right" />

            {/* Vintage Air Mail Stamp (Top Right) */}
            <div className="envelope-stamp">
              <span className="stamp-sub">AIR MAIL</span>
              <div className="stamp-heart">💖</div>
              <span className="stamp-sub">10 SEPT</span>
            </div>

            {/* 3D Wax Seal Holding the Flap */}
            <div className="wax-seal">
              <span className="seal-heart">💖</span>
              <span className="seal-text">SEALED</span>
            </div>

            {/* Handwritten Addressing in Lower Half */}
            <div className="envelope-address-area">
              <p className="to-line">
                To: <span className="address-name">Meri Pyaari Wifey, Laiba Ahmad</span> 🌹
              </p>
              <p className="from-line">
                From: <span className="address-from">Your MianG</span> 💍
              </p>
            </div>
          </div>

          <p className="envelope-cta">
            <span className="cta-icon">✨</span>
            <span>Tap the Envelope to Break the Seal & Open</span>
            <span className="cta-icon">✨</span>
          </p>
        </div>
      ) : (
        /* ─── Unfolded Romantic Parchment Letter ─── */
        <div className="unfolded-letter-container">
          <div className="letter-paper">
            <div className="letter-header-decor">
              <span className="decor-heart">🌹</span>
              <span className="decor-date">Our 3rd Birthday Together • September 10, {BIRTHDAY_YEAR}</span>
              <span className="decor-heart">🌹</span>
            </div>

            <p className="letter-greeting">My Dearest Begum Jaan (Laiba Mehboob), 🫀🌹</p>

            <div className="letter-body">
              <p>
                Happy {age}rd Birthday to the love of my life, my queen, and my forever! 🎂💖 Today as we celebrate our <span className="highlight">3rd birthday together</span>, my heart is overflowing with so much gratitude and love. Words can never truly capture how precious and valuable you are to me.
              </p>

              <p>
                Who would have thought that a journey starting with a sweet little <span className="highlight">&ldquo;This way 😘&rdquo;</span> would bring us here today? Shukar Alhamdulillah, lakh lakh shukar ke meri life partner, meri wifey aap ho. Maine kabhi zindagi me nahi socha tha ke main kisi ke liye aese crave kar sakta hoon, kisi se itna toot kar pyaar kar sakta hoon... <span className="highlight">but you walked into my life, and you made me complete</span>.
              </p>

              <p>
                With you, I found a peace, a sukoon, and a vibe that exists nowhere else in this entire world. Wo har pal ka maza, wo hansi, wo be-panaah sukoon — asy jasy <span className="highlight">&ldquo;Majjjaa a gyaaaa Yaar life ka!&rdquo;</span> When I look at you, my entire world feels blessed. Aap sirf meri biwi nahi ho, aap meri lifeline ho, mera Gollluu Motlluu Panda 🐼, Zoiiii ki Mama, Shahzain ki Chachiii, meri Cutie Puttitieee, aur mera Sweet potato ho! 🥺🥔💖
              </p>

              <p>
                I know kabhi kabhi main aap ko naraz kar deta hoon, aur mujhe theek se manana bhi nahi aata... but I promise I will learn everything for you, because <span className="highlight">you are my everything</span>. Aap ke bina meri life bilkul adhoori hai — main ab apni zindagi ka ek pal bhi aap ke bagair imagine nahi kar sakta. Aap se hi to meri life ki saari raunqein aur khushiyan hain!
              </p>

              <p>
                My promise to you will never fade: <span className="highlight">I will fight the entire world for your happiness</span>, protect every single smile of yours, and do everything in my power to make every dream of yours come true. Har saal, har birthday aap ke saath usi pehli mulaqat jaisi excitement, usi deewangi aur <span className="highlight">&ldquo;Mahol pura wavy&rdquo;</span> ke saath manaoonga! 💃✨
              </p>

              <p>
                You are my today, my tomorrow, and every beautiful dream I have for the future. May Allah Pak keep our bond blessed, protect our pure love from every evil eye, and keep us smiling together forever. <span className="highlight">Ameeeeen Summa Ameeeeen!</span> 🤲🌸💍
              </p>

              <p>
                I love you sooooooooooooooooo much, Begum Jaan... more than words could ever say and more than you could ever imagine! 🥺❤️
              </p>
            </div>

            <p className="letter-signature">Forever &amp; Always Yours, Your MianG (Mehboob Waqar) ❤️💍</p>

            <button className="reseal-letter-btn" onClick={handleClose}>
              <span>💌 Fold &amp; Seal Letter Again</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

// ─── Timeline Section (Our Journey & Meetups) ───
function Timeline() {
  const age = getAge();
  const [timelineModalIndex, setTimelineModalIndex] = useState<number | null>(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);

  const milestones = [
    {
      id: 1,
      emoji: "👶",
      badge: "Angel Born & Childhood",
      title: "Baby Laiba & Childhood Cuteness",
      date: "Childhood Days",
      text: "Wo masoom aur pyari bachi jo aage chal kar meri poori duniya banne wali thi — Baby Laiba, cutest since day 1! 🎀",
      photos: [
        "/gallery/baby-laiba-1.jpeg",
        "/gallery/baby-laiba-2.jpeg",
      ],
    },
    {
      id: 2,
      emoji: "💘",
      badge: "Love at First Sight",
      title: "The Pic That Made Me Fall In Love",
      date: "The Spark",
      text: "Wo pehli tasveer jisne mere dil ko ek hi nazar mein chura liya... dekh kar bas dil ne gawahi di ke meri kismat yahi hai! ❤️",
      photos: [
        "/gallery/first-love.jpeg",
      ],
    },
    {
      id: 3,
      emoji: "🥺",
      badge: "Pehli Mulakat",
      title: "First Meetup — 'This Way 😘'",
      date: "First Time In Person",
      text: "Wo pehla aamne saamne milna, 'This way 😘' keh kar bulana... dil ki tezi se dhadakti hui dharhkan aur aankhon mein hamesha reh jaane wali sharm aur muskaan.",
      photos: [
        "/gallery/first-meetup.jpeg",
        "/gallery/wa-moment-1.jpeg",
      ],
    },
    {
      id: 4,
      emoji: "🏨",
      badge: "RC Hotel",
      title: "The Day Going First Time to RC",
      date: "First RC Visit",
      text: "Wo din jab hum pehli dafa RC hotel gaye the — wo excitement, wo khushi aur ek doosre ke sath bitaye gaye wo anmol ghante!",
      photos: [
        "/gallery/first-rc.jpeg",
      ],
    },
    {
      id: 5,
      emoji: "🚤",
      badge: "Racecourse Park",
      title: "Racecourse Park — Boat Ride & Lake",
      date: "Boat Ride Date",
      text: "Racecourse park mein sath chalna, boat ride par thandi hawa aur sukoon bhari baatein... Racecourse park hamari sab se favorite jagah ban gaya! ⛵💕",
      photos: [
        "/gallery/rc-boat.jpeg",
        "/gallery/rc-boat-ride.jpeg",
      ],
    },
    {
      id: 6,
      emoji: "🌳",
      badge: "Racecourse Park",
      title: "Racecourse Park — Hand in Hand Walk",
      date: "Peaceful Walk",
      text: "Darakhton ke saaye mein, Racecourse park ke raste par tumhara hath mere hath mein... bas yahi chaha ke yeh rasta kabhi khatam na ho.",
      photos: [
        "/gallery/rc-park2.jpeg",
        "/gallery/rc-park1.jpeg",
      ],
    },
    {
      id: 7,
      emoji: "🥰",
      badge: "Pure Cuteness 💖",
      title: "Cutiness of My Wifey 🥰👑",
      date: "Sweetest Moments",
      text: "Meri pyari, masoom aur sab se haseen Wifey — aap ki yeh adayein, yeh cuteness dekh kar har baar dil haar jata hoon! Duniya ki sab se cute Begum Jaan! 🥺💖",
      photos: [
        "/gallery/wa-moment-2.jpeg",
        "/gallery/wifey-cuteness-1.jpeg",
        "/gallery/wifey-cuteness-2.jpeg",
        "/gallery/wifey-cuteness-3.jpeg",
        "/gallery/wifey-cuteness-4.jpeg",
        "/gallery/wifey-cuteness-5.jpeg",
      ],
    },
    {
      id: 8,
      emoji: "🌺",
      badge: "Shalamar Garden Park",
      title: "Shalamar Garden Park — Mughal Date",
      date: "Heritage Romance",
      text: "Tareekhi Shalamar garden park ke fawaron aur khubsurat corridors mein hamara ghoomna — jaise kisi haseen kahani ka manzar ho.",
      photos: [
        "/gallery/shalimar-garden.jpeg",
      ],
    },
    {
      id: 9,
      emoji: "🌸",
      badge: "3rd Meetup",
      title: "3rd Meetup — Shalamar Garden Park",
      date: "3rd Meetup Date",
      text: "Shalamar garden park mein hamari teesri mulaqat — jahan har baar ki tarah tum aur bhi zyada haseen lag rahi theen aur hamara pyar aur gehra hota gaya.",
      photos: [
        "/gallery/shalimar-3rd.jpeg",
        "/gallery/wa-moment-3.jpeg",
      ],
    },
    {
      id: 10,
      emoji: "👪",
      badge: "Shalamar Garden Park",
      title: "Shalamar Garden Park — Shahzain Meetup",
      date: "With Shahzain",
      text: "Chotay Shahzain ke sath Shalamar garden park ki sweet memories — kitni pyari pyari shararten aur muskurahatein theen us din!",
      photos: [
        "/gallery/shalimar-shahzain.jpeg",
      ],
    },
    {
      id: 11,
      emoji: "🥰",
      badge: "RC Hotel",
      title: "RC 2nd Visit — Cuteness Overloaded",
      date: "RC Hotel 2nd Time",
      text: "RC hotel mein doosri dafa ka milna — tumhari cute adayein aur wo be-panaah masoomiyat jo mere dil ko chhoo gayi.",
      photos: [
        "/gallery/rc-2nd.jpeg",
        "/gallery/rc-cuteness.jpeg",
      ],
    },
    {
      id: 12,
      emoji: "😍",
      badge: "RC Hotel",
      title: "RC 3rd Visit — Ek Doosre Ki Aadat",
      date: "RC Hotel 3rd Time",
      text: "Ab RC hotel hamara apna thikana ban chuka tha — ek aisi jagah jahan sirf tum aur main the, duniya se be-khabar!",
      photos: [
        "/gallery/rc-3rd.jpeg",
        "/gallery/rc-3rd-1.jpeg",
      ],
    },
    {
      id: 13,
      emoji: "🛍️",
      badge: "Mall Date",
      title: "Emporium Mall — Outing & Cute Poses",
      date: "Shopping Time",
      text: "Emporium mall mein ghoomna, cute cute poses banana aur logon ke darmiyan bhi ek doosre mein khoye rehna.",
      photos: [
        "/gallery/emporium-mall.jpeg",
        "/gallery/emporium-cute.jpeg",
        "/gallery/wa-shopping-mirror.jpeg",
      ],
    },
    {
      id: 14,
      emoji: "😎",
      badge: "Fun & Swag",
      title: "Gangster Look at Emporium Mall",
      date: "Swag Mode",
      text: "Hamara famous 'gangster pose' at Emporium mall! Kitna haseen aur stylish moment tha — swagger level 100/100! 🔥",
      photos: [
        "/gallery/emporium-gangster.jpeg",
        "/gallery/wa-moment-4.jpeg",
      ],
    },
    {
      id: 15,
      emoji: "🍔",
      badge: "Food Date",
      title: "Burger O'Clock — Food & Love",
      date: "Delicious Bites",
      text: "Burger O'Clock par mil kar burger khana, french fries share karna aur be-shumar meethi meethi baatein.",
      photos: [
        "/gallery/burger-oclock.jpeg",
        "/gallery/burger-oclock-1.jpeg",
        "/gallery/burger-oclock-2.jpeg",
      ],
    },
    {
      id: 16,
      emoji: "🤝",
      badge: "Cheezious Date",
      title: "Cheezious — Haath Tham Ke",
      date: "Together Forever",
      text: "Table par tumhara hath mere hath mein — Cheezious ki pizza khushboo aur dilon ka pakka wada ke hath kabhi nahi chhodenge.",
      photos: [
        "/gallery/cheezious-hands.jpeg",
        "/gallery/wa-moment-5.jpeg",
      ],
    },
    {
      id: 17,
      emoji: "🛒",
      badge: "Packages Mall",
      title: "Packages Mall — Peaceful Walks",
      date: "Mall Fun",
      text: "Packages mall mein sath ghoomna, window shopping aur choti choti baaton par tumhara khilkhilana.",
      photos: [
        "/gallery/packages-mall.jpeg",
        "/gallery/wa-moment-6.jpeg",
      ],
    },
    {
      id: 18,
      emoji: "🎂",
      badge: "RC Hotel Special",
      title: "Before Going to RC for Your Birthday",
      date: "Birthday Celebration",
      text: "RC hotel jaane ki taiyari tumhari birthday manane ke liye — wo excitement aur special din ki khushi jo lafzon mein bayaan nahi ho sakti.",
      photos: [
        "/gallery/rc-birthday.jpeg",
        "/gallery/wa-moment-7.jpeg",
      ],
    },
    {
      id: 19,
      emoji: "🏡",
      badge: "RC Hotel",
      title: "RC 5th Visit — Hamara Apna Sukoon",
      date: "RC Hotel 5th Time",
      text: "Panchween dafa RC hotel — jahan har deewar aur har kone mein hamare pyar ki yaadein basi hain.",
      photos: [
        "/gallery/rc-5th.jpeg",
        "/gallery/rc-5th-1.jpeg",
      ],
    },
    {
      id: 20,
      emoji: "🕌",
      badge: "Old Lahore Heritage",
      title: "Badshahi Mosque, Shahi Qila & Delhi Darwaza",
      date: "Historical Lahore",
      text: "Tareekhi Badshahi Mosque, Shahi Qila aur Delhi Darwaza ki khubsurat galiyan — jahan humne duaayein maangien aur haseen tasveerein banayein.",
      photos: [
        "/gallery/badshahi-mosque.jpeg",
        "/gallery/shahi-killa.jpeg",
        "/gallery/delhi-darwaza.jpeg",
      ],
    },
    {
      id: 21,
      emoji: "🇵🇰",
      badge: "Lahore Landmark",
      title: "Minar-e-Pakistan Visit",
      date: "Landmark Date",
      text: "Minar-e-Pakistan ke saaye mein, hawayein aur azaad faza — Lahore ke dil mein hamara ek aur yaadgaar din.",
      photos: [
        "/gallery/minar-pakistan.jpeg",
        "/gallery/wa-moment-8.jpeg",
      ],
    },
    {
      id: 22,
      emoji: "🍛",
      badge: "Desi Food Love",
      title: "Yaad Hai Daal Chawal? — Pure Simplicity",
      date: "Desi Taste",
      text: "Yaad hai wo daal chawal khane ka lamha? Kitna desi, kitna simple aur kitna khoobsurat tha wo pal! Simple things with you are the best.",
      photos: [
        "/gallery/daal-chawal.jpeg",
        "/gallery/wa-moment-9.jpeg",
      ],
    },
    {
      id: 23,
      emoji: "🚌",
      badge: "Travel & Vacations",
      title: "Devour Drinks & Niazi Adda for Summer Vacation",
      date: "Summer Vacation Trip",
      text: "Ghar jane se pehle Devour ki thandi drink aur phir Niazi Adda se summer vacation ke liye rawana hona — safar ki meethi yaadein!",
      photos: [
        "/gallery/devour.jpeg",
        "/gallery/niazi-adda.jpeg",
        "/gallery/wa-night-walk.jpeg",
      ],
    },
    {
      id: 24,
      emoji: "🌙",
      badge: "Night Glow",
      title: "Late Night Walks & Secret Smiles",
      date: "Moonlit Moments",
      text: "Raat ki thandi hawa mein chalna, khamoshi mein baatein karna aur tumhari aankhon mein sitaron ki chamak dekhna.",
      photos: [
        "/gallery/wa-moment-10.jpeg",
        "/gallery/wa-moment-11.jpeg",
        "/gallery/wa-moment-12.jpeg",
      ],
    },
    {
      id: 25,
      emoji: "✨",
      badge: "Candid Joy",
      title: "Unforgettable Giggles & Candid Moments",
      date: "Heartwarming Laughs",
      text: "Bina kisi filter ke, bina kisi banaawat ke — bas hum dono aur hamari be-shumaar shararten aur muskurahatein!",
      photos: [
        "/gallery/wa-moment-13.jpeg",
        "/gallery/wa-moment-14.jpeg",
        "/gallery/wa-moment-15.jpeg",
      ],
    },
    {
      id: 26,
      emoji: "🌷",
      badge: "Cherished Times",
      title: "Together in Every Season",
      date: "Timeless Bond",
      text: "Har mousam, har din, har pal tumhare sath ek nayi khushi ban kar aaya hai. Meri zindagi ki sab se haseen nemat tum ho.",
      photos: [
        "/gallery/wa-moment-16.jpeg",
        "/gallery/wa-moment-17.jpeg",
        "/gallery/wa-moment-18.jpeg",
      ],
    },
    {
      id: 27,
      emoji: "💔",
      badge: "Emotional Goodbye",
      title: "Last Meetup — Gulberg (Wapsi Se Pehle)",
      date: "Gulberg Meetup",
      text: "Gulberg mein hamari aakhri mulaqat... bhari aankhein, dilon mein be-panaah dard aur ek doosre ko na chhodne ki khwahish. Intezar mushkil hai, par hamara pyar har faslay se bara hai.",
      photos: [
        "/gallery/last-meetup.jpeg",
      ],
    },
    {
      id: 28,
      emoji: "🎉",
      badge: "Happy 23rd Birthday Wifeyy! 🎂",
      title: `Turning ${age} — Happy Birthday Meri Wifey! 💖👑`,
      date: `September 10, ${BIRTHDAY_YEAR}`,
      text: `23rd Birthday Mubarak ho meri jaan, meri rani, meri cutie puttiteeee! Tumhari wo muskurahat jis par main mar mita tha, hamesha aisi hi chamakti rahe! Happy Birthday Wifeyy G! 💖👑`,
      isComingSoon: true,
      photos: [] as string[],
    },
  ];

  const openModal = (index: number) => {
    playAudioCue("cameraShutter");
    setTimelineModalIndex(index);
    setActivePhotoIdx(0);
  };

  const currentMilestone = timelineModalIndex !== null ? milestones[timelineModalIndex] : null;
  const currentPhotos = currentMilestone ? currentMilestone.photos : [];
  const currentPhotoUrl = currentPhotos[activePhotoIdx] || "";

  const closeTimelineModal = useCallback(() => {
    playAudioCue("cameraShutter");
    setTimelineModalIndex(null);
  }, []);

  const goToPrevPhoto = useCallback(() => {
    if (!currentPhotos.length) return;
    playAudioCue("cardFlip");
    setActivePhotoIdx((prev) => (prev > 0 ? prev - 1 : currentPhotos.length - 1));
  }, [currentPhotos.length]);

  const goToNextPhoto = useCallback(() => {
    if (!currentPhotos.length) return;
    playAudioCue("cardFlip");
    setActivePhotoIdx((prev) => (prev < currentPhotos.length - 1 ? prev + 1 : 0));
  }, [currentPhotos.length]);

  const goToPrevChapter = useCallback(() => {
    playAudioCue("cardFlip");
    setTimelineModalIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : milestones.length - 1));
    setActivePhotoIdx(0);
  }, [milestones.length]);

  const goToNextChapter = useCallback(() => {
    playAudioCue("cardFlip");
    setTimelineModalIndex((prev) => (prev !== null && prev < milestones.length - 1 ? prev + 1 : 0));
    setActivePhotoIdx(0);
  }, [milestones.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (timelineModalIndex === null) return;
      if (e.key === "Escape") setTimelineModalIndex(null);
      if (e.key === "ArrowLeft") {
        if (currentPhotos.length > 1) {
          goToPrevPhoto();
        } else {
          goToPrevChapter();
        }
      }
      if (e.key === "ArrowRight") {
        if (currentPhotos.length > 1) {
          goToNextPhoto();
        } else {
          goToNextChapter();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [timelineModalIndex, currentPhotos.length, goToPrevPhoto, goToNextPhoto, goToPrevChapter, goToNextChapter]);

  return (
    <section className="timeline-section" id="timeline">
      <h2 className="section-title">✨ Our Beautiful Story & Meetups ✨</h2>
      <p className="timeline-hint">Tap any chapter to view photos &amp; memories 📸</p>
      <div className="section-divider" />

      <div className="timeline">
        {milestones.map((item, i) => (
          <div className="timeline-item" key={item.id}>
            <div className="timeline-dot" />
            <div
              className={`timeline-content ${item.isComingSoon ? "timeline-content-static" : ""}`}
              onClick={() => {
                if (!item.isComingSoon) {
                  openModal(i);
                }
              }}
              role={item.isComingSoon ? undefined : "button"}
              tabIndex={item.isComingSoon ? undefined : 0}
              onKeyDown={(e) => {
                if (!item.isComingSoon && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  openModal(i);
                }
              }}
            >
              <div className="timeline-header">
                <span className="timeline-emoji">{item.emoji}</span>
                <span className="timeline-date-badge">{item.badge}</span>
              </div>
              <h3 className="timeline-title">{item.title}</h3>
              <p className="timeline-text">{item.text}</p>

              <div className="timeline-photo-box">
                {item.isComingSoon || item.photos.length === 0 ? (
                  <div className="timeline-loading-box">
                    <span className="loading-camera-icon">📸</span>
                    <span className="loading-text">Pics loading.......</span>
                  </div>
                ) : (
                  <>
                    {item.photos.length > 1 && (
                      <span className="timeline-multi-badge">
                        📸 {item.photos.length} Photos
                      </span>
                    )}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.photos[0]}
                      alt={item.title}
                      loading="lazy"
                    />
                    <div className="timeline-photo-overlay">
                      <span>🔍 Tap to view gallery ({item.photos.length} photos)</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Timeline Multi-Photo Lightbox Modal ─── */}
      {timelineModalIndex !== null && currentMilestone && (
        <div className="lightbox-overlay" onClick={closeTimelineModal}>
          <div
            className="lightbox-content timeline-lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="lightbox-close"
              onClick={closeTimelineModal}
              aria-label="Close"
            >
              ✕
            </button>

            <div className="timeline-modal-body">
              {currentMilestone.isComingSoon || currentPhotos.length === 0 ? (
                <div className="timeline-loading-box modal-loading-box">
                  <span className="loading-camera-icon">📸</span>
                  <span className="loading-text">Pics loading.......</span>
                </div>
              ) : (
                <>
                  {/* Photo Area with Next/Prev Arrows if Multiple Photos */}
                  <div className="timeline-photo-slider-area">
                    {currentPhotos.length > 1 && (
                      <button
                        className="timeline-photo-nav timeline-photo-prev"
                        onClick={goToPrevPhoto}
                        aria-label="Previous photo"
                      >
                        ‹
                      </button>
                    )}

                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={currentPhotoUrl}
                      alt={`${currentMilestone.title} - Photo ${activePhotoIdx + 1}`}
                      className="timeline-modal-img"
                    />

                    {currentPhotos.length > 1 && (
                      <button
                        className="timeline-photo-nav timeline-photo-next"
                        onClick={goToNextPhoto}
                        aria-label="Next photo"
                      >
                        ›
                      </button>
                    )}
                  </div>

                  {/* Multi-photo indicator and thumbnails */}
                  {currentPhotos.length > 1 && (
                    <>
                      <span className="timeline-photo-counter">
                        Photo {activePhotoIdx + 1} of {currentPhotos.length}
                      </span>
                      <div className="timeline-thumb-strip">
                        {currentPhotos.map((url, idx) => (
                          <button
                            key={url}
                            type="button"
                            className={`timeline-thumb-btn ${idx === activePhotoIdx ? "active" : ""}`}
                            onClick={() => {
                              playAudioCue("cardFlip");
                              setActivePhotoIdx(idx);
                            }}
                            title={`View photo ${idx + 1}`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt={`Thumbnail ${idx + 1}`} />
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}

              <span className="timeline-modal-date">{currentMilestone.badge}</span>
              <h3 className="timeline-modal-title">
                <span>{currentMilestone.emoji}</span>
                <span>{currentMilestone.title}</span>
              </h3>
              <p className="timeline-modal-desc">{currentMilestone.text}</p>

              {/* Chapter switcher bar */}
              <div className="timeline-meetup-switcher">
                <button
                  type="button"
                  className="meetup-switcher-btn"
                  onClick={goToPrevChapter}
                >
                  ‹ Prev Meetup
                </button>
                <span className="meetup-switcher-center">
                  Meetup {timelineModalIndex + 1} of {milestones.length}
                </span>
                <button
                  type="button"
                  className="meetup-switcher-btn"
                  onClick={goToNextChapter}
                >
                  Next Meetup ›
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// ─── 40-Second Fullscreen Blue Fireworks Show Modal ───
function FireworksShowModal({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(40);
  const [isFinished, setIsFinished] = useState(false);
  const [showSkyText, setShowSkyText] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const lastLaunchSoundRef = useRef<number>(0);
  const lastBurstSoundRef = useRef<number>(0);
  const isMutedRef = useRef(false);
  isMutedRef.current = isMuted;

  const textTriggeredRef = useRef(false);

  // Prevent background interactions & hide theme switcher / floating lock
  useEffect(() => {
    document.body.classList.add("fireworks-modal-active");
    return () => {
      document.body.classList.remove("fireworks-modal-active");
    };
  }, []);

  // 40-Second Countdown Timer
  useEffect(() => {
    if (isFinished) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        const next = prev - 1;
        // Show sky text for 7 seconds after 10 seconds into show (from 30s to 24s remaining)
        if (next <= 30 && next >= 24) {
          setShowSkyText(true);
        } else {
          setShowSkyText(false);
        }

        if (next <= 0) {
          clearInterval(interval);
          setIsFinished(true);
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isFinished]);

  // When completed after 40 seconds: celebratory sound & grand confetti
  useEffect(() => {
    if (isFinished) {
      if (!isMutedRef.current) {
        playAudioCue("royalVictory");
      }
      import("canvas-confetti")
        .then(({ default: confetti }) => {
          const heart = confetti.shapeFromPath({
            path: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
          });
          confetti({
            shapes: [heart],
            particleCount: 100,
            spread: 130,
            origin: { y: 0.45 },
            colors: ["#ffd700", "#ff0080", "#00f5ff", "#ffffff", "#ffbe0b"],
          });
          setTimeout(() => {
            confetti({
              particleCount: 130,
              spread: 160,
              origin: { y: 0.55 },
              colors: ["#ffd700", "#ff007f", "#38bdf8", "#a855f7", "#ffffff"],
            });
          }, 600);
        })
        .catch(() => {});
    }
  }, [isFinished]);

  // Canvas Fireworks Simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      ctx.fillStyle = "#020a22";
      ctx.fillRect(0, 0, width, height);
    };
    window.addEventListener("resize", handleResize);

    // Initial background paint
    ctx.fillStyle = "#020a22";
    ctx.fillRect(0, 0, width, height);

    const PALETTES = [
      ["#ffd700", "#ffec3d", "#ffbe0b", "#fff3bf"], // Imperial Gold
      ["#00f0ff", "#38bdf8", "#60a5fa", "#bae6fd"], // Sapphire / Cyan
      ["#ff2a85", "#ff69b4", "#f43f5e", "#fda4af"], // Neon Rose / Pink
      ["#c084fc", "#a855f7", "#e879f9", "#f3e8ff"], // Royal Violet
      ["#06d6a0", "#34d399", "#a7f3d0", "#ffffff"], // Emerald Starlight
      ["#ffffff", "#fef08a", "#bae6fd", "#fbcfe8"], // Multiverse Diamond
    ];

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      alpha: number;
      decay: number;
      size: number;
      friction: number;
      gravity: number;
      isGlitter?: boolean;
      history: { x: number; y: number }[];
    }

    interface TextParticle {
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      alpha: number;
      dispersing: boolean;
      sparkleSpeed: number;
      sparkleOffset: number;
    }

    interface Rocket {
      x: number;
      y: number;
      targetY: number;
      vx: number;
      vy: number;
      color: string;
      palette: string[];
      burstType: "peony" | "willow" | "heart" | "ring" | "textRocket";
      trail: { x: number; y: number }[];
    }

    const rockets: Rocket[] = [];
    const particles: Particle[] = [];
    const textParticles: TextParticle[] = [];
    let nextLaunchTime = Date.now() + 50;

    const spawnRocket = (
      customX?: number,
      customTargetY?: number,
      forceBurstType?: "peony" | "willow" | "heart" | "ring" | "textRocket"
    ) => {
      const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
      const startX = customX ?? width * 0.08 + Math.random() * width * 0.84;
      const targetY = customTargetY ?? height * 0.12 + Math.random() * height * 0.46;
      const speed = -(14 + Math.random() * 4);
      const dx = customX ? (customX - startX) * 0.04 : (Math.random() - 0.5) * 2;

      const burstTypes: ("peony" | "willow" | "heart" | "ring")[] = [
        "peony",
        "peony",
        "willow",
        "heart",
        "heart",
        "ring",
      ];
      const burstType = forceBurstType ?? burstTypes[Math.floor(Math.random() * burstTypes.length)];

      rockets.push({
        x: startX,
        y: height + 10,
        targetY,
        vx: dx,
        vy: speed,
        color: palette[0],
        palette,
        burstType,
        trail: [],
      });

      // Launch sound effect
      const now = Date.now();
      if (!isMutedRef.current && now - lastLaunchSoundRef.current > 100) {
        lastLaunchSoundRef.current = now;
        playAudioCue("fireworkLaunch");
      }
    };

    const spawnTextExplosion = (cx: number, cy: number) => {
      const offscreen = document.createElement("canvas");
      offscreen.width = width;
      offscreen.height = height;
      const octx = offscreen.getContext("2d");
      if (!octx) return;

      const isMobile = width < 640;
      const l1Size = isMobile ? Math.floor(width * 0.13) : Math.floor(Math.min(width * 0.08, 62));
      const l2Size = isMobile ? Math.floor(width * 0.085) : Math.floor(Math.min(width * 0.055, 48));

      octx.fillStyle = "#ffffff";
      octx.textAlign = "center";
      octx.textBaseline = "middle";

      const textCenterY = height * 0.36;

      // Line 1: HBD ✨
      octx.font = `900 ${l1Size}px "Cinzel", "Outfit", "Segoe UI", sans-serif`;
      octx.fillText("HBD ✨", width / 2, textCenterY - l2Size * 0.85);

      // Line 2: Laiba Mehboob
      octx.font = `800 ${l2Size}px "Cinzel", "Outfit", "Segoe UI", sans-serif`;
      octx.fillText("Laiba Mehboob", width / 2, textCenterY + l1Size * 0.65);

      const imgData = octx.getImageData(0, 0, width, height);
      const d = imgData.data;
      const step = isMobile ? 3 : 4;

      for (let py = 0; py < height; py += step) {
        for (let px = 0; px < width; px += step) {
          const idx = (py * width + px) * 4;
          if (d[idx + 3] > 140) {
            const rand = Math.random();
            const color = rand > 0.45 ? "#ffd700" : rand > 0.2 ? "#ff69b4" : "#ffffff";
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 8 + 2;
            textParticles.push({
              x: cx,
              y: cy,
              targetX: px,
              targetY: py,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              color,
              size: Math.random() * 2 + 1.8,
              alpha: 1,
              dispersing: false,
              sparkleSpeed: 0.005 + Math.random() * 0.005,
              sparkleOffset: Math.random() * 10,
            });
          }
        }
      }
    };

    const explodeRocket = (rocket: Rocket) => {
      const { x, y, palette, burstType } = rocket;

      // Burst sound effect
      const now = Date.now();
      if (!isMutedRef.current && now - lastBurstSoundRef.current > 90) {
        lastBurstSoundRef.current = now;
        playAudioCue("fireworkBurst");
      }

      if (burstType === "textRocket") {
        spawnTextExplosion(x, y);
        // Also spawn gold ring around text explosion
        for (let i = 0; i < 50; i++) {
          const angle = (i / 50) * Math.PI * 2;
          const speed = 5.5 + Math.random() * 2;
          particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: "#ffd700",
            alpha: 1,
            decay: 0.012,
            size: 2.5,
            friction: 0.96,
            gravity: 0.05,
            history: [],
          });
        }
        return;
      }

      if (burstType === "heart") {
        // Parametric Heart Equation
        const total = 70;
        for (let i = 0; i < total; i++) {
          const t = (i / total) * Math.PI * 2;
          const hx = 16 * Math.pow(Math.sin(t), 3);
          const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
          const scale = 0.3 + Math.random() * 0.06;
          const color = palette[Math.floor(Math.random() * palette.length)];
          particles.push({
            x,
            y,
            vx: hx * scale + (Math.random() - 0.5) * 0.8,
            vy: hy * scale + (Math.random() - 0.5) * 0.8,
            color,
            alpha: 1,
            decay: 0.011 + Math.random() * 0.007,
            size: 2.8 + Math.random() * 1.6,
            friction: 0.968,
            gravity: 0.04,
            history: [],
          });
        }
      } else if (burstType === "willow") {
        // Golden willow glittering streamers
        const count = 95;
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 6.5 + 1.2;
          particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: Math.random() > 0.3 ? "#ffd700" : "#fff8db",
            alpha: 1,
            decay: 0.007 + Math.random() * 0.005,
            size: 2.4 + Math.random() * 1.5,
            friction: 0.945,
            gravity: 0.075,
            isGlitter: true,
            history: [],
          });
        }
      } else if (burstType === "ring") {
        // Uniform Ring
        const count = 60;
        const ringSpeed = 5.2 + Math.random() * 1.6;
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2;
          const color = palette[i % palette.length];
          particles.push({
            x,
            y,
            vx: Math.cos(angle) * ringSpeed,
            vy: Math.sin(angle) * ringSpeed,
            color,
            alpha: 1,
            decay: 0.013 + Math.random() * 0.007,
            size: 2.8,
            friction: 0.962,
            gravity: 0.048,
            history: [],
          });
        }
      } else {
        // Classic Peony spherical burst
        const count = 85 + Math.floor(Math.random() * 35);
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 7 + 1.5;
          const color = palette[Math.floor(Math.random() * palette.length)];
          particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color,
            alpha: 1,
            decay: 0.012 + Math.random() * 0.008,
            size: 2.6 + Math.random() * 1.8,
            friction: 0.96,
            gravity: 0.052,
            history: [],
          });
        }
      }
    };

    // Immediate Grand Opening Barrage (4 simultaneous rockets across width!)
    spawnRocket(width * 0.2, height * 0.25);
    spawnRocket(width * 0.45, height * 0.2);
    spawnRocket(width * 0.75, height * 0.26);
    setTimeout(() => {
      spawnRocket(width * 0.35, height * 0.35);
      spawnRocket(width * 0.65, height * 0.32);
    }, 220);

    const render = () => {
      // 1. Clear with transparent deep blue for glowing light trails
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(2, 10, 34, 0.22)";
      ctx.fillRect(0, 0, width, height);

      // 2. Glowing blending mode for fireworks
      ctx.globalCompositeOperation = "lighter";

      const now = Date.now();

      // Check 10-second mark: Trigger mega rocket for "HBD Laiba Mehboob"
      if (secondsLeft <= 30 && !textTriggeredRef.current) {
        textTriggeredRef.current = true;
        rockets.push({
          x: width / 2,
          y: height + 10,
          targetY: height * 0.36,
          vx: 0,
          vy: -15,
          color: "#ffd700",
          palette: ["#ffd700", "#fff3bf", "#ff69b4"],
          burstType: "textRocket",
          trail: [],
        });
        if (!isMutedRef.current) {
          playAudioCue("fireworkLaunch");
        }
      }

      // Check if text particles should disperse after 7 seconds (when secondsLeft < 24)
      if (secondsLeft < 24 && textParticles.length > 0) {
        for (let i = 0; i < textParticles.length; i++) {
          textParticles[i].dispersing = true;
        }
      }

      // Rocket Spawning Logic: continuous, rich, frequent!
      if (now > nextLaunchTime) {
        if (!isFinished) {
          if (secondsLeft <= 6) {
            // Finale Mode: rapid multi-rocket barrages!
            spawnRocket(width * (0.15 + Math.random() * 0.7));
            spawnRocket(width * (0.1 + Math.random() * 0.8));
            nextLaunchTime = now + (160 + Math.random() * 160);
          } else if (secondsLeft <= 30 && secondsLeft >= 24) {
            // While "HBD Laiba Mehboob" is on screen, shoot fireworks around the sides!
            const sideX =
              Math.random() > 0.5
                ? width * (0.06 + Math.random() * 0.22)
                : width * (0.72 + Math.random() * 0.22);
            spawnRocket(sideX, height * (0.15 + Math.random() * 0.45));
            nextLaunchTime = now + (280 + Math.random() * 240);
          } else {
            // Regular rich celebration: launch 1 to 2 rockets every 220-380ms
            spawnRocket();
            if (Math.random() > 0.45) {
              spawnRocket();
            }
            nextLaunchTime = now + (220 + Math.random() * 220);
          }
        } else {
          // Ambient romantic sparkles after 40s show finishes
          spawnRocket();
          nextLaunchTime = now + (2600 + Math.random() * 1600);
        }
      }

      // 3. Update & Draw Rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.trail.push({ x: r.x, y: r.y });
        if (r.trail.length > 8) r.trail.shift();

        r.x += r.vx;
        r.y += r.vy;
        r.vy *= 0.99;

        // Draw rocket streak
        ctx.strokeStyle = r.color;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        for (let j = 0; j < r.trail.length; j++) {
          const pt = r.trail[j];
          if (j === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();

        // Draw rocket tip
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(r.x, r.y, 3, 0, Math.PI * 2);
        ctx.fill();

        // Explode condition
        if (r.y <= r.targetY || r.vy >= -1.5) {
          explodeRocket(r);
          rockets.splice(i, 1);
        }
      }

      // 4. Update & Draw Text Particles ("HBD Laiba Mehboob")
      for (let i = textParticles.length - 1; i >= 0; i--) {
        const tp = textParticles[i];
        if (!tp.dispersing) {
          // Easing spring to target coordinates
          const dx = tp.targetX - tp.x;
          const dy = tp.targetY - tp.y;
          tp.vx = tp.vx * 0.84 + dx * 0.09;
          tp.vy = tp.vy * 0.84 + dy * 0.09;
          tp.x += tp.vx;
          tp.y += tp.vy;

          // Twinkle shimmer
          const flicker = Math.sin(now * tp.sparkleSpeed + tp.sparkleOffset);
          ctx.fillStyle = tp.color;
          ctx.globalAlpha = Math.max(0.4, 0.8 + flicker * 0.2);
          ctx.beginPath();
          ctx.arc(tp.x, tp.y, tp.size * (1 + flicker * 0.22), 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Dispersing stardust cascade
          tp.vy += 0.12;
          tp.vx += (Math.random() - 0.5) * 0.3;
          tp.x += tp.vx;
          tp.y += tp.vy;
          tp.alpha -= 0.014;
          if (tp.alpha <= 0) {
            textParticles.splice(i, 1);
            continue;
          }
          ctx.fillStyle = tp.color;
          ctx.globalAlpha = Math.max(0, tp.alpha);
          ctx.beginPath();
          ctx.arc(tp.x, tp.y, tp.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 5. Update & Draw Regular Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.history.push({ x: p.x, y: p.y });
        if (p.history.length > 5) p.history.shift();

        p.vx *= p.friction;
        p.vy = p.vy * p.friction + p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // Draw spark trail
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.size;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.beginPath();
        for (let j = 0; j < p.history.length; j++) {
          const pt = p.history[j];
          if (j === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();

        // Glitter sparkle effect
        if (p.isGlitter && Math.random() > 0.35) {
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.globalAlpha = 1;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    // Interactive Click / Tap on Canvas to create instant fireworks!
    const handleCanvasClick = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;
      if ("touches" in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ("clientX" in e) {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      } else {
        return;
      }

      spawnRocket(clientX, clientY, Math.random() > 0.5 ? "heart" : "peony");
    };

    const canvasElement = canvasRef.current;
    if (canvasElement) {
      canvasElement.addEventListener("click", handleCanvasClick);
      canvasElement.addEventListener("touchstart", handleCanvasClick, { passive: true });
    }

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      if (canvasElement) {
        canvasElement.removeEventListener("click", handleCanvasClick);
        canvasElement.removeEventListener("touchstart", handleCanvasClick);
      }
    };
  }, [isFinished, secondsLeft]);

  return (
    <div className="fireworks-show-overlay">
      {/* Fullscreen Royal Blue Fireworks Canvas */}
      <canvas ref={canvasRef} className="fireworks-canvas" />

      {/* Top Controls Header */}
      <div className="fireworks-modal-header">
        <div className="fireworks-show-info">
          <span className="fireworks-live-pulse" />
          <span className="fireworks-show-badge">
            {isFinished ? "✨ Grand Celebration ✨" : "🎆 40s Fireworks Show"}
          </span>
          {!isFinished && (
            <span className="fireworks-timer-pill">
              ⏳ {secondsLeft}s
            </span>
          )}
        </div>

        <div className="fireworks-top-controls">
          <button
            className="fireworks-icon-btn"
            onClick={() => setIsMuted((prev) => !prev)}
            title={isMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isMuted ? "🔇" : "🔊"}
          </button>
          {!isFinished && (
            <button
              className="fireworks-skip-btn"
              onClick={() => {
                setSecondsLeft(0);
                setIsFinished(true);
              }}
            >
              Skip ⏩
            </button>
          )}
          <button className="fireworks-close-btn" onClick={onClose} title="Close">
            ✕
          </button>
        </div>
      </div>

      {/* Sky Fireworks Text Banner: Appears after 10s for 6/7s */}
      <div className={`fireworks-sky-text-banner ${showSkyText ? "visible" : ""}`}>
        <div className="sky-text-line-1">✨ HBD ✨</div>
        <div className="sky-text-line-2">Laiba Mehboob 💖</div>
        <div className="sky-text-sub">My Forever Wifeyyy G 🌹</div>
      </div>

      {/* Interactive Tap Hint during fireworks */}
      {!isFinished && !showSkyText && (
        <div className="fireworks-tap-hint">
          ✨ Tap anywhere on screen to launch custom fireworks! ✨
        </div>
      )}

      {/* 40-Second Completed Surprise Reveal Card */}
      {isFinished && (
        <div className="fireworks-reveal-card-container">
          <div className="fireworks-reveal-card">
            <div className="fireworks-reveal-badge">🎁 SURPRISE REVEALED 💖</div>
            <div className="fireworks-reveal-icon">💝</div>
            <h2 className="fireworks-reveal-title">You are my greatest gift! 💖</h2>
            <p className="fireworks-reveal-text">
              No gift in this world compares to having you in my life, Wifeyyy G. You are my everything literally everything. 🥺✨
            </p>
            <div className="fireworks-reveal-divider" />
            <p className="fireworks-reveal-sub">Forever yours, Mehboob Waqar 💕</p>
            <div className="fireworks-reveal-actions">
              <button
                className="fireworks-btn-primary"
                onClick={() => {
                  textTriggeredRef.current = false;
                  setIsFinished(false);
                  setSecondsLeft(40);
                }}
              >
                🎆 Watch Fireworks Again (40s)
              </button>
              <button className="fireworks-btn-secondary" onClick={onClose}>
                💕 Back to Celebration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Surprise Gift Section ───
function GiftSection({
  onFireworksChange,
}: {
  onFireworksChange?: (active: boolean) => void;
}) {
  const [opened, setOpened] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);

  const handleOpen = useCallback(async () => {
    setOpened(true);
    setShowFireworks(true);
    onFireworksChange?.(true);
    playAudioCue("giftOpen");
    try {
      const confetti = (await import("canvas-confetti")).default;
      const heart = confetti.shapeFromPath({
        path: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
      });
      confetti({
        shapes: [heart],
        particleCount: 60,
        spread: 100,
        origin: { y: 0.5 },
        scalar: 2,
        colors: ["#ff0080", "#ff6b9d", "#ffd700"],
      });
    } catch (e) {
      console.log("Confetti error:", e);
    }
  }, [onFireworksChange]);

  const handleCloseFireworks = useCallback(() => {
    setShowFireworks(false);
    onFireworksChange?.(false);
  }, [onFireworksChange]);

  const handleReplayFireworks = useCallback(() => {
    setShowFireworks(true);
    onFireworksChange?.(true);
  }, [onFireworksChange]);

  return (
    <section className="gift-section" id="gift">
      <h2 className="section-title">🎁 A Surprise for You 🎁</h2>
      <div className="section-divider" />

      <div
        className={`gift-box ${opened ? "opened" : ""}`}
        onClick={handleOpen}
        title="Tap to open surprise fireworks show!"
      >
        {opened ? "💝" : "🎁"}
      </div>

      {!opened && (
        <p className="gift-message">✨ Tap the gift to open your surprise! ✨</p>
      )}

      {opened && (
        <div className="gift-reveal">
          <p className="gift-reveal-text">You are my greatest gift! 💖</p>
          <p className="gift-reveal-sub">
            No gift in this world compares to having you in my life, Wifeyyy G. You are my everything literally everything. 🥺✨
          </p>
          <button
            className="gift-replay-btn"
            onClick={handleReplayFireworks}
          >
            🎆 Watch 40s Fireworks Show Again 🎆
          </button>
        </div>
      )}

      {showFireworks && typeof document !== "undefined" && createPortal(
        <FireworksShowModal onClose={handleCloseFireworks} />,
        document.body
      )}
    </section>
  );
}

// ─── Special Quiz for You Section ───
function SpecialQuizSection() {
  // Modal visibility state
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  // Stages:
  // 0: Q1 - Do you love me?
  // 1: Q2 (1st time) - Will you marry Mehboob Waqar?
  // 2: Q2 (2nd time) - Will you marry Mehboob Waqar forever?
  // 3: Q2 (3rd time) - Will you marry Mehboob Waqar? (Final Promise)
  // 4: Official Nikkah Declaration Card!
  const [quizStage, setQuizStage] = useState(0);
  const [runawayPos, setRunawayPos] = useState<{ x: number; y: number; isFixed: boolean }>({
    x: 0,
    y: 0,
    isFixed: false,
  });
  const [dodgeCount, setDodgeCount] = useState(0);
  const [fleeText, setFleeText] = useState("No 😜");
  const [celebrationToast, setCelebrationToast] = useState<string | null>(null);

  const yesBtnRef = useRef<HTMLButtonElement | null>(null);
  const runawayBtnRef = useRef<HTMLButtonElement | null>(null);
  const lastZoneRef = useRef<"top" | "bottom">("bottom");

  const fleePhrasesQ1 = useMemo(
    () => [
      "No 😜",
      "Try again! 😂",
      "Can't catch me! 💨",
      "Only YES allowed! 💖",
      "Nice try! 😝",
      "Nope, not here! 🏃‍♀️",
      "Too slow! 💨",
    ],
    []
  );

  const fleePhrasesQ2Round1 = useMemo(
    () => [
      "Not Qabool 🙅‍♀️",
      "No chance! 😜",
      "Only Qabool allowed! 💍",
      "Run away! 💨",
      "Try again! 😂",
      "Catch me first! 🏃‍♂️",
    ],
    []
  );

  const fleePhrasesQ2Round2 = useMemo(
    () => [
      "Not Qabool 🙈",
      "Still running! 🏃‍♀️",
      "Mehboob is yours! ❤️",
      "Nice try! 😜",
      "You have to say Qabool! 💍",
      "Can't touch this! 💨",
    ],
    []
  );

  const fleePhrasesQ2Round3 = useMemo(
    () => [
      "Not Qabool 😜",
      "No escape now! 💍",
      "Almost mine! 💖",
      "Say Qabool! 👰‍♀️",
      "Forever promise! 💕",
      "Just say YES! 💍",
    ],
    []
  );

  const moveRunaway = useCallback(
    (e?: React.SyntheticEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      playAudioCue("funnyBoing"); // 🤪 Funny cartoon boing + squeak!

      const vw = typeof window !== "undefined" ? window.innerWidth : 380;
      const vh = typeof window !== "undefined" ? window.innerHeight : 700;

      const rRect = runawayBtnRef.current?.getBoundingClientRect();
      const btnW = rRect?.width && rRect.width > 40 ? rRect.width : 145;
      const btnH = rRect?.height && rRect.height > 25 ? rRect.height : 46;

      const paddingX = 16;
      const minX = paddingX;
      const maxX = Math.max(minX, vw - btnW - paddingX);

      const minY = 85; // safely below close X button (top: 25px, size: 44px)
      const maxY = Math.max(minY + 60, vh - btnH - 35); // safely above mobile bottom bar

      const yRect = yesBtnRef.current?.getBoundingClientRect();

      let targetX = minX;
      let targetY = minY;

      if (yRect) {
        // Forbidden zone around Yes button to ensure ZERO overlap (at least 24px vertical margin!)
        const forbiddenTop = Math.max(minY, yRect.top - btnH - 24);
        const forbiddenBottom = Math.min(maxY, yRect.bottom + 24);

        const canGoTop = forbiddenTop > minY + 20;
        const canGoBottom = maxY > forbiddenBottom + 20;

        // Alternate zones (top <-> bottom) so it runs away to the opposite side of Yes button!
        let nextZone: "top" | "bottom" = "top";
        if (lastZoneRef.current === "top" && canGoBottom) {
          nextZone = "bottom";
        } else if (lastZoneRef.current === "bottom" && canGoTop) {
          nextZone = "top";
        } else if (canGoBottom) {
          nextZone = "bottom";
        } else if (canGoTop) {
          nextZone = "top";
        }

        lastZoneRef.current = nextZone;

        if (nextZone === "top") {
          const topRange = Math.max(0, forbiddenTop - minY);
          const ratio = ((dodgeCount + 1) % 3) * 0.4;
          targetY = minY + Math.min(topRange, ratio * topRange);
        } else {
          const bottomRange = Math.max(0, maxY - forbiddenBottom);
          const ratio = ((dodgeCount + 1) % 3) * 0.4;
          targetY = forbiddenBottom + Math.min(bottomRange, ratio * bottomRange);
        }

        // Horizontal slots across left, center, right of screen (always strictly clamped!)
        const xSlots = [
          minX + 6,
          Math.floor((minX + maxX) / 2),
          maxX - 6,
          minX + Math.floor((maxX - minX) * 0.25),
          minX + Math.floor((maxX - minX) * 0.75),
        ];
        const slotIdx = (dodgeCount + 1) % xSlots.length;
        targetX = Math.max(minX, Math.min(maxX, xSlots[slotIdx]));
      } else {
        targetX = Math.floor(minX + Math.random() * (maxX - minX));
        targetY = Math.floor(minY + Math.random() * (maxY - minY));
      }

      setRunawayPos({
        x: Math.round(targetX),
        y: Math.round(targetY),
        isFixed: true,
      });

      setDodgeCount((prev) => prev + 1);

      let list = fleePhrasesQ1;
      if (quizStage === 1) list = fleePhrasesQ2Round1;
      else if (quizStage === 2) list = fleePhrasesQ2Round2;
      else if (quizStage === 3) list = fleePhrasesQ2Round3;

      setFleeText(list[(dodgeCount + 1) % list.length]);
    },
    [dodgeCount, quizStage, fleePhrasesQ1, fleePhrasesQ2Round1, fleePhrasesQ2Round2, fleePhrasesQ2Round3]
  );

  const resetRunaway = (defaultText: string) => {
    setRunawayPos({ x: 0, y: 0, isFixed: false });
    setDodgeCount(0);
    setFleeText(defaultText);
    lastZoneRef.current = "bottom";
  };

  const triggerConfetti = async (type: "mini" | "grand") => {
    try {
      const confetti = (await import("canvas-confetti")).default;
      if (type === "mini") {
        confetti({
          particleCount: 75,
          spread: 85,
          origin: { y: 0.6 },
          colors: ["#ff0080", "#ffd700", "#ff6b9d", "#ce93d8"],
        });
      } else {
        const heart = confetti.shapeFromPath({
          path: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
        });
        confetti({
          shapes: [heart],
          particleCount: 80,
          spread: 120,
          origin: { y: 0.5 },
          scalar: 1.8,
          colors: ["#ff0080", "#ffd700", "#ff4081", "#ffffff"],
        });
        setTimeout(() => {
          confetti({
            particleCount: 130,
            spread: 150,
            origin: { y: 0.55 },
            colors: ["#ffd700", "#ff0080", "#00f5ff", "#e040fb"],
          });
        }, 350);
      }
    } catch (_) {}
  };

  const handleOpenQuiz = () => {
    playAudioCue("cardFlip");
    setQuizStage(0);
    resetRunaway("No 😜");
    setCelebrationToast(null);
    setIsQuizOpen(true);
  };

  const handleCloseQuiz = () => {
    playAudioCue("cameraShutter");
    setIsQuizOpen(false);
    setTimeout(() => {
      document.getElementById("quiz")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  useEffect(() => {
    if (!isQuizOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCloseQuiz();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isQuizOpen]);

  const handleAnswerYesQ1 = async () => {
    playAudioCue("quizYes");
    playAudioCue("kiss");
    triggerConfetti("mini");
    setCelebrationToast("I knew it! I love you so much more, my Wifeyyy! 🥰✨ Now for the most important question...");
    setTimeout(() => {
      setCelebrationToast(null);
      setQuizStage(1);
      resetRunaway("Not Qabool 🙅‍♀️");
    }, 1800);
  };

  const handleQaboolRound1 = async () => {
    playAudioCue("quizYes");
    playAudioCue("heartPop");
    triggerConfetti("mini");
    setCelebrationToast("Alhamdulillah! 1st Qabool Hai locked! 💖 But tradition requires 2 more times... 🌹");
    setTimeout(() => {
      setCelebrationToast(null);
      setQuizStage(2);
      resetRunaway("Not Qabool 🙈");
    }, 1800);
  };

  const handleQaboolRound2 = async () => {
    playAudioCue("quizYes");
    playAudioCue("kiss");
    triggerConfetti("mini");
    setCelebrationToast("MashAllah! 2 times Qabool Hai! 🌹 Now for the final, eternal promise... 💍💖");
    setTimeout(() => {
      setCelebrationToast(null);
      setQuizStage(3);
      resetRunaway("Not Qabool 😜");
    }, 1800);
  };

  const handleQaboolRound3 = async () => {
    playAudioCue("quizYes");
    playAudioCue("success");
    triggerConfetti("grand");
    setCelebrationToast("🎉 CONGRATULATIONS! 3 TIMES QABOOL HAI! You are officially mine forever! 💍👰‍♀️");
    setTimeout(() => {
      setCelebrationToast(null);
      setQuizStage(4);
    }, 2000);
  };

  const handleRestartQuiz = () => {
    playAudioCue("cardFlip");
    setQuizStage(0);
    resetRunaway("No 😜");
    setCelebrationToast(null);
  };

  return (
    <section className="quiz-section" id="quiz">
      {/* On Main Screen: Only Show Start Special Quiz Teaser Card */}
      <div className="quiz-container">
        <div className="quiz-teaser-card">
          <div className="quiz-teaser-icon">💝</div>
          <h2 className="quiz-teaser-title">Special Romantic Quiz</h2>
          <p className="quiz-teaser-desc">
            Time to test your heart... A sweet romantic quiz made just for you, Wifeyyy! 🙈💍
          </p>
          <button
            type="button"
            className="quiz-start-btn"
            onClick={handleOpenQuiz}
          >
            ✨ Start Special Quiz 💖
          </button>
        </div>
      </div>

      {/* Dedicated Immersive Fullscreen Quiz Screen (No Small Box!) */}
      {isQuizOpen && (
        <div
          className="quiz-fullscreen-screen"
          role="dialog"
          aria-modal="true"
        >
          {celebrationToast && (
            <div className="quiz-toast-popup">
              <span>{celebrationToast}</span>
            </div>
          )}

          <button
            type="button"
            className="quiz-screen-close"
            onClick={handleCloseQuiz}
            aria-label="Close Quiz"
            title="Close Quiz"
          >
            ✕
          </button>

          {/* Stage 0: Q1 - Do you love me? */}
          {quizStage === 0 && (
            <div className="quiz-screen-body">
              <span className="quiz-screen-badge">💘 Question 1 of 2 • Love Check</span>
              <h2 className="quiz-screen-title">Do you love me? 🥺💖</h2>
              <p className="quiz-screen-subtitle">Be completely honest... No takebacks allowed! 🙈✨</p>

              <div className="quiz-screen-btn-arena">
                <button
                  type="button"
                  ref={yesBtnRef}
                  className="quiz-screen-yes-btn"
                  onClick={handleAnswerYesQ1}
                >
                  Yes, I Love You! 🥰❤️
                </button>

                <button
                  type="button"
                  ref={runawayBtnRef}
                  className="quiz-screen-runaway-btn"
                  style={
                    runawayPos.isFixed
                      ? {
                          position: "fixed",
                          left: `${runawayPos.x}px`,
                          top: `${runawayPos.y}px`,
                          margin: 0,
                        }
                      : undefined
                  }
                  onPointerDown={moveRunaway}
                  onMouseEnter={moveRunaway}
                  onTouchStart={moveRunaway}
                  onTouchMove={moveRunaway}
                  onClick={moveRunaway}
                >
                  {fleeText}
                </button>
              </div>
            </div>
          )}

          {/* Stage 1: Q2 (1st time) - Will you marry Mehboob Waqar? */}
          {quizStage === 1 && (
            <div className="quiz-screen-body">
              <span className="quiz-screen-badge">💍 Question 2 • 1st Vow (First Time)</span>
              <h2 className="quiz-screen-title">Will you marry Mehboob Waqar? 💍👰‍♀️</h2>
              <p className="quiz-screen-subtitle">Asking for the first time... Answer straight from your heart! 🌹</p>

              <div className="quiz-screen-btn-arena">
                <button
                  type="button"
                  ref={yesBtnRef}
                  className="quiz-screen-yes-btn"
                  onClick={handleQaboolRound1}
                >
                  Qabool Hai! 💖 (I Do!)
                </button>

                <button
                  type="button"
                  ref={runawayBtnRef}
                  className="quiz-screen-runaway-btn"
                  style={
                    runawayPos.isFixed
                      ? {
                          position: "fixed",
                          left: `${runawayPos.x}px`,
                          top: `${runawayPos.y}px`,
                          margin: 0,
                        }
                      : undefined
                  }
                  onPointerDown={moveRunaway}
                  onMouseEnter={moveRunaway}
                  onTouchStart={moveRunaway}
                  onTouchMove={moveRunaway}
                  onClick={moveRunaway}
                >
                  {fleeText}
                </button>
              </div>
            </div>
          )}

          {/* Stage 2: Q2 (2nd time) - Rose Garland Theme */}
          {quizStage === 2 && (
            <div className="quiz-screen-body">
              <div className="quiz-rose-garland">🌹 🌸 💐 🌹 🌸 💐 🌹</div>
              <span className="quiz-screen-badge rose-badge">🌹 Question 2 • 2nd Vow (Second Time)</span>
              <h2 className="quiz-screen-title rose-title">Will you marry Mehboob Waqar forever? 🌹💍</h2>
              <p className="quiz-screen-subtitle">Asking for the second time... Say it louder with all your love! 🙈❤️</p>

              <div className="quiz-screen-btn-arena">
                <button
                  type="button"
                  ref={yesBtnRef}
                  className="quiz-screen-yes-btn rose-btn"
                  onClick={handleQaboolRound2}
                >
                  With All My Heart, Qabool Hai! 💕🌹
                </button>

                <button
                  type="button"
                  ref={runawayBtnRef}
                  className="quiz-screen-runaway-btn"
                  style={
                    runawayPos.isFixed
                      ? {
                          position: "fixed",
                          left: `${runawayPos.x}px`,
                          top: `${runawayPos.y}px`,
                          margin: 0,
                        }
                      : undefined
                  }
                  onPointerDown={moveRunaway}
                  onMouseEnter={moveRunaway}
                  onTouchStart={moveRunaway}
                  onTouchMove={moveRunaway}
                  onClick={moveRunaway}
                >
                  {fleeText}
                </button>
              </div>
            </div>
          )}

          {/* Stage 3: Q2 (3rd time) - Simple, Clean & Romantic UI */}
          {quizStage === 3 && (
            <div className="quiz-screen-body">
              <span className="quiz-screen-badge">💍 Question 2 • 3rd Vow (Final Promise)</span>
              <h2 className="quiz-screen-title">Will you marry Mehboob Waqar? 💍❤️</h2>
              <p className="quiz-screen-subtitle">The 3rd and final vow... Forever and for all eternity! 🥺✨</p>

              <div className="quiz-screen-btn-arena">
                <button
                  type="button"
                  ref={yesBtnRef}
                  className="quiz-screen-yes-btn"
                  onClick={handleQaboolRound3}
                >
                  Forever &amp; Always, Qabool Hai! 💍💖
                </button>

                <button
                  type="button"
                  ref={runawayBtnRef}
                  className="quiz-screen-runaway-btn"
                  style={
                    runawayPos.isFixed
                      ? {
                          position: "fixed",
                          left: `${runawayPos.x}px`,
                          top: `${runawayPos.y}px`,
                          margin: 0,
                        }
                      : undefined
                  }
                  onPointerDown={moveRunaway}
                  onMouseEnter={moveRunaway}
                  onTouchStart={moveRunaway}
                  onTouchMove={moveRunaway}
                  onClick={moveRunaway}
                >
                  {fleeText}
                </button>
              </div>
            </div>
          )}

          {/* Stage 4: Luxury Nikkah / Wedding Declaration Card */}
          {quizStage === 4 && (
            <div className="nikkah-card">
              <div className="nikkah-inner-frame">
                <div className="nikkah-bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
                
                <div className="nikkah-badge">💍 OFFICIAL NIKKAH DECLARATION 💍</div>
                
                <h3 className="nikkah-title">Certificate of Eternal Love</h3>
                <p className="nikkah-subtitle">United in Heart, Soul &amp; Destiny</p>

                <div className="nikkah-divider" />

                {/* The Royal Couple Names */}
                <div className="nikkah-couple-box">
                  <div className="nikkah-person groom">
                    <span className="nikkah-role">The Groom</span>
                    <span className="nikkah-name">Mehboob Waqar</span>
                    <span className="nikkah-tag">Forever Yours 🤵‍♂️❤️</span>
                  </div>

                  <div className="nikkah-heart-badge">
                    <span className="nikkah-rings">💍 💕 💍</span>
                    <span className="nikkah-qabool-stamp">3x QABOOL HAI</span>
                  </div>

                  <div className="nikkah-person bride">
                    <span className="nikkah-role">The Beautiful Bride</span>
                    <span className="nikkah-name">Laiba Mehboob</span>
                    <span className="nikkah-tag">My Queen 👰‍♀️💖</span>
                  </div>
                </div>

                <div className="nikkah-divider" />

                {/* Short, Sweet & Elegant Vow Text */}
                <p className="nikkah-short-vow">
                  With <strong>three sacred declarations of &quot;Qabool Hai&quot;</strong>, our hearts are eternally entwined. 
                  In this life, in every prayer, and across every lifetime, you are my forever soulmate, my peace, and my greatest blessing.
                </p>

                <div className="nikkah-birthday-tag">
                  🎂 Celebrated on Your 23rd Birthday • September 9 ✨
                </div>

                {/* Signatures & Seal */}
                <div className="nikkah-signatures">
                  <div className="nikkah-sig-col">
                    <span className="nikkah-sig-script">Mehboob Waqar</span>
                    <span className="nikkah-sig-label">Groom&apos;s Signature ✍️</span>
                  </div>

                  <div className="nikkah-seal">
                    <div className="nikkah-seal-circle">
                      <span>SEALED</span>
                      <span className="seal-heart">❤️</span>
                      <span>FOREVER</span>
                    </div>
                  </div>

                  <div className="nikkah-sig-col">
                    <span className="nikkah-sig-script">Laiba Mehboob</span>
                    <span className="nikkah-sig-label">Bride&apos;s Signature ✍️</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="congrats-actions" style={{ marginTop: "2rem" }}>
                  <button type="button" className="quiz-back-btn" onClick={handleCloseQuiz}>
                    🏠 Go to Main Screen
                  </button>
                  <button type="button" className="quiz-replay-btn" onClick={handleRestartQuiz}>
                    🔄 Play Quiz Again
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

// ─── Photo Memories Section ───
function PhotoMemories() {
  const [revealedCards, setRevealedCards] = useState<Set<number>>(new Set());
  const [justRevealed, setJustRevealed] = useState<number | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const memoriesList = [
    { src: "/gallery/first-meetup.jpeg", caption: "Pehli Mulaqat — 'This Way' 😘", emoji: "🥺" },
    { src: "/gallery/first-rc.jpeg", caption: "First Time Going to RC Together 🏨✨", emoji: "🏨" },
    { src: "/gallery/rc-boat.jpeg", caption: "Racecourse Park Boat Ride Together 🚤", emoji: "⛵" },
    { src: "/gallery/rc-boat-ride.jpeg", caption: "Racecourse Park Vibes & Peace 🌳🌸", emoji: "🌳" },
    { src: "/gallery/rc-park1.jpeg", caption: "Racecourse Park Walk — Haath Tham Ke 🚶‍♂️💕", emoji: "🍃" },
    { src: "/gallery/rc-park2.jpeg", caption: "Racecourse Park Sweet Moments 💖", emoji: "🌸" },
    { src: "/gallery/rc-cuteness.jpeg", caption: "RC Hotel Cuteness & Smiles Together 🥰🏨", emoji: "🥰" },
    { src: "/gallery/rc-2nd.jpeg", caption: "RC 2nd Visit — Missing You Already 💖", emoji: "💕" },
    { src: "/gallery/rc-3rd.jpeg", caption: "RC 3rd Time — Ek Doosre Ki Aadat 😍", emoji: "😍" },
    { src: "/gallery/rc-3rd-1.jpeg", caption: "RC 3rd Visit — Us Being Us ✨", emoji: "✨" },
    { src: "/gallery/rc-5th.jpeg", caption: "RC 5th Time — Hamara Favorite Hotel 🏡", emoji: "🏡" },
    { src: "/gallery/rc-5th-1.jpeg", caption: "RC 5th Visit — Golden Memories 🌟", emoji: "🌟" },
    { src: "/gallery/rc-birthday.jpeg", caption: "Before Going to RC for Your Birthday 🎂", emoji: "🎂" },
    { src: "/gallery/shalimar-garden.jpeg", caption: "Shalamar Garden Park Date 🌺", emoji: "🌺" },
    { src: "/gallery/shalimar-3rd.jpeg", caption: "3rd Meetup — Shalamar Garden Park 🌸", emoji: "🌸" },
    { src: "/gallery/shalimar-shahzain.jpeg", caption: "Shalamar Garden with Shahzain 👪", emoji: "👪" },
    { src: "/gallery/emporium-mall.jpeg", caption: "Emporium Mall Outing Together 🛍️", emoji: "🛍️" },
    { src: "/gallery/emporium-cute.jpeg", caption: "Emporium Mall — Cute Pose Together 📸", emoji: "📸" },
    { src: "/gallery/emporium-gangster.jpeg", caption: "Gangster Look at Emporium Mall 😎", emoji: "😎" },
    { src: "/gallery/cheezious-hands.jpeg", caption: "Cheezious — Haath Tham Ke 🤝💖", emoji: "🤝" },
    { src: "/gallery/burger-oclock.jpeg", caption: "Burger O'Clock Date Together 🍔", emoji: "🍔" },
    { src: "/gallery/burger-oclock-1.jpeg", caption: "Burger O'Clock — Sharing Bites & Smiles 🍟💖", emoji: "😋" },
    { src: "/gallery/burger-oclock-2.jpeg", caption: "Burger O'Clock Sweet Moments Together 🥤🥪", emoji: "🥪" },
    { src: "/gallery/daal-chawal.jpeg", caption: "Yaad Hai Daal Chawal? Simple & Sweet 🍛", emoji: "🍛" },
    { src: "/gallery/packages-mall.jpeg", caption: "Packages Mall — Peaceful Walks Together 🛒✨", emoji: "🛒" },
    { src: "/gallery/badshahi-mosque.jpeg", caption: "Badshahi Mosque Visit Together 🕌", emoji: "🕌" },
    { src: "/gallery/shahi-killa.jpeg", caption: "Shahi Qila — Hamari Yaadgaar Mulakat 🏰❤️", emoji: "🏰" },
    { src: "/gallery/delhi-darwaza.jpeg", caption: "Delhi Darwaza Historical Walk Together 🚪🌸", emoji: "🚶‍♀️" },
    { src: "/gallery/minar-pakistan.jpeg", caption: "Minar-e-Pakistan Date Together 🇵🇰✨", emoji: "🇵🇰" },
    { src: "/gallery/last-meetup.jpeg", caption: "Last Meetup — Gulberg Wapsi Se Pehle 💔", emoji: "💔" },
  ];

  const TOTAL_PHOTOS = memoriesList.length;

  const handleReveal = useCallback(async (index: number) => {
    if (revealedCards.has(index)) {
      // Already revealed — open lightbox
      playAudioCue("cameraShutter");
      setLightboxIndex(index);
      return;
    }
    playAudioCue("cardFlip");
    setJustRevealed(index);
    setRevealedCards(prev => new Set([...Array.from(prev), index]));

    // Mini confetti on reveal
    try {
      const confetti = (await import("canvas-confetti")).default;
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.7 },
        colors: ["#ff0080", "#ffd700", "#ce93d8"],
        scalar: 0.8,
      });
    } catch (_) { }

    setTimeout(() => setJustRevealed(null), 900);
  }, [revealedCards]);

  // Lightbox navigation (only among revealed cards)
  const revealedList = Array.from(revealedCards).sort((a, b) => a - b);

  const closeLightbox = useCallback(() => {
    playAudioCue("cameraShutter");
    setLightboxIndex(null);
  }, []);

  const goToNext = useCallback(() => {
    if (lightboxIndex === null) return;
    playAudioCue("cardFlip");
    const curPos = revealedList.indexOf(lightboxIndex);
    if (curPos < revealedList.length - 1) setLightboxIndex(revealedList[curPos + 1]);
    else setLightboxIndex(revealedList[0]); // wrap
  }, [lightboxIndex, revealedList]);

  const goToPrev = useCallback(() => {
    if (lightboxIndex === null) return;
    playAudioCue("cardFlip");
    const curPos = revealedList.indexOf(lightboxIndex);
    if (curPos > 0) setLightboxIndex(revealedList[curPos - 1]);
    else setLightboxIndex(revealedList[revealedList.length - 1]); // wrap
  }, [lightboxIndex, revealedList]);

  // Keyboard support for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "ArrowLeft") goToPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, goToNext, goToPrev]);

  return (
    <>
      <section className="memories-section" id="memories">
        <h2 className="section-title">📸 Our Beautiful Memories (Us Together) 📸</h2>
        <p className="timeline-hint" style={{ textAlign: "center", marginBottom: "1rem" }}>
          Tap cards to reveal our favorite moments together ✨
        </p>
        <div className="section-divider" />

        <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
          <span className="memories-counter">
            💖 Revealed: <span className="count-num">{revealedCards.size}</span> / {TOTAL_PHOTOS}
          </span>
        </div>

        <div className="memories-grid">
          {memoriesList.map((item, i) => {
            const isRevealed = revealedCards.has(i);
            const isJust = justRevealed === i;
            return (
              <div
                key={i}
                className={`memory-card ${isRevealed ? "revealed" : ""} ${isJust ? "just-revealed" : ""}`}
                onClick={() => handleReveal(i)}
              >
                <div className="memory-card-inner">
                  {/* Front - Mystery */}
                  <div className="memory-card-front">
                    <div className="shimmer-line" />
                    <span className="mystery-num">#{i + 1}</span>
                    <span className="mystery-emoji">{item.emoji}</span>
                    <span className="mystery-text">Tap to reveal</span>
                  </div>
                  {/* Back - Photo */}
                  <div className="memory-card-back">
                    {isRevealed && (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.src}
                          alt={item.caption}
                          loading="lazy"
                        />
                        <div className="photo-overlay">
                          <span className="photo-caption">{item.caption}</span>
                          <span className="photo-expand">✨ Tap for Full Screen ✨</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Lightbox Modal ─── */}
      {lightboxIndex !== null && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>✕</button>
            {revealedList.length > 1 && (
              <button className="lightbox-nav prev" onClick={goToPrev}>‹</button>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={memoriesList[lightboxIndex].src}
              alt={memoriesList[lightboxIndex].caption}
            />
            <p className="lightbox-caption">{memoriesList[lightboxIndex].caption}</p>
            <p className="lightbox-counter">
              {revealedList.indexOf(lightboxIndex) + 1} / {revealedList.length}
            </p>
            {revealedList.length > 1 && (
              <button className="lightbox-nav next" onClick={goToNext}>›</button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ─── Funny Error Dialogues ───
const FUNNY_ERROR_LIST = [
  {
    emoji: "🤨",
    title: "Aree Kaun Ho Bhai Ap?!",
    desc: "Sirf Meri Wifey ko access hai! Chalo shabash, side pe ho jao! 😂🚫",
  },
  {
    emoji: "🧐",
    title: "Wait A Second...",
    desc: "Tum meri Wifey nahi lag rahi! Pehle ja kar permission le kar aao! 😜",
  },
  {
    emoji: "🚨",
    title: "FBI OPEN UP!",
    desc: "Wrong Password! Yeh secret surprise sirf meri Wifey k liye reserved hai! 🚔😂",
  },
  {
    emoji: "🙈",
    title: "Haww Hayee!",
    desc: "Chori chori meri Wifey ka surprise dekhne aagaye? Password bilkul galat hai boss! 🙅‍♀️",
  },
  {
    emoji: "🚪",
    title: "Galat Darwaza!",
    desc: "Bhai sahab / behn ji, galat gali aagaye aap! Meri Wifey ka secret code daalo! 💖😂",
  },
  {
    emoji: "👸",
    title: "Access Denied!",
    desc: "System bol raha hai: 'Sirf meri Wifey allowed hai yahan!' 💍✨",
  },
  {
    emoji: "🕵️",
    title: "Nice Try Chor!",
    desc: "Lekin meri Wifey ka secret code itna aasan nahi! Dimaag pe zor daalo! 🤪",
  },
];

// ─── Secret Password Gate ───
function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorIndex, setErrorIndex] = useState<number | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isSuccess) return;

    const trimmed = password.trim();
    if (!trimmed) {
      setIsShaking(true);
      setErrorIndex(0);
      playAudioCue("wrong");
      setTimeout(() => setIsShaking(false), 600);
      return;
    }

    if (trimmed.toLowerCase() === SECRET_PASSWORD.toLowerCase()) {
      // SUCCESS!
      setIsSuccess(true);
      setErrorIndex(null);
      playAudioCue("success");

      // Confetti burst for royal entrance
      import("canvas-confetti")
        .then((module) => {
          const confetti = module.default;
          confetti({
            particleCount: 120,
            spread: 90,
            origin: { y: 0.5 },
            colors: ["#ffd700", "#ff0080", "#00f5ff", "#ce93d8"],
          });
          setTimeout(() => {
            confetti({
              particleCount: 60,
              angle: 60,
              spread: 60,
              origin: { x: 0, y: 0.6 },
              colors: ["#ffd700", "#ff6b9d"],
            });
            confetti({
              particleCount: 60,
              angle: 120,
              spread: 60,
              origin: { x: 1, y: 0.6 },
              colors: ["#ffd700", "#00f5ff"],
            });
          }, 300);
        })
        .catch(() => { });

      try {
        sessionStorage.setItem("miang_unlocked", "true");
      } catch { }

      setTimeout(() => {
        setIsFadingOut(true);
      }, 1600);

      setTimeout(() => {
        onUnlock();
      }, 2100);
    } else {
      // WRONG PASSWORD!
      setIsShaking(true);
      playAudioCue("wrong");
      if (typeof window !== "undefined" && window.navigator && "vibrate" in window.navigator) {
        try {
          window.navigator.vibrate([150, 60, 150]);
        } catch { }
      }

      setErrorIndex((prev) => (prev === null ? 0 : (prev + 1) % FUNNY_ERROR_LIST.length));
      setAttemptCount((prev) => prev + 1);

      setTimeout(() => {
        setIsShaking(false);
        inputRef.current?.select();
      }, 600);
    }
  };

  const currentError = errorIndex !== null ? FUNNY_ERROR_LIST[errorIndex] : null;

  return (
    <div className={`password-gate-overlay ${isFadingOut ? "fading-out" : ""}`}>
      <div className="password-gate-stars" />
      <div
        className={`password-card ${isShaking ? "shake" : ""} ${isSuccess ? "success-state" : ""}`}
      >
        {isSuccess ? (
          <div className="success-welcome-view">
            <div className="royal-crown-burst">👑</div>
            <span className="unlocked-badge">✨ ACCESS GRANTED ✨</span>
            <h2 className="welcome-queen-title">Welcome My Beautiful Wifey! 💖</h2>
            <p className="welcome-queen-subtitle">
              This special surprise is unlocked only for you, my forever Wifey! 🌹💍
            </p>
            <div className="loading-dots">
              <span />
              <span />
              <span />
            </div>
          </div>
        ) : (
          <>
            <div className="lock-icon-halo">
              <span className="lock-emoji">🔒</span>
            </div>
            <span className="private-badge">🔐 PRIVATE SURPRISE</span>
            <h2 className="gate-title">Enter Secret Password</h2>
            <p className="gate-subtitle">
              Only for <strong>Meri Wifey</strong> 💖
              <br />
              Enter the magic password to enter!
            </p>

            <form onSubmit={handleSubmit} className="gate-form">
              <div className="input-group">
                <input
                  ref={inputRef}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password..."
                  className="password-input"
                  autoComplete="off"
                  spellCheck={false}
                />
                <button
                  type="button"
                  className="eye-toggle-btn"
                  onClick={() => {
                    playAudioCue("cardFlip");
                    setShowPassword(!showPassword);
                  }}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>

              {currentError && (
                <div className="funny-error-banner">
                  <div className="funny-emoji">{currentError.emoji}</div>
                  <div className="funny-content">
                    <strong className="funny-title">{currentError.title}</strong>
                    <p className="funny-desc">{currentError.desc}</p>
                    {attemptCount >= 2 && (
                      <span className="attempt-tag">
                        ⚠️ Wrong attempts: {attemptCount} (Sirf meri Wifey allowed hai 👀)
                      </span>
                    )}
                  </div>
                </div>
              )}

              <button type="submit" className="gate-submit-btn">
                <span>Unlock My Surprise 💖</span>
              </button>
            </form>

            <div className="gate-hint-section">
              <button
                type="button"
                className="hint-toggle-btn"
                onClick={() => {
                  playAudioCue("twinkle");
                  setShowHint(!showHint);
                }}
              >
                💡 {showHint ? "Hide Hint" : "Need a hint?"}
              </button>
              {showHint && (
                <div className="hint-card">
                  <p className="hint-text">
                    ✨ <strong>If you know, you know...</strong> 😉
                    <br />
                    And if you really know, you don&apos;t need any hint! 💖
                    <br />
                    <span style={{ display: "inline-block", marginTop: "4px", color: "#ffd700" }}>
                      <em>(Aapka aur mera pyara secret word... Starts with <strong>N</strong> 💕)</em>
                    </span>
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Envelope Intro ───
function EnvelopeIntro({ onOpen }: { onOpen: () => void }) {
  const [opened, setOpened] = useState(false);

  const handleClick = () => {
    if (opened) return;
    playAudioCue("envelopeOpen");
    setOpened(true);
    onOpen();
  };

  return (
    <div className={`envelope-overlay ${opened ? "opened" : ""}`} onClick={handleClick}>
      <div className="envelope-glow-ring" />
      <div className="envelope-glow-ring" />
      <div className="envelope-glow-ring" />
      <span className="envelope">💌</span>
      <p className="envelope-text">You have a special message, Laiba! 💖</p>
      <p className="envelope-hint">✨ Tap to open your surprise ✨</p>
    </div>
  );
}

// ─── Love Duration Clock (Live Ticking Since 04 April 2024) ───
interface LoveDuration {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
}

function calculateLoveDuration(startDate: Date, currentDate: Date): LoveDuration {
  let years = currentDate.getFullYear() - startDate.getFullYear();
  let months = currentDate.getMonth() - startDate.getMonth();
  let days = currentDate.getDate() - startDate.getDate();
  let hours = currentDate.getHours() - startDate.getHours();
  let minutes = currentDate.getMinutes() - startDate.getMinutes();
  let seconds = currentDate.getSeconds() - startDate.getSeconds();

  if (seconds < 0) {
    seconds += 60;
    minutes -= 1;
  }
  if (minutes < 0) {
    minutes += 60;
    hours -= 1;
  }
  if (hours < 0) {
    hours += 24;
    days -= 1;
  }
  if (days < 0) {
    const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
    days += prevMonthLastDay;
    months -= 1;
  }
  if (months < 0) {
    months += 12;
    years -= 1;
  }

  const diffMs = Math.max(0, currentDate.getTime() - startDate.getTime());
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return {
    years: Math.max(0, years),
    months: Math.max(0, months),
    days: Math.max(0, days),
    hours: Math.max(0, hours),
    minutes: Math.max(0, minutes),
    seconds: Math.max(0, seconds),
    totalDays,
  };
}

function LoveClockSection() {
  const [duration, setDuration] = useState<LoveDuration | null>(null);

  useEffect(() => {
    // 04 April 2024
    const startDate = new Date(2024, 3, 4, 0, 0, 0);
    const update = () => {
      setDuration(calculateLoveDuration(startDate, new Date()));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!duration) {
    return null;
  }

  const timeUnits = [
    { label: "Years", value: duration.years, emoji: "🌹" },
    { label: "Months", value: duration.months, emoji: "🌙" },
    { label: "Days", value: duration.days, emoji: "☀️" },
    { label: "Hours", value: String(duration.hours).padStart(2, "0"), emoji: "⏳" },
    { label: "Minutes", value: String(duration.minutes).padStart(2, "0"), emoji: "⏱️" },
    { label: "Seconds", value: String(duration.seconds).padStart(2, "0"), emoji: "💓", isSeconds: true },
  ];

  return (
    <section className="love-clock-section" id="love-clock">
      <div className="love-clock-card">
        <div className="love-clock-badge">
          <span>💍 Together Since 04 April 2024</span>
        </div>

        <h2 className="love-clock-title">Loving You For 💖</h2>
        <p className="love-clock-subtitle">
          Loving You For: {duration.years} Years, {duration.months} Months, {duration.days} Days, {duration.hours} Hours, {duration.minutes} Minutes, {duration.seconds} Seconds
        </p>

        <div className="love-clock-grid">
          {timeUnits.map((unit, idx) => (
            <div key={idx} className={`love-clock-box ${unit.isSeconds ? "seconds-box" : ""}`}>
              <span className="love-clock-box-emoji">{unit.emoji}</span>
              <span className="love-clock-num">{unit.value}</span>
              <span className="love-clock-label">{unit.label}</span>
            </div>
          ))}
        </div>

        <div className="love-clock-note">
          <span className="love-clock-pulse-heart">💖</span>
          <div className="note-text">
            Together for <strong>{duration.totalDays.toLocaleString()}</strong> beautiful days and counting...
          </div>
          <div className="note-hint">
            "04 April 2024 ko shuru hui thi hamari pyari kahani, aur yeh silsila ta-umr chalega!" 🥰♾️
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Special Romantic Scratch Vouchers Section ───
interface VoucherData {
  id: number;
  couponNo: string;
  category: string;
  badgeEmoji: string;
  title: string;
  subtitle: string;
  perkSummary: string;
  isSpecialReverse?: boolean;
}

const VOUCHERS_LIST: VoucherData[] = [
  {
    id: 1,
    couponNo: "LM-ROYAL-001",
    category: "24-HOUR PRIVILEGE",
    badgeEmoji: "👑",
    title: "24 Hours of Absolute Obedience",
    subtitle: "Your wish is my command—whatever you say goes!",
    perkSummary: "100% Agreement Guaranteed • Zero Arguments Allowed",
  },
  {
    id: 2,
    couponNo: "LM-LUXE-002",
    category: "RC LUXURY SPA",
    badgeEmoji: "💆‍♀️",
    title: "VIP Relaxing Head & Shoulder Massage in RC",
    subtitle: "45 minutes of pure relaxation & luxury pampering.",
    perkSummary: "Complete Tension Relief • Lavender Aromatherapy",
  },
  {
    id: 3,
    couponNo: "LM-CUDDLE-003",
    category: "ENDLESS AFFECTION",
    badgeEmoji: "🫂",
    title: "Unlimited Warm Hugs & Kisses Pass",
    subtitle: "Endless tight hugs & sweet forehead kisses anytime.",
    perkSummary: "Permanent 24/7 Supply • Unlimited Cuddles",
  },
  {
    id: 4,
    couponNo: "LM-DINE-004",
    category: "ROMANTIC DINING",
    badgeEmoji: "🥂",
    title: "Fine Dining Date at Your Favorite Place",
    subtitle: "Candlelight dinner at your favorite place, treat on Mehboob.",
    perkSummary: "Your Choice of Restaurant • Full Royal Treatment",
  },
  {
    id: 5,
    couponNo: "LM-MEHBOOB-777",
    category: "FOR MEHBOOB 💫",
    badgeEmoji: "💖",
    title: "The Golden Reversal Pass (Mehboob's Wish)",
    subtitle: "When you arrive, you have to say YES to 1 wish of mine!",
    perkSummary: "Strictly Non-Negotiable • Must Say Yes 🙈",
    isSpecialReverse: true,
  },
];

function ScratchCardItem({
  voucher,
  isScratched,
  isRedeemed,
  onScratchComplete,
  onRedeem,
}: {
  voucher: VoucherData;
  isScratched: boolean;
  isRedeemed: boolean;
  onScratchComplete: (id: number) => void;
  onRedeem: (id: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isScratchingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const checkTimerRef = useRef<number | null>(null);
  const totalScratchedDistance = useRef(0);

  // Initialize Canvas with metallic foil texture
  const initFoil = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    // Quiet Luxury Satin Champagne Pearl Gold Foil (Decent & Classy)
    const grad = ctx.createLinearGradient(0, 0, w * 0.9, h * 1.1);
    if (voucher.isSpecialReverse) {
      // Warm Antique Bronze Gold (Classy & Rich)
      grad.addColorStop(0.0, "#c59a3f");
      grad.addColorStop(0.25, "#fcedc7");
      grad.addColorStop(0.5, "#d6a853");
      grad.addColorStop(0.75, "#fff7e6");
      grad.addColorStop(1.0, "#a8782a");
    } else {
      // Satin Champagne Pearl Gold (Soft, Elegant, Quiet Luxury)
      grad.addColorStop(0.0, "#d5c2ad");
      grad.addColorStop(0.25, "#fbf6f0");
      grad.addColorStop(0.5, "#decbb7");
      grad.addColorStop(0.75, "#fffdfa");
      grad.addColorStop(1.0, "#c7b29b");
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Subtle Satin Sheen Highlight
    const sheen = ctx.createLinearGradient(0, 0, w, h);
    sheen.addColorStop(0.0, "rgba(255, 255, 255, 0.04)");
    sheen.addColorStop(0.35, "rgba(255, 255, 255, 0.28)");
    sheen.addColorStop(0.5, "rgba(255, 255, 255, 0.42)");
    sheen.addColorStop(0.65, "rgba(255, 255, 255, 0.28)");
    sheen.addColorStop(1.0, "rgba(255, 255, 255, 0.04)");
    ctx.fillStyle = sheen;
    ctx.fillRect(0, 0, w, h);

    // Soft Gold Sparkles
    ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
    for (let i = 0; i < 30; i++) {
      const sx = (Math.sin(i * 73) * 0.5 + 0.5) * w;
      const sy = (Math.cos(i * 41) * 0.5 + 0.5) * h;
      const sr = (i % 3) * 0.7 + 1.2;
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    }

    // Elegant Frosted Champagne Badge
    const badgeW = Math.min(w * 0.78, 240);
    const badgeH = 68;
    const badgeX = (w - badgeW) / 2;
    const badgeY = (h - badgeH) / 2;

    ctx.save();
    ctx.fillStyle = "rgba(42, 28, 35, 0.45)";
    ctx.beginPath();
    if (typeof ctx.roundRect === "function") {
      ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 16);
    } else {
      ctx.rect(badgeX, badgeY, badgeW, badgeH);
    }
    ctx.fill();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // Centered foil title & instructions
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 13px 'Outfit', sans-serif";
    ctx.fillText("✨ SCRATCH TO REVEAL ✨", w / 2, badgeY + 24);

    ctx.fillStyle = "#fdfbf7";
    ctx.font = "600 11px sans-serif";
    ctx.fillText("Swipe with finger or mouse", w / 2, badgeY + 45);
    ctx.restore();
  }, [voucher.isSpecialReverse]);

  useEffect(() => {
    if (!isScratched) {
      initFoil();
    }
  }, [isScratched, initFoil]);

  const checkPercent = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isScratched) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      let clearPixels = 0;
      const step = 48;
      const totalSampled = Math.floor(data.length / step);
      for (let i = 3; i < data.length; i += step) {
        if (data[i] === 0) {
          clearPixels++;
        }
      }
      const pct = (clearPixels / totalSampled) * 100;

      if (pct >= 26) {
        onScratchComplete(voucher.id);
      }
    } catch { }
  }, [isScratched, onScratchComplete, voucher.id]);

  const scheduleCheckPercent = () => {
    if (checkTimerRef.current) return;
    checkTimerRef.current = window.setTimeout(() => {
      checkTimerRef.current = null;
      checkPercent();
    }, 120);
  };

  const scratchTo = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const currX = (clientX - rect.left) * dpr;
    const currY = (clientY - rect.top) * dpr;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const brushRadius = 26 * dpr;
    ctx.lineWidth = brushRadius * 2;

    if (!lastPosRef.current) {
      ctx.beginPath();
      ctx.arc(currX, currY, brushRadius, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
      ctx.lineTo(currX, currY);
      ctx.stroke();

      const dx = currX - lastPosRef.current.x;
      const dy = currY - lastPosRef.current.y;
      totalScratchedDistance.current += Math.hypot(dx, dy);
    }

    lastPosRef.current = { x: currX, y: currY };

    if (totalScratchedDistance.current > 150 * dpr) {
      scheduleCheckPercent();
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isScratched) return;
    isScratchingRef.current = true;
    lastPosRef.current = null;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch { }
    scratchTo(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isScratchingRef.current || isScratched) return;
    scratchTo(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isScratchingRef.current) return;
    isScratchingRef.current = false;
    lastPosRef.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch { }
    checkPercent();
  };

  return (
    <div
      className={`voucher-card ${voucher.isSpecialReverse ? "voucher-card-reverse" : ""} ${
        isScratched ? "voucher-revealed" : ""
      } ${isRedeemed ? "voucher-redeemed" : ""}`}
    >
      {/* Notch cutouts for authentic perforated ticket look */}
      <div className="voucher-notch voucher-notch-left" aria-hidden="true" />
      <div className="voucher-notch voucher-notch-right" aria-hidden="true" />

      {/* Secret Voucher Content (Underneath Foil) */}
      <div className="voucher-inner">
        {/* Header Stub */}
        <div className="voucher-stub">
          <div className="voucher-badge-row">
            <span className="voucher-badge">
              {voucher.badgeEmoji} {voucher.category}
            </span>
            <span className="voucher-code">{voucher.couponNo}</span>
          </div>

          <h3 className="voucher-title">{voucher.title}</h3>
          <p className="voucher-subtitle">&ldquo;{voucher.subtitle}&rdquo;</p>
        </div>

        <div className="voucher-divider-dashed" />

        {/* Voucher Body - Compact, main points only */}
        <div className="voucher-body">
          <div className="voucher-highlight-pill">
            <span className="pill-bullet">✦</span>
            <span>{voucher.perkSummary}</span>
          </div>

          {/* Verification Seal & Action */}
          <div className="voucher-footer">
            <div className="voucher-seal">
              <span className="seal-text">SEALED BY</span>
              <span className="seal-name">MEHBOOB 💍</span>
            </div>

            {isScratched && !isRedeemed && (
              <button
                type="button"
                className="voucher-redeem-btn"
                onClick={() => onRedeem(voucher.id)}
              >
                🎁 Redeem Voucher
              </button>
            )}

            {isRedeemed && (
              <div className="voucher-redeemed-tag">
                <span>✅ Redeemed with Love! 💖</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Canvas Scratch Foil (Overlaid on top until scratched) */}
      {!isScratched && (
        <div className="voucher-foil-wrap">
          <canvas
            ref={canvasRef}
            className="voucher-scratch-canvas"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          />
        </div>
      )}
    </div>
  );
}

function VouchersSection() {
  const [scratchedIds, setScratchedIds] = useState<Set<number>>(new Set());
  const [redeemedIds, setRedeemedIds] = useState<Set<number>>(new Set());

  // Load persisted vouchers
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("birthday_vouchers_scratched");
      if (saved) {
        setScratchedIds(new Set(JSON.parse(saved)));
      }
      const savedRedeemed = sessionStorage.getItem("birthday_vouchers_redeemed");
      if (savedRedeemed) {
        setRedeemedIds(new Set(JSON.parse(savedRedeemed)));
      }
    } catch { }
  }, []);

  const handleScratchComplete = useCallback(async (id: number) => {
    playAudioCue("royalVictory");
    try {
      const confetti = (await import("canvas-confetti")).default;
      confetti({
        particleCount: 45,
        spread: 70,
        origin: { y: 0.65 },
        colors: ["#ffd700", "#ff0080", "#ff69b4", "#ffffff"],
      });
    } catch { }

    setScratchedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      try {
        sessionStorage.setItem("birthday_vouchers_scratched", JSON.stringify(Array.from(next)));
      } catch { }
      return next;
    });
  }, []);

  const handleRedeem = useCallback(async (id: number) => {
    playAudioCue("success");
    try {
      const confetti = (await import("canvas-confetti")).default;
      confetti({
        particleCount: 60,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#ff4081", "#ffd700", "#ffffff"],
      });
    } catch { }

    setRedeemedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      try {
        sessionStorage.setItem("birthday_vouchers_redeemed", JSON.stringify(Array.from(next)));
      } catch { }
      return next;
    });
  }, []);

  const handleRevealAll = useCallback(async () => {
    playAudioCue("royalVictory");
    try {
      const confetti = (await import("canvas-confetti")).default;
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.5 },
      });
    } catch { }
    const all = new Set(VOUCHERS_LIST.map((v) => v.id));
    setScratchedIds(all);
    try {
      sessionStorage.setItem("birthday_vouchers_scratched", JSON.stringify(Array.from(all)));
    } catch { }
  }, []);

  const handleReset = useCallback(() => {
    playAudioCue("cardFlip");
    setScratchedIds(new Set());
    setRedeemedIds(new Set());
    try {
      sessionStorage.removeItem("birthday_vouchers_scratched");
      sessionStorage.removeItem("birthday_vouchers_redeemed");
    } catch { }
  }, []);

  const revealedCount = scratchedIds.size;

  return (
    <section className="vouchers-section" id="vouchers">
      <div className="vouchers-container">
        <div className="vouchers-header">
          <span className="vouchers-badge">🎟️ EXCLUSIVE BIRTHDAY PRIVILEGES</span>
          <h2 className="section-title">✨ Romantic Scratch-Off Vouchers ✨</h2>
          <div className="section-divider" />
          <p className="vouchers-intro">
            Scratch the sparkling foil on each card with your finger or mouse to unveil 5 official luxury love coupons made just for you! 💖
          </p>
          <div className="vouchers-counter-pill">
            <span>🎉 {revealedCount} of 5 Vouchers Unveiled</span>
          </div>
        </div>

        <div className="vouchers-grid">
          {VOUCHERS_LIST.map((voucher) => (
            <ScratchCardItem
              key={voucher.id}
              voucher={voucher}
              isScratched={scratchedIds.has(voucher.id)}
              isRedeemed={redeemedIds.has(voucher.id)}
              onScratchComplete={handleScratchComplete}
              onRedeem={handleRedeem}
            />
          ))}
        </div>

        <div className="vouchers-action-bar">
          {revealedCount < 5 && (
            <button
              type="button"
              className="vouchers-global-reveal-btn"
              onClick={handleRevealAll}
            >
              ✨ Reveal All Vouchers
            </button>
          )}
          {revealedCount > 0 && (
            <button
              type="button"
              className="vouchers-reset-btn"
              onClick={handleReset}
              title="Reset scratch cards to play again"
            >
              🔄 Scratch Again
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Best Wife of the Universe - Official Royal Award Section ───
function BestWifeAwardSection() {
  const [isAwardOpen, setIsAwardOpen] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleOpenAward = async () => {
    playAudioCue("royalVictory");
    try {
      const confetti = (await import("canvas-confetti")).default;
      confetti({
        particleCount: 70,
        spread: 100,
        origin: { y: 0.6 },
        colors: ["#ffd700", "#ff0080", "#ffffff", "#e0a96d"],
      });
    } catch { }
    setIsAwardOpen(true);
  };

  const handleCloseAward = () => {
    playAudioCue("cardFlip");
    setIsAwardOpen(false);
  };

  const downloadAwardImage = async () => {
    playAudioCue("success");
    try {
      const confetti = (await import("canvas-confetti")).default;
      confetti({
        particleCount: 50,
        spread: 90,
        origin: { y: 0.55 },
        colors: ["#ffd700", "#ff4081", "#ffffff"],
      });
    } catch { }

    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 860;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background: Warm ivory parchment
    const bgGrad = ctx.createRadialGradient(600, 430, 80, 600, 430, 700);
    bgGrad.addColorStop(0, "#fffef9");
    bgGrad.addColorStop(0.7, "#fdf8ee");
    bgGrad.addColorStop(1, "#f4ebd7");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 860);

    // Outer Gold Border
    ctx.strokeStyle = "#b38222";
    ctx.lineWidth = 6;
    ctx.strokeRect(30, 30, 1140, 800);

    // Inner Fine Gold Border
    ctx.strokeStyle = "rgba(179, 130, 34, 0.45)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(42, 42, 1116, 776);

    // Corner Ornaments
    const drawCorner = (x: number, y: number, angle: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.strokeStyle = "#b38222";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 24, 0, Math.PI * 0.5);
      ctx.stroke();
      ctx.fillStyle = "#b38222";
      ctx.beginPath();
      ctx.arc(10, 10, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };
    drawCorner(55, 55, 0);
    drawCorner(1145, 55, Math.PI * 0.5);
    drawCorner(1145, 805, Math.PI);
    drawCorner(55, 805, Math.PI * 1.5);

    // Royal Header
    ctx.fillStyle = "#801235";
    ctx.font = "bold 15px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("👑 THE SUPREME ROYAL COUNCIL OF MEHBOOB'S HEART 👑", 600, 95);

    ctx.fillStyle = "#b38222";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("OFFICIAL DIPLOMA OF ETERNAL EXCELLENCE • 2026 EDITION", 600, 125);

    // Divider Line
    ctx.strokeStyle = "rgba(179, 130, 34, 0.35)";
    ctx.beginPath();
    ctx.moveTo(250, 145);
    ctx.lineTo(950, 145);
    ctx.stroke();

    // Presenting
    ctx.fillStyle = "#3b1029";
    ctx.font = "italic 18px Georgia, serif";
    ctx.fillText("This prestigious royal honor is proudly conferred upon", 600, 190);

    // Recipient Name
    ctx.fillStyle = "#1c0819";
    ctx.font = "bold 46px Georgia, serif";
    ctx.fillText("LAIBA MEHBOOB", 600, 255);

    // Underline
    ctx.strokeStyle = "#b38222";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(380, 275);
    ctx.lineTo(820, 275);
    ctx.stroke();

    // Subtitle
    ctx.fillStyle = "#801235";
    ctx.font = "bold 20px Georgia, serif";
    ctx.fillText("THE BEST WIFE IN THE ENTIRE UNIVERSE 🌟", 600, 320);

    // Citation Box
    ctx.fillStyle = "rgba(184, 40, 88, 0.05)";
    ctx.fillRect(160, 355, 880, 100);
    ctx.strokeStyle = "rgba(184, 40, 88, 0.25)";
    ctx.lineWidth = 1;
    ctx.strokeRect(160, 355, 880, 100);

    // Exact Citation Requested
    ctx.fillStyle = "#2b0e25";
    ctx.font = "italic 21px Georgia, serif";
    ctx.fillText(
      "“Awarded to Laiba Mehboob for being 10/10 in beauty,",
      600,
      395
    );
    ctx.fillText(
      "100/10 in drama, and the uncontested Queen of Mehboob's Life.”",
      600,
      430
    );

    // Rating Badges
    const drawBadge = (text: string, x: number, y: number) => {
      ctx.save();
      ctx.fillStyle = "#fff0f5";
      ctx.strokeStyle = "rgba(184, 40, 88, 0.35)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(x - 140, y - 20, 280, 40, 20);
      } else {
        ctx.rect(x - 140, y - 20, 280, 40);
      }
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#801235";
      ctx.font = "bold 13px sans-serif";
      ctx.fillText(text, x, y + 5);
      ctx.restore();
    };
    drawBadge("👑 10/10 IN BEAUTY", 310, 510);
    drawBadge("🎭 100/10 IN DRAMA", 600, 510);
    drawBadge("♾️ UNCONTESTED QUEEN", 890, 510);

    // Description note
    ctx.fillStyle = "#4a1432";
    ctx.font = "15px Georgia, serif";
    ctx.fillText(
      "Certified with unconditional love, lifetime loyalty, and infinite affection.",
      600,
      585
    );
    ctx.fillText(
      "Issued with royal authority on September 10, 2026 • 23rd Birthday Royal Proclamation",
      600,
      610
    );

    // Bottom Line
    ctx.strokeStyle = "rgba(179, 130, 34, 0.35)";
    ctx.beginPath();
    ctx.moveTo(120, 645);
    ctx.lineTo(1080, 645);
    ctx.stroke();

    // Signature Left (Mehboob)
    ctx.fillStyle = "#801235";
    ctx.font = "italic bold 26px 'Brush Script MT', 'Dancing Script', cursive, serif";
    ctx.fillText("Mehboob Waqar", 300, 715);
    ctx.strokeStyle = "rgba(0,0,0,0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(200, 725);
    ctx.lineTo(400, 725);
    ctx.stroke();
    ctx.fillStyle = "#3b1029";
    ctx.font = "bold 12px sans-serif";
    ctx.fillText("Groom & Devoted Admirer ✍️", 300, 745);

    // Center Wax Seal
    ctx.save();
    ctx.fillStyle = "#801235";
    ctx.beginPath();
    ctx.arc(600, 710, 44, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffd700";
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.fillStyle = "#ffd700";
    ctx.font = "bold 10px sans-serif";
    ctx.fillText("OFFICIAL", 600, 695);
    ctx.fillText("SEAL", 600, 712);
    ctx.fillText("💍 2026", 600, 728);
    ctx.restore();

    // Signature Right (Royal Heart Council)
    ctx.fillStyle = "#801235";
    ctx.font = "italic bold 24px 'Brush Script MT', 'Dancing Script', cursive, serif";
    ctx.fillText("The Royal Heart Council", 900, 715);
    ctx.beginPath();
    ctx.moveTo(800, 725);
    ctx.lineTo(1000, 725);
    ctx.stroke();
    ctx.fillStyle = "#3b1029";
    ctx.font = "bold 12px sans-serif";
    ctx.fillText("Registered with Eternal Love ✍️", 900, 745);

    // Export and download
    const imageURI = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = imageURI;
    link.download = "Best_Wife_Award_Laiba_Mehboob.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  return (
    <section className="award-section" id="royal-award">
      <div className="award-container">
        {/* Main Page Teaser Case (Hidden until clicked) */}
        <div className="award-teaser-card">
          <div className="award-crown-icon">👑</div>
          <span className="award-confidential-badge">
            ⚜️ CONFIDENTIAL ROYAL PROCLAMATION ⚜️
          </span>
          <h2 className="award-teaser-title">
            The Official Royal Award for Laiba Mehboob
          </h2>
          <div className="section-divider" />
          <p className="award-teaser-desc">
            By supreme decree of the Royal Council of Mehboob&apos;s Heart, a formal lifetime honor has been officially ratified and sealed for you.
          </p>

          <button
            type="button"
            className="award-open-btn"
            onClick={handleOpenAward}
          >
            🏆 Break Seal &amp; Open Official Award ✨
          </button>
        </div>

        {/* Fullscreen Royal Award Presentation Modal */}
        {isAwardOpen && (
          <div className="award-modal-overlay" onClick={handleCloseAward}>
            <div
              className="award-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                className="award-close-btn"
                onClick={handleCloseAward}
                title="Close Award"
                aria-label="Close Award"
              >
                ✕
              </button>

              {/* Royal Certificate Paper */}
              <div className="award-certificate-frame">
                <div className="certificate-inner">
                  {/* Decorative Corner Ornaments */}
                  <span className="cert-corner cert-corner-tl">⚜️</span>
                  <span className="cert-corner cert-corner-tr">⚜️</span>
                  <span className="cert-corner cert-corner-bl">⚜️</span>
                  <span className="cert-corner cert-corner-br">⚜️</span>

                  <div className="cert-header">
                    <span className="cert-council">👑 THE SUPREME ROYAL COUNCIL OF MEHBOOB&apos;S HEART 👑</span>
                    <h3 className="cert-diploma-title">OFFICIAL DIPLOMA OF ETERNAL EXCELLENCE</h3>
                    <span className="cert-edition">2026 ROYAL BIRTHDAY EDITION • DIPLOMA NO. LM-QUEEN-001</span>
                  </div>

                  <div className="cert-divider-line" />

                  <p className="cert-conferred">
                    This highest royal honor in the cosmos is proudly conferred upon:
                  </p>

                  <h1 className="cert-recipient-name">LAIBA MEHBOOB</h1>
                  <span className="cert-sub-title">THE BEST WIFE IN THE ENTIRE UNIVERSE 🌟</span>

                  {/* Citation Box with exact user text */}
                  <div className="cert-citation-box">
                    <p className="cert-citation-text">
                      &ldquo;Awarded to <strong>Laiba Mehboob</strong> for being <strong>10/10 in beauty</strong>, <strong>100/10 in drama</strong>, and the <strong>uncontested Queen of Mehboob&apos;s Life</strong>.&rdquo;
                    </p>
                  </div>

                  {/* Official Score Badges */}
                  <div className="cert-badges-grid">
                    <div className="cert-score-pill">
                      <span className="score-icon">👑</span>
                      <span className="score-label">10/10 IN BEAUTY</span>
                    </div>
                    <div className="cert-score-pill">
                      <span className="score-icon">🎭</span>
                      <span className="score-label">100/10 IN DRAMA</span>
                    </div>
                    <div className="cert-score-pill highlight-pill">
                      <span className="score-icon">💍</span>
                      <span className="score-label">UNCONTESTED QUEEN</span>
                    </div>
                  </div>

                  <p className="cert-legal-text">
                    Ratified with infinite love, eternal adoration, and unconditional lifelong devotion on this 10th day of September, 2026.
                  </p>

                  {/* Signatures & Golden Wax Seal */}
                  <div className="cert-signatures-row">
                    <div className="cert-sig-box">
                      <span className="cert-sig-script">Mehboob Waqar</span>
                      <div className="cert-sig-line" />
                      <span className="cert-sig-role">Groom &amp; Devoted Admirer ✍️</span>
                    </div>

                    <div className="cert-wax-seal">
                      <div className="wax-seal-circle">
                        <span className="wax-seal-top">OFFICIAL</span>
                        <span className="wax-seal-heart">💍</span>
                        <span className="wax-seal-bottom">SEAL</span>
                      </div>
                    </div>

                    <div className="cert-sig-box">
                      <span className="cert-sig-script">The Royal Heart Council</span>
                      <div className="cert-sig-line" />
                      <span className="cert-sig-role">Registered with Eternal Love ✍️</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons Below Certificate */}
              <div className="award-actions-row">
                <button
                  type="button"
                  className="award-download-btn"
                  onClick={downloadAwardImage}
                >
                  📸 Save Image to Phone (Download)
                </button>

                <button
                  type="button"
                  className="award-modal-close-btn"
                  onClick={handleCloseAward}
                >
                  Close Award
                </button>
              </div>

              {downloadSuccess && (
                <div className="award-toast-msg">
                  🎉 Certificate saved to your device! Post it on your story/status! 💖
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Main Page ───
export default function BirthdayPage() {
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [isMidnightUnlocked, setIsMidnightUnlocked] = useState(false);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [sessionKey, setSessionKey] = useState(0);
  const [theme, setTheme] = useState<"original" | "light">("original");
  const confettiFired = useRef(false);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("birthday_theme");
      if (savedTheme === "light" || savedTheme === "original") {
        setTheme(savedTheme as "original" | "light");
        if (savedTheme === "light") {
          document.documentElement.setAttribute("data-theme", "light");
        } else {
          document.documentElement.removeAttribute("data-theme");
        }
      } else {
        document.documentElement.removeAttribute("data-theme");
      }

      if (sessionStorage.getItem("miang_password_verified") === "true") {
        setIsPasswordVerified(true);
      }
      if (sessionStorage.getItem("miang_midnight_bypassed") === "true" || isMidnightPassed()) {
        setIsMidnightUnlocked(true);
      }
    } catch { }
  }, []);

  const selectTheme = useCallback((target: "original" | "light") => {
    playAudioCue("twinkle");
    setTheme(target);
    try {
      localStorage.setItem("birthday_theme", target);
    } catch { }
    if (target === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, []);

  const isFullyUnlocked = isPasswordVerified && isMidnightUnlocked;

  // Lock body scroll and keep viewport at top when website is not fully unlocked
  useEffect(() => {
    if (!isFullyUnlocked) {
      document.body.classList.add("locked-body");
      window.scrollTo(0, 0);
    } else {
      document.body.classList.remove("locked-body");
    }
    return () => {
      document.body.classList.remove("locked-body");
    };
  }, [isFullyUnlocked]);

  const fireConfetti = useCallback(async () => {
    if (confettiFired.current) return;
    confettiFired.current = true;

    try {
      const confetti = (await import("canvas-confetti")).default;

      // Grand entrance confetti
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ["#ff0080", "#ff6b9d", "#ffd700", "#ce93d8", "#f48fb1", "#00f5ff"] });

      setTimeout(() => {
        confetti({ particleCount: 60, angle: 60, spread: 60, origin: { x: 0, y: 0.6 }, colors: ["#ff0080", "#ff6b9d", "#ffd700"] });
      }, 250);

      setTimeout(() => {
        confetti({ particleCount: 60, angle: 120, spread: 60, origin: { x: 1, y: 0.6 }, colors: ["#ce93d8", "#f48fb1", "#ffd700"] });
      }, 500);

      setTimeout(() => {
        confetti({ particleCount: 40, spread: 160, origin: { y: 0.35 }, shapes: ["star"], colors: ["#ffd700", "#fff176", "#00f5ff"], scalar: 1.5 });
      }, 900);

      // Extra sparkle burst
      setTimeout(() => {
        confetti({ particleCount: 80, spread: 100, origin: { y: 0.5 }, colors: ["#ff0080", "#ffd700", "#00f5ff"], scalar: 1.2 });
      }, 1400);
    } catch (e) {
      console.log("Confetti error:", e);
    }
  }, []);

  const handleEnvelopeOpen = useCallback(() => {
    setEnvelopeOpened(true);
    setTimeout(() => fireConfetti(), 900);
  }, [fireConfetti]);

  const handlePasswordVerified = useCallback(() => {
    try {
      sessionStorage.setItem("miang_password_verified", "true");
    } catch { }
    setIsPasswordVerified(true);
    if (sessionStorage.getItem("miang_midnight_bypassed") === "true" || isMidnightPassed()) {
      setIsMidnightUnlocked(true);
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const handleMidnightUnlock = useCallback(() => {
    setIsMidnightUnlocked(true);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const handleRelock = useCallback(() => {
    playAudioCue("cameraShutter");
    try {
      sessionStorage.removeItem("miang_password_verified");
      sessionStorage.removeItem("miang_midnight_bypassed");
    } catch { }
    setIsPasswordVerified(false);
    setIsMidnightUnlocked(false);
    setEnvelopeOpened(false);
    confettiFired.current = false;
    setSessionKey((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: "instant" });
    if (typeof document !== "undefined") {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, []);

  const [isFireworksActive, setIsFireworksActive] = useState(false);
  const age = getAge();

  return (
    <>
      <StarField />

      {/* Upper Theme Switcher Pill (Original vs Light) */}
      {!isFireworksActive && (
        <div className="top-theme-switcher" role="group" aria-label="Color Theme Switcher">
          <button
            type="button"
            className={`theme-segment-btn ${theme === "original" ? "active" : ""}`}
            onClick={() => selectTheme("original")}
          >
            Original
          </button>
          <button
            type="button"
            className={`theme-segment-btn ${theme === "light" ? "active" : ""}`}
            onClick={() => selectTheme("light")}
          >
            Light
          </button>
        </div>
      )}

      {/* Quick Floating Lock Button */}
      {isFullyUnlocked && !isFireworksActive && (
        <button
          className="floating-lock-btn"
          onClick={handleRelock}
          title="Lock Website"
          aria-label="Lock Website"
        >
          <span>🔒</span>
          <span>Lock</span>
        </button>
      )}

      {/* Step 1: Secret Password Gate (Password: nono) */}
      {!isPasswordVerified && (
        <PasswordGate
          key={`gate-${sessionKey}`}
          onUnlock={handlePasswordVerified}
        />
      )}

      {/* Step 2: Midnight Countdown Gate (with Skip Button for MianG) */}
      {isPasswordVerified && !isMidnightUnlocked && (
        <MidnightCountdownGate
          key={`midnight-${sessionKey}`}
          onUnlock={handleMidnightUnlock}
        />
      )}

      {/* Step 3: Celebration Envelope & Website Content */}
      {isFullyUnlocked && (
        <>
          <EnvelopeIntro
            key={`envelope-${sessionKey}`}
            onOpen={handleEnvelopeOpen}
          />

          <main key={`main-${sessionKey}`}>
            {/* ─── Hero Section ─── */}
            <section className="hero-section">
              <FloatingHearts />
              <div className="hero-content">
                <div className="birthday-badge">
                  <span className="badge-sparkle">✨</span>
                  <span className="badge-emoji">🎂</span>
                  <span className="badge-text">Happy Birthday</span>
                  <span className="badge-emoji">🎂</span>
                  <span className="badge-sparkle">✨</span>
                </div>
                <div className="hero-title-wrapper">
                  <h1 className="hero-title">{BIRTHDAY_NAME}</h1>
                </div>
                <p className="hero-subtitle">✨ The Most Beautiful Soul ✨</p>
                <p className="hero-age-line">
                  Celebrating <span>{age}</span> Years of Pure Magic
                </p>
                <p className="hero-message">
                  A special birthday celebration for the most amazing person — <strong className="sweet-potato-highlight">Moiiiiiiii Wifey G</strong>! It&apos;s the <strong>{age}rd Birthday</strong> of my Sweet potato 🎂💖 Today and always, you deserve all the love, all the stars, and all the happiness in the entire universe. ✨
                </p>
                <button
                  className="cta-button"
                  onClick={() => {
                    playAudioCue("twinkle");
                    document.getElementById("qualities")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  🌟 Explore Your Surprises 🌟
                </button>
              </div>
              <div
                className="scroll-indicator"
                onClick={() => {
                  playAudioCue("twinkle");
                  document.getElementById("qualities")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <span />
              </div>
            </section>

            {/* ─── Qualities ─── */}
            <QualitiesSection />

            {/* ─── Cake ─── */}
            <CakeSection />

            {/* ─── Reasons ─── */}
            <ReasonsSection />

            {/* ─── Love Letter ─── */}
            <LoveLetter />

            {/* ─── Photo Memories ─── */}
            <PhotoMemories />

            {/* ─── Surprise Gift ─── */}
            <GiftSection onFireworksChange={setIsFireworksActive} />

            {/* ─── Special Quiz for You ─── */}
            <SpecialQuizSection />

            {/* ─── Romantic Scratch-Off Vouchers ─── */}
            <VouchersSection />

            {/* ─── Timeline ─── */}
            <Timeline />

            {/* ─── Best Wife of the Universe - Official Royal Award ─── */}
            <BestWifeAwardSection />

            {/* ─── Live Love Clock (Since 04 April 2024) ─── */}
            <LoveClockSection />

            {/* ─── Footer ─── */}
            <footer className="footer">
              <div className="footer-hearts">💖💕💗💝💖</div>
              <p className="footer-text">Made with all my love for you, {BIRTHDAY_NAME} 🌹</p>
              <p className="footer-sub">You are my everything, my forever, my always 💍</p>
              <p className="footer-year">
                Happy {age}{getOrdinal(age)} Birthday • September 10, {BIRTHDAY_YEAR} 💫
              </p>
              <button
                className="relock-btn"
                onClick={handleRelock}
                title="Click to lock again"
              >
                🔒 Lock Website
              </button>
              <span className="footer-infinity">∞</span>
            </footer>
          </main>
        </>
      )}
    </>
  );
}
