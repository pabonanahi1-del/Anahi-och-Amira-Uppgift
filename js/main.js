
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

    // Diskokulans position och storlek
    const ball = new PIXI.Container();
    const radius = 58;

    app.stage.addChild(ball);

    // Mjukt neonljus bakom kulan
    const glow = new PIXI.Graphics();

    glow.circle(0, 0, radius + 15)
      .fill({
        color: 0x8a3dff,
        alpha: 0.12
      });

    glow.circle(0, 0, radius + 5)
      .stroke({
        color: 0x19e6ff,
        width: 2,
        alpha: 0.5
      });

    app.stage.addChild(glow);

    // Själva kulan
    const base = new PIXI.Graphics();

    base.circle(0, 0, radius)
      .fill({ color: 0x17102f });

    ball.addChild(base);

    // Mask gör att rutorna stannar inom cirkeln
    const mask = new PIXI.Graphics();

    mask.circle(0, 0, radius)
      .fill({ color: 0xffffff });

    ball.addChild(mask);

    const tiles = new PIXI.Graphics();

    const tileColors = [
      0x19e6ff,
      0xff3fb4,
      0x8a3dff,
      0xffffff
    ];

    const tileSize = 14;

    for (let row = -5; row <= 5; row++) {
      for (let col = -5; col <= 5; col++) {

        const color = tileColors[
          Math.abs(row + col) % tileColors.length
        ];

        tiles.rect(
          col * tileSize - tileSize / 2,
          row * tileSize - tileSize / 2,
          tileSize - 2,
          tileSize - 2
        ).fill({
          color: color,
          alpha: 0.9
        });
      }
    }

    ball.addChild(tiles);
    tiles.mask = mask;

    // Kant runt kulan
    const outline = new PIXI.Graphics();

    outline.circle(0, 0, radius)
      .stroke({
        color: 0x19e6ff,
        width: 3,
        alpha: 0.9
      });

    ball.addChild(outline);

    // Liten ljusreflex
    const highlight = new PIXI.Graphics();

    highlight.ellipse(-20, -25, 12, 5)
      .fill({
        color: 0xffffff,
        alpha: 0.6
      });

    ball.addChild(highlight);

    // Placera kulan vid höger sida av skärmen
    function positionBall() {
      const x = window.innerWidth - 90;
      const y = window.innerHeight * 0.48;

      ball.position.set(x, y);
      glow.position.set(x, y);
    }

    positionBall();

    window.addEventListener("resize", positionBall);

    // Snurra kulan
    app.ticker.add(() => {

      ball.rotation += 0.008;

      // Ger en liten illusion av att kulan snurrar runt sin axel
      ball.scale.x = 0.35 + Math.abs(Math.sin(ball.rotation)) * 0.65;

    });

  }

  start().catch(error => {
    console.error("PixiJS could not start:", error);
  });

}
