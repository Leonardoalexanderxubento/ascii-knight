// Motor ASCII
// A cena é desenhada num canvas pequeno, onde 1 pixel = 1 caractere.
// Depois cada pixel vira um caractere: quanto mais claro, mais "cheio" o caractere.
const Engine = (() => {
  // do mais vazio para o mais cheio
  const RAMP = " .`'-:;~+=*!?ilcxvoaeOX#%&@";

  const layers = [];
  const tela = document.getElementById('tela');
  const ctx = tela.getContext('2d');
  const cena = document.createElement('canvas');
  const cctx = cena.getContext('2d', { willReadFrequently: true });

  let W, H, cols, rows, cw, ch, font;

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    W = innerWidth;
    H = innerHeight;
    tela.width = W * dpr;
    tela.height = H * dpr;
    tela.style.width = W + 'px';
    tela.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const size = Math.max(7, Math.min(12, Math.round(W / 150)));
    font = `bold ${size}px "Courier New", monospace`;
    ctx.font = font;
    cw = ctx.measureText('M').width; // largura de 1 caractere
    ch = size * 1.05;                // altura de 1 linha
    cols = Math.ceil(W / cw);
    rows = Math.ceil(H / ch);
    cena.width = cols;
    cena.height = rows;

    layers.forEach(l => l.resize && l.resize(W, H));
  }

  function frame(ms) {
    const t = ms / 1000;

    cctx.setTransform(1, 0, 0, 1, 0, 0);
    cctx.clearRect(0, 0, cols, rows);
    // as camadas desenham em coordenadas de tela (pixels normais)
    cctx.setTransform(1 / cw, 0, 0, 1 / ch, 0, 0);

    const view = { W, H, t, ctx: cctx, cw, ch };
    for (const l of layers) {
      cctx.save();
      l.draw(view);
      cctx.restore();
    }

    render(t);
    requestAnimationFrame(frame);
  }

  function render(t) {
    const data = cctx.getImageData(0, 0, cols, rows).data;

    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, W, H);
    ctx.font = font;
    ctx.textBaseline = 'top';

    // agrupa caracteres pela cor para desenhar mais rápido
    const grupos = new Map();

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i = (y * cols + x) * 4;
        const a = data[i + 3] / 255;
        let r = data[i] * a, g = data[i + 1] * a, b = data[i + 2] * a;
        let v = Math.max(r, g, b) / 255; // brilho 0..1

        if (v < 0.05) continue;

        let k = Math.min(RAMP.length - 1, Math.floor(v * RAMP.length));
        const c = RAMP[k];
        if (c === ' ') continue;

        // clareia um pouco e reduz a quantidade de cores
        const boost = 1.25;
        r = Math.min(255, r * boost) >> 4;
        g = Math.min(255, g * boost) >> 4;
        b = Math.min(255, b * boost) >> 4;
        const key = (r << 8) | (g << 4) | b;

        let lista = grupos.get(key);
        if (!lista) grupos.set(key, (lista = []));
        lista.push(x * cw, y * ch, c);
      }
    }

    for (const [key, lista] of grupos) {
      const r = ((key >> 8) & 15) * 17;
      const g = ((key >> 4) & 15) * 17;
      const b = (key & 15) * 17;
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      for (let i = 0; i < lista.length; i += 3) {
        ctx.fillText(lista[i + 2], lista[i], lista[i + 1]);
      }
    }
  }

  return {
    add(layer) { layers.push(layer); },
    start() {
      resize();
      addEventListener('resize', resize);
      requestAnimationFrame(frame);
    },
  };
})();
