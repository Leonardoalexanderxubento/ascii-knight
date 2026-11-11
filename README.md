# ASCII Knight

Animação em ASCII no estilo dark fantasy: um cavaleiro ajoelhado, com um lenço vermelho
tremulando ao vento, grama balançando, cinzas flutuando e trilha sonora ambiente.

Feito só com HTML, CSS e JavaScript puro, sem bibliotecas.

## Como rodar

Abra o arquivo `index.html` no navegador. Clique na tela para ligar o som.

## Como funciona

1. Cada camada (grama, cavaleiro, lenço, partículas) desenha formas comuns num canvas pequeno,
   em que cada pixel vale um caractere.
2. O motor (`js/engine.js`) lê o brilho de cada pixel e escolhe um caractere:
   quanto mais claro, mais "cheio" (` .:-=+*#%@`).
3. Os caracteres são desenhados na tela com a cor do pixel, umas 60 vezes por segundo.

## Estrutura

| Arquivo | O que faz |
|---|---|
| `js/engine.js` | Converte a cena em ASCII e aplica os efeitos (vinheta, estrelas, glitch) |
| `js/knight.js` | Cavaleiro com espada |
| `js/scarf.js` | Lenço vermelho ao vento |
| `js/grass.js` | Grama |
| `js/particles.js` | Cinzas e brasas |
| `js/audio.js` | Trilha sonora |
| `js/main.js` | Ordem das camadas e início |

## Música

A trilha é gerada pelo próprio navegador (Web Audio API), então não precisa de nenhum arquivo.

Para usar uma música sua, coloque o arquivo em `audio/musica.mp3`.
Arquivos `.mp3` ficam fora do Git (`.gitignore`) para não publicar músicas com direitos autorais.
