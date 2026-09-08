"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";

// ─── Birthday Config ───
const BIRTHDAY_NAME = "Laiba Ahmad";
const BIRTHDAY_DATE = new Date("2003-09-10");
const BIRTHDAY_YEAR = 2026;
const SECRET_PASSWORD = "MianG";

// ─── Audio Tone Effects (Web Audio API) ───
function playAudioCue(type: "success" | "wrong" | "kiss") {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (type === "wrong") {
      // Funny buzzer / boing sound
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
    } else if (type === "kiss") {
      // Sweet kiss "mwah" smack pop sound
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
    } else {
      // Royal sweet victory chord (C5, E5, G5, C6)
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
    try {
      sessionStorage.setItem("miang_midnight_bypassed", "true");
    } catch { }
    onUnlock();
  };

  return (
    <div className="midnight-gate-overlay">
      <div className="midnight-stars" />
      <div className="midnight-gate-card">
        <div className="midnight-crown-icon">👑</div>
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

        {/* Discreet preview button for Mehboob Waqar to test anytime */}
        <div className="midnight-admin-area">
          <button
            type="button"
            className="midnight-preview-btn"
            onClick={handleManualPreview}
            title="MianG Testing Preview"
          >
            👑 MianG Preview (Test Mode)
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Qualities Section (Interactive Kiss Emojis 😘) ───
interface ScreenKiss {
  id: string;
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

  const [activeKisses, setActiveKisses] = useState<ScreenKiss[]>([]);
  const [clickedCardIdx, setClickedCardIdx] = useState<number | null>(null);
  const kissTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCardClick = (idx: number) => {
    setClickedCardIdx(idx);
    setTimeout(() => setClickedCardIdx(null), 500);

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

    // Play kiss audio cues matching count
    playAudioCue("kiss");
    if (count > 1) {
      setTimeout(() => playAudioCue("kiss"), 140);
    }
    if (count > 2) {
      setTimeout(() => playAudioCue("kiss"), 280);
    }

    // Generate positions for 1, 2, 3, or 4 kissing face emojis (😘)
    const now = Date.now();
    let newKisses: ScreenKiss[] = [];
    const jitter = () => (Math.random() - 0.5) * 8;

    if (count === 1) {
      newKisses = [
        { id: `${now}-0`, x: 50 + jitter(), y: 46 + jitter(), scale: 1.15, delay: 0 },
      ];
    } else if (count === 2) {
      newKisses = [
        { id: `${now}-0`, x: 38 + jitter(), y: 45 + jitter(), scale: 1.05, delay: 0 },
        { id: `${now}-1`, x: 62 + jitter(), y: 48 + jitter(), scale: 1.08, delay: 0.14 },
      ];
    } else if (count === 3) {
      newKisses = [
        { id: `${now}-0`, x: 30 + jitter(), y: 44 + jitter(), scale: 1.0, delay: 0 },
        { id: `${now}-1`, x: 70 + jitter(), y: 46 + jitter(), scale: 1.05, delay: 0.12 },
        { id: `${now}-2`, x: 50 + jitter(), y: 36 + jitter(), scale: 1.1, delay: 0.24 },
      ];
    } else {
      // 4 kisses
      newKisses = [
        { id: `${now}-0`, x: 28 + jitter(), y: 40 + jitter(), scale: 0.95, delay: 0 },
        { id: `${now}-1`, x: 72 + jitter(), y: 43 + jitter(), scale: 1.0, delay: 0.1 },
        { id: `${now}-2`, x: 42 + jitter(), y: 54 + jitter(), scale: 1.05, delay: 0.22 },
        { id: `${now}-3`, x: 58 + jitter(), y: 33 + jitter(), scale: 1.0, delay: 0.32 },
      ];
    }

    setActiveKisses(newKisses);

    if (kissTimeoutRef.current) clearTimeout(kissTimeoutRef.current);
    kissTimeoutRef.current = setTimeout(() => {
      setActiveKisses([]);
    }, 2200);
  };

  return (
    <section className="qualities-section" id="qualities">
      <h2 className="section-title">👑 Words That Describe You 👑</h2>
      <div className="section-divider" />
      <p className="qualities-hint">
        ✨ Tap any card for sweet kisses! <span className="hint-kiss">😘</span>
      </p>
      <div className="qualities-grid">
        {qualities.map((q, i) => (
          <div
            className={`quality-card ${clickedCardIdx === i ? "card-kissed" : ""}`}
            key={i}
            onClick={() => handleCardClick(i)}
            role="button"
            tabIndex={0}
            title={`Tap for kisses for ${q.word}! 😘`}
          >
            <span className="card-tap-kiss" aria-hidden="true">😘</span>
            <span className="quality-emoji">{q.emoji}</span>
            <span className="quality-word">{q.word}</span>
          </div>
        ))}
      </div>

      {/* Full Screen Kiss Emoji Overlay (😘 with flying heart 💖) */}
      {activeKisses.length > 0 && (
        <div className="screen-kiss-overlay" aria-hidden="true">
          {activeKisses.map((kiss) => (
            <div
              key={kiss.id}
              className="screen-kiss-item"
              style={{
                left: `${kiss.x}%`,
                top: `${kiss.y}%`,
                animationDelay: `${kiss.delay}s`,
                transform: `translate(-50%, -50%) scale(${kiss.scale})`,
              }}
            >
              <span className="screen-kiss-face">😘</span>
              <span className="screen-kiss-heart">💖</span>
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
    if (candlesBlown) return;
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
      <h2 className="section-title">💕 10 Reasons You&apos;re Amazing 💕</h2>
      <div className="section-divider" />
      <div className="reasons-container">
        {reasons.map((reason, i) => (
          <div className="reason-item" key={i}>
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
    playAudioCue("success");

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

// ─── Timeline Section ───
// ─── Timeline Section (Our Journey & Meetups) ───
function Timeline() {
  const age = getAge();
  const [timelineModalIndex, setTimelineModalIndex] = useState<number | null>(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);
  const [failedPhotos, setFailedPhotos] = useState<Record<string, boolean>>({});
  const [loadedPhotos, setLoadedPhotos] = useState<Record<string, boolean>>({});

  const milestones = [
    {
      id: 1,
      emoji: "👶",
      badge: "Blessed Beginning",
      title: "The Day My Angel Was Born",
      date: "September 10, 2003",
      text: "Wo khubsurat din jab Allah Pak ne meri pyari Laiba ko is duniya mein bheja — meri poori kainaat aur meri zindagi ka noor! ❤️",
      photos: ["/timeline/1.jpg", "/timeline/1_2.jpg", "/timeline/1_3.jpg", "/timeline/1_4.jpg"],
    },
    {
      id: 2,
      emoji: "😘",
      badge: "The Spark",
      title: "Where It All Started ('This way 😘')",
      date: "The Beginning",
      text: "'This way 😘' se shuru hone wali baat jo aahista aahista meri poori rooh, meri saans aur meri zindagi ban gayi.",
      photos: ["/timeline/2.jpg", "/timeline/2_2.jpg", "/timeline/2_3.jpg", "/timeline/2_4.jpg"],
    },
    {
      id: 3,
      emoji: "🌸",
      badge: "Pehli Mulakat",
      title: "Our Very First Meetup",
      date: "First Time In Person",
      text: "Pehli dafa aamne saamne dekh kar dil ki jo halat thi... aankhon mein sharm, chehre par muskurahat aur dharhkan tez! Wo lamha hamesha dil mein zinda hai.",
      photos: ["/timeline/3.jpg", "/timeline/3_2.jpg", "/timeline/3_3.jpg", "/timeline/3_4.jpg"],
    },
    {
      id: 4,
      emoji: "🍨",
      badge: "Random Sweet Day",
      title: "Ice Cream & Endless Talks",
      date: "Sweet Memories",
      text: "Bina kisi plan ke milna, ice cream khana, be-matlab ki baatein aur ghanton ek doosre ki aankhon mein dekhte rehna.",
      photos: ["/timeline/4.jpg", "/timeline/4_2.jpg", "/timeline/4_3.jpg", "/timeline/4_4.jpg"],
    },
    {
      id: 5,
      emoji: "💍",
      badge: "Sacred Bond",
      title: "Bound in Sacred Love & Nikah",
      date: "Milestone of Hearts",
      text: "Wo muqaddas din jab hum hamesha ke liye ek pakke aur pak rishte mein bandh gaye — Meri Official Wifey, Laiba Mehboob!",
      photos: ["/timeline/5.jpg", "/timeline/5_2.jpg", "/timeline/5_3.jpg", "/timeline/5_4.jpg"],
    },
    {
      id: 6,
      emoji: "🎂",
      badge: "1st Birthday Together",
      title: "Our 1st Birthday Celebrated Together",
      date: "September 10, 2024",
      text: "Ek ek din gin kar intezar kiya tha — dulha dulhan ko dekh kar ek hone ke khwaab dekhe aur khushiyon bhari duayein mangi theen.",
      photos: ["/timeline/6.jpg", "/timeline/6_2.jpg", "/timeline/6_3.jpg", "/timeline/6_4.jpg"],
    },
    {
      id: 7,
      emoji: "🚗",
      badge: "Lambi Drive Meetup",
      title: "Late Night Drive & Cold Breeze",
      date: "Cherished Moments",
      text: "Gaadi ki khirki se aati thandi hawa, slow music, tumhara hath mere hath mein aur be-panaah sukoon ka ehsaas.",
      photos: ["/timeline/7.jpg", "/timeline/7_2.jpg", "/timeline/7_3.jpg", "/timeline/7_4.jpg"],
    },
    {
      id: 8,
      emoji: "☕",
      badge: "Pure Sukoon",
      title: "Rainy Day Chai & Heartfelt Talks",
      date: "Peaceful Evening",
      text: "Duniya ki har fikar se be-parwah, sirf tum aur main... asy jasy 'Majjjaa a gyaaaa Yaar life ka!' Har lamha khubsurat!",
      photos: ["/timeline/8.jpg", "/timeline/8_2.jpg", "/timeline/8_3.jpg", "/timeline/8_4.jpg"],
    },
    {
      id: 9,
      emoji: "👑",
      badge: "2nd Birthday Together",
      title: "Our 2nd Birthday Together",
      date: "September 10, 2025",
      text: "Shukar Alhamdulillah ke meri wifey Laiba Mehboob ban chuki theen — Meri Mallika, Meri Jaan ke sath zindagi ka sab se haseen saal!",
      photos: ["/timeline/9.jpg", "/timeline/9_2.jpg", "/timeline/9_3.jpg", "/timeline/9_4.jpg"],
    },
    {
      id: 10,
      emoji: "🛍️",
      badge: "Happy Little Outing",
      title: "Shopping & Walking Hand in Hand",
      date: "Fun Times Together",
      text: "Sath ghoomna, choti choti baaton par khilkhila kar hansna, tumhari pasand ki shopping aur hath tham kar chalna.",
      photos: ["/timeline/10.jpg", "/timeline/10_2.jpg", "/timeline/10_3.jpg", "/timeline/10_4.jpg"],
    },
    {
      id: 11,
      emoji: "🥺",
      badge: "Aakhri Mulakat",
      title: "Last Meetup (Jaane Se Pehle) 💔",
      date: "Memorable Goodbye",
      text: "Rukhsat hone se pehle ki aakhri mulakat... bhari aankhein, nam dil, par dil mein hamesha ke liye ek doosre ka sath aur intezar ka pakka wada.",
      photos: ["/timeline/11.jpg", "/timeline/11_2.jpg", "/timeline/11_3.jpg", "/timeline/11_4.jpg"],
    },
    {
      id: 12,
      emoji: "💖",
      badge: "Turning 23 🎉",
      title: `3rd Birthday Together (Turning ${age})`,
      date: `September 10, ${BIRTHDAY_YEAR}`,
      text: `23 saal ki meri haseen Begum! Faslay chahe jitne bhi hon, dilon ka fasla koi nahi — Forever & Always Mahol pura wavy!`,
      photos: ["/timeline/12.jpg", "/timeline/12_2.jpg", "/timeline/12_3.jpg", "/timeline/12_4.jpg"],
    },
  ];

  // Pre-probe candidate images to detect which ones exist
  useEffect(() => {
    if (typeof window === "undefined") return;
    milestones.forEach((item) => {
      item.photos.forEach((url) => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          setLoadedPhotos((prev) => ({ ...prev, [url]: true }));
        };
        img.onerror = () => {
          setFailedPhotos((prev) => ({ ...prev, [url]: true }));
        };
      });
    });
  }, []);

  const openModal = (index: number) => {
    setTimelineModalIndex(index);
    setActivePhotoIdx(0);
  };

  const currentMilestone = timelineModalIndex !== null ? milestones[timelineModalIndex] : null;

  // Compute available photos for current milestone
  const currentValidPhotos = currentMilestone
    ? currentMilestone.photos.filter((url) => loadedPhotos[url] || (!failedPhotos[url] && url === currentMilestone.photos[0]))
    : [];

  const currentPhotoUrl = currentValidPhotos[activePhotoIdx] || (currentMilestone ? currentMilestone.photos[0] : "");
  const hasAnyLoaded = currentMilestone ? currentMilestone.photos.some((url) => loadedPhotos[url]) : false;
  const isCurrentFailed = failedPhotos[currentPhotoUrl] && !hasAnyLoaded;

  const goToPrevPhoto = useCallback(() => {
    if (!currentValidPhotos.length) return;
    setActivePhotoIdx((prev) => (prev > 0 ? prev - 1 : currentValidPhotos.length - 1));
  }, [currentValidPhotos.length]);

  const goToNextPhoto = useCallback(() => {
    if (!currentValidPhotos.length) return;
    setActivePhotoIdx((prev) => (prev < currentValidPhotos.length - 1 ? prev + 1 : 0));
  }, [currentValidPhotos.length]);

  const goToPrevChapter = useCallback(() => {
    setTimelineModalIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : milestones.length - 1));
    setActivePhotoIdx(0);
  }, [milestones.length]);

  const goToNextChapter = useCallback(() => {
    setTimelineModalIndex((prev) => (prev !== null && prev < milestones.length - 1 ? prev + 1 : 0));
    setActivePhotoIdx(0);
  }, [milestones.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (timelineModalIndex === null) return;
      if (e.key === "Escape") setTimelineModalIndex(null);
      if (e.key === "ArrowLeft") {
        if (currentValidPhotos.length > 1) {
          goToPrevPhoto();
        } else {
          goToPrevChapter();
        }
      }
      if (e.key === "ArrowRight") {
        if (currentValidPhotos.length > 1) {
          goToNextPhoto();
        } else {
          goToNextChapter();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [timelineModalIndex, currentValidPhotos.length, goToPrevPhoto, goToNextPhoto, goToPrevChapter, goToNextChapter]);

  return (
    <section className="timeline-section" id="timeline">
      <h2 className="section-title">✨ Our Beautiful Story ✨</h2>
      <p className="timeline-hint">Tap any chapter to view photos &amp; memories 📸</p>
      <div className="section-divider" />

      <div className="timeline">
        {milestones.map((item, i) => {
          const loadedCount = item.photos.filter((url) => loadedPhotos[url]).length;
          const primaryUrl = item.photos[0];
          const isPrimaryFailed = failedPhotos[primaryUrl] && loadedCount === 0;

          return (
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

                <div className="timeline-photo-box">
                  {loadedCount > 1 && (
                    <span className="timeline-multi-badge">
                      📸 {loadedCount} Photos
                    </span>
                  )}

                  {!isPrimaryFailed ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={primaryUrl}
                      alt={item.title}
                      loading="lazy"
                      onLoad={() => setLoadedPhotos((prev) => ({ ...prev, [primaryUrl]: true }))}
                      onError={() => setFailedPhotos((prev) => ({ ...prev, [primaryUrl]: true }))}
                    />
                  ) : (
                    <div className="timeline-photo-placeholder">
                      <span className="placeholder-icon">📸</span>
                      <span className="placeholder-text">Meetup #{item.id} • Tap to view</span>
                    </div>
                  )}
                  <div className="timeline-photo-overlay">
                    <span>🔍 Tap to view gallery</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Timeline Multi-Photo Lightbox Modal ─── */}
      {timelineModalIndex !== null && currentMilestone && (
        <div className="lightbox-overlay" onClick={() => setTimelineModalIndex(null)}>
          <div
            className="lightbox-content timeline-lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="lightbox-close"
              onClick={() => setTimelineModalIndex(null)}
              aria-label="Close"
            >
              ✕
            </button>

            <div className="timeline-modal-body">
              {/* Photo Area with Next/Prev Arrows if Multiple Photos */}
              <div className="timeline-photo-slider-area">
                {currentValidPhotos.length > 1 && (
                  <button
                    className="timeline-photo-nav timeline-photo-prev"
                    onClick={goToPrevPhoto}
                    aria-label="Previous photo"
                  >
                    ‹
                  </button>
                )}

                {!isCurrentFailed && currentPhotoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={currentPhotoUrl}
                    alt={`${currentMilestone.title} - Photo ${activePhotoIdx + 1}`}
                    className="timeline-modal-img"
                    onLoad={() => setLoadedPhotos((prev) => ({ ...prev, [currentPhotoUrl]: true }))}
                    onError={() => setFailedPhotos((prev) => ({ ...prev, [currentPhotoUrl]: true }))}
                  />
                ) : (
                  <div className="timeline-modal-placeholder">
                    <span className="modal-placeholder-emoji">
                      {currentMilestone.emoji}
                    </span>
                    <p className="modal-placeholder-tip">
                      📸 Add photo(s) for this meetup in:<br />
                      <code>public/timeline/{currentMilestone.id}.jpg</code><br />
                      <code>public/timeline/{currentMilestone.id}_2.jpg (extra)</code>
                    </p>
                  </div>
                )}

                {currentValidPhotos.length > 1 && (
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
              {currentValidPhotos.length > 1 && (
                <>
                  <span className="timeline-photo-counter">
                    Photo {activePhotoIdx + 1} of {currentValidPhotos.length}
                  </span>
                  <div className="timeline-thumb-strip">
                    {currentValidPhotos.map((url, idx) => (
                      <button
                        key={url}
                        type="button"
                        className={`timeline-thumb-btn ${idx === activePhotoIdx ? "active" : ""}`}
                        onClick={() => setActivePhotoIdx(idx)}
                        title={`View photo ${idx + 1}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt={`Thumbnail ${idx + 1}`} />
                      </button>
                    ))}
                  </div>
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
    if (opened) return;
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

// ─── Photo Memories Section ───
function PhotoMemories() {
  const TOTAL_PHOTOS = 25;
  const [revealedCards, setRevealedCards] = useState<Set<number>>(new Set());
  const [justRevealed, setJustRevealed] = useState<number | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const mysteryEmojis = ["💖", "🎁", "💝", "🌹", "✨", "💕", "🦋", "🌸", "💫", "🎀",
    "💎", "🌺", "⭐", "🌷", "💗", "🎂", "👑", "🌟", "💐", "🎉",
    "🥰", "💘", "🌈", "🎊", "💞"];

  const captions = [
    "Our beautiful moment 💕", "Together forever 💖", "My favorite person 🌹",
    "Love at first sight 💫", "You & Me ✨", "Perfect together 💝",
    "My sunshine 🌟", "Sweet memories 🦋", "Us forever 💕", "Best day ever 🎀",
    "My heart 💖", "Beautiful us 🌸", "Always & forever 💫", "Our story 💝",
    "My everything ✨", "Love you 🌹", "Priceless moment 💎", "My queen 👑",
    "Together 💕", "Our journey 🌟", "Soulmates 💖", "My world 🌸",
    "Forever yours 💫", "Made for each other 💝", "The best of us ✨"
  ];

  const handleReveal = useCallback(async (index: number) => {
    if (revealedCards.has(index)) {
      // Already revealed — open lightbox
      setLightboxIndex(index);
      return;
    }
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

  const handleRevealAll = useCallback(async () => {
    const allCards = new Set(Array.from({ length: TOTAL_PHOTOS }, (_, i) => i));
    setRevealedCards(allCards);
    try {
      const confetti = (await import("canvas-confetti")).default;
      confetti({ particleCount: 100, spread: 120, origin: { y: 0.5 }, colors: ["#ff0080", "#ffd700", "#ce93d8", "#00f5ff"] });
    } catch (_) { }
  }, []);

  // Lightbox navigation (only among revealed cards)
  const revealedList = Array.from(revealedCards).sort((a, b) => a - b);

  const goToNext = useCallback(() => {
    if (lightboxIndex === null) return;
    const curPos = revealedList.indexOf(lightboxIndex);
    if (curPos < revealedList.length - 1) setLightboxIndex(revealedList[curPos + 1]);
    else setLightboxIndex(revealedList[0]); // wrap
  }, [lightboxIndex, revealedList]);

  const goToPrev = useCallback(() => {
    if (lightboxIndex === null) return;
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
        <h2 className="section-title">📸 Our Beautiful Memories 📸</h2>
        <div className="section-divider" />

        <div style={{ position: "relative", zIndex: 1 }}>
          <span className="memories-counter">
            💖 Revealed: <span className="count-num">{revealedCards.size}</span> / {TOTAL_PHOTOS}
          </span>
        </div>

        <div className="memories-grid">
          {Array.from({ length: TOTAL_PHOTOS }, (_, i) => {
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
                    <span className="mystery-emoji">{mysteryEmojis[i]}</span>
                    <span className="mystery-text">Tap to reveal</span>
                  </div>
                  {/* Back - Photo */}
                  <div className="memory-card-back">
                    {isRevealed && (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`/photos/${i + 1}.jpg`}
                          alt={`Memory ${i + 1}`}
                          loading="lazy"
                        />
                        <div className="photo-overlay">
                          <span className="photo-caption">{captions[i]}</span>
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
        <div className="lightbox-overlay" onClick={() => setLightboxIndex(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightboxIndex(null)}>✕</button>
            {revealedList.length > 1 && (
              <button className="lightbox-nav prev" onClick={goToPrev}>‹</button>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/photos/${lightboxIndex + 1}.jpg`}
              alt={`Memory ${lightboxIndex + 1}`}
            />
            <p className="lightbox-caption">{captions[lightboxIndex]}</p>
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
                  onClick={() => setShowPassword(!showPassword)}
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
                onClick={() => setShowHint(!showHint)}
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
                      <em>(Jo aap mujhe pyaar se bulati ho... Starts with <strong>M</strong>)</em>
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
      if (isMidnightPassed()) {
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
    if (isMidnightPassed()) {
      setIsMidnightUnlocked(true);
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const handleMidnightUnlock = useCallback(() => {
    setIsMidnightUnlocked(true);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const handleRelock = useCallback(() => {
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

      {/* Step 1: Secret Password Gate (MUST ENTER PASSWORD) */}
      {!isPasswordVerified && (
        <PasswordGate
          key={`gate-${sessionKey}`}
          onUnlock={handlePasswordVerified}
        />
      )}

      {/* Step 2: Midnight Countdown Gate (AFTER PASSWORD, UNTIL MIDNIGHT) */}
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
                  onClick={() => document.getElementById("qualities")?.scrollIntoView({ behavior: "smooth" })}
                >
                  🌟 Explore Your Surprises 🌟
                </button>
              </div>
              <div
                className="scroll-indicator"
                onClick={() => document.getElementById("qualities")?.scrollIntoView({ behavior: "smooth" })}
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
