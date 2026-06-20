import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, useVelocity } from "framer-motion";
import { RotateCcw, Stars, X, Hand, Info, Book, Check } from "lucide-react";
import { deckGroups, tarotCards } from "./tarotDeck";

// Haptic Tap helper for mobile devices
function hapticTap(pattern = 8) {
  if (typeof window !== "undefined" && "navigator" in window && "vibrate" in window.navigator) {
    try {
      window.navigator.vibrate(pattern);
    } catch (e) {
      // Ignore vibration errors if blocked by browser
    }
  }
}

// 3D Interactive Card Component
function InteractiveCard({
  instanceId,
  card,
  x,
  y,
  initialRotate,
  flipped,
  zIndex,
  isOverlapped,
  isSelected,
  onFlip,
  onSelect,
  onDragStart,
  onDragEnd,
  globalTiltX, // combined tilt (touch + idle auto-shimmer)
  globalTiltY,
  tableRef, // boundary container ref
}) {
  const cardRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Framer Motion values for position
  const cardX = useMotionValue(x);
  const cardY = useMotionValue(y);

  // Sync state position changes (e.g. from reset or snaps)
  useEffect(() => {
    cardX.set(x);
    cardY.set(y);
  }, [x, y, cardX, cardY]);

  // Velocity tracking for drag rotation (weight/swing)
  const velX = useVelocity(cardX);
  const dragRotate = useTransform(velX, [-1800, 1800], [-18, 18]);
  const smoothDragRotate = useSpring(dragRotate, { stiffness: 220, damping: 20 });
  const totalRotate = useTransform(smoothDragRotate, (r) => r + initialRotate);

  // Parallax 3D tilt based on combined sensor/mouse/idle values
  const tiltAngleX = useTransform(globalTiltY, [-1.5, 1.5], [18, -18]); // pitch
  const tiltAngleY = useTransform(globalTiltX, [-1.5, 1.5], [-18, 18]); // roll
  
  const rotateX = useSpring(tiltAngleX, { stiffness: 120, damping: 22 });
  
  // Calculate rotateY based on whether the card is flipped (180 deg) + tilt angle
  const rotateY = useSpring(
    useTransform(tiltAngleY, (tY) => (flipped ? 180 + tY : tY)),
    { stiffness: 120, damping: 22 }
  );

  // Dynamic shadow displacement (shadow moves away from the tilt source)
  const shadowDx = useSpring(useTransform(globalTiltX, [-1.5, 1.5], [-14, 14]), { stiffness: 120, damping: 22 });
  const shadowDy = useSpring(useTransform(globalTiltY, [-1.5, 1.5], [14, -14]), { stiffness: 120, damping: 22 });

  // Gold foil shimmer variables
  const shimmerX = useTransform(globalTiltX, [-1.5, 1.5], ["0%", "100%"]);
  const shimmerY = useTransform(globalTiltY, [-1.5, 1.5], ["0%", "100%"]);
  const shimmerOpacity = useTransform([globalTiltX, globalTiltY], ([gx, gy]) => {
    return Math.min(0.85, Math.abs(gx) * 0.45 + Math.abs(gy) * 0.45 + 0.15);
  });
  
  // Combine shimmer values for inline styling
  const shimmerBgPos = useTransform([shimmerX, shimmerY], ([sx, sy]) => `${sx} ${sy}`);

  // Tap handler (detects single vs double tap without click latency)
  const lastTap = useRef(0);
  const tapTimeout = useRef(null);

  useEffect(() => {
    return () => {
      if (tapTimeout.current) clearTimeout(tapTimeout.current);
    };
  }, []);

  const handleTapGesture = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 280;

    if (now - lastTap.current < DOUBLE_TAP_DELAY) {
      if (tapTimeout.current) {
        clearTimeout(tapTimeout.current);
        tapTimeout.current = null;
      }
      hapticTap(12);
      onFlip(instanceId);
    } else {
      // Delay single tap slightly to make sure a second tap isn't coming (prevents drawer overlap during double-tap)
      tapTimeout.current = setTimeout(() => {
        hapticTap(5);
        onSelect(instanceId);
        tapTimeout.current = null;
      }, DOUBLE_TAP_DELAY);
    }
    lastTap.current = now;
  };

  // Dynamic values representing height lift when dragged
  const cardScale = isDragging ? 1.06 : 1;
  const shadowOpacity = isDragging ? 0.8 : (isOverlapped ? 0.45 : 0.65);
  const shadowBlur = isDragging ? 22 : 12;

  return (
    <motion.div
      ref={cardRef}
      drag
      dragConstraints={tableRef} // Elastic play mat boundaries
      dragElastic={0.15}
      dragMomentum={true}
      dragTransition={{ power: 0.18, damping: 20 }}
      onDragStart={() => {
        setIsDragging(true);
        onDragStart(instanceId);
      }}
      onDragEnd={(e, info) => {
        setIsDragging(false);
        onDragEnd(instanceId, info);
      }}
      onPointerDown={() => {
        // Boost z-index immediately when user touches card
        onDragStart(instanceId);
      }}
      style={{
        x: cardX,
        y: cardY,
        rotate: totalRotate,
        zIndex: zIndex,
      }}
      onTap={handleTapGesture}
      className={`card-3d-wrapper ${isSelected ? "ring-2 ring-champagne/50 rounded-xl" : ""}`}
      initial={{ scale: 0.3, opacity: 0, y: y + 80 }}
      animate={{ 
        scale: cardScale, 
        opacity: isOverlapped ? 0.86 : 1,
        transition: { type: "spring", stiffness: 220, damping: 18 }
      }}
      exit={{ 
        scale: 0.4, 
        opacity: 0,
        x: x > window.innerWidth / 2 ? window.innerWidth + 200 : -200,
        transition: { duration: 0.45, ease: "easeIn" }
      }}
    >
      {/* 3D dynamic shadow layer */}
      <motion.div 
        className="card-shadow-layer"
        animate={{
          scale: isDragging ? 1.02 : (isOverlapped ? 0.94 : 0.98),
          opacity: shadowOpacity,
          filter: `blur(${shadowBlur}px)`
        }}
        style={{
          x: shadowDx,
          y: shadowDy,
        }}
        transition={{ duration: 0.18 }}
      />

      {/* Card Body with rotations */}
      <motion.div
        className="card-inner"
        style={{
          rotateX: rotateX,
          rotateY: rotateY,
        }}
      >
        {/* CARD BACK */}
        <div className="card-face card-back">
          <div className="card-back-border">
            <div className="card-back-pattern">
              <span className="card-back-star">✦</span>
            </div>
          </div>
          {/* Reflective Gold Foil Shimmer */}
          <motion.div
            className="gold-shimmer"
            style={{
              backgroundPosition: shimmerBgPos,
              opacity: shimmerOpacity,
            }}
          />
        </div>

        {/* CARD FRONT */}
        <div className="card-face card-front">
          <div className="card-front-border">
            <div className="card-front-art-wrapper">
              <img
                src={card.image}
                alt={card.name}
                className="card-front-art"
                draggable="false"
              />
            </div>
            <div className="card-front-title-area">
              <div className="card-front-title">{card.name}</div>
              <div className="card-front-number">{card.arcana}</div>
            </div>
          </div>
          {/* Reflective Gold Foil Shimmer */}
          <motion.div
            className="gold-shimmer"
            style={{
              backgroundPosition: shimmerBgPos,
              opacity: shimmerOpacity,
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

// Cinematic Shuffle Visualizer
function RiffleShuffle() {
  const cards = Array.from({ length: 14 });
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-30">
      {cards.map((_, i) => {
        const isLeft = i % 2 === 0;
        return (
          <motion.div
            key={i}
            className="absolute card-face card-back"
            style={{
              width: 104,
              height: 166,
              border: "1.5px solid rgba(212, 175, 55, 0.45)",
              borderRadius: 12,
              boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
            }}
            initial={{ x: 0, y: 0, rotate: 0, scale: 0.95 }}
            animate={{
              x: [0, isLeft ? -110 - i * 2 : 110 + i * 2, 0],
              y: [0, (i - 7) * 4, 0],
              rotate: [0, isLeft ? -20 - i : 20 + i, 0],
              scale: [0.95, 1.02, 0.95],
              zIndex: [i, i, i],
            }}
            transition={{
              duration: 1.25,
              times: [0, 0.45, 1],
              ease: "easeInOut",
              delay: i * 0.045,
              repeat: 1,
            }}
          />
        );
      })}
    </div>
  );
}

// Opening Silk Box Screen
function SilkBox({ onOpen }) {
  const [opening, setOpening] = useState(false);

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);
    hapticTap([15, 30, 10]);
    setTimeout(() => {
      onOpen();
    }, 900);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full px-6">
      <motion.div
        className="silk-box cursor-pointer flex flex-col items-center justify-center relative touch-manipulation"
        onClick={handleOpen}
        animate={opening ? { 
          scale: [1, 1.05, 0.85], 
          opacity: [1, 1, 0],
          filter: ["blur(0px)", "blur(0px)", "blur(12px)"]
        } : {}}
        transition={{ duration: 0.8, cubicBezier: [0.16, 1, 0.3, 1] }}
        whileTap={{ scale: 0.96 }}
      >
        {/* Soft magical aura glow */}
        <div className="absolute w-[260px] h-[260px] rounded-full bg-champagne/10 blur-[40px] pointer-events-none" />

        {/* 3D Silk Box Container */}
        <motion.div 
          className="box-lid w-[200px] h-[200px] flex items-center justify-center"
          animate={opening ? { rotateX: 65, rotateZ: -25, y: -60 } : { rotateX: 45, rotateZ: -10 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Ribbon Wrap */}
          <div className="box-ribbon box-ribbon-x" />
          <div className="box-ribbon box-ribbon-y" />
          
          {/* Center Sigil */}
          <div className="box-sigil">
            <span className="box-sigil-text text-center">LAE</span>
            <span className="text-[1.2rem] text-champagne/80 my-0.5">✦</span>
            <span className="box-sigil-text text-center">TAROT</span>
          </div>
        </motion.div>
      </motion.div>
      
      <motion.div
        className="text-center mt-10 max-w-xs pointer-events-none"
        initial={{ opacity: 0, y: 15 }}
        animate={opening ? { opacity: 0, y: -10 } : { opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <h2 className="font-display text-2xl text-champagne tracking-wider">Tap Box to Begin</h2>
        <p className="mt-2.5 text-xs font-light text-pearl/50 leading-relaxed">
          Open the velvet casket to draw from a full 78-card deck. Keep a personal journal of what the cards whisper.
        </p>
      </motion.div>
    </div>
  );
}

// Complete Tarot Reading Application
export default function App() {
  const [boxOpen, setBoxOpen] = useState(false);
  const [deck, setDeck] = useState(() => [...tarotCards].sort(() => Math.random() - 0.5));
  const [tableCards, setTableCards] = useState([]);
  const [maxZIndex, setMaxZIndex] = useState(1);
  const [shuffling, setShuffling] = useState(false);
  const [activeCardId, setActiveCardId] = useState(null); // instanceId
  const [selectedCardId, setSelectedCardId] = useState(null); // instanceId for single-tap select
  const [journalText, setJournalText] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const tableRef = useRef(null);
  const deckRef = useRef(null);
  const [deckPos, setDeckPos] = useState({ x: 0, y: 0 });

  // Motion values for smooth 3D tilt tracking (global)
  const pointerTiltX = useMotionValue(0);
  const pointerTiltY = useMotionValue(0);
  
  // Motion values for idle auto-shimmer breathing loop (0.15 scale oscillation)
  const idleShimmerX = useMotionValue(0);
  const idleShimmerY = useMotionValue(0);

  // Smooth springs to merge touch dragging and idle breathing
  const smoothTiltX = useSpring(
    useTransform([pointerTiltX, idleShimmerX], ([pX, iX]) => pX + iX),
    { stiffness: 75, damping: 22 }
  );
  const smoothTiltY = useSpring(
    useTransform([pointerTiltY, idleShimmerY], ([pY, iY]) => pY + iY),
    { stiffness: 75, damping: 22 }
  );

  // Update deck coordinate bounds on resizing
  const updateDeckBounds = () => {
    if (deckRef.current && tableRef.current) {
      const tableRect = tableRef.current.getBoundingClientRect();
      const deckRect = deckRef.current.getBoundingClientRect();
      
      // Calculate local coordinate relative to table surface
      setDeckPos({
        x: deckRect.left - tableRect.left,
        y: deckRect.top - tableRect.top,
      });
    }
  };

  useEffect(() => {
    if (boxOpen) {
      setTimeout(updateDeckBounds, 120);
      window.addEventListener("resize", updateDeckBounds);
    }
    return () => window.removeEventListener("resize", updateDeckBounds);
  }, [boxOpen]);

  // Global pointer move tracking (supports touch drag + mousemove seamlessly)
  useEffect(() => {
    const handlePointerMove = (e) => {
      // Normalize from -1.0 to 1.0
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      pointerTiltX.set(x);
      pointerTiltY.set(y);
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [pointerTiltX, pointerTiltY]);

  // Idle breathing auto-shimmer loop animation
  useEffect(() => {
    let animationFrameId;
    let time = 0;
    
    const tick = () => {
      time += 0.012; // slow breathing rate
      // Creates a subtle orbital shift loop to catch room lighting when idle
      idleShimmerX.set(Math.sin(time) * 0.18);
      idleShimmerY.set(Math.cos(time * 0.8) * 0.15);
      animationFrameId = requestAnimationFrame(tick);
    };
    
    tick();
    return () => cancelAnimationFrame(animationFrameId);
  }, [idleShimmerX, idleShimmerY]);

  // Draw Card mechanic
  const drawCard = () => {
    if (deck.length === 0 || shuffling) return;

    hapticTap(8);
    const cardToDraw = deck[0];
    const newDeck = deck.slice(1);
    
    // Spawn at deck pile position
    const spawnX = deckPos.x || (window.innerWidth - 130);
    const spawnY = deckPos.y || (window.innerHeight - 200);

    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    
    const cardW = 110;
    const cardH = 176;

    // Distribute randomly in target zone
    const targetZoneX = screenW / 2 - cardW / 2;
    const targetZoneY = screenH / 2 - cardH / 2 - 30;

    const randomX = targetZoneX + (Math.random() - 0.5) * (screenW * 0.35);
    const randomY = targetZoneY + (Math.random() - 0.5) * (screenH * 0.3);

    const nextZ = maxZIndex + 1;
    setMaxZIndex(nextZ);

    const newInstance = {
      instanceId: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      card: cardToDraw,
      x: spawnX,
      y: spawnY,
      rotate: (Math.random() - 0.5) * 16,
      flipped: false,
      zIndex: nextZ,
    };

    setTableCards((prev) => [...prev, newInstance]);
    setDeck(newDeck);

    // Animate transition glide from deck pile to target spot
    setTimeout(() => {
      setTableCards((prev) =>
        prev.map((c) =>
          c.instanceId === newInstance.instanceId
            ? { ...c, x: randomX, y: randomY }
            : c
        )
      );
    }, 50);
  };

  // Drag start moves card to top zIndex
  const handleDragStart = (instanceId) => {
    const nextZ = maxZIndex + 1;
    setMaxZIndex(nextZ);
    setTableCards((prev) =>
      prev.map((c) => (c.instanceId === instanceId ? { ...c, zIndex: nextZ } : c))
    );
    setSelectedCardId(instanceId);
  };

  // Drag end handles boundaries, saves final positions, and resolves collision stacking offsets
  const handleDragEnd = (instanceId, info) => {
    setTableCards((prevCards) => {
      const target = prevCards.find((c) => c.instanceId === instanceId);
      if (!target) return prevCards;

      // New base coordinates from drag offset
      let targetX = target.x + info.offset.x;
      let targetY = target.y + info.offset.y;

      // Pile collision stacking detection
      // If we drop near another card, snap stack it offset (16px right, 22px down)
      const otherCards = prevCards.filter((c) => c.instanceId !== instanceId);
      otherCards.sort((a, b) => b.zIndex - a.zIndex); // check top z-index cards first

      for (const other of otherCards) {
        const dx = Math.abs(targetX - other.x);
        const dy = Math.abs(targetY - other.y);
        // within stacking threshold
        if (dx < 48 && dy < 60) {
          targetX = other.x + 16;
          targetY = other.y + 22;
          hapticTap(6); // soft snap vibration click
          break;
        }
      }

      return prevCards.map((c) =>
        c.instanceId === instanceId
          ? { ...c, x: targetX, y: targetY }
          : c
      );
    });
  };

  // Flip card double tap
  const handleFlip = (instanceId) => {
    setTableCards((prev) =>
      prev.map((c) => (c.instanceId === instanceId ? { ...c, flipped: !c.flipped } : c))
    );
  };

  // Select card (single tap)
  const handleSelect = (instanceId) => {
    setSelectedCardId(instanceId);
    const cardObj = tableCards.find((c) => c.instanceId === instanceId);
    
    // If it's already face-up, open details overlay!
    if (cardObj && cardObj.flipped) {
      setActiveCardId(instanceId);
      // Load saved journal entry from localStorage
      const savedText = localStorage.getItem(`tarot-journal-${cardObj.card.id}`) || "";
      setJournalText(savedText);
    }
  };

  // Save journal entry
  const saveJournal = () => {
    const activeInstance = tableCards.find((c) => c.instanceId === activeCardId);
    if (!activeInstance) return;

    localStorage.setItem(`tarot-journal-${activeInstance.card.id}`, journalText);
    showToast("Reflection Saved ✦");
    hapticTap(10);
  };

  // Helper toast notification
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2000);
  };

  // Sweep reset table action
  const resetTable = () => {
    if (tableCards.length === 0 || shuffling) return;
    
    hapticTap(15);
    
    // Step 1: Sweep cards off-screen
    setTableCards((prev) =>
      prev.map((c) => ({
        ...c,
        x: c.x > window.innerWidth / 2 ? window.innerWidth + 250 : -250,
      }))
    );

    // Step 2: Clear state and restore full deck
    setTimeout(() => {
      setTableCards([]);
      setDeck([...tarotCards].sort(() => Math.random() - 0.5));
      setSelectedCardId(null);
      showToast("Table Cleared ✧");
    }, 450);
  };

  // Sweep back and play shuffle riffle animation
  const startShuffle = () => {
    if (shuffling) return;

    hapticTap([15, 30, 15]);
    setShuffling(true);

    // Sweep existing cards off-screen if any exist
    if (tableCards.length > 0) {
      setTableCards((prev) =>
        prev.map((c) => ({
          ...c,
          x: c.x > window.innerWidth / 2 ? window.innerWidth + 250 : -250,
        }))
      );
      setTimeout(() => {
        setTableCards([]);
        runShuffleRiffle();
      }, 400);
    } else {
      runShuffleRiffle();
    }
  };

  const runShuffleRiffle = () => {
    // Staggered vibrations for "riffle shuffle" clicky feel
    let count = 0;
    const interval = setInterval(() => {
      if (count < 8) {
        hapticTap(6);
        count++;
      } else {
        clearInterval(interval);
      }
    }, 160);

    // End shuffle and randomize deck
    setTimeout(() => {
      setDeck([...tarotCards].sort(() => Math.random() - 0.5));
      setShuffling(false);
      showToast("Deck Shuffled ✦");
      hapticTap(20);
    }, 2500);
  };

  // Find if a card is overlapped by another with higher zIndex
  const isOverlapped = (cardInst) => {
    return tableCards.some((other) => {
      if (other.instanceId === cardInst.instanceId) return false;
      const dx = Math.abs(cardInst.x - other.x);
      const dy = Math.abs(cardInst.y - other.y);
      const overlaps = dx < 48 && dy < 60;
      return overlaps && other.zIndex > cardInst.zIndex;
    });
  };

  const activeTableCard = tableCards.find((c) => c.instanceId === activeCardId);

  // Deck size thick piling multiplier
  const deckPileLayersCount = Math.min(6, Math.max(1, Math.ceil(deck.length / 13)));

  return (
    <main className="relative h-[100svh] w-screen overflow-hidden bg-obsidian text-pearl antialiased">
      {/* Table velvet canvas background and grids */}
      <div className="table-surface" />
      <div className="constellation-overlay" />
      
      {/* Ambient ceiling spot vignette shadow */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/75 z-10" />

      {/* Main Container */}
      <div className="relative z-20 flex flex-col h-full w-full">
        <AnimatePresence mode="wait">
          {!boxOpen ? (
            <motion.div 
              key="silk-casket"
              className="flex-1"
              exit={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
              transition={{ duration: 0.5 }}
            >
              <SilkBox onOpen={() => setBoxOpen(true)} />
            </motion.div>
          ) : (
            <motion.div
              key="reading-sandbox"
              className="flex-1 flex flex-col h-full w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              {/* TOP HEADER */}
              <header className="flex items-center justify-between px-6 pt-[max(16px,env(safe-area-inset-top))] pb-3 shrink-0">
                <div>
                  <h1 className="font-display text-2xl tracking-wider text-pearl font-semibold leading-none">LAE • TAROT</h1>
                  <p className="text-[0.62rem] uppercase tracking-[0.24em] text-champagne/60 mt-1">✦ For My Love ✦</p>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Clean Counter */}
                  <div className="px-3.5 py-1.5 rounded-full border border-white/5 bg-white/[0.03] text-[0.72rem] tracking-widest text-champagne font-medium">
                    DECK: {deck.length}
                  </div>
                </div>
              </header>

              {/* TABLE SANDBOX AREA */}
              <div 
                ref={tableRef}
                className="flex-1 relative w-full overflow-hidden p-4 touch-none"
              >
                {/* Visual guidelines when table is pristine */}
                {tableCards.length === 0 && !shuffling && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-8 text-center opacity-40">
                    <Hand size={22} className="text-champagne/60 animate-bounce mb-3" />
                    <p className="font-display text-lg text-pearl/80 italic">The table is empty...</p>
                    <p className="text-[0.7rem] uppercase tracking-widest text-champagne/50 mt-1 max-w-[200px]">
                      Tap the deck in the bottom right corner to draw cards
                    </p>
                  </div>
                )}

                {/* Staggered Shuffle Animation */}
                {shuffling && <RiffleShuffle />}

                {/* Active Sandboxed Cards */}
                <AnimatePresence>
                  {tableCards.map((tableCard) => (
                    <InteractiveCard
                      key={tableCard.instanceId}
                      instanceId={tableCard.instanceId}
                      card={tableCard.card}
                      x={tableCard.x}
                      y={tableCard.y}
                      initialRotate={tableCard.rotate}
                      flipped={tableCard.flipped}
                      zIndex={tableCard.zIndex}
                      isOverlapped={isOverlapped(tableCard)}
                      isSelected={selectedCardId === tableCard.instanceId}
                      onFlip={handleFlip}
                      onSelect={handleSelect}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                      globalTiltX={smoothTiltX}
                      globalTiltY={smoothTiltY}
                      tableRef={tableRef}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* BOTTOM BAR CONTROLS & DECK PILE */}
              <footer className="h-[120px] px-6 pb-[max(16px,env(safe-area-inset-bottom))] flex items-center justify-between shrink-0 z-30 pointer-events-none">
                {/* Control Panel Bar */}
                <div className="flex items-center gap-3 pointer-events-auto bg-black/45 border border-white/5 rounded-full p-2 backdrop-blur-xl">
                  <button
                    onClick={startShuffle}
                    disabled={shuffling}
                    className="h-11 px-5 rounded-full text-xs font-semibold tracking-wider uppercase border border-champagne/30 bg-champagne/10 text-champagne flex items-center gap-2 hover:bg-champagne/15 transition-all"
                  >
                    <Stars size={13} className={shuffling ? "animate-spin" : ""} />
                    Shuffle
                  </button>
                  
                  <button
                    onClick={resetTable}
                    disabled={tableCards.length === 0 || shuffling}
                    className="h-11 w-11 rounded-full border border-white/10 bg-white/[0.04] text-pearl/80 hover:text-pearl flex items-center justify-center transition-all hover:bg-white/[0.08]"
                    aria-label="Reset Table"
                  >
                    <RotateCcw size={15} />
                  </button>
                </div>

                {/* 3D Physical Deck Pile Spawner */}
                <div className="relative pointer-events-auto select-none">
                  {deck.length > 0 ? (
                    <div 
                      ref={deckRef}
                      onClick={drawCard}
                      className="relative cursor-pointer transition-transform hover:scale-105 active:scale-95"
                      style={{ width: 104, height: 166 }}
                      aria-label="Draw Card"
                    >
                      {/* Render layered shadows and cards to create 3D thickness */}
                      {Array.from({ length: deckPileLayersCount }).map((_, idx) => (
                        <div
                          key={idx}
                          className="absolute inset-0 card-face card-back pointer-events-none"
                          style={{
                            border: "1.5px solid rgba(212, 175, 55, 0.35)",
                            boxShadow: `${idx * 0.5}px ${idx * 0.8}px 8px rgba(0,0,0,0.35)`,
                            transform: `translate3d(-${idx * 1.5}px, -${idx * 1.5}px, 0)`,
                            zIndex: 10 - idx,
                          }}
                        >
                          <div className="card-back-border">
                            <div className="card-back-pattern">
                              <span className="card-back-star text-xs">✦</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Interactive draw helper label */}
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[0.55rem] uppercase tracking-[0.25em] text-champagne/80 font-bold bg-black/60 px-2 py-0.5 rounded border border-champagne/20 backdrop-blur pointer-events-none whitespace-nowrap">
                        DRAW
                      </span>
                    </div>
                  ) : (
                    // Empty Deck Slot Frame
                    <div
                      style={{ width: 104, height: 166 }}
                      className="border border-dashed border-champagne/20 rounded-xl flex flex-col items-center justify-center bg-white/[0.01] pointer-events-none opacity-60"
                    >
                      <span className="text-[1.5rem] text-champagne/20">✦</span>
                      <span className="text-[0.55rem] uppercase tracking-widest text-champagne/40 mt-1">EMPTY</span>
                    </div>
                  )}
                </div>
              </footer>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* DETAILS JOURNAL DRAWER OVERLAY */}
      <AnimatePresence>
        {activeCardId && activeTableCard && (
          <div className="glass-overlay">
            {/* Backdrop click close */}
            <button 
              className="absolute inset-0 w-full h-full bg-transparent cursor-default" 
              onClick={() => setActiveCardId(null)} 
            />

            <motion.aside
              className="details-panel relative z-10 shrink-0"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 220, damping: 25 }}
            >
              {/* Top Drawer header */}
              <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-white/5">
                <div>
                  <span className="text-[0.62rem] uppercase tracking-[0.22em] text-champagne/70 font-semibold">
                    {activeTableCard.card.arcana}
                  </span>
                  <h2 className="font-display text-2xl text-pearl font-bold leading-none mt-1">
                    {activeTableCard.card.name}
                  </h2>
                </div>
                <button
                  onClick={() => setActiveCardId(null)}
                  className="h-10 w-10 rounded-full border border-white/10 bg-white/[0.04] text-pearl/80 flex items-center justify-center active:scale-95 transition-transform"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Scrollable details content */}
              <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-4 flex flex-col gap-6">
                {/* 3D Static Card Art display */}
                <div className="flex justify-center py-2">
                  <div className="relative w-[150px] aspect-[5/8] rounded-2xl overflow-hidden border-2 border-champagne/30 shadow-2xl">
                    <img
                      src={activeTableCard.card.image}
                      alt={activeTableCard.card.name}
                      className="w-full h-full object-cover filter sepia-[0.15] contrast-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />
                  </div>
                </div>

                {/* Meaning & Poetic Tone */}
                <div className="flex flex-col gap-2.5">
                  <span className="text-[0.65rem] uppercase tracking-widest text-champagne font-bold flex items-center gap-1.5">
                    <Info size={12} />
                    Interpretation
                  </span>
                  <p className="font-display text-lg italic text-champagne/90 leading-snug">
                    "{activeTableCard.card.tone}"
                  </p>
                  <p className="text-sm font-light text-pearl/80 leading-relaxed">
                    {activeTableCard.card.meaning}
                  </p>
                </div>

                {/* Journal Reflection Box */}
                <div className="flex flex-col gap-3 pb-8">
                  <span className="text-[0.65rem] uppercase tracking-widest text-champagne font-bold flex items-center gap-1.5">
                    <Book size={12} />
                    Your Reflection Journal
                  </span>
                  
                  <textarea
                    rows={4}
                    value={journalText}
                    onChange={(e) => setJournalText(e.target.value)}
                    placeholder="Whisper your thoughts, dreams, and feelings here. Your diary is private and saved automatically..."
                    className="journal-textarea"
                  />
                  
                  <button
                    onClick={saveJournal}
                    className="h-11 w-full rounded-full border border-champagne/45 bg-champagne/10 text-champagne font-semibold tracking-wider text-xs uppercase flex items-center justify-center gap-2 hover:bg-champagne/15 active:scale-95 transition-all mt-1"
                  >
                    <Check size={14} />
                    Save Reflection
                  </button>
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* ambient toast alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50 px-4 py-2 border border-champagne/25 bg-black/85 text-champagne rounded-full text-xs font-semibold tracking-wider uppercase shadow-xl backdrop-blur-xl"
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
