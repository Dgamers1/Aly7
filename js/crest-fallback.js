// ARENA XI — escudos: tenta carregar a imagem real do time em assets/crests/<id>.png
// Se o arquivo não existir (ou ainda não tiver sido colocado ali), cai automaticamente
// para a forma geométrica colorida (SVG) como hoje. Basta o usuário colocar um arquivo
// PNG/JPG com o nome exato do ID do time dentro de assets/crests/ que ele passa a
// aparecer no lugar da forma — não precisa editar nenhum código.

function initCrestFallbacks(root){
  root = root || document;
  root.querySelectorAll('img[data-crest-fallback]:not([data-bound])').forEach(img => {
    img.dataset.bound = '1';
    img.addEventListener('error', () => {
      if(img.dataset.failed) return;
      img.dataset.failed = '1';
      const color = img.dataset.crestColor || '#E8B33D';
      const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">'
        + '<circle cx="12" cy="12" r="10" fill="#0F1730" stroke="' + color + '" stroke-width="1.2"/>'
        + '</svg>';
      img.src = 'data:image/svg+xml,' + encodeURIComponent(svg);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => initCrestFallbacks());
