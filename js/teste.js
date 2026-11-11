// Camada de teste: um círculo com degradê para conferir o motor ASCII.
window.Teste = {
  draw({ W, H, t, ctx }) {
    const x = W / 2 + Math.sin(t) * W * 0.2;
    const y = H / 2;
    const r = Math.min(W, H) * 0.25;
    const g = ctx.createRadialGradient(x - r * 0.4, y - r * 0.4, 0, x, y, r);
    g.addColorStop(0, '#ffffff');
    g.addColorStop(1, '#202020');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  },
};
