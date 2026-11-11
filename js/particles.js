// Cinzas e brasas flutuando, levadas pelo vento.
window.Particles = (() => {
  let lista = [];

  function nova(W, H, espalhar) {
    const brasa = Math.random() < 0.15;
    return {
      x: espalhar ? Math.random() * W : -20 + Math.random() * W * 0.5,
      y: espalhar ? Math.random() * H : H * (0.4 + Math.random() * 0.6),
      vx: 15 + Math.random() * 35,
      vy: -(5 + Math.random() * 20),
      fase: Math.random() * 10,
      brasa,
    };
  }

  return {
    resize(W, H) {
      lista = [];
      const qtd = Math.floor((W * H) / 14000);
      for (let i = 0; i < qtd; i++) lista.push(nova(W, H, true));
    },
    draw({ W, H, t, ctx, cw, ch }) {
      const dt = 1 / 60;
      for (let i = 0; i < lista.length; i++) {
        const p = lista[i];
        p.x += (p.vx + Math.sin(t + p.fase) * 10) * dt;
        p.y += (p.vy + Math.cos(t * 1.3 + p.fase) * 8) * dt;
        if (p.x > W + 20 || p.y < -20) lista[i] = nova(W, H, false);

        const brilho = 0.5 + 0.5 * Math.sin(t * 5 + p.fase * 3);
        if (p.brasa) {
          ctx.fillStyle = `rgba(255,${80 + brilho * 80},30,${0.5 + brilho * 0.5})`;
        } else {
          const c = 140 + brilho * 100;
          ctx.fillStyle = `rgba(${c},${c},${c - 10},${0.3 + brilho * 0.5})`;
        }
        ctx.fillRect(p.x, p.y, cw, ch); // ocupa 1 caractere
      }
    },
  };
})();
