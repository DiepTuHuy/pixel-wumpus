# AIMA Propositional Knowledge Base Specification: Wumpus World

> **Formal Verification & Theoretical Grounding**  
> Based on Stuart Russell & Peter Norvig, *Artificial Intelligence: A Modern Approach (AIMA)*, Chapter 7: *Logical Agents*.  
> Implementation verified in [`src/logic_engine.js`](../src/logic_engine.js) and [`test/logic_engine.test.js`](../test/logic_engine.test.js).

---

## 1. Overview & System Architecture

In this implementation of the Wumpus World, agent reasoning is governed by a **sound and complete Propositional Knowledge Base ($\text{KB}$)**. Every move and deduction follows propositional calculus, transformation into Conjunctive Normal Form (CNF), and theorem proving via **proof by refutation resolution**:

$$\text{KB} \wedge \neg \alpha \vdash \square \quad (\text{Empty Clause / Contradiction})$$

When the refutation algorithm derives an empty clause $\square$, the safety of the target room or the location of the Wumpus is mathematically guaranteed ($\text{KB} \models \alpha$).

---

## 2. Propositional Symbols (Tập ký hiệu mệnh đề)

The environment is an $N \times N$ orthogonal grid (canonical $4 \times 4$). Coordinates follow the standard AIMA mathematical notation $[x, y]$ where $x \in \{1, 2, 3, 4\}$ denotes columns (West to East) and $y \in \{1, 2, 3, 4\}$ denotes rows (South to North).

| Symbol | Description | Count ($4 \times 4$) |
| :--- | :--- | :--- |
| $P_{x,y}$ | True if room $(x,y)$ contains a bottomless **Pit** | 16 |
| $W_{x,y}$ | True if room $(x,y)$ contains the ravenous **Wumpus** | 16 |
| $B_{x,y}$ | True if the agent perceives a **Breeze** in room $(x,y)$ | 16 |
| $S_{x,y}$ | True if the agent perceives a **Stench** in room $(x,y)$ | 16 |
| $G_{x,y}$ | True if the agent perceives a **Glitter** in room $(x,y)$ (Gold location) | 16 |
| $OK_{x,y}$ | True if room $(x,y)$ is **guaranteed safe** to enter | 16 |

### Adjacency Definition
For any room $(x,y)$, its adjacent orthogonal chambers are:
$$\text{Adj}(x,y) = \{(i,j) \mid |i - x| + |j - y| = 1, \; 1 \le i,j \le 4\}$$

---

## 3. AIMA Domain Axioms (Hệ tiên đề cơ sở)

The initial Knowledge Base $\text{KB}_0$ contains the structural axioms governing the physics of the cave:

### Axiom 1: Initial Entry Safety
The agent starts at $(1,1)$, which is unconditionally guaranteed to contain no Pit and no alive Wumpus:
$$\neg P_{1,1} \wedge \neg W_{1,1} \implies OK_{1,1}$$

### Axiom 2: Breeze Equivalence (Nguyên lý cảm nhận Gió)
A room has a Breeze if and only if at least one adjacent room contains a Pit:
$$B_{x,y} \iff \bigvee_{(i,j) \in \text{Adj}(x,y)} P_{i,j}$$

### Axiom 3: Stench Equivalence (Nguyên lý cảm nhận Mùi hôi)
A room has a Stench if and only if at least one adjacent room contains the Wumpus:
$$S_{x,y} \iff \bigvee_{(i,j) \in \text{Adj}(x,y)} W_{i,j}$$

### Axiom 4: Exactly-One-Wumpus Rule (Định lý duy nhất Wumpus)
There is exactly one Wumpus in the cavern:
1. **At least one Wumpus**:
   $$\bigvee_{x=1}^4 \bigvee_{y=1}^4 W_{x,y}$$
2. **At most one Wumpus**:
   $$\bigwedge_{(x_1,y_1) \neq (x_2,y_2)} (\neg W_{x_1,y_1} \vee \neg W_{x_2,y_2})$$

### Axiom 5: Safe Room Definition (Định nghĩa phòng an toàn)
A room is safe if and only if it contains neither a Pit nor a Wumpus:
$$OK_{x,y} \iff \neg P_{x,y} \wedge \neg W_{x,y}$$

---

## 4. Conjunctive Normal Form (CNF) Clauses

To execute resolution, biconditionals $\alpha \iff \beta$ are converted into CNF clauses:
$$\alpha \iff \beta \equiv (\neg \alpha \vee \beta) \wedge (\alpha \vee \neg \beta)$$

### Example: Cell $(1,1)$ Adjacent to $(1,2)$ and $(2,1)$

#### Breeze CNF Transformation:
$$B_{1,1} \iff (P_{1,2} \vee P_{2,1})$$
Produces three CNF clauses:
1. $(\neg B_{1,1} \vee P_{1,2} \vee P_{2,1})$
2. $(\neg P_{1,2} \vee B_{1,1})$
3. $(\neg P_{2,1} \vee B_{1,1})$

