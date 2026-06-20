# • TAROT ✦
> A mobile-first, high-fidelity virtual Tarot deck built as a premium, immersive digital gift. Designed with hardware-accelerated fluid physics, gold-foil shimmer reflections, and a private reflection diary.

---

## ✦ Key Design & Tactile Interactions

### 1. Viewport Lockout & Notch Integration
- Locked viewport configuration (`user-scalable=no`, `maximum-scale=1.0`) prevents mobile browser double-tap scaling, keeping the canvas 100% stable during fast double-tap flipping gestures.
- Background extends completely behind camera notches and dynamic islands (`viewport-fit=cover`) for a cohesive full-screen experience.

### 2. High-Fidelity Sandbox & Boundary constraints
- Supports drawing an unlimited number of cards.
- Cards are bound to the table mat boundaries (`dragConstraints`). They slide with inertia and bounce off screen edges, preventing them from flying out of view.

### 3. Tactile Card Lift & Stacking Depth
- Touching a card instantly triggers a dynamic z-index boost to the top.
- Dragging a card initiates a physical lift transform (scaling up to `1.06` and expanding its shadow blur to `22px`), casting a realistic soft shadow on the table below.
- Dropping a card flat on the table drops it back down. Dropping near another card automatically snap-stacks them in a cascading cascade offset (`+16px`, `+22px`) with staggered opacities.

### 4. Hardware-Accelerated 3D Flip (`rotateY`)
- Double-tapping a card triggers a high-fidelity 3D flip. Card faces use `backface-visibility: hidden` and `transform-style: preserve-3d` to prevent clipping or flickering.

### 5. Touch-Pointer Shimmer (No-Permission Required)
- Replaced system gyroscope requests with screen-touch pointer coordinates. Gold-foil shimmer layers and 3D card tilt angles follow finger drags and mouse moves.
- When the screen is idle, a continuous background loop gently sways the shimmer, catching light naturally.

### 6. Cinematic Riffle Shuffle
- Sweeps table cards off-screen with a slide-out transition and plays a custom visual riffle shuffle in the center of the table where cards fan out and weave back together.
- Accompanied by synchronized tactile haptic vibrations.

### 7. Private Frosted Journal
- Single-tapping a face-up card slides open a translucent detail modal showing poetic descriptions, upright meanings, and an auto-saving diary text box backed by `localStorage`.

---

## ✦ Technology Stack
*   **Core**: React 18 & JavaScript
*   **Animation Engine**: Framer Motion 11 (Hardware-Accelerated springs, velocities, and transforms)
*   **Styling**: Tailwind CSS v3 & CSS Variables
*   **Icons**: Lucide React
*   **Build Tool**: Vite v8

---

## ✦ Setup & Run Locally

### 1. Clone the repository
```bash
git clone https://github.com/Aung-Nyi-Thant/The-Tarot-Deck.git
cd The-Tarot-Deck
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```

### 4. Build production bundle
```bash
npm run build
```
