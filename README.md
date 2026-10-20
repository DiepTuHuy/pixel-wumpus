# Pixel Wumpus World: Caverns of Logic

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-success.svg?style=for-the-badge&logo=github)](https://dieptuhuy.github.io/pixel-wumpus/)
[![AIMA Propositional Logic](https://img.shields.io/badge/AIMA-Propositional%20Logic-amber.svg)](#aima-theorem-proving--clause-resolution)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![HTML5 Canvas](https://img.shields.io/badge/Engine-HTML5%20Canvas%202D-emerald.svg)](#architecture)
[![Font: Press Start 2P](https://img.shields.io/badge/Font-Press%20Start%202P-purple.svg)](#visual--aesthetic-design)

> **Play Live on GitHub Pages:** **[https://dieptuhuy.github.io/pixel-wumpus/](https://dieptuhuy.github.io/pixel-wumpus/)**

An authentic 2D retro Dark Fantasy adaptation of Russell & Norvig's classic **Wumpus World** (*Artificial Intelligence: A Modern Approach - AIMA*), featuring Godot-style 2D radial torch lighting with 20% edge feathering, medieval battlemap stone textures, high-fidelity pixel archer walk cycles, real-time propositional clause resolution refutation proofs, Web Audio synthesis, and an atmospheric Start Screen.

---

## 🌟 Key Features

1. **Atmospheric Dark Fantasy Start Screen & Map Selector**:
   - Majestic title banner in antique gold typography (`Press Start 2P`).
   - Dynamic 2D cavern entrance view with an idle breathing archer, central torchlight halo, and floating golden embers.
   - **Interactive Map Selector (21 Authentic AIMA Maps)**: Choose any map from Map 00 (Canonical AIMA Book Scenario) to Map 20 with real-time pit counts and gold/wumpus preview.
   - **Map Browser Modal**: Full grid modal to browse and select from all 21 maps with one click.
   - Comprehensive **Rules & Senses** modal and **AIMA Logic Manual** modal.

2. **Centered Map Layout & Integrated RPG Frame**:
   - The 4x4 dungeon map sits majestically right in the center of the viewport.
   - Integrated top status ribbon directly inside the map's rectangular frame (`POS: (x, y)`, `SCORE: 1000`, `ARROWS: 1`, and active Perception cues).
   - Real-time perception indicators (`BREEZE`, `STENCH`, `GLITTER`, `SCREAM`) cleanly docked within the frame.

3. **Handcrafted Procedural & Battlemap RPG Textures**:
   - Authentic 2D dungeon stone flagstones directly sourced and adapted from medieval battlemap textures with weathered mortar joints and stone cracks.
   - **Centered Room Coordinates**: Clear engraved coordinate watermarks `(x, y)` centered directly inside each chamber.
   - **Animated Green Slime Wumpus**: An expressive green pixel slime monster featuring squish-and-stretch breathing animation, bioluminescent slime aura, and a melted puddle pose with `SLAIN` banner when defeated.
   - **Pit Chasms**: Craggy stone rim descending into a deep abyssal void with swirling violet mist vortex.
   - **Gold Chest**: Handcrafted mahogany chest with gilded gold bands, keyhole, and twinkling star sparkle glints.

4. **Restored Warm Godot-Style 2D Torch Lighting**:
   - Centered precisely on the player coordinate with multi-stop radial gradient using `'screen'` blend mode.
   - Vibrant warm orange-gold torch flame casting atmospheric reflections over the medieval stone slabs, enveloped in deep cavern fog of war.

4. **UI Zoom & Scaling Customization**:
   - Built-in UI zoom controls (`SCALE: 80% / 100% / 120%`) with quick hotkeys (`+` / `-` / `0`) for seamless responsive adaptation on any display.

5. **High-Fidelity 2D Pixel Archer & Godot-Style Torchlight**:
   - Custom 360x460 high-definition pixel sprites with an intact hood (16,113 pixels preserved).
   - Authentic **4-phase forward stride walk cycle** (`walk0` -> `walk1` -> `walk2` -> `walk3`) with knee flexion, apex rise, and heel contact.
   - Directional horizontal turning (`scaleX = 1 / -1`) when moving left or right.
   - Dynamic 2D radial torchlight centered on the player with atmospheric dark cavern fog of war.

6. **Verifiable AIMA Propositional Clause Resolution Engine**:
   - Background inference engine maintaining a Propositional Knowledge Base (KB).
   - Refutation resolution proof (`KB ∧ ¬α ⊢ □`) executed upon every perception to mathematically prove safe rooms (`OK_x,y`) and isolate the Wumpus.
   - Streamlined live log detailing axiomatic derivations and contradiction proofs.

7. **Universal Pixel Typography & Zero-Emoji Constraint**:
   - Pure retro typography using `'Press Start 2P', monospace` across all screens, buttons, HUD, and modals.
   - Strictly zero emojis or external icon fonts; only 4 directional arrows on movement buttons (`◄`, `▲`, `▼`, `►`) and pure CSS geometric diamond accents.

8. **Web Audio Synthesizer**:
   - Procedural sound effects using Web Audio API oscillators: footsteps, bow drawing, arrow whoosh, Wumpus death scream, pit falls, and victory chimes.

---

## 🎮 How to Play

### Controls
| Key | Action |
| :--- | :--- |
| **W** / **▲** | Move North (Up) |
| **S** / **▼** | Move South (Down) |
| **A** / **◄** | Move West (Left) |
| **D** / **►** | Move East (Right) |
| **Space** | Shoot Arrow (in current direction) |
| **G** | Grab Gold Chest |
| **C** | Climb Out at `(1,1)` |
| **Escape** | Return to Title Menu |
| **H** | View Rules & Perceptions |
| **M** | View AIMA Logic Manual |
| **T** | Open Animation Studio |

### Perception Senses
- **Breeze**: Felt in rooms directly orthogonal to a bottomless Pit.
- **Stench**: Smelled in rooms directly orthogonal to the ravenous Wumpus.
- **Glitter**: Seen in the room containing the Chest of Gold.
- **Bump**: Felt when attempting to walk through an outer cavern boundary wall.
- **Scream**: Cavern-wide shriek heard when your arrow successfully pierces the Wumpus.

### Scoring Economy
- **Starting Score**: $1000$ points
- **Action Cost**: $-1$ point per movement or turn
- **Arrow Shot**: $-10$ points (only $1$ arrow equipped)
- **Grab Gold**: $+1000$ points
- **Death (Pit or Wumpus)**: $-1000$ points (Game Over)
- **Escape**: Return to `(1,1)` and Climb out carrying the gold for Maximum Score ($1100$ pts ceiling).

---

## 📐 AIMA Theorem Proving & Clause Resolution

The game follows the formal propositional logic specification from Russell & Norvig:

### 1. Percept Axioms
$$B_{x,y} \iff \bigvee_{(i,j) \in \text{Adj}(x,y)} P_{i,j}$$
$$S_{x,y} \iff \bigvee_{(i,j) \in \text{Adj}(x,y)} W_{i,j}$$

### 2. Room Safety
$$OK_{x,y} \iff \neg P_{x,y} \wedge \neg W_{x,y}$$

### 3. Refutation Clause Resolution
To prove $OK_{x,y}$:
1. Assume the negation $\neg OK_{x,y} \iff (P_{x,y} \vee W_{x,y})$.
2. Add $\neg OK_{x,y}$ to the current Knowledge Base ($KB$).
3. Resolve complementary literals $(L \vee C_1)$ and $(\neg L \vee C_2)$ to derive resolvent $(C_1 \vee C_2)$.
4. Continue until deriving the empty clause $\square$ (Contradiction).
5. Hence, $KB \models OK_{x,y}$ is soundly proven!

---

## 🏗 Architecture & Code Structure

```
pixel-wumpus/
├── index.html                   # Complete standalone single-file production build
├── README.md                    # Project documentation
├── .gitignore                   # Ignored files and directories
├── src/
│   └── logic_engine.js          # Core AIMA Propositional Logic & Resolution engine
├── test/
│   └── logic_engine.test.js     # Unit test suite verifying logic inference & game rules
└── docs/
    └── superpowers/
        ├── specs/               # Formal system design specification
        └── plans/               # Task-by-task execution plan
```

---

## 🚀 Running the Project

### Standalone (Zero Dependencies)
Simply open `index.html` in any modern web browser:
```bash
open index.html
```

### Running Unit Tests
Execute the AIMA logic engine test suite with Node.js:
```bash
node test/logic_engine.test.js
```

---

## 📜 License

MIT License. Designed and developed with Google DeepMind Antigravity Pair Programming.
