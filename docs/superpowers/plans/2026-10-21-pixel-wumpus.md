# Pixel Wumpus World Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a complete 2D Dark Fantasy Wumpus World game featuring a rich Start Screen, Godot-style 2D radial torch lighting, authentic AIMA Clause Resolution logic engine, 4-phase stride archer animation, and Web Audio synthesizer, then push to GitHub repository `pixel-wumpus`.

**Architecture:** A high-performance, single-bundle vanilla HTML5/Canvas architecture. The state machine orchestrates transitions between the Title Start Screen, Game Board, and Animation Studio. An AIMA propositional calculus engine performs real-time clause resolution and proof logging.

**Tech Stack:** HTML5 Canvas, JavaScript (ES6+), Tailwind CSS, Web Audio API, 'Press Start 2P' font, Node.js (test runner).

**Spec:** `docs/superpowers/specs/2026-10-21-pixel-wumpus-design.md`

## Global Constraints

- Universal typography: Every element, button, HUD, modal, and formula must use `'Press Start 2P', monospace !important`.
- Text language: English across all UI, modals, and proofs to prevent font fallback glitches.
- Zero icon / emoji constraint: No emojis or external icons anywhere, except the 4 directional arrows on movement buttons (`◄`, `▲`, `▼`, `►`) and pure CSS geometric shapes.
- Player torchlight: Torchlight must be centered directly on the player with radial falloff.
- Intact archer: Archer hood 100% intact, 4-phase stride walk cycle, directional flipping (`scaleX = 1 / -1`).
- Clean CSS frames: Deep navy `#090e24` and antique gold `#e8ca74` frames with pure CSS rotated diamond corners.

## Review Focus

1. **Title to Game Transition**: Clicking "ENTER CAVERN" or pressing Space cleanly switches view to the game without audio desync or canvas sizing artifacts.
2. **Modal Backdrop Collision**: Opening Rules, AIMA Manual, Victory, or Game Over modals properly blocks interaction underneath while keeping all text 100% visible and scrollable.
3. **Clause Resolution Soundness**: The inference engine correctly deduces Safe rooms and Wumpus location via refutation resolution `KB ∧ ¬α ⊢ ⊥` without false positives.
4. **Action Economy & Score Tracking**: Moving decreases score by 1, shooting arrow decreases by 10, grabbing gold adds 1000, death sets penalty -1000.
5. **Git Repository Deployment**: Clean repository setup without bloated temporary artifacts, pushed to `https://github.com/DiepTuHuy/pixel-wumpus.git`.

---

## Tasks

### Task 1: AIMA Logic & Game State Unit Tests

**Files:**
- Create: `test/logic_engine.test.js`
- Create: `src/logic_engine.js`

- [ ] **Step 1: Write failing unit tests for Propositional Logic & Resolution Engine**
  - Test safe room inference: `At (1,1) without Breeze and Stench -> (1,2) and (2,1) are OK`.
  - Test Stench inference and Wumpus resolution: `Stench at (1,2) + No Stench at (2,1) -> Wumpus at (1,3)`.
  - Test Score & State transitions (Move, Turn, Grab Gold, Shoot Wumpus, Fall into Pit).
- [ ] **Step 2: Run test runner to verify failures**
  - Run `node test/logic_engine.test.js`.
- [ ] **Step 3: Implement minimal logic engine to pass all tests**
  - Implement Propositional KB representation, adjacency helper, and refutation resolution method.
- [ ] **Step 4: Verify all tests pass**
  - Run `node test/logic_engine.test.js` and confirm 0 failures.

---

### Task 2: Start Screen Implementation & Visual Atmospheric Canvas

**Files:**
- Modify: `.superpowers/brainstorm/session/content/archer-and-pixel-frames.html`
- Create: `src/start_screen.js`

- [ ] **Step 1: Build the Start Screen HTML/CSS layout**
  - Title banner: `WUMPUS WORLD: CAVERNS OF LOGIC` in embossed retro gold with glowing halo.
  - Cavern opening canvas: Archer breathing in idle state with flickering radial torchlight halo and rising embers.
  - Menu buttons: `ENTER CAVERN`, `RULES & SENSES`, `AIMA LOGIC MANUAL`, `ANIMATION STUDIO`, `AUDIO: ON/OFF`.
- [ ] **Step 2: Implement Start Screen animation loop**
  - Dynamic particles / dust embers floating upward in cavern darkness.
  - Pulsing torchlight radius centered on the archer.
- [ ] **Step 3: Add keyboard navigation**
  - `Enter` / `Space` to enter cavern, `H` for How to Play, `M` for Manual, `T` for Studio.

---

### Task 3: Rules & Perception Modal + AIMA Manual Modal

**Files:**
- Modify: `.superpowers/brainstorm/session/content/archer-and-pixel-frames.html`

- [ ] **Step 1: Implement Rules & Senses Modal**
  - Senses breakdown: Breeze (adjacent to pit), Stench (adjacent to Wumpus), Glitter (gold room), Bump (wall boundary), Scream (Wumpus slain).
  - Scoring breakdown: +1000 Gold, -1000 Death, -1 Action, -10 Arrow.
  - Pure CSS Dark Fantasy celestial frame, 100% visible text, close button.
- [ ] **Step 2: Implement AIMA Logic Manual Modal**
  - Explanation of Horn Clauses, Propositional Knowledge Base, Resolution Rule `(A ∨ B) ∧ (¬B ∨ C) ⊢ (A ∨ C)`.
  - Step-by-step example on the 4x4 grid.

---

### Task 4: Complete State Controller & Navigation

**Files:**
- Modify: `.superpowers/brainstorm/session/content/archer-and-pixel-frames.html`

- [ ] **Step 1: Implement global screen switching controller**
  - `showScreen('title')`, `showScreen('game')`, `showScreen('studio')`.
  - Add `TITLE MENU` button to the main game header and studio header so the player can return to the Start Screen anytime.
- [ ] **Step 2: Verify audio synthesizer integration**
  - Sound on button clicks, transitions, steps, arrow shoot, and victory.
- [ ] **Step 3: Test modal overlays and dismissal in all screen states**

---

### Task 5: Production Packaging (`index.html`, `README.md`, `.gitignore`)

**Files:**
- Create: `index.html` (Complete standalone production build with inlined sprites and components)
- Create: `README.md`
- Create: `.gitignore`

- [ ] **Step 1: Assemble production `index.html`**
  - Combine Start Screen, Game Board, Studio, Modals, AIMA Engine, Audio Synthesizer, and Base64 assets into root `index.html`.
  - Validate HTML tag balance and syntax with Python parser.
- [ ] **Step 2: Author comprehensive `README.md`**
  - Game lore, gameplay controls, AIMA mathematical deduction explanation, architecture details, and how to run.
- [ ] **Step 3: Configure `.gitignore`**
  - Ignore OS files, temp logs, brainstorm session artifacts.

---

### Task 6: Git Setup & Remote Push to GitHub

- [ ] **Step 1: Initialize git repository in `/Users/dieptuhuy/Documents/wumpus`**
  - `git init`, set branch `main`.
- [ ] **Step 2: Add remote repository**
  - `git remote add origin https://github.com/DiepTuHuy/pixel-wumpus.git`.
- [ ] **Step 3: Commit all production files**
  - `git add index.html README.md .gitignore docs/ src/ test/`.
  - `git commit -m "feat: complete 2D Dark Fantasy Wumpus World with Start Screen and AIMA engine"`.
- [ ] **Step 4: Push to GitHub**
  - Push branch `main` to `origin`.
