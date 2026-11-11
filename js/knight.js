// Cavaleiro ajoelhado segurando a espada fincada no chão.
// Tudo é desenhado com formas simples; o motor transforma em ASCII.
// Unidades: origem no chão, no centro do cavaleiro; y negativo = para cima.
window.Knight = (() => {
  const anchor = { x: 0, y: 0, s: 1 }; // posição dos olhos (usada pelo lenço)

  function poly(ctx, pts) {
    ctx.beginPath();
    ctx.moveTo(pts[0], pts[1]);
    for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
    ctx.closePath();
  }

  // degradê "metal": claro em cima/esquerda, escuro em baixo/direita
  function metal(ctx, x0, y0, x1, y1, claro = '#d8d2c8', escuro = '#2c2926') {
    const g = ctx.createLinearGradient(x0, y0, x1, y1);
    g.addColorStop(0, claro);
    g.addColorStop(1, escuro);
    return g;
  }

  function linhas(ctx, cor, largura, segs) {
    ctx.strokeStyle = cor;
    ctx.lineWidth = largura;
    ctx.lineCap = 'round';
    for (const s of segs) {
      ctx.beginPath();
      ctx.moveTo(s[0], s[1]);
      if (s.length === 6) ctx.quadraticCurveTo(s[2], s[3], s[4], s[5]);
      else ctx.lineTo(s[2], s[3]);
      ctx.stroke();
    }
  }

  function capa(ctx, t) {
    ctx.beginPath();
    ctx.moveTo(-70, -300);
    ctx.bezierCurveTo(-150, -160, -165, -60, -140, 0);
    // borda de baixo ondulando com o vento
    for (let x = -140; x <= 230; x += 10) {
      ctx.lineTo(x, Math.sin(t * 1.4 + x * 0.05) * 6 - 2);
    }
    ctx.bezierCurveTo(215, -120, 130, -250, 75, -305);
    ctx.closePath();
    ctx.fillStyle = metal(ctx, 0, -300, 60, 0, '#5a524c', '#120f0e');
    ctx.fill();
    // dobras
    linhas(ctx, '#0a0909', 6, [
      [-100, -200, -120, -100, -105, 0],
      [120, -220, 160, -100, 170, 0],
      [170, -150, 205, -60, 215, 0],
    ]);
  }

  function pernaDeTras(ctx) {
    ctx.fillStyle = metal(ctx, 20, -170, 200, 0, '#8a837a', '#1c1a18');
    poly(ctx, [10, -175, 75, -180, 125, -30, 75, -5]);
    ctx.fill();
    poly(ctx, [70, 0, 95, -45, 225, -32, 250, 0]);
    ctx.fill();
  }

  function pernaDaFrente(ctx) {
    ctx.fillStyle = metal(ctx, -140, -190, 10, -100);
    poly(ctx, [5, -195, -115, -168, -100, -105, 10, -140]); // coxa
    ctx.fill();
    ctx.fillStyle = metal(ctx, -140, -140, -70, 0, '#c8c1b6', '#24211f');
    poly(ctx, [-138, -130, -85, -130, -76, -18, -130, -18]); // canela
    ctx.fill();
    poly(ctx, [-142, -28, -72, -28, -52, 0, -152, 0]); // pé
    ctx.fill();
    // joelheira
    ctx.fillStyle = metal(ctx, -140, -165, -90, -110, '#ece6dc', '#3a3632');
    ctx.beginPath();
    ctx.ellipse(-110, -135, 32, 28, 0, 0, Math.PI * 2);
    ctx.fill();
    linhas(ctx, '#0b0a09', 4, [[-135, -90, -80, -90], [-133, -55, -80, -55]]);
  }

  function tronco(ctx) {
    // saiote de placas
    ctx.fillStyle = metal(ctx, -90, -190, 90, -120, '#a39c92', '#25221f');
    poly(ctx, [-82, -190, 82, -190, 98, -128, -98, -128]);
    ctx.fill();
    linhas(ctx, '#0b0a09', 4, [[-88, -170, 88, -170], [-93, -149, 93, -149]]);

    // peitoral
    ctx.fillStyle = metal(ctx, -90, -320, 80, -180, '#efe9df', '#2a2724');
    poly(ctx, [-78, -185, 78, -185, 88, -288, 42, -322, -55, -322, -98, -286]);
    ctx.fill();
    linhas(ctx, '#0b0a09', 4, [
      [-80, -205, 0, -215, 80, -205],
      [-5, -318, -10, -260, -2, -215],
    ]);

    // braço direito (do fundo), descansando na coxa
    ctx.fillStyle = metal(ctx, 70, -300, 120, -180, '#8f887f', '#1d1b19');
    poly(ctx, [62, -292, 108, -282, 122, -196, 86, -182]);
    ctx.fill();

    // ombreiras
    ctx.fillStyle = metal(ctx, -140, -330, -60, -260, '#f4eee4', '#3a3632');
    ctx.beginPath();
    ctx.ellipse(-95, -293, 46, 34, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = metal(ctx, 40, -330, 120, -260, '#b3aca2', '#24211f');
    ctx.beginPath();
    ctx.ellipse(80, -295, 40, 31, 0.3, 0, Math.PI * 2);
    ctx.fill();
    linhas(ctx, '#0b0a09', 4, [[-135, -280, -95, -300, -55, -285]]);
  }

  function espada(ctx) {
    const x = -178;
    // lâmina fincada no chão
    const g = ctx.createLinearGradient(x - 9, 0, x + 9, 0);
    g.addColorStop(0, '#fbf8f2');
    g.addColorStop(0.5, '#bfb9b0');
    g.addColorStop(1, '#4a4642');
    ctx.fillStyle = g;
    poly(ctx, [x - 10, -205, x + 10, -205, x + 7, -14, x, 6, x - 7, -14]);
    ctx.fill();
    linhas(ctx, '#3a3632', 2, [[x, -200, x, -30]]);
    // guarda
    ctx.fillStyle = metal(ctx, x - 45, -215, x + 45, -198, '#efe9df', '#3a3632');
    poly(ctx, [x - 48, -218, x + 48, -218, x + 42, -204, x - 42, -204]);
    ctx.fill();
    // cabo e pomo
    ctx.fillStyle = '#5c5650';
    ctx.fillRect(x - 7, -282, 14, 66);
    ctx.fillStyle = metal(ctx, x - 14, -305, x + 14, -280, '#ffffff', '#5c5650');
    ctx.beginPath();
    ctx.arc(x, -292, 14, 0, Math.PI * 2);
    ctx.fill();
  }

  function bracoEsquerdo(ctx) {
    ctx.strokeStyle = metal(ctx, -110, -300, -180, -230, '#e2dbd0', '#3c3834');
    ctx.lineWidth = 44;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-100, -288);
    ctx.quadraticCurveTo(-168, -275, -176, -245);
    ctx.stroke();
    // manopla segurando o cabo
    ctx.fillStyle = metal(ctx, -200, -268, -155, -225, '#f4eee4', '#34302c');
    ctx.beginPath();
    ctx.roundRect(-200, -268, 46, 42, 10);
    ctx.fill();
    linhas(ctx, '#0b0a09', 3, [[-198, -252, -158, -252], [-198, -240, -158, -240]]);
  }

  function elmo(ctx) {
    // gorjal (pescoço)
    ctx.fillStyle = '#4a4540';
    poly(ctx, [-42, -330, 34, -330, 30, -310, -38, -310]);
    ctx.fill();
    // elmo fechado
    const g = ctx.createRadialGradient(-28, -405, 4, -5, -375, 75);
    g.addColorStop(0, '#ffffff');
    g.addColorStop(0.5, '#a8a197');
    g.addColorStop(1, '#22201d');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(-50, -322);
    ctx.lineTo(-55, -382);
    ctx.quadraticCurveTo(-50, -432, -5, -434);
    ctx.quadraticCurveTo(45, -432, 49, -382);
    ctx.lineTo(45, -322);
    ctx.closePath();
    ctx.fill();
    // crista central e furos de respiração
    linhas(ctx, '#f8f4ec', 3, [[-6, -430, -6, -330]]);
    ctx.fillStyle = '#0b0a09';
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 2; j++) {
        ctx.fillRect(12 + i * 8, -350 + j * 10, 4, 5);
      }
    }
  }

  return {
    anchor,
    draw({ W, H, t, ctx }) {
      const s = Math.min(H / 600, W / 700);
      const cx = W * 0.47;
      const gy = H * 0.9;
      const resp = Math.sin(t * 1.3) * 3; // respiração

      ctx.translate(cx, gy);
      ctx.scale(s, s);

      capa(ctx, t);
      pernaDeTras(ctx);
      pernaDaFrente(ctx);

      ctx.save();
      ctx.translate(0, resp);
      tronco(ctx);
      espada(ctx);
      bracoEsquerdo(ctx);
      ctx.translate(-5, -330);
      ctx.rotate(-0.08 + Math.sin(t * 0.7) * 0.015); // cabeça levemente baixa
      ctx.translate(5, 330);
      elmo(ctx);
      ctx.restore();

      // posição dos olhos em pixels de tela, para o lenço
      anchor.x = cx + -3 * s;
      anchor.y = gy + (-376 + resp) * s;
      anchor.s = s;
    },
  };
})();
