// src/logic_engine.js
/**
 * AIMA Propositional Logic & Wumpus Game State Engine
 * Implements Russell & Norvig's Propositional Logic inference and refutation resolution.
 */

class WumpusLogicEngine {
  constructor(size = 4) {
    this.size = size;
    this.percepts = new Map(); // key: "x,y" -> { breeze, stench }
    this.safeRooms = new Set();
    this.notPitRooms = new Set();
    this.notWumpusRooms = new Set();
    this.stenchSources = new Map(); // "x,y" -> candidate cells
    this.breezeSources = new Map();

    // Cell (1,1) is always safe
    this.safeRooms.add("1,1");
    this.notPitRooms.add("1,1");
    this.notWumpusRooms.add("1,1");
  }

  getAdjacent(x, y) {
    const res = [];
    const deltas = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    for (const [dx, dy] of deltas) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 1 && nx <= this.size && ny >= 1 && ny <= this.size) {
        res.push([nx, ny]);
      }
    }
    return res;
  }

  addPercept(x, y, { breeze, stench }) {
    const key = `${x},${y}`;
    this.percepts.set(key, { breeze, stench });
    this.safeRooms.add(key);
    this.notPitRooms.add(key);
    this.notWumpusRooms.add(key);

    const adj = this.getAdjacent(x, y);

    // If ¬Breeze(x,y): ∀ (i,j) ∈ Adj(x,y), ¬Pit(i,j)
    if (!breeze) {
      for (const [ax, ay] of adj) {
        this.notPitRooms.add(`${ax},${ay}`);
      }
    } else {
      this.breezeSources.set(key, adj);
    }

    // If ¬Stench(x,y): ∀ (i,j) ∈ Adj(x,y), ¬Wumpus(i,j)
    if (!stench) {
      for (const [ax, ay] of adj) {
        this.notWumpusRooms.add(`${ax},${ay}`);
      }
    } else {
      this.stenchSources.set(key, adj);
    }

    // Infer Safe: OK(i,j) ⟺ ¬Pit(i,j) ∧ ¬Wumpus(i,j)
    for (let i = 1; i <= this.size; i++) {
      for (let j = 1; j <= this.size; j++) {
        const cKey = `${i},${j}`;
        if (this.notPitRooms.has(cKey) && this.notWumpusRooms.has(cKey)) {
          this.safeRooms.add(cKey);
        }
      }
    }
  }

  isSafe(x, y) {
    return this.safeRooms.has(`${x},${y}`);
  }

  /**
   * Refutation Clause Resolution for Wumpus location
   * Resolves: Stench(x,y) ∧ ¬Wumpus(other) ⊢ Wumpus(isolated)
   */
  resolveWumpusLocation() {
    if (this.stenchSources.size === 0) return { location: null, confidence: 0 };

    let candidateSets = [];
    for (const [sKey, neighbors] of this.stenchSources.entries()) {
      // Filter out neighbors that are proven ¬Wumpus
      const plausible = neighbors.filter(([nx, ny]) => !this.notWumpusRooms.has(`${nx},${ny}`));
      candidateSets.push(plausible);
    }

    if (candidateSets.length === 0) return { location: null, confidence: 0 };

    // Find intersection of all candidate sets
    let common = candidateSets[0];
    for (let i = 1; i < candidateSets.length; i++) {
      common = common.filter(([cx, cy]) => 
        candidateSets[i].some(([ox, oy]) => ox === cx && oy === cy)
      );
    }

    if (common.length === 1) {
      return { location: common[0], confidence: 1.0, proof: "Refutation clause resolution reached single unit literal." };
    }

    return { location: common[0] || null, confidence: common.length > 0 ? 1.0 / common.length : 0 };
  }
}

class WumpusGameState {
  constructor(config = {}) {
    this.size = config.size || 4;
    this.wumpus = config.wumpus || [1, 3];
    this.gold = config.gold || [2, 3];
    this.pits = config.pits || [[3, 1], [3, 3]];
    this.start = config.start || [1, 1];

    this.playerPos = [...this.start];
    this.playerDir = 'N'; // N, E, S, W
    this.score = 1000;
    this.arrows = 1;
    this.hasGold = false;
    this.wumpusAlive = true;
    this.gameOver = false;
    this.won = false;
    this.visited = new Set([`${this.start[0]},${this.start[1]}`]);
  }

  turnRight() {
    if (this.gameOver) return;
    const dirs = ['N', 'E', 'S', 'W'];
    const idx = dirs.indexOf(this.playerDir);
    this.playerDir = dirs[(idx + 1) % 4];
    this.score -= 1;
  }

  turnLeft() {
    if (this.gameOver) return;
    const dirs = ['N', 'E', 'S', 'W'];
    const idx = dirs.indexOf(this.playerDir);
    this.playerDir = dirs[(idx + 3) % 4];
    this.score -= 1;
  }

  moveForward() {
    if (this.gameOver) return { success: false, bumped: false };
    this.score -= 1;

    let [x, y] = this.playerPos;
    if (this.playerDir === 'N') y += 1;
    else if (this.playerDir === 'S') y -= 1;
    else if (this.playerDir === 'E') x += 1;
    else if (this.playerDir === 'W') x -= 1;

    // Check Wall Bump
    if (x < 1 || x > this.size || y < 1 || y > this.size) {
      return { success: false, bumped: true };
    }

    this.playerPos = [x, y];
    this.visited.add(`${x},${y}`);

    // Check Pit
    const isPit = this.pits.some(([px, py]) => px === x && py === y);
    if (isPit) {
      this.score -= 1000;
      this.gameOver = true;
      return { success: true, dead: true, reason: 'Fell into a bottomless Pit!' };
    }

    // Check Alive Wumpus
    if (this.wumpusAlive && this.wumpus[0] === x && this.wumpus[1] === y) {
      this.score -= 1000;
      this.gameOver = true;
      return { success: true, dead: true, reason: 'Devoured by the Ravenous Wumpus!' };
    }

    return { success: true, dead: false };
  }

  shoot() {
    if (this.gameOver || this.arrows <= 0) return { hit: false };
    this.arrows -= 1;
    this.score -= 10;

    let [x, y] = this.playerPos;
    let hit = false;

    // Arrow travels in straight line in playerDir
    while (true) {
      if (this.playerDir === 'N') y += 1;
      else if (this.playerDir === 'S') y -= 1;
      else if (this.playerDir === 'E') x += 1;
      else if (this.playerDir === 'W') x -= 1;

      if (x < 1 || x > this.size || y < 1 || y > this.size) break;

      if (this.wumpusAlive && this.wumpus[0] === x && this.wumpus[1] === y) {
        this.wumpusAlive = false;
        hit = true;
        break;
      }
    }

    return { hit, scream: hit };
  }

  grab() {
    if (this.gameOver || this.hasGold) return { success: false };
    if (this.playerPos[0] === this.gold[0] && this.playerPos[1] === this.gold[1]) {
      this.hasGold = true;
      this.score += 1000;
      return { success: true };
    }
    return { success: false };
  }

  climb() {
    if (this.gameOver) return { won: false };
    if (this.playerPos[0] === 1 && this.playerPos[1] === 1 && this.hasGold) {
      this.won = true;
      this.gameOver = true;
      return { won: true, score: this.score };
    }
    return { won: false };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { WumpusLogicEngine, WumpusGameState };
}
