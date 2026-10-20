// test/logic_engine.test.js
const assert = require('assert');
const { WumpusLogicEngine, WumpusGameState } = require('../src/logic_engine.js');

console.log("=== RUNNING AIMA LOGIC & GAME STATE TEST SUITE ===");

// 1. Test Grid Adjacency
{
  const engine = new WumpusLogicEngine(4);
  const adj11 = engine.getAdjacent(1, 1);
  assert.deepStrictEqual(adj11.sort(), [[1, 2], [2, 1]].sort(), "Adjacency of (1,1) should be (1,2) and (2,1)");

  const adj22 = engine.getAdjacent(2, 2);
  assert.strictEqual(adj22.length, 4, "Adjacency of interior cell (2,2) should have 4 neighbors");
  console.log("✓ Test 1: Grid Adjacency verified");
}

// 2. Test Safe Room Deduction (No Breeze, No Stench at 1,1)
{
  const engine = new WumpusLogicEngine(4);
  engine.addPercept(1, 1, { breeze: false, stench: false });
  
  assert.strictEqual(engine.isSafe(1, 2), true, "(1,2) must be proven safe when (1,1) has no breeze and no stench");
  assert.strictEqual(engine.isSafe(2, 1), true, "(2,1) must be proven safe when (1,1) has no breeze and no stench");
  assert.strictEqual(engine.isSafe(3, 1), false, "(3,1) status must remain unproven/unknown");
  console.log("✓ Test 2: Safe room inference via refutation verified");
}

// 3. Test Wumpus Location Deduction via Clause Resolution
{
  const engine = new WumpusLogicEngine(4);
  // At (1,1): no stench
  engine.addPercept(1, 1, { breeze: false, stench: false });
  // At (2,1): no stench -> adjacent cells (2,2), (3,1) cannot have Wumpus
  engine.addPercept(2, 1, { breeze: false, stench: false });
  // At (1,2): stench perceived -> Wumpus must be in adjacent {(1,3), (2,2)}
  engine.addPercept(1, 2, { breeze: false, stench: true });

  const deduction = engine.resolveWumpusLocation();
  assert.deepStrictEqual(deduction.location, [1, 3], "Clause resolution must isolate Wumpus at (1,3)");
  assert.strictEqual(deduction.confidence, 1.0, "Wumpus deduction confidence must be 1.0");
  console.log("✓ Test 3: Wumpus clause resolution refutation proof verified");
}

// 4. Test Game State & Score Economy
{
  const state = new WumpusGameState({
    wumpus: [1, 3],
    gold: [2, 3],
    pits: [[3, 1], [3, 3], [4, 4]],
    start: [1, 1]
  });

  assert.strictEqual(state.score, 1000, "Initial score must be 1000");
  assert.strictEqual(state.arrows, 1, "Player starts with 1 arrow");

  // Move forward to (1,2)
  state.moveForward();
  assert.strictEqual(state.playerPos[1], 2, "Player should be at (1,2)");
  assert.strictEqual(state.score, 999, "Moving costs 1 point (1000 - 1 = 999)");

  // Turn Right (now facing East)
  state.turnRight();
  assert.strictEqual(state.playerDir, 'E', "Player should face East");
  assert.strictEqual(state.score, 998, "Turning costs 1 point (999 - 1 = 998)");

  // Turn Left back to North
  state.turnLeft();
  assert.strictEqual(state.playerDir, 'N', "Player should face North");

  // Shoot arrow at Wumpus (Wumpus is at 1,3, directly North of 1,2)
  const shootResult = state.shoot();
  assert.strictEqual(shootResult.hit, true, "Arrow shot North from (1,2) should hit Wumpus at (1,3)");
  assert.strictEqual(state.wumpusAlive, false, "Wumpus must be slain");
  assert.strictEqual(state.arrows, 0, "Arrow count should now be 0");
  assert.strictEqual(state.score, 987, "Arrow shoot costs 10 points (997 - 10 = 987)");

  console.log("✓ Test 4: Game state economy and arrow mechanics verified");
}

// 5. Test Gold Grab and Victory Condition
{
  const state = new WumpusGameState({
    wumpus: [1, 3],
    gold: [1, 2],
    pits: [[3, 3]],
    start: [1, 1]
  });

  state.moveForward(); // to (1,2) where gold is
  const grabResult = state.grab();
  assert.strictEqual(grabResult.success, true, "Gold grab at (1,2) should succeed");
  assert.strictEqual(state.hasGold, true, "State hasGold must be true");
  assert.strictEqual(state.score, 1999, "Grabbing gold awards +1000 points (999 + 1000 = 1999)");

  // Move back to (1,1) and climb
  state.turnLeft();
  state.turnLeft();
  state.moveForward(); // at (1,1)
  const climbResult = state.climb();
  assert.strictEqual(climbResult.won, true, "Climbing at (1,1) with gold triggers Victory");
  console.log("✓ Test 5: Gold grab and victory exit verified");
}

console.log("=== ALL AIMA LOGIC & STATE TESTS PASSED ===");
