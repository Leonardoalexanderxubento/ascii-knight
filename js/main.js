// Ponto de entrada: registra as camadas na ordem (de trás para frente) e inicia.
const camadas = [
  window.Teste,
];

camadas.filter(Boolean).forEach(c => Engine.add(c));
Engine.start();
