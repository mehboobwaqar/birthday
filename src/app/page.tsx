"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";

// ─── Birthday Config ───
const BIRTHDAY_NAME = "Laiba Ahmad";
const BIRTHDAY_DATE = new Date("2003-09-10");
const BIRTHDAY_YEAR = 2026;
const SECRET_PASSWORD = "MianG";

// ─── Audio Tone Effects (Web Audio API) ───
function playAudioCue(type: "success" | "wrong") {
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

// ─── Countdown Component ───
function Countdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isBirthday, setIsBirthday] = useState(false);

  useEffect(() => {
    function update() {
      const now = new Date();
      if (now.getMonth() === BIRTHDAY_DATE.getMonth() && now.getDate() === BIRTHDAY_DATE.getDate()) {
        setIsBirthday(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const target = getNextBirthday();
      const diff = target.getTime() - now.getTime();
      if (diff <= 0) { setIsBirthday(true); return; }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const age = getAge();

  return (
    <section className="countdown-section" id="countdown">
      <h2 className="section-title">
        {isBirthday ? "🎉 It's Her Special Day! 🎉" : "✨ The Countdown Has Begun ✨"}
      </h2>
      <div className="section-divider" />
      {!isBirthday ? (
        <div className="countdown-container">
          {[
            { value: timeLeft.days, label: "Days" },
            { value: timeLeft.hours, label: "Hours" },
            { value: timeLeft.minutes, label: "Minutes" },
            { value: timeLeft.seconds, label: "Seconds" },
          ].map((item) => (
            <div className="countdown-item" key={item.label}>
              <div className="countdown-number">{String(item.value).padStart(2, "0")}</div>
              <div className="countdown-label">{item.label}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="birthday-active-message">
          🎂 Happy {age}{getOrdinal(age)} Birthday, {BIRTHDAY_NAME}! 🎂
        </div>
      )}
    </section>
  );
}

// ─── Qualities Section ───
function QualitiesSection() {
  const qualities = [
    { emoji: "👑", word: "Queen" },
    { emoji: "🌹", word: "Beautiful" },
    { emoji: "💎", word: "Precious" },
    { emoji: "🦋", word: "Graceful" },
    { emoji: "⭐", word: "Amazing" },
    { emoji: "🌸", word: "Kind" },
    { emoji: "💖", word: "Loving" },
    { emoji: "✨", word: "Magical" },
    { emoji: "🌺", word: "Stunning" },
    { emoji: "🎀", word: "Perfect" },
    { emoji: "💫", word: "Radiant" },
    { emoji: "🌷", word: "Elegant" },
  ];

  return (
    <section className="qualities-section" id="qualities">
      <h2 className="section-title">👑 Words That Describe You 👑</h2>
      <div className="section-divider" />
      <div className="qualities-grid">
        {qualities.map((q, i) => (
          <div className="quality-card" key={i}>
            <span className="quality-emoji">{q.emoji}</span>
            <span className="quality-word">{q.word}</span>
          </div>
        ))}
      </div>
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
      <h2 className="section-title">🎂 Make a Wish, Laiba! 🎂</h2>
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
    { text: "Your smile can literally light up the entire room", emoji: "😊" },
    { text: "The way you care about everyone around you", emoji: "💝" },
    { text: "Your beautiful heart that's full of kindness", emoji: "💖" },
    { text: "How strong and brave you are in everything", emoji: "💪" },
    { text: "Your laughter is the sweetest sound in the world", emoji: "😂" },
    { text: "The way you make everything feel so special", emoji: "✨" },
    { text: "Your eyes that tell the most beautiful stories", emoji: "👀" },
    { text: "How you inspire me to be a better person every day", emoji: "🌟" },
    { text: "Your intelligence and wisdom beyond your years", emoji: "🧠" },
    { text: "Simply everything about you — you are perfect", emoji: "👑" },
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

// ─── Wishes Section ───
function WishesSection() {
  const wishes = [
    { icon: "🌟", title: "Shine Bright", text: "May your light continue to brighten every room you walk into. You are the star of every story worth telling." },
    { icon: "🦋", title: "Beautiful Soul", text: "Your kindness and grace make this world a better place. Never stop being the incredible person you are." },
    { icon: "🌹", title: "Eternal Love", text: "Every moment with you is a blessing. My heart belongs to you today, tomorrow, and for all of eternity." },
    { icon: "🎓", title: "Dream Big", text: "May all your wildest dreams come true this year. The world is waiting for someone as extraordinary as you." },
    { icon: "💎", title: "Precious Gem", text: "You are rare, precious, and absolutely priceless. The universe created its masterpiece when it made you." },
    { icon: "🌈", title: "Endless Joy", text: "May your days overflow with laughter, love, and every color of happiness that life has to offer." },
  ];

  return (
    <section className="wishes-section" id="wishes">
      <h2 className="section-title">🌟 Birthday Wishes for You 🌟</h2>
      <div className="section-divider" />
      <div className="wishes-grid">
        {wishes.map((wish, i) => (
          <div className="wish-card" key={i}>
            <span className="wish-icon">{wish.icon}</span>
            <h3 className="wish-title">{wish.title}</h3>
            <p className="wish-text">{wish.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Love Letter Section ───
function LoveLetter() {
  const age = getAge();
  return (
    <section className="letter-section" id="letter">
      <h2 className="section-title">💌 A Letter From My Heart 💌</h2>
      <div className="section-divider" />
      <div className="letter-container">
        <p className="letter-greeting">My Dearest Laiba,</p>
        <div className="letter-body">
          <p>
            On this beautiful day, the world became a better place because you were born into it.
            Your smile lights up the darkest days, and your laughter is the <span className="highlight">sweetest melody</span> I&apos;ve ever heard.
          </p>
          <p>
            You are not just beautiful on the outside — your heart, your soul, your kindness — <span className="highlight">everything about you is absolutely perfect</span>.
            Every single day with you feels like a gift I don&apos;t deserve but am infinitely grateful for.
          </p>
          <p>
            As you turn <span className="highlight">{age}</span>, I want you to know that my love for you grows deeper with every passing second.
            You are my today, my tomorrow, and my forever. Happy Birthday, my love! 🌹
          </p>
          <p>
            May this year bring you everything your heart desires and more.
            You deserve all the happiness, all the love, and all the beautiful things this world has to offer.
            I promise to be right beside you through <span className="highlight">every moment, every dream, every adventure</span>. 💖
          </p>
          <p>
            You make me want to be a better person. You make every ordinary moment extraordinary.
            And I want to spend the rest of my life making sure you know just how <span className="highlight">special and loved</span> you truly are. 🥺💕
          </p>
        </div>
        <p className="letter-signature">Forever & Always Yours ❤️</p>
      </div>
    </section>
  );
}

// ─── Timeline Section ───
function Timeline() {
  const age = getAge();
  const milestones = [
    { emoji: "👶", title: "September 10, 2003", text: "An angel was born & the world became a beautiful place" },
    { emoji: "🌸", title: "Growing Up Beautiful", text: "Becoming the most incredible, kind, and amazing person" },
    { emoji: "💕", title: "Our Paths Crossed", text: "The best thing that ever happened in this universe" },
    { emoji: "💍", title: "My Future Wifey", text: "The person I want to spend my entire life with" },
    { emoji: "🎂", title: `Turning ${age} in ${BIRTHDAY_YEAR}`, text: "This is just the beginning of our beautiful forever" },
  ];

  return (
    <section className="timeline-section" id="timeline">
      <h2 className="section-title">✨ Our Beautiful Story ✨</h2>
      <div className="section-divider" />
      <div className="timeline">
        {milestones.map((item, i) => (
          <div className="timeline-item" key={i}>
            <div className="timeline-dot" />
            <div className="timeline-content">
              <span className="timeline-emoji">{item.emoji}</span>
              <h3 className="timeline-title">{item.title}</h3>
              <p className="timeline-text">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
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
            No gift in this world compares to having you in my life, Laiba. You are my everything. 🥺✨
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
          {revealedCards.size < TOTAL_PHOTOS && (
            <button className="memories-reveal-all" onClick={handleRevealAll}>
              ✨ Reveal All ✨
            </button>
          )}
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
                          <span className="photo-expand">tap to enlarge</span>
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

    if (trimmed === SECRET_PASSWORD) {
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
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const confettiFired = useRef(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("miang_unlocked") === "true") {
        setIsUnlocked(true);
      }
    } catch { }
  }, []);

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

  const age = getAge();

  return (
    <main>
      <StarField />
      {!isUnlocked && <PasswordGate onUnlock={() => setIsUnlocked(true)} />}
      <EnvelopeIntro onOpen={handleEnvelopeOpen} />

      {/* ─── Hero Section ─── */}
      <section className="hero-section">
        <FloatingHearts />
        <div className="hero-content">
          <div className="birthday-badge">🎂 Happy Birthday 🎂</div>
          <div className="hero-title-wrapper">
            <h1 className="hero-title">{BIRTHDAY_NAME}</h1>
          </div>
          <p className="hero-subtitle">✨ The Most Beautiful Soul ✨</p>
          <p className="hero-age-line">
            Celebrating <span>{age}</span> years of pure magic
          </p>
          <p className="hero-message">
            Today we celebrate the most amazing, kind-hearted, and beautiful person in the entire universe.
            A day as special as you deserves all the love, all the stars, and all the happiness in the world. 💖
          </p>
          <button
            className="cta-button"
            onClick={() => document.getElementById("countdown")?.scrollIntoView({ behavior: "smooth" })}
          >
            🌟 Explore Your Surprises 🌟
          </button>
        </div>
        <div
          className="scroll-indicator"
          onClick={() => document.getElementById("countdown")?.scrollIntoView({ behavior: "smooth" })}
        >
          <span />
        </div>
      </section>

      {/* ─── Countdown ─── */}
      <Countdown />

      {/* ─── Qualities ─── */}
      <QualitiesSection />

      {/* ─── Cake ─── */}
      <CakeSection />

      {/* ─── Reasons ─── */}
      <ReasonsSection />

      {/* ─── Wishes ─── */}
      <WishesSection />

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
          onClick={() => {
            try {
              sessionStorage.removeItem("miang_unlocked");
            } catch { }
            setIsUnlocked(false);
          }}
          title="Click to lock again"
        >
          🔒 Lock Website
        </button>
        <span className="footer-infinity">∞</span>
      </footer>
    </main>
  );
}
