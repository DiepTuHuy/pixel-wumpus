// scripts/build_centered_rpg_game.js
const fs = require('fs');
const path = require('path');

const mapsJson = fs.readFileSync('src/maps_data.json', 'utf8');

function generateHtml(inlineB64 = false) {
  const b64Tag = inlineB64 
    ? `<script>\n${fs.readFileSync('.superpowers/brainstorm/session/content/archer_b64.js', 'utf8')}\n</script>`
    : `<script src="/files/archer_b64.js"></script>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Wumpus World: Caverns of Logic (AIMA Resolution)</title>
  <script src="https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
  <style>
    :root {
      --df-navy-bg: #050816;
      --df-navy-panel: #090e24;
      --df-navy-inset: #040713;
      --df-gold-dark: #5b4114;
      --df-gold-mid: #9b7630;
      --df-gold-bright: #e8ca74;
      --df-gold-glow: #fcedb6;
      --df-border-outer: #020308;
      --df-border-inner: #1a2550;
      --df-gem-emerald: #10b981;
      --df-gem-amber: #f59e0b;
      --df-gem-crimson: #ef4444;
      --app-scale: 1;
    }

    * {
      box-sizing: border-box;
      user-select: none;
      font-family: 'Press Start 2P', monospace !important;
      text-rendering: geometricPrecision;
      -webkit-font-smoothing: none;
    }

    body {
      background-color: var(--df-navy-bg);
      color: #cbd5e1;
      margin: 0;
      padding: 12px;
      overflow-x: hidden;
      min-height: 100vh;
    }

    #app-container {
      transition: transform 0.15s ease-out;
      transform-origin: top center;
      transform: scale(var(--app-scale));
    }

    /* Dark Fantasy Celestial Frame */
    .df-frame {
      background: radial-gradient(circle at 50% 0%, #10193e 0%, var(--df-navy-panel) 75%);
      border: 2px solid var(--df-gold-mid);
      outline: 1px solid var(--df-border-outer);
      box-shadow: 
        inset 0 0 0 3px #060918,
        inset 0 0 0 4.5px var(--df-gold-dark),
        inset 0 0 25px rgba(20, 35, 90, 0.45),
        0 12px 35px rgba(0, 0, 0, 0.9);
      position: relative;
    }

    /* Pure CSS Pixel Diamond Corners */
    .df-corners::before,
    .df-corners::after {
      content: '';
      position: absolute;
      top: 6px;
      width: 6px;
      height: 6px;
      background: var(--df-gold-bright);
      transform: rotate(45deg);
      box-shadow: 0 0 5px var(--df-gold-mid), inset 0 0 1px #ffffff;
      pointer-events: none;
      z-index: 5;
    }
    .df-corners::before { left: 7px; }
    .df-corners::after { right: 7px; }

    /* Top & Bottom Finial Badges */
    .df-finial-top {
      position: absolute;
      top: -9px;
      left: 50%;
      transform: translateX(-50%);
      background: #080d21;
      border: 1.5px solid var(--df-gold-bright);
      color: var(--df-gold-glow);
      font-size: 7px;
      padding: 0 4px;
      line-height: 12px;
      box-shadow: 0 0 6px var(--df-gold-mid);
      pointer-events: none;
      z-index: 6;
    }
    .df-finial-bot {
      position: absolute;
      bottom: -9px;
      left: 50%;
      transform: translateX(-50%);
      background: #080d21;
      border: 1.5px solid var(--df-gold-bright);
      color: var(--df-gold-glow);
      font-size: 7px;
      padding: 0 4px;
      line-height: 12px;
      box-shadow: 0 0 6px var(--df-gold-mid);
      pointer-events: none;
      z-index: 6;
    }

    .df-inset {
      background: var(--df-navy-inset);
      border: 1px solid #141c3d;
      box-shadow: inset 0 2px 6px rgba(0,0,0,0.85);
    }

    /* Retro Dark Fantasy Button */
    .df-btn {
      background: linear-gradient(180deg, #18234c 0%, #0c1228 100%);
      border: 1px solid var(--df-gold-dark);
      color: #f1f5f9;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.15), 0 2px 4px rgba(0,0,0,0.6);
      cursor: pointer;
      transition: all 0.1s;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 6px 10px;
    }
    .df-btn:hover {
      border-color: var(--df-gold-bright);
      color: var(--df-gold-glow);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.25), 0 0 8px rgba(232,202,116,0.3);
    }
    .df-btn:active, .df-btn.active {
      background: linear-gradient(180deg, #090d1f 0%, #151e42 100%);
      border-color: var(--df-gold-bright);
      color: var(--df-gold-glow);
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(232,202,116,0.4);
    }

    .df-btn-emerald {
      background: linear-gradient(180deg, #065f46 0%, #022c22 100%);
      border-color: #059669;
      color: #a7f3d0;
    }
    .df-btn-emerald:hover {
      border-color: #34d399;
      color: #ffffff;
      box-shadow: 0 0 10px rgba(52, 211, 153, 0.4);
    }

    .df-btn-amber {
      background: linear-gradient(180deg, #78350f 0%, #451a03 100%);
      border-color: #b45309;
      color: #fde68a;
    }
    .df-btn-amber:hover {
      border-color: #fbbf24;
      color: #ffffff;
      box-shadow: 0 0 10px rgba(251, 191, 36, 0.4);
    }

    .df-btn-red {
      background: linear-gradient(180deg, #7f1d1d 0%, #450a0a 100%);
      border-color: #b91c1c;
      color: #fecaca;
    }
    .df-btn-red:hover {
      border-color: #f87171;
      color: #ffffff;
      box-shadow: 0 0 10px rgba(248, 113, 113, 0.4);
    }

    canvas {
      image-rendering: pixelated;
      image-rendering: crisp-edges;
    }
  </style>
</head>
<body>
  <div id="app-container" class="max-w-4xl mx-auto space-y-3.5">
    <!-- ============================================================== -->
    <!-- GLOBAL HEADER: CELESTIAL NAVY & GOLD                           -->
    <!-- ============================================================== -->
    <header class="df-frame df-corners p-3 flex flex-wrap items-center justify-between gap-3 relative">
      <div class="df-finial-top">▲</div>
      
      <!-- Brand Logo -->
      <div class="flex items-center gap-2.5 cursor-pointer" onclick="showScreen('title')">
        <div class="w-3.5 h-3.5 bg-amber-400 border border-amber-200 rotate-45 shadow-[0_0_8px_#f59e0b]"></div>
        <div>
          <h1 class="text-[9.5px] lg:text-[11px] text-[#fcedb6] tracking-wider font-bold">WUMPUS WORLD • CELESTIAL CAVERNS</h1>
          <p class="text-[6.5px] text-sky-200/70 mt-0.5">AIMA CLAUSE RESOLUTION • GODOT 2D LIGHTING • RPG TILES</p>
        </div>
      </div>

      <!-- Navigation & Controls -->
      <div class="flex flex-wrap items-center gap-2 text-[7px]">
        <button onclick="showScreen('title')" id="nav-btn-title" class="df-btn py-1 px-2 active">
          TITLE MENU
        </button>
        <button onclick="showScreen('game')" id="nav-btn-game" class="df-btn py-1 px-2">
          EXPEDITION
        </button>
        <button onclick="openRulesModal()" class="df-btn py-1 px-2">
          RULES
        </button>
        <button onclick="openLogicManualModal()" class="df-btn py-1 px-2">
          AIMA MANUAL
        </button>

        <!-- UI Zoom Controls -->
        <div class="flex items-center gap-1 bg-[#060a1d] border border-[#202952] px-1.5 py-0.5">
          <span class="text-[6px] text-slate-400">ZOOM:</span>
          <button onclick="zoomUi(-0.1)" class="df-btn px-1 py-0.5 text-[6.5px]" title="Zoom Out (-)">-</button>
          <span id="zoom-badge" class="text-[6.5px] text-[#fcedb6] font-bold px-1">100%</span>
          <button onclick="zoomUi(0.1)" class="df-btn px-1 py-0.5 text-[6.5px]" title="Zoom In (+)">+</button>
          <button onclick="setUiScale(1.0)" class="df-btn px-1 py-0.5 text-[6px] text-slate-300" title="Reset (0)">RESET</button>
        </div>

        <button onclick="toggleAudio()" id="btn-audio" class="df-btn py-1 px-2">
          AUDIO: ON
        </button>
      </div>
    </header>

    <!-- ============================================================== -->
    <!-- SCREEN 1: START SCREEN (TITLE, MAP SELECTOR, CAVERN VIEW)      -->
    <!-- ============================================================== -->
    <section id="screen-title" class="df-frame df-corners p-5 relative max-w-2xl mx-auto flex flex-col items-center justify-center text-center space-y-4">
      <div class="df-finial-top">▲</div>
      <div class="df-finial-bot">▼</div>

      <div class="space-y-1.5 mt-1">
        <div class="inline-block px-3 py-1 bg-[#0b1335] border border-[var(--df-gold-dark)] text-[#fcedb6] text-[6.5px] tracking-widest uppercase">
          Artificial Intelligence: A Modern Approach
        </div>
        <h1 class="text-xl md:text-2xl text-[#fcedb6] tracking-widest font-bold filter drop-shadow-[0_0_12px_#e8ca74] pt-1">
          WUMPUS WORLD
        </h1>
        <h2 class="text-[7.5px] md:text-[9px] text-sky-300 tracking-wider font-bold">
          CAVERNS OF LOGIC • PROPOSITIONAL RESOLUTION
        </h2>
      </div>

      <!-- Cavern Entrance Canvas Centerpiece -->
      <div class="relative group">
        <div class="p-1.5 bg-[#060a1d] border-2 border-[var(--df-gold-dark)] shadow-[0_0_25px_rgba(232,202,116,0.15)] inline-block">
          <canvas id="titleCanvas" width="340" height="220" class="block bg-[#050816]"></canvas>
        </div>
        <div class="absolute bottom-2.5 left-0 right-0 text-center pointer-events-none">
          <span class="inline-block px-2 py-0.5 bg-black/80 border border-[#202952] text-[#fcedb6] text-[6px] tracking-wider animate-pulse">
            TORCHLIGHT ILLUMINATING CAVERN ENTRANCE
          </span>
        </div>
      </div>

      <!-- Map Selection Carousel & Browser -->
      <div class="df-frame df-corners p-3 w-full max-w-md relative bg-[#060b24]">
        <div class="df-finial-top">▲</div>
        <div class="flex items-center justify-between border-b border-[#1b2554] pb-1.5 mb-2">
          <div class="text-[7px] text-[#fcedb6] font-bold tracking-wider">
            EXPEDITION MAP (00 - 20)
          </div>
          <button onclick="openMapBrowserModal()" class="df-btn text-[6.5px] py-1 px-2 text-sky-300">
            BROWSE ALL 21 MAPS
          </button>
        </div>

        <div class="flex items-center justify-between gap-2">
          <button onclick="changeMap(-1)" class="df-btn text-[8px] py-2 px-2.5 font-bold" id="btn-prev-map">
            ◄
          </button>

          <div class="flex-1 df-inset p-2 text-center space-y-1">
            <div class="text-[8px] text-[#fcedb6] font-bold tracking-wider" id="title-map-name">
              MAP 00 (AIMA BOOK)
            </div>
            <div class="text-[6.5px] text-sky-200/80 truncate" id="title-map-desc">
              Canonical AIMA Book Scenario
            </div>
            <div class="flex justify-center items-center gap-3 text-[6.5px] text-slate-300 pt-0.5">
              <span class="text-rose-300">PITS: <b id="title-map-pits" class="text-white">3</b></span>
              <span class="text-amber-300">GOLD: <b id="title-map-gold" class="text-white">(2, 3)</b></span>
              <span class="text-purple-300">WUMPUS: <b id="title-map-wumpus" class="text-white">(1, 3)</b></span>
            </div>
          </div>

          <button onclick="changeMap(1)" class="df-btn text-[8px] py-2 px-2.5 font-bold" id="btn-next-map">
            ►
          </button>
        </div>
      </div>

      <!-- Main Action Menu -->
      <div class="w-full max-w-md space-y-2 pt-1">
        <button onclick="showScreen('game'); playSfx(440, 'triangle', 0.2, 0.2, 880);" class="df-btn df-btn-emerald w-full py-2.5 text-[8.5px] tracking-widest font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-[1.01] transition-transform">
          [ ◄ ENTER CAVERN (START EXPEDITION) ► ]
        </button>
        <div class="grid grid-cols-2 gap-2">
          <button onclick="openRulesModal()" class="df-btn w-full py-2 text-[7px]">
            RULES & SENSES
          </button>
          <button onclick="openLogicManualModal()" class="df-btn w-full py-2 text-[7px]">
            AIMA LOGIC MANUAL
          </button>
        </div>
      </div>

      <!-- Quick Key Guide -->
      <div class="df-inset p-2 w-full max-w-md text-slate-400 text-[6.5px] leading-relaxed flex flex-wrap justify-around items-center gap-2">
        <span><b class="text-[#fcedb6]">[SPACE / ENTER]</b> START</span>
        <span><b class="text-[#fcedb6]">[H]</b> RULES</span>
        <span><b class="text-[#fcedb6]">[M]</b> MANUAL</span>
        <span><b class="text-[#fcedb6]">[+/-]</b> ZOOM</span>
      </div>
    </section>

    <!-- ============================================================== -->
    <!-- SCREEN 2: GAMEPLAY EXPEDITION (CENTERED MAP & INTEGRATED HUD) -->
    <!-- ============================================================== -->
    <section id="screen-game" class="max-w-xl mx-auto space-y-3 hidden">
      <!-- THE RECTANGULAR MAP CONTAINER -->
      <div class="df-frame df-corners p-3 relative w-full flex flex-col items-center">
        <div class="df-finial-top">▲</div>
        <div class="df-finial-bot">▼</div>

        <!-- 1. INTEGRATED STATUS RIBBON (INSIDE THE MAP RECTANGLE) -->
        <div class="w-full flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-[#1b2554]">
          <div class="df-inset px-2.5 py-1 text-[7.5px] text-[#fcedb6] font-bold">
            POS: <span id="pos-stat" class="text-white">(1, 1)</span>
          </div>

          <!-- Map Switcher inside Map Rectangle -->
          <div class="flex items-center gap-1 bg-[#060a1d] border border-[#202952] px-2 py-0.5">
            <button onclick="changeMap(-1)" class="text-[7.5px] text-[#fcedb6] hover:text-white px-1">◄</button>
            <span id="game-map-name" class="text-[7px] text-[#fcedb6] font-bold px-1">MAP 00</span>
            <button onclick="changeMap(1)" class="text-[7.5px] text-[#fcedb6] hover:text-white px-1">►</button>
          </div>

          <div class="flex items-center gap-2 text-[7.5px]">
            <div class="df-inset px-2.5 py-1 text-emerald-400 font-bold">
              SCORE: <span id="score-stat" class="text-white">1000</span>
            </div>
            <div class="df-inset px-2 py-1 text-amber-300 font-bold" id="arrow-count-badge">
              ARROWS: 1
            </div>
          </div>
        </div>

        <!-- 2. PERCEPTIONS RIBBON (INSIDE THE MAP RECTANGLE) -->
        <div id="senses-ribbon" class="w-full flex flex-wrap items-center justify-center gap-1.5 py-1 px-2 mb-2.5 bg-[#050818] border border-[#18234c] text-[6.5px]">
          <span class="text-slate-400 mr-1">PERCEPTS:</span>
          <span id="sense-breeze" class="px-2 py-0.5 bg-sky-950 text-sky-300 border border-sky-600 hidden font-bold">BREEZE</span>
          <span id="sense-stench" class="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-600 hidden font-bold">STENCH</span>
          <span id="sense-glitter" class="px-2 py-0.5 bg-amber-950 text-amber-300 border border-amber-500 animate-pulse hidden font-bold">GLITTER</span>
          <span id="sense-scream" class="px-2 py-0.5 bg-rose-950 text-rose-300 border border-rose-600 hidden font-bold">SCREAM</span>
          <span id="sense-safe" class="px-2 py-0.5 text-slate-400">NO PERCEPTS (CLEAR AIR)</span>
        </div>

        <!-- 3. CENTERED 4x4 DUNGEON CANVAS (WITH RPG TEXTURES & 2D TORCH LIGHT) -->
        <div class="relative bg-[#03050c] p-1 border-2 border-[var(--df-gold-dark)] shadow-[0_0_20px_rgba(0,0,0,0.9)]">
          <canvas id="gameCanvas" width="480" height="480" class="block cursor-crosshair"></canvas>
        </div>

        <!-- 4. ACTION & MOVEMENT CONTROLS (DOCKED INSIDE MAP RECTANGLE) -->
        <div class="w-full pt-2.5 mt-2.5 border-t border-[#1b2554] flex flex-wrap items-center justify-between gap-2.5">
          <!-- Left Action Buttons -->
          <div class="flex flex-col gap-1.5">
            <button onclick="triggerGrab()" class="df-btn df-btn-amber text-[7px] py-1.5 px-3">
              GRAB GOLD
            </button>
            <button onclick="triggerClimbUp()" class="df-btn df-btn-emerald text-[7px] py-1.5 px-3">
              CLIMB EXIT (1,1)
            </button>
          </div>

          <!-- Center Directional D-Pad -->
          <div class="grid grid-cols-3 gap-1 w-28">
            <div></div>
            <button onclick="movePlayer(0, -1)" class="df-btn py-2 text-[8px] font-bold text-center" title="North (W / ▲)">▲</button>
            <div></div>
            <button onclick="movePlayer(-1, 0)" class="df-btn py-2 text-[8px] font-bold text-center" title="West (A / ◄)">◄</button>
            <button onclick="movePlayer(0, 1)" class="df-btn py-2 text-[8px] font-bold text-center" title="South (S / ▼)">▼</button>
            <button onclick="movePlayer(1, 0)" class="df-btn py-2 text-[8px] font-bold text-center" title="East (D / ►)">►</button>
          </div>

          <!-- Right Action Buttons -->
          <div class="flex flex-col gap-1.5">
            <button onclick="triggerShoot('UP')" class="df-btn text-[7px] py-1.5 px-3 text-sky-200 border-sky-600">
              SHOOT ARROW
            </button>
            <button onclick="resetGame()" class="df-btn text-[7px] py-1.5 px-3 text-slate-300">
              RESTART MAP
            </button>
          </div>
        </div>
      </div>

      <!-- 5. AIMA CLAUSE RESOLUTION INFERENCE LOG (CENTERED BELOW MAP) -->
      <div class="df-frame df-corners p-3 w-full relative">
        <div class="flex items-center justify-between border-b border-[#1b2554] pb-1.5 mb-2">
          <div class="flex items-center gap-2">
            <div class="w-2.5 h-2.5 bg-amber-400 rotate-45"></div>
            <span class="text-[7.5px] text-[#fcedb6] font-bold tracking-wider">AIMA CLAUSE RESOLUTION LOG</span>
          </div>
          <button onclick="openMathProofFromVictory()" class="df-btn text-[6.5px] py-0.5 px-2 text-sky-300">
            FULL GRIMOIRE
          </button>
        </div>
        <div id="proof-stream" class="overflow-y-auto max-h-[130px] space-y-1.5 pr-1 text-[7px]">
          <!-- Real-time AIMA refutation proofs -->
        </div>
        <div class="pt-2 mt-2 border-t border-[#1b2554] flex justify-between items-center text-[7px]">
          <button onclick="showScreen('title')" class="df-btn text-[7px] py-1">◄ TITLE MENU</button>
          <div class="flex items-center gap-2">
            <button onclick="changeMap(1)" class="df-btn df-btn-emerald text-[7px] py-1">NEXT MAP ►</button>
          </div>
        </div>
      </div>
    </section>
  </div>

  <!-- ============================================================== -->
  <!-- MODALS                                                         -->
  <!-- ============================================================== -->

  <!-- MODAL: MAP BROWSER (ALL 21 AIMA MAPS) -->
  <div id="map-browser-modal" class="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 hidden">
    <div class="df-frame df-corners p-5 max-w-2xl w-full space-y-4 relative border-2 border-[var(--df-gold-mid)]">
      <div class="df-finial-top">▲</div>
      <div class="df-finial-bot">▼</div>

      <div class="flex items-center justify-between border-b border-[#202952] pb-2">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 bg-amber-400 rotate-45"></div>
          <h3 class="text-[9px] text-[#fcedb6] font-bold tracking-wider">SELECT FROM 21 AIMA CAVERN MAPS</h3>
        </div>
        <button onclick="closeMapBrowserModal()" class="df-btn text-[7.5px] px-2 py-0.5">X</button>
      </div>

      <div id="map-cards-grid" class="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[55vh] overflow-y-auto pr-1">
        <!-- Populated dynamically via JS -->
      </div>

      <div class="pt-2 border-t border-[#202952] flex justify-between items-center text-[6.5px] text-slate-400">
        <span>CLICK ANY MAP TO LOAD IMMEDIATELY</span>
        <button onclick="closeMapBrowserModal()" class="df-btn text-[7.5px]">CLOSE</button>
      </div>
    </div>
  </div>

  <!-- MODAL: RULES & PERCEPTIONS -->
  <div id="rules-modal" class="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 hidden">
    <div class="df-frame df-corners p-5 max-w-lg w-full space-y-4 relative border-2 border-[var(--df-gold-mid)]">
      <div class="df-finial-top">▲</div>
      <div class="df-finial-bot">▼</div>

      <div class="flex items-center justify-between border-b border-[#202952] pb-2">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 bg-amber-400 rotate-45"></div>
          <h3 class="text-[9px] text-[#fcedb6] font-bold tracking-wider">CAVERN RULES & PERCEPTION CUES</h3>
        </div>
        <button onclick="closeRulesModal()" class="df-btn text-[7.5px] px-2 py-0.5">X</button>
      </div>

      <div class="space-y-3 text-[7.5px] leading-relaxed text-slate-300 max-h-[60vh] overflow-y-auto pr-1">
        <div>
          <div class="text-[#fcedb6] font-bold mb-1">1. SENSES & PERCEPTIONS</div>
          <div class="df-inset p-2 space-y-1">
            <div><b class="text-sky-300">BREEZE:</b> Chilly draft felt in rooms directly adjacent (orthogonal) to a bottomless Pit.</div>
            <div><b class="text-emerald-400">STENCH:</b> Putrid stench in rooms directly adjacent to the ravenous Wumpus.</div>
            <div><b class="text-amber-300">GLITTER:</b> Shimmering radiance in the room containing the Gold chest.</div>
            <div><b class="text-red-300">BUMP:</b> Felt when walking into an impenetrable cavern wall boundary.</div>
            <div><b class="text-purple-300">SCREAM:</b> Cavern-wide shriek heard when your arrow pierces the Wumpus.</div>
          </div>
        </div>

        <div>
          <div class="text-[#fcedb6] font-bold mb-1">2. SCORING & ACTION COSTS</div>
          <div class="df-inset p-2 space-y-1">
            <div><b class="text-slate-100">STARTING SCORE:</b> 1000 points.</div>
            <div><b class="text-amber-400">STEP / TURN:</b> -1 point per action.</div>
            <div><b class="text-amber-400">SHOOT ARROW:</b> -10 points (only 1 arrow equipped).</div>
            <div><b class="text-emerald-400">GRAB GOLD:</b> +1000 points.</div>
            <div><b class="text-red-400">PIT FALL / WUMPUS:</b> -1000 points (Fatal Expedition).</div>
            <div><b class="text-emerald-400">VICTORY:</b> Escape at (1,1) carrying the Gold chest!</div>
          </div>
        </div>
      </div>

      <div class="pt-2 border-t border-[#202952] flex justify-end">
        <button onclick="closeRulesModal()" class="df-btn df-btn-emerald text-[7.5px]">UNDERSTOOD</button>
      </div>
    </div>
  </div>

  <!-- MODAL: AIMA LOGIC MANUAL -->
  <div id="logic-manual-modal" class="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 hidden">
    <div class="df-frame df-corners p-5 max-w-xl w-full space-y-4 relative border-2 border-[var(--df-gold-mid)]">
      <div class="df-finial-top">▲</div>
      <div class="df-finial-bot">▼</div>

      <div class="flex items-center justify-between border-b border-[#202952] pb-2">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 bg-amber-400 rotate-45"></div>
          <h3 class="text-[9px] text-[#fcedb6] font-bold tracking-wider">AIMA CLAUSE RESOLUTION MANUAL</h3>
        </div>
        <button onclick="closeLogicManualModal()" class="df-btn text-[7.5px] px-2 py-0.5">X</button>
      </div>

      <div class="space-y-3 text-[7.5px] leading-relaxed text-slate-300 max-h-[60vh] overflow-y-auto pr-1">
        <div>
          <div class="text-[#fcedb6] font-bold mb-1">1. THE PROPOSITIONAL KNOWLEDGE BASE</div>
          <div class="df-inset p-2 space-y-1">
            <div>Every room (x,y) contains propositions: P(x,y) [Pit], W(x,y) [Wumpus], B(x,y) [Breeze], S(x,y) [Stench].</div>
            <div>Axioms: B(x,y) <=> Or(P_adj) and S(x,y) <=> Or(W_adj).</div>
            <div>Safe Room Definition: OK(x,y) <=> Not P(x,y) And Not W(x,y).</div>
          </div>
        </div>

        <div>
          <div class="text-[#fcedb6] font-bold mb-1">2. REFUTATION RESOLUTION PROOF (KB And Not Alpha |- EmptyClause)</div>
          <div class="df-inset p-2 space-y-1">
            <div>To verify if cell (x,y) is Safe, we assume the negation: (P(x,y) Or W(x,y)).</div>
            <div>We resolve complementary literals against known facts:</div>
            <div>- If cell (1,1) has No Breeze, resolution derives Not P(1,2) and Not P(2,1).</div>
            <div>- If cell (1,1) has No Stench, resolution derives Not W(1,2) and Not W(2,1).</div>
            <div>- Resolving (Not P And Not W) against (P Or W) derives the Empty Clause [] (Contradiction).</div>
            <div>Hence, OK(1,2) is mathematically guaranteed!</div>
          </div>
        </div>
      </div>

      <div class="pt-2 border-t border-[#202952] flex justify-end">
        <button onclick="closeLogicManualModal()" class="df-btn df-btn-emerald text-[7.5px]">CLOSE MANUAL</button>
      </div>
    </div>
  </div>

  <!-- MODAL: VICTORY SUMMARY -->
  <div id="victory-modal" class="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 hidden">
    <div class="df-frame df-corners p-5 max-w-lg w-full space-y-4 relative border-2 border-[var(--df-gold-bright)]">
      <div class="df-finial-top">▲</div>
      <div class="df-finial-bot">▼</div>

      <div class="flex items-center justify-between border-b border-[#202952] pb-2">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 bg-emerald-400 rotate-45 shadow-[0_0_8px_#10b981]"></div>
          <h3 class="text-[9.5px] text-[#fcedb6] font-bold tracking-wider">EXPEDITION TRIUMPH!</h3>
        </div>
        <button onclick="closeVictoryModal()" class="df-btn text-[7.5px] px-2 py-0.5">X</button>
      </div>

      <div class="space-y-3">
        <div class="grid grid-cols-2 gap-3">
          <div class="df-inset p-3 text-center">
            <span class="text-slate-400 text-[6.5px] block">YOUR FINAL SCORE</span>
            <div class="text-base text-[#fcedb6] mt-1.5 font-bold" id="v-player-score">1000</div>
          </div>
          <div class="df-inset p-3 text-center">
            <span class="text-slate-400 text-[6.5px] block">AIMA THEORETICAL MAX</span>
            <div class="text-base text-emerald-400 mt-1.5 font-bold" id="v-best-score">1100</div>
          </div>
        </div>

        <div class="df-inset p-3 text-[7px] leading-relaxed text-slate-300 space-y-1">
          <div><b class="text-emerald-400">AIMA OPTIMAL DEDUCTION:</b></div>
          <div>1. Safe ingress via resolution proofs at (1,1) -> (1,2) -> (2,1).</div>
          <div>2. Wumpus isolated and eliminated with single arrow.</div>
          <div>3. Gold secured at optimal step count.</div>
        </div>
      </div>

      <div class="flex flex-wrap justify-between items-center gap-2 pt-2 border-t border-[#202952]">
        <button onclick="closeVictoryModal(); showScreen('title');" class="df-btn text-[7px]">
          TITLE MENU
        </button>
        <button onclick="closeVictoryModal(); changeMap(1);" class="df-btn df-btn-emerald text-[7.5px]">
          NEXT EXPEDITION ►
        </button>
      </div>
    </div>
  </div>

  <!-- MODAL: GAME OVER -->
  <div id="gameover-modal" class="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 hidden">
    <div class="df-frame df-corners p-5 max-w-md w-full space-y-4 relative border-2 border-red-700">
      <div class="df-finial-top">▲</div>
      <div class="df-finial-bot">▼</div>

      <div class="flex items-center justify-between border-b border-[#202952] pb-2">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 bg-red-500 rotate-45 shadow-[0_0_8px_#ef4444]"></div>
          <h3 class="text-[9px] text-red-400 font-bold tracking-wider">EXPEDITION FAILED</h3>
        </div>
        <button onclick="closeGameOverModal()" class="df-btn text-[7.5px] px-2 py-0.5">X</button>
      </div>

      <div class="space-y-3">
        <div class="df-inset p-3 border border-red-900/60 text-slate-300 text-[7.5px] leading-relaxed" id="go-reason">
          Archer met an untimely demise in the dark caverns.
        </div>
        <div class="df-inset p-2.5 text-center">
          <span class="text-slate-400 text-[6.5px]">SCORE AT DEATH: </span>
          <span class="text-red-400 text-[8.5px] font-bold" id="go-score">0</span>
        </div>
      </div>

      <div class="flex justify-between items-center pt-2 border-t border-[#202952]">
        <button onclick="closeGameOverModal(); showScreen('title');" class="df-btn text-[7px]">
          TITLE MENU
        </button>
        <button onclick="closeGameOverModal(); resetGame();" class="df-btn df-btn-red text-[7.5px]">
          RETRY EXPEDITION
        </button>
      </div>
    </div>
  </div>

  <!-- MODAL: FORMAL MATHEMATICAL PROOF MODAL -->
  <div id="math-modal" class="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 hidden">
    <div class="df-frame df-corners p-5 max-w-xl w-full space-y-3.5 relative border-2 border-[var(--df-gold-mid)]">
      <div class="df-finial-top">▲</div>
      <div class="df-finial-bot">▼</div>

      <div class="flex items-center justify-between border-b border-[#202952] pb-2">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 bg-amber-400 rotate-45"></div>
          <h3 class="text-[9px] text-[#fcedb6] font-bold tracking-wider">AIMA PROPOSITIONAL PROOF GRIMOIRE</h3>
        </div>
        <button onclick="closeMathModal()" class="df-btn text-[7.5px] px-2 py-0.5">X</button>
      </div>

      <div class="space-y-2 text-[7px] leading-relaxed text-slate-300 max-h-[55vh] overflow-y-auto pr-1">
        <div class="df-inset p-2">
          <b class="text-[#fcedb6]">1. PROPOSITIONAL REFUTATION RESOLUTION:</b><br>
          KB ∧ ¬OK(x,y) ⊢ □ (Empty Clause).<br>
          Resolving (¬Breeze ∧ ¬Stench) against (Pit ∨ Wumpus) derives contradiction, guaranteeing room safety.
        </div>
        <div class="df-inset p-2">
          <b class="text-amber-300">2. WUMPUS ISOLATION THEOREM:</b><br>
          Stench(1,2) ∧ ¬Stench(2,1) ∧ ¬Stench(1,1) ⇒ Wumpus(1,3) UNIQUE (Confidence P = 1.0).
        </div>
        <div class="df-inset p-2">
          <b class="text-emerald-400">3. PAR SCORE OPTIMIZATION:</b><br>
          MaxScore = 1000(Gold) + 1000(ClimbOut) - Steps - 10(Arrow) = <b class="text-emerald-400">1100 PTS</b>.
        </div>
      </div>
      <div class="flex justify-end pt-2 border-t border-[#202952]">
        <button onclick="closeMathModal()" class="df-btn text-[7.5px]">CLOSE</button>
      </div>
    </div>
  </div>

  ${b64Tag}

  <script>
    // ==============================================================
    // 1. AUDIO SYNTHESIZER (WEB AUDIO API)
    // ==============================================================
    let audioCtx = null;
    let soundOn = true;
    function initAudio() {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
    }
    function toggleAudio() {
      soundOn = !soundOn;
      const b = document.getElementById('btn-audio');
      b.innerText = soundOn ? 'AUDIO: ON' : 'AUDIO: OFF';
      b.classList.toggle('active', soundOn);
    }
    function playSfx(freq, type, duration, gainVal, endFreq) {
      if (!soundOn) return;
      try {
        initAudio();
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = type || 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, audioCtx.currentTime + duration);
        g.gain.setValueAtTime(gainVal, audioCtx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        osc.connect(g); g.connect(audioCtx.destination);
        osc.start(); osc.stop(audioCtx.currentTime + duration);
      } catch(e) {}
    }

    // ==============================================================
    // 2. UI ZOOM / SCALING CONTROLLER
    // ==============================================================
    let uiScale = 1.0;
    function setUiScale(scale) {
      uiScale = Math.min(1.4, Math.max(0.7, Math.round(scale * 10) / 10));
      const root = document.documentElement;
      root.style.setProperty('--app-scale', uiScale);
      const app = document.getElementById('app-container');
      if (app) {
        app.style.transform = \`scale(\${uiScale})\`;
      }
      const badge = document.getElementById('zoom-badge');
      if (badge) badge.innerText = Math.round(uiScale * 100) + '%';
    }
    function zoomUi(delta) {
      setUiScale(uiScale + delta);
      playSfx(550, 'sine', 0.08, 0.1);
    }

    // ==============================================================
    // 3. SPRITE LOADING (10 INTACT ASSETS)
    // ==============================================================
    const SPRITE_KEYS = ['idle0', 'idle1', 'walk0', 'walk1', 'walk2', 'walk3', 'shoot0', 'shoot1', 'shoot2', 'arrow'];
    const sprites = {};
    SPRITE_KEYS.forEach(k => {
      sprites[k] = new Image();
      const b64 = (typeof ARCHER_B64 !== 'undefined') ? ARCHER_B64[k] : null;
      sprites[k].onerror = () => { if (b64) sprites[k].src = b64; };
      sprites[k].src = b64 ? b64 : \`/files/archer_\${k}.png\`;
    });

    // ==============================================================
    // 4. AUTHENTIC 21 AIMA MAPS SPECIFICATION
    // ==============================================================
    const WUMPUS_MAPS = ${mapsJson};
    let selectedMapIndex = 0;

    function populateMapBrowser() {
      const grid = document.getElementById("map-cards-grid");
      if (!grid) return;
      grid.innerHTML = "";
      WUMPUS_MAPS.forEach((m, idx) => {
        const card = document.createElement("div");
        card.className = "p-2 bg-[#060a20] border cursor-pointer hover:border-[var(--df-gold-bright)] transition-all flex flex-col justify-between space-y-1 rounded text-center " +
          (selectedMapIndex === idx ? "border-[var(--df-gold-bright)] bg-[#0c153d]" : "border-[#1b2554]");
        card.id = "map-card-" + idx;
        card.onclick = () => {
          selectMap(idx);
          closeMapBrowserModal();
        };

        const title = document.createElement("div");
        title.className = "text-[7.5px] text-[#fcedb6] font-bold";
        title.innerText = m.name;

        const desc = document.createElement("div");
        desc.className = "text-[6px] text-sky-200/70 truncate";
        desc.innerText = m.description;

        const stats = document.createElement("div");
        stats.className = "text-[6px] text-slate-400 pt-1 border-t border-[#151f47] flex justify-around";
        stats.innerHTML = "<span class='text-rose-300'>Pits: " + m.aima.pits.length + "</span>" +
          "<span class='text-amber-300'>Gold: (" + m.aima.gold[0] + "," + m.aima.gold[1] + ")</span>";

        card.appendChild(title);
        card.appendChild(desc);
        card.appendChild(stats);
        grid.appendChild(card);
      });
    }

    function selectMap(idx) {
      selectedMapIndex = (idx + WUMPUS_MAPS.length) % WUMPUS_MAPS.length;
      const cur = WUMPUS_MAPS[selectedMapIndex];

      const nameEl = document.getElementById("title-map-name");
      if (nameEl) nameEl.innerText = cur.name;
      const descEl = document.getElementById("title-map-desc");
      if (descEl) descEl.innerText = cur.description;
      const pitsEl = document.getElementById("title-map-pits");
      if (pitsEl) pitsEl.innerText = cur.aima.pits.length;
      const goldEl = document.getElementById("title-map-gold");
      if (goldEl) goldEl.innerText = "(" + cur.aima.gold[0] + ", " + cur.aima.gold[1] + ")";
      const wumpusEl = document.getElementById("title-map-wumpus");
      if (wumpusEl) wumpusEl.innerText = "(" + cur.aima.wumpus[0] + ", " + cur.aima.wumpus[1] + ")";

      const gameMapBadge = document.getElementById("game-map-name");
      if (gameMapBadge) gameMapBadge.innerText = cur.id === 0 ? "MAP 00 (AIMA)" : "MAP " + cur.id.toString().padStart(2, "0");

      WUMPUS_MAPS.forEach((_, i) => {
        const c = document.getElementById("map-card-" + i);
        if (c) {
          c.classList.toggle("border-[var(--df-gold-bright)]", i === selectedMapIndex);
          c.classList.toggle("bg-[#0c153d]", i === selectedMapIndex);
          c.classList.toggle("border-[#1b2554]", i !== selectedMapIndex);
          c.classList.toggle("bg-[#060a20]", i !== selectedMapIndex);
        }
      });

      mapData.wumpus = { ...cur.canvas.wumpus, alive: true };
      mapData.gold = { ...cur.canvas.gold, collected: false };
      mapData.pits = cur.canvas.pits.map(p => ({ ...p }));

      resetGame();
      showFramedToast("MAP_LOADED", "Loaded " + cur.name + ": " + cur.description);
    }

    function changeMap(delta) {
      selectMap(selectedMapIndex + delta);
      playSfx(330, "triangle", 0.15, 0.15, 550);
    }

    function openMapBrowserModal() {
      populateMapBrowser();
      document.getElementById("map-browser-modal").classList.remove("hidden");
    }
    function closeMapBrowserModal() {
      document.getElementById("map-browser-modal").classList.add("hidden");
    }

    // ==============================================================
    // 5. SCREEN STATE CONTROLLER & TITLE CANVAS LOOP
    // ==============================================================
    let currentScreen = "title";

    function showScreen(screenId) {
      currentScreen = screenId;
      const screens = {
        title: document.getElementById("screen-title"),
        game: document.getElementById("screen-game")
      };

      for (const [key, el] of Object.entries(screens)) {
        if (el) el.classList.toggle("hidden", key !== screenId);
      }

      const navBtns = {
        title: document.getElementById("nav-btn-title"),
        game: document.getElementById("nav-btn-game")
      };
      for (const [key, btn] of Object.entries(navBtns)) {
        if (btn) btn.classList.toggle("active", key === screenId);
      }

      if (screenId === "game") {
        updateUI();
      }
    }

    function openRulesModal() { document.getElementById("rules-modal").classList.remove("hidden"); }
    function closeRulesModal() { document.getElementById("rules-modal").classList.add("hidden"); }
    function openLogicManualModal() { document.getElementById("logic-manual-modal").classList.remove("hidden"); }
    function closeLogicManualModal() { document.getElementById("logic-manual-modal").classList.add("hidden"); }

    // Title Canvas Atmospheric Render
    const titleCanvas = document.getElementById("titleCanvas");
    const tCtx = titleCanvas ? titleCanvas.getContext("2d") : null;
    if (tCtx) tCtx.imageSmoothingEnabled = false;

    let titleTime = 0;
    const titleEmbers = [];
    for (let i = 0; i < 28; i++) {
      titleEmbers.push({
        x: Math.random() * 340,
        y: Math.random() * 220,
        speed: 0.3 + Math.random() * 0.7,
        size: Math.random() > 0.5 ? 2 : 1,
        alpha: 0.2 + Math.random() * 0.8,
        drift: (Math.random() - 0.5) * 0.4
      });
    }

    function renderTitleCanvas() {
      if (currentScreen === "title" && tCtx) {
        titleTime += 0.04;
        tCtx.clearRect(0, 0, titleCanvas.width, titleCanvas.height);

        const cx = titleCanvas.width / 2;
        const cy = titleCanvas.height / 2 + 10;

        // 1. Cavern Stone Background
        tCtx.fillStyle = "#060a1d";
        tCtx.fillRect(0, 0, titleCanvas.width, titleCanvas.height);

        // Stone Pillars
        tCtx.fillStyle = "#0a102b";
        tCtx.fillRect(18, 15, 34, titleCanvas.height - 30);
        tCtx.fillRect(titleCanvas.width - 52, 15, 34, titleCanvas.height - 30);
        tCtx.strokeStyle = "#15214e";
        tCtx.strokeRect(18, 15, 34, titleCanvas.height - 30);
        tCtx.strokeRect(titleCanvas.width - 52, 15, 34, titleCanvas.height - 30);

        // Stone Floor flagstones
        for (let c = 0; c < 6; c++) {
          tCtx.fillStyle = (c % 2 === 0) ? "#090e28" : "#0d1436";
          tCtx.fillRect(c * 57, titleCanvas.height - 48, 57, 48);
          tCtx.strokeStyle = "#1a275a";
          tCtx.strokeRect(c * 57, titleCanvas.height - 48, 57, 48);
        }

        // 2. Archer Idle Breathing State
        const isF1 = Math.sin(titleTime * 3) > 0;
        const archerSprite = isF1 ? sprites.idle1 : sprites.idle0;
        const bobY = Math.sin(titleTime * 3) * 1.5;

        if (archerSprite && archerSprite.complete && archerSprite.naturalWidth > 0) {
          tCtx.save();
          tCtx.translate(cx, cy + bobY);
          tCtx.drawImage(archerSprite, -36, -46, 72, 92);
          tCtx.restore();
        }

        // 3. Dynamic Torchlight Halo Centered on Archer
        const flicker = Math.sin(titleTime * 7) * 4 + Math.cos(titleTime * 13) * 3;
        const lightRadius = 115 + flicker;

        const grad = tCtx.createRadialGradient(cx, cy + bobY - 8, 14, cx, cy + bobY - 8, lightRadius);
        grad.addColorStop(0, "rgba(255, 230, 150, 0.45)");
        grad.addColorStop(0.35, "rgba(245, 160, 40, 0.22)");
        grad.addColorStop(0.7, "rgba(180, 70, 20, 0.08)");
        grad.addColorStop(1.0, "rgba(5, 8, 22, 0.92)");

        tCtx.save();
        tCtx.globalCompositeOperation = "lighter";
        tCtx.fillStyle = grad;
        tCtx.beginPath();
        tCtx.arc(cx, cy + bobY - 8, lightRadius, 0, Math.PI * 2);
        tCtx.fill();
        tCtx.restore();

        // Dark Cavern Vignette overlay
        const darkGrad = tCtx.createRadialGradient(cx, cy + bobY - 8, lightRadius * 0.75, cx, cy + bobY - 8, lightRadius * 1.4);
        darkGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
        darkGrad.addColorStop(1, "rgba(5, 8, 22, 0.95)");
        tCtx.fillStyle = darkGrad;
        tCtx.fillRect(0, 0, titleCanvas.width, titleCanvas.height);

        // 4. Floating Golden Embers
        for (const ember of titleEmbers) {
          ember.y -= ember.speed;
          ember.x += ember.drift + Math.sin(titleTime + ember.y * 0.05) * 0.3;
          if (ember.y < 0) {
            ember.y = titleCanvas.height;
            ember.x = Math.random() * titleCanvas.width;
          }
          tCtx.fillStyle = "rgba(252, 237, 182, " + (ember.alpha * (0.6 + Math.sin(titleTime * 4 + ember.x) * 0.4)) + ")";
          tCtx.fillRect(Math.floor(ember.x), Math.floor(ember.y), ember.size, ember.size);
        }
      }
      requestAnimationFrame(renderTitleCanvas);
    }

    // ==============================================================
    // 6. GAMEPLAY LOGIC & PROCEDURAL RPG MAP ENGINE
    // ==============================================================
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    const GRID = 4;
    const CELL = 120;
    let time = 0;

    let player = {
      x: 0, y: 3,
      startX: 0, startY: 3,
      targetX: 0, targetY: 3,
      facing: 1,
      isWalking: false, walkProgress: 0,
      scale: 1, rotation: 0, alpha: 1,
      isFalling: false, fallTimer: 0,
      animState: 'idle',
      walkTimer: 0, shootPhase: 0, shootTimer: 0
    };

    let score = 1000;
    let arrows = 1;
    let hasGold = false;
    let gameOver = false;

    let arrow = {
      active: false,
      x: 0, y: 0,
      vx: 0, vy: 0,
      trail: []
    };

    const mapData = {
      wumpus: { x: 0, y: 1, alive: true },
      gold: { x: 1, y: 1, collected: false },
      pits: [{ x: 2, y: 3 }, { x: 2, y: 1 }, { x: 3, y: 0 }]
    };

    let visited = Array(4).fill(0).map(() => Array(4).fill(false));
    visited[3][0] = true;

    let motes = [];
    for (let i = 0; i < 35; i++) {
      motes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.6 - 0.2,
        size: Math.random() > 0.5 ? 2 : 1,
        alpha: Math.random() * 0.5 + 0.3
      });
    }

    function resetGame() {
      player = {
        x: 0, y: 3,
        startX: 0, startY: 3,
        targetX: 0, targetY: 3,
        facing: 1,
        isWalking: false, walkProgress: 0,
        scale: 1, rotation: 0, alpha: 1,
        isFalling: false, fallTimer: 0,
        animState: 'idle',
        walkTimer: 0, shootPhase: 0, shootTimer: 0
      };
      arrow.active = false;
      score = 1000; arrows = 1; hasGold = false; gameOver = false;
      mapData.wumpus.alive = true; mapData.gold.collected = false;
      visited = Array(4).fill(0).map(() => Array(4).fill(false));
      visited[3][0] = true;
      updateUI();
    }

    // --- PROCEDURAL RPG DUNGEON DRAWING HELPERS ---
    function drawRpgFloorTile(cctx, x, y, size, isVisited, col, row) {
      const isEven = (col + row) % 2 === 0;
      const baseColor = isEven ? '#121838' : '#162046';
      const sub = size / 2;

      // Dark mortar joints
      cctx.fillStyle = '#050814';
      cctx.fillRect(x, y, size, size);

      // 4 interlocking stone pavers per cell
      const offsets = [
        { dx: 0, dy: 0, w: sub - 1, h: sub - 1 },
        { dx: sub + 1, dy: 0, w: sub - 1, h: sub - 1 },
        { dx: 0, dy: sub + 1, w: sub - 1, h: sub - 1 },
        { dx: sub + 1, dy: sub + 1, w: sub - 1, h: sub - 1 }
      ];

      for (let i = 0; i < offsets.length; i++) {
        const o = offsets[i];
        const sx = x + o.dx;
        const sy = y + o.dy;

        cctx.fillStyle = isVisited ? baseColor : '#090d20';
        cctx.fillRect(sx, sy, o.w, o.h);

        // Highlight bevel (Top & Left)
        cctx.fillStyle = isVisited ? '#222f5e' : '#101730';
        cctx.fillRect(sx, sy, o.w, 1.5);
        cctx.fillRect(sx, sy, 1.5, o.h);

        // Shadow bevel (Bottom & Right)
        cctx.fillStyle = '#060a18';
        cctx.fillRect(sx, sy + o.h - 1.5, o.w, 1.5);
        cctx.fillRect(sx + o.w - 1.5, sy, 1.5, o.h);

        // Weathering speckles on visited stones
        if (isVisited && (col + row + i) % 3 === 0) {
          cctx.fillStyle = '#0a0f26';
          cctx.fillRect(sx + 14, sy + 18, 4, 1);
          cctx.fillRect(sx + 18, sy + 19, 2, 3);
        }
      }

      // Inscribed AIMA Coordinates at Top-Left of room
      const aimaX = col + 1;
      const aimaY = 4 - row;
      cctx.fillStyle = isVisited ? '#415286' : '#1c2647';
      cctx.font = '6.5px "Press Start 2P"';
      cctx.fillText(\`(\${aimaX},\${aimaY})\`, x + 5, y + 13);
    }

    function drawRpgPit(cctx, x, y, size) {
      const cx = x + size / 2;
      const cy = y + size / 2;
      const r = size * 0.38;

      // Outer Jagged Rock Rim
      cctx.fillStyle = '#060814';
      cctx.beginPath();
      cctx.arc(cx, cy, r + 4, 0, Math.PI * 2);
      cctx.fill();

      // Deep Abyssal Void
      cctx.fillStyle = '#010206';
      cctx.beginPath();
      cctx.arc(cx, cy, r, 0, Math.PI * 2);
      cctx.fill();

      // Ethereal Violet Mist Vortex
      const mistGrad = cctx.createRadialGradient(cx, cy, 2, cx, cy, r);
      mistGrad.addColorStop(0, 'rgba(110, 25, 150, 0.6)');
      mistGrad.addColorStop(0.6, 'rgba(45, 10, 70, 0.35)');
      mistGrad.addColorStop(1, 'rgba(1, 2, 6, 0.95)');
      cctx.fillStyle = mistGrad;
      cctx.beginPath();
      cctx.arc(cx, cy, r, 0, Math.PI * 2);
      cctx.fill();

      // Jagged stalagmites along the precipice
      cctx.fillStyle = '#111833';
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
        const px = cx + Math.cos(a) * (r - 2);
        const py = cy + Math.sin(a) * (r - 2);
        cctx.fillRect(px - 2, py - 2, 4, 4);
      }
    }

    function drawRpgGoldChest(cctx, x, y, size, animTime) {
      const cx = x + size / 2;
      const cy = y + size / 2;
      const w = 38; const h = 30;
      const gx = cx - w / 2; const gy = cy - h / 2;

      // Golden Radiance Glow
      const glow = cctx.createRadialGradient(cx, cy, 4, cx, cy, 38);
      glow.addColorStop(0, 'rgba(255, 235, 140, 0.55)');
      glow.addColorStop(0.6, 'rgba(245, 160, 20, 0.2)');
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      cctx.fillStyle = glow;
      cctx.fillRect(cx - 40, cy - 40, 80, 80);

      // Wooden Chest Body
      cctx.fillStyle = '#78350f';
      cctx.fillRect(gx, gy + 8, w, h - 8);
      // Chest Lid (Barrel Top)
      cctx.fillStyle = '#92400e';
      cctx.fillRect(gx + 2, gy, w - 4, 10);
      cctx.fillStyle = '#b45309';
      cctx.fillRect(gx + 4, gy + 1, w - 8, 3);

      // Gilded Gold Bands
      cctx.fillStyle = '#fbbf24';
      cctx.fillRect(gx + 6, gy, 4, h);
      cctx.fillRect(gx + w - 10, gy, 4, h);

      // Lock Plate & Keyhole
      cctx.fillStyle = '#fef08a';
      cctx.fillRect(cx - 4, gy + 11, 8, 8);
      cctx.fillStyle = '#451a03';
      cctx.fillRect(cx - 1.5, gy + 13, 3, 4);

      // Sparkle Glint Star
      const glint = (Math.sin(animTime * 6) + 1) / 2;
      if (glint > 0.4) {
        cctx.fillStyle = '#ffffff';
        const sx = gx + 5; const sy = gy + 2;
        cctx.fillRect(sx - 2, sy, 5, 1);
        cctx.fillRect(sx, sy - 2, 1, 5);
      }
    }

    function drawRpgWumpus(cctx, x, y, size, isAlive, animTime) {
      const cx = x + size / 2;
      const cy = y + size / 2;

      if (isAlive) {
        const breathe = Math.sin(animTime * 4) * 2;
        // Shaggy Beast Body
        cctx.fillStyle = '#4c0519';
        cctx.fillRect(cx - 24, cy - 20 + breathe, 48, 42);
        cctx.fillStyle = '#831843';
        cctx.fillRect(cx - 20, cy - 24 + breathe, 40, 10);
        cctx.fillRect(cx - 26, cy - 8 + breathe, 6, 20);
        cctx.fillRect(cx + 20, cy - 8 + breathe, 6, 20);

        // Frightening Glowing Eyes
        cctx.fillStyle = '#fbbf24';
        cctx.fillRect(cx - 14, cy - 12 + breathe, 7, 5);
        cctx.fillRect(cx + 7, cy - 12 + breathe, 7, 5);
        cctx.fillStyle = '#ef4444';
        cctx.fillRect(cx - 12, cy - 11 + breathe, 3, 3);
        cctx.fillRect(cx + 9, cy - 11 + breathe, 3, 3);

        // Sharp Fangs & Maw
        cctx.fillStyle = '#000000';
        cctx.fillRect(cx - 10, cy + 3 + breathe, 20, 8);
        cctx.fillStyle = '#fef3c7';
        cctx.fillRect(cx - 8, cy + 3 + breathe, 3, 4);
        cctx.fillRect(cx - 1, cy + 3 + breathe, 3, 4);
        cctx.fillRect(cx + 5, cy + 3 + breathe, 3, 4);
      } else {
        // Slumped Slain Beast Corpse
        cctx.fillStyle = '#1e293b';
        cctx.fillRect(cx - 22, cy + 5, 44, 20);
        cctx.fillStyle = '#0f172a';
        cctx.fillRect(cx - 25, cy + 18, 50, 8);
        cctx.fillStyle = '#ef4444';
        cctx.font = '7px "Press Start 2P"';
        cctx.fillText('SLAIN', cx - 18, cy + 2);
      }
    }

    function render() {
      time += 0.05;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Render RPG Flagstone Dungeon Tiles & Entities
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          const x = c * CELL; const y = r * CELL;
          const isVis = visited[r][c];

          // Draw procedural RPG Stone Paver Tile
          drawRpgFloorTile(ctx, x, y, CELL, isVis, c, r);

          if (isVis) {
            // Entities
            if (mapData.gold.collected === false && mapData.gold.x === c && mapData.gold.y === r) {
              drawRpgGoldChest(ctx, x, y, CELL, time);
            }
            if (mapData.pits.some(p => p.x === c && p.y === r)) {
              drawRpgPit(ctx, x, y, CELL);
            }
            if (mapData.wumpus.x === c && mapData.wumpus.y === r) {
              drawRpgWumpus(ctx, x, y, CELL, mapData.wumpus.alive, time);
            }
          }
        }
      }

      // 2. Exact Center of Player coordinates with smooth walk interpolation
      let px, py;
      if (player.isWalking) {
        player.walkProgress += 0.045; // 4-phase stride progression
        if (player.walkProgress >= 1.0) {
          player.walkProgress = 1.0;
          player.x = player.targetX;
          player.y = player.targetY;
          player.isWalking = false;
          player.animState = 'idle';
          visited[player.y][player.x] = true;

          const nx = player.x; const ny = player.y;
          let hasBreeze = mapData.pits.some(p => Math.abs(p.x - nx) + Math.abs(p.y - ny) === 1);
          let hasStench = Math.abs(mapData.wumpus.x - nx) + Math.abs(mapData.wumpus.y - ny) === 1;
          let hasGlitter = !mapData.gold.collected && (mapData.gold.x === nx && mapData.gold.y === ny);

          updateProofGrimoire(nx, ny, hasBreeze, hasStench);
          updateUI();

          if (mapData.pits.some(p => p.x === nx && p.y === ny)) {
            player.isFalling = true;
            player.animState = 'fall';
            gameOver = true;
            score -= 1000;
            openGameOverDialog('PIT');
          } else if (mapData.wumpus.alive && mapData.wumpus.x === nx && mapData.wumpus.y === ny) {
            gameOver = true;
            score -= 1000;
            openGameOverDialog('WUMPUS');
          }
        }
        px = (player.startX + (player.targetX - player.startX) * player.walkProgress) * CELL + CELL / 2;
        py = (player.startY + (player.targetY - player.startY) * player.walkProgress) * CELL + CELL / 2;
      } else {
        px = player.x * CELL + CELL / 2;
        py = player.y * CELL + CELL / 2;
      }

      // 3. Falling / Death Animation Handler
      if (player.isFalling) {
        player.fallTimer += 0.05;
        player.scale = Math.max(0, 1 - player.fallTimer * 1.5);
        player.rotation += 0.3;
        player.alpha = Math.max(0, 1 - player.fallTimer);
      }

      // 4. Arrow Flying Flight Animation
      if (arrow.active) {
        arrow.x += arrow.vx;
        arrow.y += arrow.vy;
        arrow.trail.push({ x: arrow.x, y: arrow.y, alpha: 0.8 });

        ctx.strokeStyle = 'rgba(252, 237, 182, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        arrow.trail.forEach((p, idx) => {
          p.alpha -= 0.05;
          if (idx === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();
        arrow.trail = arrow.trail.filter(p => p.alpha > 0);

        ctx.save();
        ctx.translate(arrow.x, arrow.y);
        ctx.drawImage(sprites.arrow, -6, -17, 12, 34);
        ctx.restore();

        const aCol = Math.floor(arrow.x / CELL);
        const aRow = Math.floor(arrow.y / CELL);

        if (mapData.wumpus.alive && aCol === mapData.wumpus.x && aRow === mapData.wumpus.y) {
          arrow.active = false;
          mapData.wumpus.alive = false;
          playSfx(140, 'sawtooth', 0.8, 0.35, 60);
          showFramedToast('SCREAM');
          updateUI();
        } else if (arrow.x < 0 || arrow.x > canvas.width || arrow.y < 0 || arrow.y > canvas.height) {
          arrow.active = false;
        }
      }

      // 5. Select Active Archer Sprite Frame
      let spriteToDraw = sprites.idle0;
      if (player.animState === 'idle') {
        const isF1 = Math.sin(time * 3) > 0;
        spriteToDraw = isF1 ? sprites.idle1 : sprites.idle0;
      } else if (player.animState === 'walk') {
        player.walkTimer += 0.22;
        const cycleProgress = player.walkTimer % 4;
        const stepIdx = Math.floor(cycleProgress);
        const walkCycle = [sprites.walk0, sprites.walk1, sprites.walk2, sprites.walk3];
        spriteToDraw = walkCycle[stepIdx] || sprites.walk0;
      } else if (player.animState === 'shoot') {
        player.shootTimer += 0.08;
        if (player.shootTimer < 0.2) spriteToDraw = sprites.shoot0;
        else if (player.shootTimer < 0.4) spriteToDraw = sprites.shoot1;
        else {
          spriteToDraw = sprites.shoot2;
          if (player.shootTimer > 0.6) player.animState = 'idle';
        }
      }

      // 6. Draw Player Archer
      ctx.save();
      ctx.translate(px, py);
      ctx.scale(player.facing * player.scale, player.scale);
      ctx.rotate(player.rotation);
      ctx.globalAlpha = player.alpha;

      const SPRITE_RENDER_W = 46;
      const SPRITE_RENDER_H = 58;

      if (spriteToDraw && spriteToDraw.complete && spriteToDraw.naturalWidth > 0) {
        ctx.drawImage(spriteToDraw, -SPRITE_RENDER_W / 2, -SPRITE_RENDER_H / 2 - 2, SPRITE_RENDER_W, SPRITE_RENDER_H);
      }
      ctx.restore();

      // 7. Godot-Style 2D Dynamic Radial Torch Lighting (Centered on Player)
      applyGodotSmoothLighting(ctx, px, py);

      // 8. Floating Golden Dust Motes in Cavern Air
      ctx.save();
      for (const m of motes) {
        m.x += m.vx; m.y += m.vy;
        if (m.y < 0) { m.y = canvas.height; m.x = Math.random() * canvas.width; }
        if (m.x < 0) m.x = canvas.width;
        if (m.x > canvas.width) m.x = 0;

        const dist = Math.hypot(m.x - px, m.y - py);
        if (dist < 180) {
          const lum = (1 - dist / 180) * m.alpha;
          ctx.fillStyle = \`rgba(252, 237, 182, \${lum})\`;
          ctx.fillRect(Math.floor(m.x), Math.floor(m.y), m.size, m.size);
        }
      }
      ctx.restore();

      requestAnimationFrame(render);
    }

    // Centered Godot-Style 2D Radial Light Shader
    function applyGodotSmoothLighting(c, lx, ly) {
      c.save();
      c.globalCompositeOperation = 'multiply';

      const flicker = Math.sin(time * 6) * 3 + Math.cos(time * 11) * 2;
      const torchRadius = 155 + flicker;

      const lightGrad = c.createRadialGradient(lx, ly, 15, lx, ly, torchRadius);
      lightGrad.addColorStop(0, 'rgba(255, 245, 200, 1.0)');
      lightGrad.addColorStop(0.3, 'rgba(240, 190, 100, 0.95)');
      lightGrad.addColorStop(0.65, 'rgba(140, 80, 40, 0.55)');
      lightGrad.addColorStop(1.0, 'rgba(5, 8, 22, 0.05)');

      c.fillStyle = lightGrad;
      c.fillRect(0, 0, canvas.width, canvas.height);

      c.globalCompositeOperation = 'source-over';
      const fogGrad = c.createRadialGradient(lx, ly, torchRadius * 0.65, lx, ly, torchRadius * 1.55);
      fogGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      fogGrad.addColorStop(0.6, 'rgba(5, 8, 22, 0.7)');
      fogGrad.addColorStop(1.0, 'rgba(4, 6, 18, 0.96)');

      c.fillStyle = fogGrad;
      c.fillRect(0, 0, canvas.width, canvas.height);

      for (let r = 0; r < 4; r++) {
        for (let col = 0; col < 4; col++) {
          if (!visited[r][col]) {
            const cellDist = Math.hypot((col + 0.5) * CELL - lx, (r + 0.5) * CELL - ly);
            if (cellDist > torchRadius) {
              c.fillStyle = 'rgba(4, 7, 20, 0.96)';
              c.fillRect(col * CELL, r * CELL, CELL, CELL);
            }
          }
        }
      }
      c.restore();
    }

    // --- GAME ACTIONS & MOVEMENT ---
    function movePlayer(dx, dy) {
      if (player.isWalking || gameOver) return;
      const nx = player.x + dx;
      const ny = player.y + dy;

      if (nx < 0 || nx >= GRID || ny < 0 || ny >= GRID) {
        showFramedToast('BUMP');
        playSfx(180, 'square', 0.15, 0.2);
        return;
      }

      if (dx !== 0) player.facing = dx > 0 ? 1 : -1;

      player.startX = player.x;
      player.startY = player.y;
      player.targetX = nx;
      player.targetY = ny;
      player.isWalking = true;
      player.walkProgress = 0;
      player.animState = 'walk';
      score -= 1;

      playSfx(140, 'triangle', 0.1, 0.2);
      updateUI();
    }

    function triggerShoot(dir) {
      if (arrows <= 0 || gameOver || arrow.active) return;
      arrows -= 1;
      score -= 10;
      player.animState = 'shoot';
      player.shootTimer = 0;

      arrow.active = true;
      arrow.x = player.x * CELL + CELL / 2;
      arrow.y = player.y * CELL + CELL / 2;
      arrow.trail = [];

      arrow.vx = 0; arrow.vy = -18;
      playSfx(380, 'sawtooth', 0.25, 0.2, 700);
      updateUI();
    }

    function triggerGrab() {
      if (gameOver) return;
      if (!mapData.gold.collected && player.x === mapData.gold.x && player.y === mapData.gold.y) {
        mapData.gold.collected = true;
        hasGold = true;
        score += 1000;
        playSfx(587, 'sine', 0.3, 0.25, 880);
        showFramedToast('GOLD_COLLECTED');
        updateUI();
      }
    }

    function triggerClimbUp() {
      if (gameOver) return;
      if (player.x === 0 && player.y === 3 && hasGold) {
        gameOver = true;
        playSfx(523, 'triangle', 0.5, 0.3, 1046);
        openVictoryDialog(score, 1100);
      } else if (player.x === 0 && player.y === 3 && !hasGold) {
        showFramedToast('CAUTION', 'Cavern entrance reached, but the Gold remains unfound!');
      } else {
        showFramedToast('CAUTION', 'You must return to (1,1) to climb out and escape!');
      }
    }

    // --- UI UPDATERS & PROOF STREAM ---
    function updateUI() {
      const aimaX = player.x + 1;
      const aimaY = 4 - player.y;

      const posEl = document.getElementById('pos-stat');
      if (posEl) posEl.innerText = \`(\${aimaX}, \${aimaY})\`;
      const scoreEl = document.getElementById('score-stat');
      if (scoreEl) scoreEl.innerText = score;
      const arrowBadge = document.getElementById('arrow-count-badge');
      if (arrowBadge) arrowBadge.innerText = \`ARROWS: \${arrows}\`;

      const curMap = WUMPUS_MAPS[selectedMapIndex];
      const gameMapBadge = document.getElementById('game-map-name');
      if (gameMapBadge && curMap) {
        gameMapBadge.innerText = curMap.id === 0 ? "MAP 00 (AIMA)" : "MAP " + curMap.id.toString().padStart(2, "0");
      }

      // Update Perception Ribbons
      const hasBreeze = mapData.pits.some(p => Math.abs(p.x - player.x) + Math.abs(p.y - player.y) === 1);
      const hasStench = Math.abs(mapData.wumpus.x - player.x) + Math.abs(mapData.wumpus.y - player.y) === 1;
      const hasGlitter = !mapData.gold.collected && (mapData.gold.x === player.x && mapData.gold.y === player.y);

      const breezeEl = document.getElementById('sense-breeze');
      const stenchEl = document.getElementById('sense-stench');
      const glitterEl = document.getElementById('sense-glitter');
      const safeEl = document.getElementById('sense-safe');

      if (breezeEl) breezeEl.classList.toggle('hidden', !hasBreeze);
      if (stenchEl) stenchEl.classList.toggle('hidden', !hasStench);
      if (glitterEl) glitterEl.classList.toggle('hidden', !hasGlitter);
      if (safeEl) safeEl.classList.toggle('hidden', hasBreeze || hasStench || hasGlitter);
    }

    function updateProofGrimoire(col, row, breeze, stench) {
      const stream = document.getElementById('proof-stream');
      if (!stream) return;
      const aimaX = col + 1;
      const aimaY = 4 - row;

      const card = document.createElement('div');
      card.className = 'df-inset p-2 border-l-2 border-l-[var(--df-gold-bright)] text-slate-300 space-y-1';

      let perceptStr = [];
      if (breeze) perceptStr.push('<span class="text-sky-300">Breeze</span>');
      if (stench) perceptStr.push('<span class="text-emerald-400">Stench</span>');
      if (perceptStr.length === 0) perceptStr.push('<span class="text-slate-400">Clear Air</span>');

      let inference = '';
      if (!breeze && !stench) {
        inference = \`KB ∧ ¬Breeze(\${aimaX},\${aimaY}) ∧ ¬Stench(\${aimaX},\${aimaY}) ⊢ <b class="text-emerald-400">Adjacent Cells Proven Safe</b>\`;
      } else if (stench) {
        inference = \`Stench(\${aimaX},\${aimaY}) ⊢ <b class="text-rose-300">Wumpus Candidate in Orthogonal Cells</b>\`;
      } else {
        inference = \`Breeze(\${aimaX},\${aimaY}) ⊢ <b class="text-sky-300">Pit Candidate in Orthogonal Cells</b>\`;
      }

      card.innerHTML = \`
        <div class="flex justify-between items-center text-[6.5px] border-b border-[#1b2554] pb-0.5">
          <span class="text-[#fcedb6] font-bold">ROOM (\${aimaX}, \${aimaY}) PROOF</span>
          <span>\${perceptStr.join(' • ')}</span>
        </div>
        <div class="text-[6.5px] leading-relaxed">\${inference}</div>
      \`;

      stream.prepend(card);
      while (stream.children.length > 5) stream.removeChild(stream.lastChild);
    }

    function showFramedToast(type, text) {
      const t = document.createElement('div');
      t.className = 'fixed top-12 left-1/2 -translate-x-1/2 z-50 df-frame df-corners px-4 py-2 flex items-center gap-2 shadow-2xl animate-bounce';

      let msg = text || '';
      let badge = '';
      if (type === 'BUMP') {
        msg = 'Wall Boundary Reached! (Bump perceived)';
        badge = '<span class="px-2 py-0.5 bg-red-950 text-red-300 border border-red-600 font-bold text-[7.5px]">BUMP</span>';
      } else if (type === 'GOLD_COLLECTED') {
        msg = 'Gold treasure secured! (+1000 pts)';
        badge = '<span class="px-2 py-0.5 bg-amber-500 text-black font-bold text-[7.5px]">GOLD +1000</span>';
      } else if (type === 'SCREAM') {
        msg = 'Distant agonizing howl: The Wumpus has been slain!';
        badge = '<span class="px-2 py-0.5 bg-rose-950 text-rose-300 border border-rose-600 font-bold text-[7.5px]">SCREAM</span>';
      } else if (type === 'MAP_LOADED') {
        msg = text;
        badge = '<span class="px-2 py-0.5 bg-sky-900 text-sky-200 border border-sky-500 font-bold text-[7.5px]">MAP LOADED</span>';
      } else if (type === 'CAUTION') {
        msg = text;
        badge = '<span class="px-2 py-0.5 bg-amber-950 text-amber-300 border border-amber-600 font-bold text-[7.5px]">NOTICE</span>';
      }

      t.innerHTML = \`
        <div class="df-finial-top">▲</div>
        \${badge}
        <span class="text-[#fcedb6] text-[7.5px] font-bold">\${msg}</span>
      \`;
      document.body.appendChild(t);
      setTimeout(() => { if (t) t.remove(); }, 3200);
    }

    // Modal Control Functions
    function openVictoryDialog(pScore, bScore) {
      document.getElementById('v-player-score').innerText = pScore;
      document.getElementById('v-best-score').innerText = bScore;
      document.getElementById('victory-modal').classList.remove('hidden');
      playSfx(523, 'triangle', 0.4, 0.25);
    }
    function closeVictoryModal() { document.getElementById('victory-modal').classList.add('hidden'); }

    function openGameOverDialog(reason) {
      document.getElementById('go-score').innerText = score;
      document.getElementById('go-reason').innerText = reason === 'PIT'
        ? 'Archer stepped into a bottomless pit chasm.'
        : 'Archer was ambushed and devoured by the Wumpus.';
      document.getElementById('gameover-modal').classList.remove('hidden');
      playSfx(110, 'sawtooth', 0.5, 0.25);
    }
    function closeGameOverModal() { document.getElementById('gameover-modal').classList.add('hidden'); }
    function openMathProofFromVictory() { document.getElementById('math-modal').classList.remove('hidden'); }
    function closeMathModal() { document.getElementById('math-modal').classList.add('hidden'); }

    // Keyboard Bindings
    window.addEventListener('keydown', e => {
      // Zoom Shortcuts: '+' or '=' to zoom in, '-' to zoom out, '0' to reset
      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        zoomUi(0.1);
        return;
      }
      if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        zoomUi(-0.1);
        return;
      }
      if (e.key === '0') {
        e.preventDefault();
        setUiScale(1.0);
        return;
      }

      if (currentScreen === 'title') {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          showScreen('game');
          playSfx(440, 'triangle', 0.2, 0.2, 880);
        } else if (e.key === 'h' || e.key === 'H') {
          e.preventDefault();
          openRulesModal();
        } else if (e.key === 'm' || e.key === 'M') {
          e.preventDefault();
          openLogicManualModal();
        } else if (e.key === 's' || e.key === 'S') {
          e.preventDefault();
          toggleAudio();
        }
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        showScreen('title');
        return;
      }

      if (currentScreen === 'game') {
        if (gameOver) return;
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') { e.preventDefault(); movePlayer(0, -1); }
        if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') { e.preventDefault(); movePlayer(0, 1); }
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') { e.preventDefault(); movePlayer(-1, 0); }
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') { e.preventDefault(); movePlayer(1, 0); }
        if (e.key === ' ') { e.preventDefault(); triggerShoot('UP'); }
        if (e.key === 'g' || e.key === 'G') { e.preventDefault(); triggerGrab(); }
        if (e.key === 'c' || e.key === 'C') { e.preventDefault(); triggerClimbUp(); }
      }
    });

    // Initialize Map System & Start Loops
    selectMap(0);
    populateMapBrowser();
    showScreen("title");
    requestAnimationFrame(renderTitleCanvas);
    requestAnimationFrame(render);
  </script>
</body>
</html>`;
}

// Generate companion html (references /files/archer_b64.js)
const companionHtml = generateHtml(false);
fs.writeFileSync('.superpowers/brainstorm/session/content/archer-and-pixel-frames.html', companionHtml, 'utf8');

// Generate inlined standalone html (for wumpus_preview.html and index.html)
const inlinedHtml = generateHtml(true);
fs.writeFileSync('/Users/dieptuhuy/.gemini/antigravity/brain/51cdc300-3a2f-4800-8d7e-d056543d88ca/wumpus_preview.html', inlinedHtml, 'utf8');
fs.writeFileSync('index.html', inlinedHtml, 'utf8');

console.log('Successfully generated centered RPG game across all files!');
