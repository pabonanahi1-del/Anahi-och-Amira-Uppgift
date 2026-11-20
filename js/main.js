
const stage = document.getElementById("stage");

if (!stage || !window.PIXI) {
  console.error("PixiJS or stage could not be found.");
} else {

  const app = new PIXI.Application();

  async function start() {

    await app.init({
      resizeTo: window,
      backgroundAlpha: 0,
      antialias: false,
      resolution: Math.min(window.devicePixelRatio || 1, 2),
      autoDensity: true
    });

    stage.appendChild(app.canvas);

    const scene = new PIXI.Graphics();
    const effects = new PIXI.Graphics();

    app.stage.addChild(scene);
    app.stage.addChild(effects);

    const colors = [
      0x070418,
      0x24105c,
      0x8a3dff,
      0x19e6ff,
      0xff3fb4,
      0x5424a8,
      0x142b60
    ];

    function drawScene() {

      scene.clear();

      const w = window.innerWidth;
      const h = window.innerHeight;

      // Background
      scene.rect(0, 0, w, h)
        .fill({ color: 0x070418 });

      // Side walls
      const sideWidth = w * 0.13;

      scene.rect(0, 0, sideWidth, h)
        .fill({ color: 0x210b39 });

      scene.rect(w - sideWidth, 0, sideWidth, h)
        .fill({ color: 0x210b39 });

      // Checkerboard walls
      const square = Math.max(18, Math.min(32, w * 0.018));

      for (let y = 0; y < h; y += square) {
        for (let x = 0; x < sideWidth; x += square) {

          const checker = (Math.floor(x / square) +
                           Math.floor(y / square)) % 2;

          if (checker === 0) {
            scene.rect(x, y, square, square)
              .fill({ color: 0x8a3dff });
          } else {
            scene.rect(x, y, square, square)
              .fill({ color: 0xf4b8ff });
          }

          const rightX = w - sideWidth + x;

          if (checker === 0) {
            scene.rect(rightX, y, square, square)
              .fill({ color: 0x8a3dff });
          } else {
            scene.rect(rightX, y, square, square)
              .fill({ color: 0xf4b8ff });
          }
        }
      }

      // Neon vertical wall strips
      scene.rect(sideWidth * 0.72, 0, 7, h)
        .fill({ color: 0xff3fb4, alpha: 0.9 });

      scene.rect(w - sideWidth * 0.72 - 7, 0, 7, h)
        .fill({ color: 0xff3fb4, alpha: 0.9 });

      // Inner wall borders
      scene.rect(sideWidth, 0, 4, h)
        .fill({ color: 0x19e6ff });

      scene.rect(w - sideWidth - 4, 0, 4, h)
        .fill({ color: 0x19e6ff });

      // Dance floor
      const left = sideWidth + 45;
      const right = w - sideWidth - 45;
      const top = 75;
      const floorWidth = right - left;
      const floorHeight = h - top;

      const columns = 8;
      const rows = 7;

      const tileWidth = floorWidth / columns;
      const tileHeight = floorHeight / rows;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {

          // Dark base tile
          scene.rect(
            left + col * tileWidth,
            top + row * tileHeight,
            tileWidth,
            tileHeight
          ).fill({ color: 0x0d0826 });

          // Some bright coloured tiles
          const tileNumber = (row * 5 + col * 3) % 7;

          if ((row + col * 2) % 3 === 0) {

            scene.rect(
              left + col * tileWidth + 3,
              top + row * tileHeight + 3,
              tileWidth - 6,
              tileHeight - 6
            ).fill({
              color: colors[tileNumber + 1],
              alpha: 0.8
            });
          }

          // Cyan grid borders
          scene.rect(
            left + col * tileWidth,
            top + row * tileHeight,
            tileWidth,
            tileHeight
          ).stroke({
            color: 0x19e6ff,
            width: 3,
            alpha: 0.55
          });
        }
      }

      // Wall decorations
      for (let i = 0; i < 5; i++) {

        const y = 120 + i * 145;

        // Left neon circles
        scene.circle(sideWidth * 0.90, y, 14)
          .fill({ color: 0x19e6ff });

        scene.circle(sideWidth * 0.90, y, 7)
          .fill({ color: 0xffffff });

        // Right neon circles
        scene.circle(w - sideWidth * 0.90, y, 14)
          .fill({ color: 0x19e6ff });

        scene.circle(w - sideWidth * 0.90, y, 7)
          .fill({ color: 0xffffff });
      }

    }


    // Draw moving spotlights
    let time = 0;

    function drawSpotlight(x, y, angle, color) {

      const beamLength = window.innerHeight * 1.3;
      const beamWidth = window.innerWidth * 0.35;

      const endX = x + Math.sin(angle) * beamLength;
      const endY = y + Math.cos(angle) * beamLength;

      // Wide glowing beam
      effects
        .moveTo(x, y)
        .lineTo(endX - beamWidth, endY)
        .lineTo(endX + beamWidth, endY)
        .closePath()
        .fill({
          color: color,
          alpha: 0.12
        });

      // Brighter centre
      effects
        .moveTo(x, y)
        .lineTo(endX - beamWidth * 0.25, endY)
        .lineTo(endX + beamWidth * 0.25, endY)
        .closePath()
        .fill({
          color: color,
          alpha: 0.13
        });
    }


    function animate() {

      time += 0.012;
      effects.clear();

      const w = window.innerWidth;

      // Blue spotlight
      drawSpotlight(
        w * 0.13,
        65,
        Math.sin(time) * 0.65 + 0.45,
        0x19e6ff
      );

      // Pink spotlight
      drawSpotlight(
        w * 0.87,
        65,
        Math.sin(time + 2) * 0.65 - 0.45,
        0xff3fb4
      );

    }


    // Initial drawing
    drawScene();
    app.ticker.add(animate);

    // Redraw when window changes size
    window.addEventListener("resize", drawScene);

  }

  start().catch(error => {
    console.error("PixiJS could not start:", error);
  });

}
