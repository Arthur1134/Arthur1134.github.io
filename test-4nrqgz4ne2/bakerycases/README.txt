Bakery Cases v1.0.0 - Retro Gaming Dad / Arthur McConnell
Single-file HTML5 tray-sort puzzle (index.html == bakery_cases.html). 44 levels.
src/: core.js (rules+solver+level maker), gen.js (level generator -> levels.json), music.js (WebAudio radio), shell.html (UI), build.js, smoke.js.
Rebuild: cd src; node gen.js; node build.js; node smoke.js   (smoke proves every level solvable + open-slot rules)
Difficulty curve (harder than Cassette Rack v1.2): L1-3: 4 flavors, 12 open slots. L4-6: 5 flavors + turn stands, 8-12 open. L7-10: 6 flavors + closed stand. L11-15 cooling ice, 7 flavors. L16-22 turn-required. L23-32: 7 flavors, ice+lock+turn. L33-44: 8 flavors, 8 open slots, 5 ice, 3 turn stands.
Debug: index.html#play=N opens level N+1.
