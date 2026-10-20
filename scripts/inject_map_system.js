// scripts/inject_map_system.js
const fs = require('fs');
const path = require('path');

const targetHtmlPath = path.resolve('.superpowers/brainstorm/session/content/archer-and-pixel-frames.html');
const mapsJsonPath = path.resolve('src/maps_data.json');

let html = fs.readFileSync(targetHtmlPath, 'utf8');
const mapsJson = fs.readFileSync(mapsJsonPath, 'utf8');

// 1. ADD MAP SELECTOR WIDGET TO SCREEN-TITLE
const mapSelectorWidget = `    <!-- Map Selection Carousel & Browser -->
    <div class="df-frame df-corners p-3.5 w-full max-w-md relative bg-[#060b24]">
      <div class="df-finial-top">▲</div>
      <div class="flex items-center justify-between border-b border-[#1b2554] pb-1.5 mb-2.5">
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
    </div>`;

const actionMenuMarker = `    <!-- Main Action Menu -->`;
if (html.includes(actionMenuMarker) && !html.includes('id="title-map-name"')) {
  html = html.replace(actionMenuMarker, mapSelectorWidget + '\n\n' + actionMenuMarker);
  console.log('✓ Injected mapSelectorWidget into screen-title');
}

// 2. ADD MAP BROWSER MODAL
const mapBrowserModal = `  <!-- ============================================================== -->
  <!-- MODAL: MAP BROWSER (ALL 21 AIMA MAPS)                          -->
  <!-- ============================================================== -->
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

      <!-- 21 Maps Grid Container -->
      <div id="map-cards-grid" class="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[55vh] overflow-y-auto pr-1">
        <!-- Populated dynamically via JS -->
      </div>

      <div class="pt-2 border-t border-[#202952] flex justify-between items-center text-[6.5px] text-slate-400">
        <span>CLICK ANY MAP TO LOAD IMMEDIATELY</span>
        <button onclick="closeMapBrowserModal()" class="df-btn text-[7.5px]">
          CLOSE
        </button>
      </div>
    </div>
  </div>\n\n`;

const rulesModalMarker = `<!-- ============================================================== -->\n  <!-- MODAL: RULES & PERCEPTIONS`;
if (html.includes(rulesModalMarker) && !html.includes('id="map-browser-modal"')) {
  html = html.replace(rulesModalMarker, mapBrowserModal + rulesModalMarker);
  console.log('✓ Injected mapBrowserModal');
}

// 3. UPDATE GAME SCREEN HEADER WITH MAP SWITCHER
const oldGameHeaderLeft = `<button onclick="resetGame()" class="df-btn text-[7px] py-1">
          RESTART MAP
        </button>
        <button onclick="showScreen('studio')" class="df-btn text-[7px] py-1">
          STUDIO
        </button>`;

const newGameHeaderLeft = `<div class="flex items-center gap-1 bg-[#060a1d] border border-[#202952] px-1.5 py-0.5">
          <button onclick="changeMap(-1)" class="text-[7.5px] text-[#fcedb6] hover:text-white px-1">◄</button>
          <span id="game-map-name" class="text-[7px] text-[#fcedb6] font-bold px-1">MAP 00</span>
          <button onclick="changeMap(1)" class="text-[7.5px] text-[#fcedb6] hover:text-white px-1">►</button>
        </div>
        <button onclick="resetGame()" class="df-btn text-[7px] py-1">
          RESTART
        </button>
        <button onclick="changeMap(1)" class="df-btn df-btn-emerald text-[7px] py-1">
          NEXT MAP ►
        </button>
        <button onclick="showScreen('studio')" class="df-btn text-[7px] py-1">
          STUDIO
        </button>`;

if (html.includes(oldGameHeaderLeft)) {
  html = html.replace(oldGameHeaderLeft, newGameHeaderLeft);
  console.log('✓ Updated game screen header with map switcher');
}

// 4. INJECT MAPS ARRAY AND MAP SELECTION JS
const mapsCode = `
    // ==============================================================
    // 21 AUTHENTIC AIMA MAPS SPECIFICATION
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

      // Update Start Screen Widget
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

      // Update Game Header Badge
      const gameMapBadge = document.getElementById("game-map-name");
      if (gameMapBadge) gameMapBadge.innerText = cur.id === 0 ? "MAP 00 (AIMA)" : "MAP " + cur.id.toString().padStart(2, "0");

      // Update Map Cards active highlight in modal
      WUMPUS_MAPS.forEach((_, i) => {
        const c = document.getElementById("map-card-" + i);
        if (c) {
          c.classList.toggle("border-[var(--df-gold-bright)]", i === selectedMapIndex);
          c.classList.toggle("bg-[#0c153d]", i === selectedMapIndex);
          c.classList.toggle("border-[#1b2554]", i !== selectedMapIndex);
          c.classList.toggle("bg-[#060a20]", i !== selectedMapIndex);
        }
      });

      // Load into mapData
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
`;

const stateControllerMarker = `let currentScreen = "title";`;
if (html.includes(stateControllerMarker) && !html.includes('const WUMPUS_MAPS =')) {
  html = html.replace(stateControllerMarker, mapsCode + '\n    ' + stateControllerMarker);
  console.log('✓ Injected WUMPUS_MAPS and map control functions');
}

// Update showFramedToast with MAP_LOADED badge
const oldToastMarker = `} else if (type === 'SCREAM') {`;
const newToastHandling = `} else if (type === 'MAP_LOADED') {
        msg = text;
        badge = '<span class="px-2 py-0.5 bg-sky-900 text-sky-200 border border-sky-500 font-bold text-[7.5px]">MAP LOADED</span>';
      } else if (type === 'SCREAM') {`;
if (html.includes(oldToastMarker) && !html.includes('MAP LOADED')) {
  html = html.replace(oldToastMarker, newToastHandling);
  console.log('✓ Added MAP_LOADED toast type');
}

// Update init calls at bottom
const oldInitMarker = `// Start Loops\n    showScreen("title");`;
const newInitCalls = `// Initialize Map System & Browser
    selectMap(0);
    populateMapBrowser();

    // Start Loops
    showScreen("title");`;
if (html.includes(oldInitMarker) && !html.includes('selectMap(0);')) {
  html = html.replace(oldInitMarker, newInitCalls);
  console.log('✓ Initialized map system on launch');
}

fs.writeFileSync(targetHtmlPath, html, 'utf8');

// Synchronize wumpus_preview.html and index.html
const b64Src = fs.readFileSync(path.resolve('.superpowers/brainstorm/session/content/archer_b64.js'), 'utf8');
const inlined = html.replace(
  `<script src="/files/archer_b64.js"></script>`,
  `<script>\n${b64Src}\n</script>`
);

fs.writeFileSync('/Users/dieptuhuy/.gemini/antigravity/brain/51cdc300-3a2f-4800-8d7e-d056543d88ca/wumpus_preview.html', inlined, 'utf8');
fs.writeFileSync('index.html', inlined, 'utf8');

console.log('✓ Synchronized archer-and-pixel-frames.html, wumpus_preview.html, and index.html');
