// Grama balançando com o vento.
// São duas camadas: uma atrás do cavaleiro e outra na frente dele.
window.Grass = (() => {
  let folhas = [];

  function vento(t, x) {
    // vento base + rajadas mais rápidas
    return Math.sin(t * 0.9 + x * 0.004) * 0.45 + Math.sin(t * 2.3 + x * 0.02) * 0.15;
  }

  function resize(W, H) {
    folhas = [];
    const chao = H * 0.9;
    const qtd = Math.floor(W / 2.5);
    for (let i = 0; i < qtd; i++) {
      const y = chao - 25 + Math.random() * (H - chao + 40);
      const perto = (y - chao + 25) / (H - chao + 40); // 0 = longe, 1 = perto
      folhas.push({
        x: Math.random() * W,
        y,
        h: (25 + Math.random() * 60) * (0.6 + perto),
        inclina: (Math.random() - 0.5) * 0.6,
        fase: Math.random() * Math.PI * 2,
        tom: 70 + Math.random() * 90,
        frente: Math.random() < 0.45,
      });
    }
    folhas.sort((a, b) => a.y - b.y);
  }

  function desenha(view, frente) {
    const { W, H, t, ctx, cw } = view;
    if (!frente) {
      // chão escuro
      const g = ctx.createLinearGradient(0, H * 0.86, 0, H);
      g.addColorStop(0, 'rgba(30,30,28,0)');
      g.addColorStop(1, 'rgba(48,50,44,1)');
      ctx.fillStyle = g;
      ctx.fillRect(0, H * 0.86, W, H * 0.14);
    }
    ctx.lineCap = 'round';
    ctx.lineWidth = cw * 0.9;
    for (const f of folhas) {
      if (f.frente !== frente) continue;
      const v = vento(t, f.x) + Math.sin(t * 3 + f.fase) * 0.05;
      const pontaX = f.x + (f.inclina + v) * f.h;
      const pontaY = f.y - f.h * (1 - Math.abs(v) * 0.25);
      const c = f.tom;
      ctx.strokeStyle = `rgb(${c},${c + 6},${c - 10})`;
      ctx.beginPath();
      ctx.moveTo(f.x, f.y);
      ctx.quadraticCurveTo(f.x + (f.inclina + v) * f.h * 0.2, f.y - f.h * 0.6, pontaX, pontaY);
      ctx.stroke();
    }
  }

  return {
    back: { resize, draw: v => desenha(v, false) },
    front: { draw: v => desenha(v, true) },
  };
})();
