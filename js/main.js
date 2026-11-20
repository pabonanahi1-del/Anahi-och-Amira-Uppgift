
// Find the dance floor
const dancefloor = document.getElementById("dancefloor");

if (dancefloor) {

  // Colours used in the game
  const colors = ["cyan", "pink", "purple", "dark"];

  // Create 40 pixel tiles
  const numberOfTiles = 40;
  const tiles = [];

  for (let i = 0; i < numberOfTiles; i++) {

    const tile = document.createElement("div");

    tile.classList.add("dance-tile");

    dancefloor.appendChild(tile);

    tiles.push(tile);
  }

  // Change the colours
  function changeFloor() {

    tiles.forEach((tile, index) => {

      // Create a repeating but varied colour pattern
      const colorIndex = (
        index * 3 + Math.floor(Math.random() * colors.length)
      ) % colors.length;

      tile.className = "dance-tile " + colors[colorIndex];

    });

  }

  // Start with the first colour pattern
  changeFloor();

  // Slowly change the colours
  setInterval(changeFloor, 1400);

}
