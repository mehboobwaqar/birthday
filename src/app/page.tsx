"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";

// ─── Birthday Config ───
const BIRTHDAY_NAME = "Laiba Ahmad";
const BIRTHDAY_DATE = new Date("2003-09-10");
const BIRTHDAY_YEAR = 2026;
const SECRET_PASSWORD = "nono";

// ─── Audio Tone Effects (Web Audio API) ───
type AudioCueType =
  | "envelopeOpen"
  | "candleBlow"
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
  | "quizYes";

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

// ─── Cake Section with Interactive Candles ───
function CakeSection() {
  const [candlesBlown, setCandlesBlown] = useState(false);
  const age = getAge();

  const handleBlowCandles = useCallback(async () => {
    if (candlesBlown) {
      playAudioCue("twinkle");
      return;
    }
    playAudioCue("candleBlow");
    setCandlesBlown(true);
    try {
      const confetti = (await import("canvas-confetti")).default;
      // Multi-burst celebration
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          confetti({
            particleCount: 80,
            spread: 100 + i * 20,
            origin: { y: 0.5, x: 0.3 + Math.random() * 0.4 },
            colors: ["#ff0080", "#ffd700", "#ff6b9d", "#ce93d8", "#00f5ff"],
          });
        }, i * 300);
      }
    } catch (e) {
      console.log("Confetti error:", e);
    }
  }, [candlesBlown]);

  return (
    <section className="cake-section" id="cake">
      <h2 className="section-title">🎂 Make a Wish, Wifeyyy G! 🎂</h2>
      <div className="section-divider" />

      {!candlesBlown && (
        <div className="candles-row">
          {Array.from({ length: 7 }, (_, i) => (
            <div className="candle" key={i}>
              <span className="candle-flame">🔥</span>
              <div className="candle-stick" />
            </div>
          ))}
        </div>
      )}

      <div className="cake-container" onClick={handleBlowCandles}>
        <span className="cake-emoji">{candlesBlown ? "🎉" : "🎂"}</span>
        <div className="cake-glow" />
      </div>

      <div className="age-badge">{age}</div>

      <button className={`blow-candles-btn ${candlesBlown ? "blown" : ""}`} onClick={handleBlowCandles}>
        {candlesBlown ? "🎉 Wish Made! 🎉" : "💨 Blow the Candles!"}
      </button>

      <p className="cake-message" style={{ marginTop: "1.5rem" }}>
        {candlesBlown
          ? `Every wish you make deserves to come true, Laiba! ✨ Here's to an incredible year of being ${age}! 🌟`
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
      title: `Turning ${age} — Today's Grand Celebration! 🎂👑`,
      date: `September 10, ${BIRTHDAY_YEAR}`,
      text: `23rd Birthday Mubarak ho meri jaan, meri rani, meri cutie puttiteeee! Aaj ka din sab se bada celebration hai... Abhi to cake katna, full party aur photoshoot baqi hai! 💖👑`,
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
              className="timeline-content"
              onClick={() => openModal(i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
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

              {item.isComingSoon || item.photos.length === 0 ? (
                <div className="timeline-photo-box timeline-coming-soon-card">
                  <div className="coming-soon-preview-content">
                    <div className="coming-soon-camera-bounce">📸🎂✨</div>
                    <span className="coming-soon-badge">🎂 23rd Birthday Photoshoot</span>
                    <p className="coming-soon-teaser">
                      &ldquo;Pics Coming Soon... Abhi to cake katna aur cute photos lena baqi hai! 🙈💖&rdquo;
                    </p>
                    <span className="coming-soon-tap-hint">🔍 Tap to open surprise ✨</span>
                  </div>
                </div>
              ) : (
                <div className="timeline-photo-box">
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
                </div>
              )}
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
                <div className="timeline-coming-soon-box">
                  <div className="coming-soon-icon">📸✨🎂</div>
                  <h4 className="coming-soon-title">23rd Birthday Photoshoot — Coming Soon!</h4>
                  <p className="coming-soon-text">
                    Aree sabar meri jaan! 🙈 Abhi to 23 saal ki hui ho! Pehle cake kato, cute si birthday dress pehno aur pyari pyari poses do... Uske baad hamari 23rd Birthday ki grand pictures yahan upload hongi! 😉💖📸
                  </p>
                  <div className="coming-soon-status">
                    <span className="status-dot pulse" />
                    <span>Status: Birthday Photoshoot in progress... 99% ⏳</span>
                  </div>
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

// ─── Surprise Gift Section ───
function GiftSection() {
  const [opened, setOpened] = useState(false);

  const handleOpen = useCallback(async () => {
    if (opened) {
      playAudioCue("heartPop");
      return;
    }
    playAudioCue("giftOpen");
    setOpened(true);
    try {
      const confetti = (await import("canvas-confetti")).default;
      // Heart-shaped confetti
      const heart = confetti.shapeFromPath({ path: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" });
      confetti({ shapes: [heart], particleCount: 60, spread: 100, origin: { y: 0.5 }, scalar: 2, colors: ["#ff0080", "#ff6b9d", "#ffd700"] });
      setTimeout(() => {
        confetti({ particleCount: 100, spread: 160, origin: { y: 0.6 }, colors: ["#ff0080", "#ffd700", "#ce93d8", "#00f5ff"] });
      }, 500);
    } catch (e) {
      console.log("Confetti error:", e);
    }
  }, [opened]);

  return (
    <section className="gift-section" id="gift">
      <h2 className="section-title">🎁 A Surprise for You 🎁</h2>
      <div className="section-divider" />

      <div className={`gift-box ${opened ? "opened" : ""}`} onClick={handleOpen}>
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
        </div>
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

// ─── Main Page ───
export default function BirthdayPage() {
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [isMidnightUnlocked, setIsMidnightUnlocked] = useState(false);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [sessionKey, setSessionKey] = useState(0);
  const confettiFired = useRef(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("miang_password_verified") === "true") {
        setIsPasswordVerified(true);
      }
      if (sessionStorage.getItem("miang_midnight_bypassed") === "true" || isMidnightPassed()) {
        setIsMidnightUnlocked(true);
      }
    } catch { }
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

  const age = getAge();

  return (
    <>
      <StarField />

      {/* Quick Floating Lock Button */}
      {isFullyUnlocked && (
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
            <GiftSection />

            {/* ─── Special Quiz for You ─── */}
            <SpecialQuizSection />

            {/* ─── Timeline ─── */}
            <Timeline />

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
