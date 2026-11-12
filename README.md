# Cube Maze

A maze-and-puzzle mini-game for acubemy smart cubes.

## Gameplay
- Navigate six handcrafted 9×9 mazes.
- Collect keys to unlock doors.
- Activate switches to open gates.
- Reach the portal to clear each maze.
- Press **B** to undo your last move.

## Controls
| Cube move | Action |
|---|---|
| U | Move up |
| R | Move right |
| D | Move down |
| L | Move left |
| F | Toggle switches |
| B | Undo |

Desktop preview supports keyboard keys `U R D L F B`; touch controls are also included.

## Install
Upload the contents of this folder to a public GitHub repository with `index.html` at the repository root, then paste the repository URL into acubemy → Games & Plugins.

## Local preview
Run `npx serve --cors .` in this folder and open the local URL.

## Note
The game includes keyboard and touch controls for preview. Smart-cube event hookup uses the acubemy SDK's `onMove` event when exposed by the plugin host; confirm the connection indicator in your acubemy environment before playing with hardware.