#### Stench CNF Transformation:
$$S_{1,1} \iff (W_{1,2} \vee W_{2,1})$$
Produces three CNF clauses:
1. $(\neg S_{1,1} \vee W_{1,2} \vee W_{2,1})$
2. $(\neg W_{1,2} \vee S_{1,1})$
3. $(\neg W_{2,1} \vee S_{1,1})$

---

## 5. Refutation Resolution Proof ($\text{KB} \wedge \neg \alpha \vdash \square$)

### Proving Safe Ingress to Room $(1,2)$
When entering $(1,1)$, the agent perceives no breeze ($\neg B_{1,1}$) and no stench ($\neg S_{1,1}$).  
We seek to mathematically prove $\alpha = OK_{1,2}$.

#### Step-by-Step Resolution Trace:

| Step | Clause / Assertion | Origin / Justification |
| :--- | :--- | :--- |
| 1 | $\neg B_{1,1}$ | Percept at $(1,1)$ |
| 2 | $\neg S_{1,1}$ | Percept at $(1,1)$ |
| 3 | $(\neg P_{1,2} \vee B_{1,1})$ | CNF Axiom of Breeze at $(1,1)$ |
| 4 | $(\neg W_{1,2} \vee S_{1,1})$ | CNF Axiom of Stench at $(1,1)$ |
| 5 | $\mathbf{\neg P_{1,2}}$ | Resolution of (1) and (3) |
| 6 | $\mathbf{\neg W_{1,2}}$ | Resolution of (2) and (4) |
| 7 | $\neg OK_{1,2} \equiv (P_{1,2} \vee W_{1,2})$ | **Negation of Goal (Refutation Assumption)** |
| 8 | $W_{1,2}$ | Resolution of (5) and (7) |
| 9 | $\mathbf{\square}$ (**Contradiction**) | Resolution of (6) and (8) |

Since the assumption $\neg OK_{1,2}$ leads to a contradiction ($\square$), the theorem is proved:
$$\text{KB} \models OK_{1,2} \quad (\text{Proven Safe with } P = 1.0)$$

---

## 6. Wumpus Isolation & Arrow Targeting Theorem

When an agent perceives a Stench $S_{x,y}$, candidate cells are collected. The isolation theorem resolves the exact location of the Wumpus:

1. **At $(1,2)$**: Stench perceived $\implies (W_{1,1} \vee W_{1,3} \vee W_{2,2})$.
2. Since $(1,1)$ was already visited, $\text{KB} \ni \neg W_{1,1}$.
   $$\text{Resolvent 1}: (W_{1,3} \vee W_{2,2})$$
3. Agent backtracks and moves to $(2,1)$: No stench perceived ($\neg S_{2,1}$).
   $$\text{Axiom}: \neg S_{2,1} \implies \neg W_{2,2} \wedge \neg W_{3,1} \wedge \neg W_{1,1}$$
4. **Unit Propagation**:
   - Resolving $(W_{1,3} \vee W_{2,2})$ with unit literal $\neg W_{2,2}$ yields:
   $$\mathbf{W_{1,3}} \quad (\text{Unit Clause, Confidence } P = 1.0)$$
5. The agent faces North at $(1,2)$ and shoots. Arrow propagation along the column $x=1$ is guaranteed to slay the monster.

---

## 7. Implementation & Code Traceability

| Component | Code Location | Mechanism |
| :--- | :--- | :--- |
| **Logic Engine** | [`src/logic_engine.js`](../src/logic_engine.js#L7-L108) | `WumpusLogicEngine` class maintaining `notPitRooms`, `notWumpusRooms`, and `safeRooms` sets. |
| **Percept Processor** | [`src/logic_engine.js`](../src/logic_engine.js#L36-L72) | `addPercept(x, y, { breeze, stench })`: Unit propagation for $\neg B \implies \forall \text{adj}, \neg P$ and $\neg S \implies \forall \text{adj}, \neg W$. |
| **Wumpus Solver** | [`src/logic_engine.js`](../src/logic_engine.js#L82-L107) | `resolveWumpusLocation()`: Candidate set intersection with eliminated $\neg W$ rooms. |
| **Runtime Grimoire** | [`index.html`](../index.html#L2738-L2771) | `updateProofGrimoire(col, row, breeze, stench)`: Live rendering of propositional proof cards in HUD. |
| **Logic Manual Modal**| [`index.html`](../index.html#L506-L547) | In-game reference modal explaining CNF axioms and refutation rules. |
| **Unit Test Suite** | [`test/logic_engine.test.js`](../test/logic_engine.test.js) | 6 verification suites passing 100%: Adjacency, Safe Room Refutation, Wumpus Isolation, Score Economy, Gold Grab, and All 21 AIMA Maps. |
