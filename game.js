// Define your player and enemy objects
let player = {
  name: 'Emby',
  level: 1,
  health: 100,
  action: 0,
  stats: {
    currentHP:100,
    maximumHP:100,
    attack: 10,
    defense: 5,
    speed: 7,
    ultimate: 1
  }
}

let enemy = {
  name: 'Draggle',
  level: 1,
  health: 100,
  action: 0,
  stats: {
    currentHP:100,
    maximumHP:100,
    attack: 8,
    defense: 6,
    speed: 6,
    ultimate: 1
  }
}

// Populate the menus
document.getElementById('player-name').innerText = player.name;
document.getElementById('player-level').innerText = `Level: ${player.level}`;
document.getElementById('player-health-bar').style.width = `${player.health}%`;
document.getElementById('player-stats').innerText = `Attack: ${player.stats.attack} Defense: ${player.stats.defense} Speed: ${player.stats.speed}`;
document.getElementById('player-ultimate-bar').style.width = `${player.ultimate}%`;

document.getElementById('enemy-name').innerText = enemy.name;
document.getElementById('enemy-level').innerText = `Level: ${enemy.level}`;
document.getElementById('enemy-health-bar').style.width = `${enemy.health}%`;
document.getElementById('enemy-stats').innerText = `Attack: ${enemy.stats.attack} Defense: ${enemy.stats.defense} Speed: ${enemy.stats.speed}`;
document.getElementById('enemy-ultimate-bar').style.width = `${enemy.ultimate}%`;


function increaseUltimate() {
  player.stats.ultimate += 1;
  enemy.stats.ultimate += 1;
  
  // Ensure the ultimate doesn't exceed 100%
  if (player.stats.ultimate > 100) player.stats.ultimate = 100;
  if (enemy.ultimate > 100) enemy.stats.ultimate = 100;
  
  // Update the ultimate bars
  document.getElementById('player-ultimate-bar').style.width = `${player.ultimate}%`;
  document.getElementById('enemy-ultimate-bar').style.width = `${enemy.ultimate}%`;
}

// Increase the ultimate every second
setInterval(increaseUltimate, 1000);


// defining player globally

window.onload = function() {
  const battlefield = document.getElementById('battlefield');
  
  // Generate 3 cells per row

  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 3; j++) {
      const cell = document.createElement('div');
      battlefield.children[i].appendChild(cell);
    }
  }
  
  // Let's put the player in the first row middle cell

  player = document.createElement('img'); // using the global player variable

  player.src = 'embygif.gif'; 
  

  player.style.width = '45%';
  player.style.height = '90%';
  battlefield.children[5].children[1].appendChild(player);
  
  // Let's put an enemy in the last row middle cell
  enemy = document.createElement('img'); // using the global player variable

  enemy.src = 'dragglegif.gif'; 
  

  enemy.style.width = '25%';
  enemy.style.height = '65%';

  battlefield.children[0].children[1].appendChild(enemy);
  


 // code for player movement
 // code for player movement
document.addEventListener('keydown', function (event) {
  const key = event.key; // "a", "s", "d", "w"
  const playerCell = player.parentElement;
  const rowIndex = Array.from(battlefield.children).indexOf(playerCell.parentElement);
  const columnIndex = Array.from(playerCell.parentElement.children).indexOf(playerCell);
  switch (key) {
    case 's':
      // check if it's possible to move up and if the destination is not rows 1,2, or 3
      if (rowIndex < 5 && rowIndex >= 3) {
        // remove player from the current cell
        playerCell.removeChild(playerCell.children[0]);
        // add player to the cell above
        battlefield.children[rowIndex + 1].children[columnIndex].appendChild(player);
      }
      break;
    case 'w':
      // check if it's possible to move down and if the destination is not rows 1,2, or 3
      if (rowIndex > 0 && rowIndex > 3) {
        // remove player from the current cell
        playerCell.removeChild(playerCell.children[0]);
        // add player to the cell below
        battlefield.children[rowIndex - 1].children[columnIndex].appendChild(player);
      }
      break;
    case 'a':
      // check if it's possible to move left
      if (columnIndex > 0) {
        // remove player from the current cell
        playerCell.removeChild(playerCell.children[0]);
        // add player to the cell to the left
        battlefield.children[rowIndex].children[columnIndex - 1].appendChild(player);
      }
      break;
    case 'd':
      // check if it's possible to move right
      if (columnIndex < 2) {
        // remove player from the current cell
        playerCell.removeChild(playerCell.children[0]);
        // add player to the cell to the right
        battlefield.children[rowIndex].children[columnIndex + 1].appendChild(player);
      }
      break;
  }
});
}

var canvas = document.getElementById('battlefield-overlay');
var ctx = canvas.getContext('2d');

// resize the canvas to fill its container
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

// draw the trapezoid
ctx.beginPath();
ctx.moveTo(0.3 * canvas.width, 0);
ctx.lineTo(0.7 * canvas.width, 0);
ctx.lineTo(canvas.width, 1 * canvas.height);
ctx.lineTo(0, 1 * canvas.height);
ctx.closePath();

// fill the trapezoid
ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; // change this as needed
ctx.fill();

// draw the grid lines
ctx.beginPath();
ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'; // set the color of the lines
ctx.lineWidth = 2; // set the width of the lines

let start_x = 0.1667 * canvas.width;  // This is 1/6 of the width, the left margin assuming your battlefield occupies middle 2/3
let end_x = 0.8333 * canvas.width;  // This is 5/6 of the width, the right margin assuming your battlefield occupies middle 2/3

// draw horizontal lines
ctx.moveTo(start_x + 165, 0.1 * canvas.height);
ctx.lineTo(end_x - 165, 0.1 * canvas.height);

ctx.moveTo(start_x + 108, 0.22 * canvas.height);
ctx.lineTo(end_x - 108, 0.22 * canvas.height);

ctx.moveTo(start_x + 41, 0.36 * canvas.height);
ctx.lineTo(end_x - 41, 0.36 * canvas.height);

ctx.moveTo(start_x - 36 , 0.52 * canvas.height);
ctx.lineTo(end_x + 36 , 0.52 * canvas.height);

ctx.moveTo(start_x - 124, 0.7 * canvas.height);
ctx.lineTo(end_x + 124, 0.7 * canvas.height);

// draw vertical lines
// for (let i = 1; i <= 2; i++) {
let top1 = canvas.width * (0.1 + 0.8 * 1.43 / 3.4);
let bottom1 = canvas.width * 1 / 3;
let top2 = canvas.width * (0.1 + 0.8 * 1.97 / 3.4)
let bottom2 = canvas.width * 2 / 3;
ctx.moveTo(top1, 0);
ctx.lineTo(bottom1, canvas.height);
ctx.moveTo(top2, 0);
ctx.lineTo(bottom2, canvas.height)
// }

ctx.stroke();


 