
// Find the background element
const stage = document.getElementById("stage");

// Check that PixiJS is loaded
if (!stage || !window.PIXI) {
  console.error("PixiJS or stage could not be found.");
} else {

  // Create Pixi application
  const app = new PIXI.Application();

  async function start() {

    await app.init({
      resizeTo: window,
      backgroundAlpha: 0,
      antialias: true,
      resolution: Math.min(window.devicePixelRatio || 1, 2),
      autoDensity: true
    });

    // Add canvas to the page
    stage.appendChild(app.canvas);

    // One graphics object for all lights
    const lights = new PIXI.Graphics();

    app.stage.addChild(lights);

    let time = 0;

    // Draw a club lamp and its light beam
    function drawLamp(x, y, angle, color) {

      const beamLength = window.innerHeight * 1.2;
      const beamWidth = 100;

      // Calculate beam direction
      const endX = x + Math.sin(angle) * beamLength;
      const endY = y + Math.cos(angle) * beamLength;

      // Draw light beam
      lights
        .moveTo(x - 12, y)
        .lineTo(endX - beamWidth, endY)
        .lineTo(endX + beamWidth, endY)
        .lineTo(x + 12, y)
        .closePath()
        .fill({
          color: color,
          alpha: 0.045
        });

      // Draw outer glow
      lights.circle(x, y, 28)
        .fill({
          color: color,
          alpha: 0.08
        });

      // Draw lamp
      lights.circle(x, y, 12)
        .fill({
          color: color,
          alpha: 0.9
        });

      // Draw lamp centre
      lights.circle(x, y, 5)
        .fill({
          color: 0xffffff,
          alpha: 1
        });
    }


    // Animation
    function animate() {

      time += 0.012;

      lights.clear();

      const width = window.innerWidth;

      // Left lamp
      drawLamp(
        width * 0.08,
        65,
        Math.sin(time) * 0.55 - 0.35,
        0x19e6ff
      );

      // Right lamp
      drawLamp(
        width * 0.92,
        65,
        Math.sin(time + 2) * 0.55 + 0.35,
        0xff3fb4
      );

    }

    app.ticker.add(animate);

  }

  start().catch(error => {
    console.error("PixiJS could not start:", error);
  });

}
