document.addEventListener('DOMContentLoaded', async function() {
  // Load base64 images
  const scoutingEmblem = await loadBase64Image('public/assets/scouting.png');
  const cubEmblem = await loadBase64Image('public/assets/cub.png');

  // Scout Name Plaque functionality
  const packInput = document.getElementById('pack');
  const councilInput = document.getElementById('council');
  const townInput = document.getElementById('town');
  const scoutsTextarea = document.getElementById('scouts');
  const previewDescription = document.getElementById('preview-description');
  const namePreviewContainer = document.getElementById('name-preview-container');
  const namePreviewPlaceholder = document.getElementById('name-preview-placeholder');
  const scoutPlaquePreview = document.getElementById('scout-plaque-preview');
  const previewNavigation = document.getElementById('preview-navigation');
  const prevButton = document.getElementById('prev-button');
  const nextButton = document.getElementById('next-button');
  const downloadCurrentButton = document.getElementById('download-current');
  const downloadAllButton = document.getElementById('download-all');
  const hiddenSvgsContainer = document.getElementById('hidden-svgs');
  
  let namePreviewIndex = 0;
  let parsedScoutNames = [];
  
  // Update preview when inputs change
  [packInput, councilInput, townInput, scoutsTextarea].forEach(input => {
    input.addEventListener('input', updateNamePreview);
  });
  
  // Navigation buttons
  prevButton.addEventListener('click', () => {
    namePreviewIndex = namePreviewIndex > 0 ? namePreviewIndex - 1 : parsedScoutNames.length - 1;
    updateNamePreview();
  });
  
  nextButton.addEventListener('click', () => {
    namePreviewIndex = namePreviewIndex < parsedScoutNames.length - 1 ? namePreviewIndex + 1 : 0;
    updateNamePreview();
  });
  
  // Download buttons
  downloadCurrentButton.addEventListener('click', () => {
    const svgEl = document.getElementById(`scout-plaque-${namePreviewIndex}`);
    downloadSVG(svgEl, `${parsedScoutNames[namePreviewIndex].replace(/\s+/g, '_')}_plaque.svg`);
  });
  
  downloadAllButton.addEventListener('click', () => {
    parsedScoutNames.forEach((name, index) => {
      const svgEl = document.getElementById(`scout-plaque-${index}`);
      downloadSVG(svgEl, `${name.replace(/\s+/g, '_')}_plaque.svg`);
    });
  });
  
  function updateNamePreview() {
    const pack = packInput.value || 'Pack 91';
    const council = councilInput.value || 'Lake Erie Council';
    const town = townInput.value || 'Munson Township, OH';
    
    parsedScoutNames = scoutsTextarea.value
      .split('\n')
      .map(name => name.trim())
      .filter(name => name.length > 0);
    
    if (parsedScoutNames.length === 0) {
      parsedScoutNames = ['Jane Doe'];
    }
    
    // Update UI based on whether we have scout names
    if (parsedScoutNames.length > 0) {
      namePreviewPlaceholder.classList.add('hidden');
      scoutPlaquePreview.classList.remove('hidden');
      downloadCurrentButton.classList.remove('hidden');
      
      if (parsedScoutNames.length > 1) {
        previewNavigation.classList.remove('hidden');
        downloadAllButton.classList.remove('hidden');
      } else {
        previewNavigation.classList.add('hidden');
        downloadAllButton.classList.add('hidden');
      }
      
      // Ensure preview index is valid
      if (namePreviewIndex >= parsedScoutNames.length) {
        namePreviewIndex = 0;
      }
      
      // Update preview description
      previewDescription.textContent = `Showing plaque ${namePreviewIndex + 1} of ${parsedScoutNames.length}`;
      
      // Generate SVG for preview
      const scoutName = parsedScoutNames[namePreviewIndex];
      scoutPlaquePreview.innerHTML = generateNamePlaqueSVG(scoutName, pack, council, town);
      scoutPlaquePreview.setAttribute('viewBox', '0 0 1400 300');
      scoutPlaquePreview.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      
      // Generate hidden SVGs for all scouts
      hiddenSvgsContainer.innerHTML = '';
      parsedScoutNames.forEach((name, index) => {
        const div = document.createElement('div');
        div.id = `scout-plaque-${index}`;
        div.innerHTML = generateNamePlaqueSVG(name, pack, council, town);
        hiddenSvgsContainer.appendChild(div);
      });
    } else {
      namePreviewPlaceholder.classList.remove('hidden');
      scoutPlaquePreview.classList.add('hidden');
      previewNavigation.classList.add('hidden');
      downloadCurrentButton.classList.add('hidden');
      downloadAllButton.classList.add('hidden');
      previewDescription.textContent = "Enter scout names to see previews";
    }
  }
  
  // SVG Generation Function
  function generateNamePlaqueSVG(scoutName, pack, council, town) {
    // SVG dimensions
    const width = 1400;
    const height = 300;
    
    // Calculate font sizes based on name length
    const nameFontSize = Math.min(48, Math.max(24, 400 / Math.max(1, scoutName.length)));
    
    return `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="${width}" height="${height}" fill="white" stroke="black" stroke-width="2" />
        
        <!-- Border design -->
        <rect x="10" y="10" width="${width - 20}" height="${height - 20}" fill="none" stroke="black" stroke-width="1" />
        
        <!-- Scout emblem - scouting emblem on the left -->
        <image x="20" y="20" width="100" height="100" href="${scoutingEmblem}" />
        
        <!-- Scout emblem - cub emblem on the right -->
        <image x="1280" y="20" width="100" height="100" href="${cubEmblem}" />
        
        <!-- Scout name -->
        <text
          x="${width / 2}"
          y="${height / 2 + 10}"
          font-family="Arial, sans-serif"
          font-size="${nameFontSize}"
          text-anchor="middle"
          font-weight="bold"
        >
          ${scoutName}
        </text>
        
        <!-- Pack information -->
        <text
          x="${width / 2}"
          y="${height - 50}"
          font-family="Arial, sans-serif"
          font-size="20"
          text-anchor="middle"
        >
          ${pack} ${town ? `• ${town}` : ''}
        </text>
        
        <!-- Council information -->
        <text
          x="${width / 2}"
          y="${height - 30}"
          font-family="Arial, sans-serif"
          font-size="14"
          text-anchor="middle"
        >
          ${council}
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
