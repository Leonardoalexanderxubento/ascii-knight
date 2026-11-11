// Lenço vermelho amarrado nos olhos do elmo, tremulando ao vento.
// Cada ponta é uma "corrente" de segmentos; cada segmento segue uma onda
// atrasada em relação ao anterior, o que dá o efeito de pano.
window.Scarf = (() => {
  const SEG = 26;

  function cor(luz) {
    // luz 0..1 -> vermelho escuro até vermelho vivo
    const r = Math.round(90 + luz * 165);
    const g = Math.round(4 + luz * 30);
    const b = Math.round(12 + luz * 34);
    return `rgb(${r},${g},${b})`;
  }

  function ponta(ctx, t, x0, y0, s, id) {
    const passo = 13 * s;
    const base = -0.18 + id * 0.3;
    let x = x0, y = y0;
    const pts = [];
    for (let j = 0; j <= SEG; j++) {
      const p = j / SEG;
      const fase = t * 4.4 - j * 0.42 + id * 1.9;
      const ang = base
        + Math.sin(fase) * 0.32 * p
        + Math.sin(t * 1.3 + j * 0.15 + id) * 0.12
        + p * 0.15; // o pano cai um pouco no final
      const largura = ((1 - p) * 15 + 4) * s * (0.75 + 0.25 * Math.cos(fase));
      pts.push({ x, y, ang, largura, luz: 0.5 + 0.5 * Math.cos(fase - 0.6) });
      x += Math.cos(ang) * passo;
      y += Math.sin(ang) * passo;
    }
    // desenha um quadrilátero por segmento, com cor variando (dobras)
    for (let j = 0; j < SEG; j++) {
      const a = pts[j], b = pts[j + 1];
      const nax = -Math.sin(a.ang) * a.largura, nay = Math.cos(a.ang) * a.largura;
      const nbx = -Math.sin(b.ang) * b.largura, nby = Math.cos(b.ang) * b.largura;
      ctx.fillStyle = cor(a.luz * (1 - j / SEG * 0.35));
      ctx.beginPath();
      ctx.moveTo(a.x + nax, a.y + nay);
      ctx.lineTo(b.x + nbx, b.y + nby);
      ctx.lineTo(b.x - nbx, b.y - nby);
      ctx.lineTo(a.x - nax, a.y - nay);
      ctx.closePath();
      ctx.fill();
    }
  }

  return {
    draw({ t, ctx }) {
      const { x, y, s } = window.Knight.anchor;

      // faixa em volta do elmo, na altura dos olhos
      const ond = Math.sin(t * 2) * 1.5 * s;
      ctx.fillStyle = cor(0.75);
      ctx.beginPath();
      ctx.moveTo(x - 54 * s, y - 12 * s);
      ctx.quadraticCurveTo(x, y - 16 * s + ond, x + 54 * s, y - 10 * s);
      ctx.lineTo(x + 52 * s, y + 10 * s);
      ctx.quadraticCurveTo(x, y + 6 * s + ond, x - 52 * s, y + 9 * s);
      ctx.closePath();
      ctx.fill();

      // nó e as duas pontas soltas
      const nx = x + 50 * s, ny = y;
      ponta(ctx, t, nx, ny - 3 * s, s, 0);
      ponta(ctx, t, nx, ny + 3 * s, s, 1);
      ctx.fillStyle = cor(0.9);
      ctx.beginPath();
      ctx.ellipse(nx, ny, 10 * s, 12 * s, 0, 0, Math.PI * 2);
      ctx.fill();
    },
  };
})();
