Bakery Cases v1.0.4 - Retro Gaming Dad / Arthur McConnell
v1.0.3: Sold-stand labels use short names (Berry/Choco/Lilac/…) so Strawberry/Chocolate no longer clip on phone.
Single-file HTML5 tray-sort puzzle (index.html == bakery_cases.html). 44 levels.
src/: core.js (rules+solver+level maker), gen.js (level generator -> levels.json), music.js (WebAudio radio), shell.html (UI), build.js, smoke.js.
Rebuild: cd src; node gen.js; node build.js; node smoke.js   (smoke proves every level solvable + open-slot rules)
Difficulty curve (harder than Cassette Rack v1.2): L1-3: 4 flavors, 12 open slots. L4-6: 5 flavors + turn stands, 8-12 open. L7-10: 6 flavors + closed stand. L11-15 cooling ice, 7 flavors. L16-22 turn-required. L23-32: 7 flavors, ice+lock+turn. L33-44: 8 flavors, 8 open slots, 5 ice, 3 turn stands.
Debug: index.html#play=N opens level N+1.

v1.0.1 (2026-11-02)
- All 44 cases re-verified solvable by the built-in solver (smoke 239/0).
- Case polish: thicker wood/brass display frame, deeper glass, stronger stands & plates,
  bigger SOLD badge, striped "locked" glass on closed stands, purple glow on turn stands,
  clearer ice, punchier sweets, bigger selected lift.
- New "How to Play" screen on the title. Toasts hide when a modal opens. Small-height phone fit.

v1.0.2 (2026-11-02)
- Smarter Hint: weighted A* search (shorter paths) + per-first-move scoring that rewards sell-outs,
  opening closed stands and stacking on matching tops, and penalizes undoing recent moves or
  shuffling the same flavor between the same two stands. No more Lemon ping-pong on Case 7.
- Hint toast now says it in words ("move Lemon from Tier 3 onto Tier 4") and still highlights both stands.
- Closed-stand coaching: clearer Case 7 intro; tip after repeated hints/undos while nothing is sold out.
