document.addEventListener('DOMContentLoaded', async function() {
  // Load base64 images
  const rankEmblems = {
    'Bobcat': await loadBase64Image('public/assets/bobcat.png'),
    'Lion': await loadBase64Image('public/assets/lion.png'),
    'Tiger': await loadBase64Image('public/assets/tiger.png'),
    'Wolf': await loadBase64Image('public/assets/wolf.png'),
    'Bear': await loadBase64Image('public/assets/bear.png'),
    'Webelos': await loadBase64Image('public/assets/webelos.png'),
    'Arrow of Light': await loadBase64Image('public/assets/arrow_of_light.png'),
    'default': await loadBase64Image('public/assets/cub.png')
  };

  // Rank Plaque functionality
  const rankSelect = document.getElementById('rank');
  const yearInput = document.getElementById('year');
  const rankPreviewDescription = document.getElementById('rank-preview-description');
  const rankPlaque = document.getElementById('rank-plaque');
  const downloadRankButton = document.getElementById('download-rank');
  
  // Update rank preview when inputs change
  rankSelect.addEventListener('change', updateRankPreview);
  yearInput.addEventListener('input', updateRankPreview);
  
  // Download rank plaque
  downloadRankButton.addEventListener('click', () => {
    downloadSVG(rankPlaque, `${rankSelect.value.replace(/\s+/g, '_')}_rank_plaque_${yearInput.value}.svg`);
  });
  
  function updateRankPreview() {
    const rank = rankSelect.value;
    const year = yearInput.value;
    
    // Update preview description
    rankPreviewDescription.textContent = `${rank} Rank Plaque for ${year}`;
    
    // Generate SVG
    rankPlaque.innerHTML = generateRankPlaqueSVG(rank, year);
    rankPlaque.setAttribute('viewBox', '0 0 1400 300');
    rankPlaque.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  }
  
  // SVG Generation Function
  function generateRankPlaqueSVG(rank, year) {
    // SVG dimensions
    const width = 1400;
    const height = 300;
    
    // Get rank emblem path based on rank
    let rankEmblem = rankEmblems[rank] || rankEmblems['default'];
    
    return `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <!-- Background -->
        <rect x="0" y="0" width="${width}" height="${height}" fill="white" stroke="black" stroke-width="2" />
        
        <!-- Border design -->
        <rect x="15" y="15" width="${width - 30}" height="${height - 30}" fill="none" stroke="black" stroke-width="1" />
        
        <!-- Rank title -->
        <text
          x="${width / 2}"
          y="50"
          font-family="Arial, sans-serif"
          font-size="32"
          text-anchor="middle"
          font-weight="bold"
        >
          ${rank} Rank
        </text>
        
        <!-- Rank emblem -->
        <image x="600" y="80" width="200" height="200" href="${rankEmblem}" />
        
        <!-- Year -->
        <text
          x="${width / 2}"
          y="${height - 50}"
          font-family="Arial, sans-serif"
          font-size="28"
          text-anchor="middle"
        >
          ${year}
        </text>
      </svg>
    `;
  }
  
  // Utility function to download SVG
  function downloadSVG(svgEl, fileName) {
    if (!svgEl) return;
    
    const svgData = svgEl.outerHTML;
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  }
});
