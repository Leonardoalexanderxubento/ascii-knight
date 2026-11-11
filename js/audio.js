// Trilha sonora.
// 1) Se existir o arquivo audio/musica.mp3, ele toca em loop.
// 2) Se não existir, uma trilha dark ambient é gerada na hora (Web Audio API):
//    zumbido grave + coral em acordes de Ré menor + sinos com eco.
// O navegador só deixa tocar som depois de um clique, por isso existe o botão.
const Trilha = (() => {
  const botao = document.getElementById('som');
  const arquivo = document.getElementById('musica');
  let temArquivo = false;
  let ac = null, master, seco, molhado, timer;
  let tocando = false;

  arquivo.addEventListener('canplay', () => { temArquivo = true; });

  const nota = n => 440 * Math.pow(2, (n - 69) / 12); // número MIDI -> Hz

  // Ré menor: Dm, Bb, Gm, A (em notas MIDI)
  const ACORDES = [
    [50, 57, 62, 65],
    [46, 53, 58, 62],
    [43, 50, 55, 58],
    [45, 52, 57, 61],
  ];
  const SINOS = [74, 77, 79, 81, 84, 86];

  function reverb() {
    const len = ac.sampleRate * 5;
    const buf = ac.createBuffer(2, len, ac.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    }
    const conv = ac.createConvolver();
    conv.buffer = buf;
    return conv;
  }

  function zumbido() {
    const filtro = ac.createBiquadFilter();
    filtro.type = 'lowpass';
    filtro.frequency.value = 200;
    filtro.Q.value = 4;
    const lfo = ac.createOscillator();
    const lfoGanho = ac.createGain();
    lfo.frequency.value = 0.05;
    lfoGanho.gain.value = 120;
    lfo.connect(lfoGanho).connect(filtro.frequency);
    lfo.start();

    const g = ac.createGain();
    g.gain.value = 0.1;
    filtro.connect(g);
    g.connect(seco);
    g.connect(molhado);

    [nota(26), nota(26) * 1.004, nota(33), nota(38) * 0.997].forEach(f => {
      const o = ac.createOscillator();
      o.type = 'sawtooth';
      o.frequency.value = f;
      o.connect(filtro);
      o.start();
    });
  }

  function acorde(notas, quando, dur) {
    notas.forEach(n => {
      [-6, 6].forEach(detune => {
        const o = ac.createOscillator();
        o.type = 'sawtooth';
        o.frequency.value = nota(n);
        o.detune.value = detune;
        const f = ac.createBiquadFilter();
        f.type = 'lowpass';
        f.frequency.value = 700;
        const g = ac.createGain();
        g.gain.setValueAtTime(0, quando);
        g.gain.linearRampToValueAtTime(0.018, quando + 3);
        g.gain.setValueAtTime(0.018, quando + dur - 1);
        g.gain.linearRampToValueAtTime(0, quando + dur + 3);
        o.connect(f).connect(g);
        g.connect(seco);
        g.connect(molhado);
        o.start(quando);
        o.stop(quando + dur + 3.5);
      });
    });
  }

  function sino(n, quando, volume, decaimento) {
    [1, 2.76, 5.4].forEach((parcial, i) => {
      const o = ac.createOscillator();
      o.type = 'sine';
      o.frequency.value = nota(n) * parcial;
      const g = ac.createGain();
      const v = volume / (i + 1);
      g.gain.setValueAtTime(0, quando);
      g.gain.linearRampToValueAtTime(v, quando + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, quando + decaimento / (i + 1));
      o.connect(g).connect(molhado);
      o.start(quando);
      o.stop(quando + decaimento + 0.1);
    });
  }

  let proxAcorde = 0, idxAcorde = 0, proxSino = 0, proxBadalo = 0;

  function agenda() {
    const agora = ac.currentTime;
    while (proxAcorde < agora + 1) {
      acorde(ACORDES[idxAcorde % ACORDES.length], proxAcorde, 8);
      idxAcorde++;
      proxAcorde += 8;
    }
    while (proxSino < agora + 1) {
      sino(SINOS[Math.floor(Math.random() * SINOS.length)], proxSino, 0.05, 4);
      proxSino += 1.5 + Math.random() * 3.5;
    }
    while (proxBadalo < agora + 1) {
      sino(38, proxBadalo, 0.12, 9); // badalo grave
      proxBadalo += 16;
    }
  }

  function iniciaSintetizador() {
    ac = new (window.AudioContext || window.webkitAudioContext)();
    master = ac.createGain();
    master.gain.setValueAtTime(0, ac.currentTime);
    master.gain.linearRampToValueAtTime(0.9, ac.currentTime + 4);
    master.connect(ac.destination);

    seco = ac.createGain();
    seco.gain.value = 0.5;
    seco.connect(master);
    const rev = reverb();
    molhado = ac.createGain();
    molhado.gain.value = 0.7;
    molhado.connect(rev).connect(master);

    zumbido();
    proxAcorde = proxSino = proxBadalo = ac.currentTime + 0.1;
    agenda();
    timer = setInterval(agenda, 250);
  }

  function liga() {
    if (arquivo.readyState >= 2) temArquivo = true;
    if (temArquivo) {
      arquivo.volume = 0.8;
      arquivo.play();
    } else if (!ac) {
      iniciaSintetizador();
    } else {
      ac.resume();
    }
    tocando = true;
    botao.textContent = '♪ som: ligado';
  }

  function desliga() {
    if (temArquivo) arquivo.pause();
    else if (ac) ac.suspend();
    tocando = false;
    botao.textContent = '♪ som: desligado';
  }

  botao.addEventListener('click', e => {
    e.stopPropagation();
    tocando ? desliga() : liga();
  });

  // um clique em qualquer lugar da tela também liga o som
  addEventListener('click', () => { if (!tocando) liga(); }, { once: true });
})();
