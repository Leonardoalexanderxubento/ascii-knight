// Ponto de entrada: registra as camadas na ordem (de trás para frente) e inicia.
const camadas = [
  window.Grass.back,
  window.Knight,
  window.Scarf,
  window.Grass.front,
];

camadas.filter(Boolean).forEach(c => Engine.add(c));
Engine.start();
