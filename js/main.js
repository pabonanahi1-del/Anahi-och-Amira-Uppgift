
// =====================================================
// Get Keke Out the Club! :: Portfolio animation
// PixiJS 8
// =====================================================

// Hämta elementen från HTML
const stage = document.getElementById("stage");
const kula = document.getElementById("kula");

// Kontrollera att elementen finns
if (!stage || !kula || !window.PIXI) {
  console.error("Could not find the stage, kula or PixiJS.");
} else {

  // Samma färger som i CSS och spelet
  const COLORS = {
    bg: 0x070418,
    cyan: 0x19e6ff,
    pink: 0xff3fb4,
    purple: 0x8a3dff,
    dark: 0x12082f,
    white: 0xffffff
  };

  // Skapa PixiJS-applikationen
  const app = new PIXI.Application();

  // Starta animationen
  async function start() {

    await app.init({
      resizeTo: window,
      backgroundAlpha: 0,
      antialias: true,
      resolution: Math.min(window.devicePixelRatio || 1, 2),
      autoDensity: true
    });

    // Lägg canvas bakom hemsidan
    stage.appendChild(app.canvas);

    // Grafiklager
    const lights = new PIXI.Graphics();
    const ball = new PIXI.Graphics();
    const ripples = new PIXI.Graphics();

    app.stage.addChild(lights);
    app.stage.addChild(ball);
    app.stage.addChild(ripples);

    // Inställningar för discokulan
    let rotation = 0;
    let speed = 0.003;
    let targetSpeed = 0.003;
    let rippleSize = 0;
    let rippleActive = false;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    // Slumpmässiga men återanvändbara positioner för ljusstrålar
    const rays = [];

    for (let i = 0; i < 18; i++) {
      rays.push({
        angle: (Math.PI * 2 / 18) * i,
        length: 450 + Math.random() * 250,
        width: 0.025 + Math.random() * 0.035,
        color: [COLORS.pink, COLORS.cyan, COLORS.purple][i % 3]
      });
    }

    // Rita ljusstrålar runt discokulan
    function drawLights(x, y, radius) {

      lights.clear();

      rays.forEach((ray, index) => {

        const angle = ray.angle + rotation * 0.15;

        const startX = x + Math.cos(angle) * radius;
        const startY = y + Math.sin(angle) * radius;

        const endX = x + Math.cos(angle) * ray.length;
        const endY = y + Math.sin(angle) * ray.length;

        const sideX = Math.cos(angle + Math.PI / 2) *
          ray.width * ray.length;

        const sideY = Math.sin(angle + Math.PI / 2) *
          ray.width * ray.length;

        // Ljusstrålarna blir bredare utåt
        lights.moveTo(startX, startY);
        lights.lineTo(endX + sideX, endY + sideY);
        lights.lineTo(endX - sideX, endY - sideY);
        lights.closePath();

        lights.fill({
          color: ray.color,
          alpha: 0.055 + Math.sin(rotation * 2 + index) * 0.025
        });
      });
    }

    // Rita discokulan
    function drawBall(x, y, radius) {

      ball.clear();

      // Mörk bas
      ball.circle(x, y, radius);
      ball.fill({ color: COLORS.dark });

      // Rita rutorna på discokulan
      const tileSize = radius / 3.2;

      for (let row = -4; row <= 4; row++) {
        for (let col = -4; col <= 4; col++) {

          const localX = col * tileSize;
          const localY = row * tileSize;

          // Hoppa över rutor utanför kulan
          const distance = Math.sqrt(
            localX * localX + localY * localY
          );

          if (distance < radius - tileSize * 0.35) {

            const angle = Math.atan2(localY, localX);
            const colorIndex = Math.abs(row + col) % 3;

            const colors = [
              COLORS.cyan,
              COLORS.pink,
              COLORS.purple
            ];

            const offset = Math.sin(
              rotation * 3 + row * 0.7 + col * 0.8
            ) * 0.35 + 0.65;

            // Roterade fyrkantiga spegelrutor
            const corners = [
              [-tileSize / 2, -tileSize / 2],
              [tileSize / 2, -tileSize / 2],
              [tileSize / 2, tileSize / 2],
              [-tileSize / 2, tileSize / 2]
            ];

            const tileAngle = rotation * 0.35;

            const points = corners.map(([cx, cy]) => {
              const rotatedX = cx * Math.cos(tileAngle) -
                cy * Math.sin(tileAngle);

              const rotatedY = cx * Math.sin(tileAngle) +
                cy * Math.cos(tileAngle);

              return {
                x: x + localX + rotatedX,
                y: y + localY + rotatedY
              };
            });

            ball.moveTo(points[0].x, points[0].y);

            for (let i = 1; i < points.length; i++) {
              ball.lineTo(points[i].x, points[i].y);
            }

            ball.closePath();

            ball.fill({
              color: colors[colorIndex],
              alpha: offset
            });
          }
        }
      }

      // Kulan får en tydlig rund kant
      ball.circle(x, y, radius);
      ball.stroke({
        color: COLORS.white,
        width: 2,
        alpha: 0.75
      });

      // Ljusreflektion
      ball.ellipse(
        x - radius * 0.25,
        y - radius * 0.48,
        radius * 0.25,
        radius * 0.09
      );

      ball.fill({
        color: COLORS.white,
        alpha: 0.5
      });
    }

    // Rita en ljusring när man klickar på kulan
    function drawRipple(x, y, radius) {

      ripples.clear();

      if (rippleActive) {

        ripples.circle(x, y, rippleSize);

        ripples.stroke({
          color: COLORS.cyan,
          width: 4,
          alpha: Math.max(0, 1 - rippleSize / 200)
        });

        rippleSize += 4;

        if (rippleSize > 200) {
          rippleActive = false;
          rippleSize = 0;
        }
      }
    }

    // Placera animationen efter kulan i HTML
    function animate() {

      const rect = kula.getBoundingClientRect();

      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      const radius = Math.min(rect.width, rect.height) * 0.43;

      // Uppdatera rotationshastigheten
      speed += (targetSpeed - speed) * 0.05;

      if (!reducedMotion.matches) {
        rotation += speed;
      }

      // Rita om animationerna
      drawLights(x, y, radius);
      drawBall(x, y, radius);
      drawRipple(x, y, radius);
    }

    // Uppdatera animationen
    app.ticker.add(animate);

    // Hover: kulan snurrar snabbare
    kula.addEventListener("mouseenter", () => {
      targetSpeed = 0.035;
    });

    kula.addEventListener("mouseleave", () => {
      targetSpeed = 0.003;
    });

    // Klick: skicka ut en ljusring
    kula.addEventListener("click", () => {
      rippleSize = 0;
      rippleActive = true;
    });

    // Gör kulan klickbar
    kula.style.cursor = "pointer";
    kula.setAttribute("aria-label", "Interactive disco ball");

    // Anpassa animationen vid scroll och storleksändring
    window.addEventListener("scroll", animate);
    window.addEventListener("resize", animate);

    // Starta animationen
    animate();
  }

  start().catch(error => {
    console.error("PixiJS could not start:", error);
  });


  // =====================================================
  // GALLERY :: Kontrollera att bilderna finns
  // =====================================================

  const images = document.querySelectorAll(".galleri img");

  images.forEach(img => {

    // Om bilden inte kan laddas visas en platshållare
    img.addEventListener("error", () => {
      img.closest("figure").classList.add("saknas");
    });

    // Om bilden laddas tas platshållaren bort
    img.addEventListener("load", () => {
      img.closest("figure").classList.remove("saknas");
    });

    // Kontrollera även bilder som redan försökt laddas
    if (img.complete && img.naturalWidth === 0) {
      img.closest("figure").classList.add("saknas");
    }
  });

}
