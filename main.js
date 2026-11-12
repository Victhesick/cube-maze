const $ = (id) => document.getElementById(id);
const levels = [
 {name:"The First Turn",difficulty:"BEGINNER",hint:"A simple path. Find the golden key, then reach the portal.",map:["#########","#S..#...#","#.#.#.#E#","#.#...#.#","#.###.#.#","#K....#.#","###.#...#","#.......#","#########"]},
 {name:"Switchback",difficulty:"BEGINNER",hint:"The purple switch opens the cyan gate. Find the switch before the exit.",map:["#########","#S..#...#","#.#.#.#E#","#.#...#.#","#.###G#.#","#...#...#","###.#.#.#","#...F...#","#########"]},
 {name:"Key Theory",difficulty:"INTERMEDIATE",hint:"Collect both keys. The red door won't open until you have them.",map:["#########","#S..#..E#","#.#.#.#D#","#.#...#.#","#.###.#.#","#K..#...#","#.#.#.###","#...K...#","#########"]},
 {name:"The Split",difficulty:"INTERMEDIATE",hint:"A longer route with a locked door and a switch-controlled gate.",map:["#########","#S..#...#","#.#.#.#E#","#.#D..#.#","#.###G#.#","#K..#...#","###.#.#.#","#...F...#","#########"]},
 {name:"Double Trouble",difficulty:"ADVANCED",hint:"Two keys, one switch, and a winding route. Plan before you turn.",map:["#########","#S..#..E#","#.#.#.#.#","#.#D..#.#","#.###G#.#","#K..#...#","###.#.#.#","#...F.K.#","#########"]},
 {name:"The Grand Twist",difficulty:"EXPERT",hint:"The final maze. Collect the key, activate the switch, and escape.",map:["#########","#S..#...#","#.#.#.#E#","#.#...#D#","#.###G#.#","#K..#...#","###.#.#.#","#...F...#","#########"]}
];
const directions={U:[0,-1],R:[1,0],D:[0,1],L:[-1,0]};
let levelIndex=0, grid=[], player={x:1,y:1}, start={x:1,y:1}, keys=0, totalKeys=0, switchOn=false, steps=0, history=[], active=false, toastTimer;
function showToast(message){const t=$("toast");t.textContent=message;t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),1500)}
function renderLevels(){
 $("levels").innerHTML=levels.map((l,i)=>`<button class="level-card" data-level="${i}"><span class="num">MAZE ${String(i+1).padStart(2,"0")}</span><strong>${l.name}</strong><small>${l.hint}</small><span class="difficulty">${l.difficulty} · 9 × 9</span></button>`).join("");
 document.querySelectorAll("[data-level]").forEach(b=>b.addEventListener("click",()=>startLevel(+b.dataset.level)));
}
function startLevel(i){
 levelIndex=i;grid=levels[i].map.map(row=>row.split(""));keys=0;switchOn=false;steps=0;history=[];active=true;
 const sy=grid.findIndex(r=>r.includes("S"));player={x:grid[sy].indexOf("S"),y:sy};start={...player};
 totalKeys=grid.flat().filter(c=>c==="K").length;
 $("intro").classList.add("hidden");$("win").classList.add("hidden");$("game").classList.remove("hidden");
 $("level-label").textContent=`LEVEL ${String(i+1).padStart(2,"0")}`;$("level-title").textContent=levels[i].name;
 $("hint").textContent=levels[i].hint;$("objective").textContent=totalKeys?`Find ${totalKeys} ${totalKeys===1?"key":"keys"} and the exit`:"Reach the exit";
 update();
}
function update(){
 $("steps").textContent=steps;$("keys").textContent=`${keys}/${totalKeys}`;$("switch-state").textContent=switchOn?"ON":"OFF";$("switch-state").classList.toggle("on",switchOn);
 const board=$("board");board.innerHTML="";
 for(let y=0;y<9;y++)for(let x=0;x<9;x++){
  const c=grid[y][x],el=document.createElement("div");el.className="cell";
  if(c==="#")el.classList.add("wall");else el.classList.add("floor");
  if(c==="S")el.classList.add("start");
  if(c==="K") {el.classList.add("key");el.textContent="✦"}
  if(c==="D"){el.classList.add("door");el.textContent="🔒"}
  if(c==="G"){el.classList.add("gate");el.textContent=switchOn?"◌":"▥"}
  if(c==="F"){el.classList.add("switch");el.textContent="✧"}
  if(c==="E"){el.classList.add("exit");el.textContent="◉"}
  if(player.x===x&&player.y===y)el.classList.add("player");
  board.appendChild(el);
 }
}
function move(face){
 if(!active)return;
 if(face==="B"){undo();return}
 if(face==="F"){history.push(snapshot());switchOn=!switchOn;steps++;$("last-turn").textContent="F · SWITCH";update();showToast(switchOn?"Switch activated":"Switch deactivated");return}
 const delta=directions[face];if(!delta)return;
 const nx=player.x+delta[0],ny=player.y+delta[1],tile=grid[ny]?.[nx];
 if(!tile||tile==="#"){ $("last-turn").textContent=face+" · BLOCKED";showToast("Blocked by a wall");return}
 if(tile==="D"&&keys<2){showToast("You need two keys for this door");return}
 if(tile==="G"&&!switchOn){showToast("Activate the switch first");return}
 history.push(snapshot());player={x:nx,y:ny};steps++;$("last-turn").textContent=face+(face==="U"?" ↑":face==="R"?" →":face==="D"?" ↓":" ←");
 if(tile==="K"){keys++;grid[ny][nx]=".";showToast("Key collected!")}
 update();
 if(tile==="E"){active=false;setTimeout(winLevel,250)}
}
function snapshot(){return {player:{...player},keys,switchOn,steps,grid:grid.map(r=>r.slice())}}
function undo(){if(!history.length){showToast("Nothing to undo");return}const s=history.pop();player=s.player;keys=s.keys;switchOn=s.switchOn;steps=s.steps;grid=s.grid;$("last-turn").textContent="B · UNDO";update()}
function winLevel(){
 $("game").classList.add("hidden");$("win").classList.remove("hidden");
 $("win-title").textContent=["Great first escape!","Switch master!","Key collector!","Pathfinder!","Puzzle pro!","Maze champion!"][levelIndex];
 $("win-copy").textContent=`You cleared ${levels[levelIndex].name} in ${steps} turns and collected ${keys} key${keys===1?"":"s"}.`;
 $("next").textContent=levelIndex===levels.length-1?"PLAY AGAIN →":"NEXT LEVEL →";
}
function backToLevels(){$("game").classList.add("hidden");$("win").classList.add("hidden");$("intro").classList.remove("hidden");active=false}
$("back").addEventListener("click",backToLevels);$("levels-back").addEventListener("click",backToLevels);
$("reset").addEventListener("click",()=>startLevel(levelIndex));
$("next").addEventListener("click",()=>startLevel((levelIndex+1)%levels.length));
document.querySelectorAll("[data-move]").forEach(b=>b.addEventListener("click",()=>move(b.dataset.move)));
window.addEventListener("keydown",e=>{const key=e.key.toUpperCase();if("URDLFB".includes(key)){e.preventDefault();move(key)}});
renderLevels();

// The acubemy SDK exposes cube events in the plugin host. Keep keyboard/touch
// controls available for desktop preview and environments without a connected cube.
function attachCube(){
 const candidates=[window.acubemy,window.Acubemy,window.cube,window.Cube];
 for(const api of candidates){
  if(!api)continue;
  if(typeof api.onMove==="function"){api.onMove(m=>{const face=String(m?.face||m?.move||m||"").toUpperCase()[0];if("URDLFB".includes(face))move(face)});$("connection").innerHTML="<i></i><span>Smart cube connected</span>";return}
  if(typeof api.on==="function"){api.on("move",m=>{const face=String(m?.face||m?.move||m||"").toUpperCase()[0];if("URDLFB".includes(face))move(face)});$("connection").innerHTML="<i></i><span>Smart cube connected</span>";return}
 }
}
attachCube();
