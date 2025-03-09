document.addEventListener('DOMContentLoaded', async function() {
  // Load base64 images
  const scoutingEmblem = await loadBase64Image('public/assets/scouting.png');
  const cubEmblem = await loadBase64Image('public/assets/cub.png');
  const cubSign = await loadBase64Image('public/assets/cubsign.png');
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

  // Tab switching
  const tabTriggers = document.querySelectorAll('.tab-trigger');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      // Remove active class from all triggers and contents
      tabTriggers.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked trigger and corresponding content
      trigger.classList.add('active');
      const tabId = trigger.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });
  
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
  const downloadCurrentPngButton = document.getElementById('download-current-png');
  const downloadAllButton = document.getElementById('download-all');
  const downloadAllPngButton = document.getElementById('download-all-png');
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
    const svgEl = document.getElementById(`scout-plaque-${namePreviewIndex}`).querySelector('svg');
    downloadSVG(svgEl, `${parsedScoutNames[namePreviewIndex].replace(/\s+/g, '_')}_plaque.svg`);
  });
  
  downloadCurrentPngButton.addEventListener('click', () => {
    const svgEl = document.getElementById(`scout-plaque-${namePreviewIndex}`).querySelector('svg');
    downloadPNG(svgEl, `${parsedScoutNames[namePreviewIndex].replace(/\s+/g, '_')}_plaque.png`);
  });
  
  downloadAllButton.addEventListener('click', () => {
    parsedScoutNames.forEach((name, index) => {
      const svgEl = document.getElementById(`scout-plaque-${index}`).querySelector('svg');
      downloadSVG(svgEl, `${name.replace(/\s+/g, '_')}_plaque.svg`);
    });
  });
  
  downloadAllPngButton.addEventListener('click', () => {
    parsedScoutNames.forEach((name, index) => {
      const svgEl = document.getElementById(`scout-plaque-${index}`).querySelector('svg');
      downloadPNG(svgEl, `${name.replace(/\s+/g, '_')}_plaque.png`);
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
      downloadCurrentPngButton.classList.remove('hidden');
      
      if (parsedScoutNames.length > 1) {
        previewNavigation.classList.remove('hidden');
        downloadAllButton.classList.remove('hidden');
        downloadAllPngButton.classList.remove('hidden');
      } else {
        previewNavigation.classList.add('hidden');
        downloadAllButton.classList.add('hidden');
        downloadAllPngButton.classList.add('hidden');
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
      scoutPlaquePreview.setAttribute('viewBox', '0 0 3525 750');
      scoutPlaquePreview.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      scoutPlaquePreview.style.width = '100%'; // Ensure the border fits the SVG
      scoutPlaquePreview.style.backgroundColor = 'lightgrey'; // Make the preview background grey
      
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
      downloadCurrentPngButton.classList.add('hidden');
      downloadAllButton.classList.add('hidden');
      downloadAllPngButton.classList.add('hidden');
      previewDescription.textContent = "Enter scout names to see previews";
    }
  }
  
  // Rank Plaque functionality
  const rankSelect = document.getElementById('rank');
  const yearInput = document.getElementById('year');
  const rankPreviewDescription = document.getElementById('rank-preview-description');
  const rankPlaque = document.getElementById('rank-plaque');
  const downloadRankButton = document.getElementById('download-rank');
  const downloadRankPngButton = document.getElementById('download-rank-png');
  
  // Update rank preview when inputs change
  rankSelect.addEventListener('change', updateRankPreview);
  yearInput.addEventListener('input', updateRankPreview);
  
  // Download rank plaque
  downloadRankButton.addEventListener('click', () => {
    downloadSVG(rankPlaque, `${rankSelect.value.replace(/\s+/g, '_')}_rank_plaque_${yearInput.value}.svg`);
  });
  
  downloadRankPngButton.addEventListener('click', () => {
    downloadPNG(rankPlaque, `${rankSelect.value.replace(/\s+/g, '_')}_rank_plaque_${yearInput.value}.png`);
  });
  
  function updateRankPreview() {
    const rank = rankSelect.value;
    const year = yearInput.value;
    
    // Update preview description
    rankPreviewDescription.textContent = `${rank} Rank Plaque for ${year}`;
    
    // Generate SVG
    rankPlaque.innerHTML = generateRankPlaqueSVG(rank, year);
    rankPlaque.setAttribute('viewBox', '0 0 3525 750');
    rankPlaque.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    rankPlaque.style.border = '1px solid black'; // Add border for preview
    rankPlaque.style.width = '100%'; // Ensure the border fits the SVG
    rankPlaque.style.backgroundColor = 'lightgrey'; // Make the preview background grey
  }
  
  // Initialize previews
  updateNamePreview();
  updateRankPreview();
  
  // SVG Generation Functions
  function generateNamePlaqueSVG(scoutName, pack, council, town) {
    // SVG dimensions
    const width = 3525; // 11.75 inches * 300 dpi
    const height = 750; // 2.5 inches * 300 dpi
    const emblemWidth = 450;
    const availableWidth = width - 2 * (emblemWidth + 60); // Subtract emblem widths and margins
    
    // Calculate font sizes based on name length
    const nameFontSize = Math.min(216, Math.max(108, availableWidth / (scoutName.length * 0.6)));
    
    // Calculate vertical positions
    const nameY = height / 2 - 90;
    const packY = nameY + 150;
    const councilY = packY + 120;
    
    return `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <!-- Background -->
        <rect x="0" y="0" width="${width}" height="${height}" fill="none" />
        
        <!-- Scout emblem - scouting emblem on the left -->
        <image x="60" y="150" width="450" height="450" href="${scoutingEmblem}" />
        
        <!-- Scout emblem - cub emblem on the right -->
        <image x="3015" y="150" width="450" height="450" href="${cubEmblem}" />
        
        <!-- Scout name -->
        <text
          x="${width / 2}"
          y="${nameY}"
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
          y="${packY}"
          font-family="Arial, sans-serif"
          font-size="120"
          text-anchor="middle"
        >
          ${pack} ${town ? `• ${town}` : ''}
        </text>
        
        <!-- Council information -->
        <text
          x="${width / 2}"
          y="${councilY}"
          font-family="Arial, sans-serif"
          font-size="120"
          text-anchor="middle"
        >
          ${council}
        </text>
      </svg>
    `;
  }
  
  function generateRankPlaqueSVG(rank, year) {
    // SVG dimensions
    const width = 3525; // 11.75 inches * 300 dpi
    const height = 750; // 2.5 inches * 300 dpi
    
    // Get rank emblem path based on rank
    let rankEmblem = rankEmblems[rank] || rankEmblems['default'];
    
    // Additional content for Bobcat rank
    const additionalContent = rank === 'Bobcat' ? `
      <!-- Scout Law -->
      <text x="100" y="150" font-family="Arial, sans-serif" font-size="72" font-weight="bold">Scout Law</text>
      <text x="100" y="250" font-family="Arial, sans-serif" font-size="48">
        <tspan x="100" dy="1.2em">Trustworthy</tspan>
        <tspan x="100" dy="1.2em">Loyal</tspan>
        <tspan x="100" dy="1.2em">Helpful</tspan>
        <tspan x="100" dy="1.2em">Friendly</tspan>
        <tspan x="100" dy="1.2em">Courteous</tspan>
        <tspan x="100" dy="1.2em">Kind</tspan>
        <tspan x="500" dy="-7.2em">Obedient</tspan>
        <tspan x="500" dy="1.2em">Cheerful</tspan>
        <tspan x="500" dy="1.2em">Thrifty</tspan>
        <tspan x="500" dy="1.2em">Brave</tspan>
        <tspan x="500" dy="1.2em">Clean</tspan>
        <tspan x="500" dy="1.2em">Reverent</tspan>
      </text>
      
      <!-- Scout Oath -->
      <text x="1000" y="150" font-family="Arial, sans-serif" font-size="72" font-weight="bold">Scout Oath</text>
      <text x="1000" y="250" font-family="Arial, sans-serif" font-size="48">
        <tspan x="1000" dy="1.2em">On my honor, I will do my best</tspan>
        <tspan x="1000" dy="1.2em">To do my duty to God and my country</tspan>
        <tspan x="1000" dy="1.2em">and to obey the Scout Law;</tspan>
        <tspan x="1000" dy="1.2em">To help other people at all times;</tspan>
        <tspan x="1000" dy="1.2em">To keep myself physically strong,</tspan>
        <tspan x="1000" dy="1.2em">mentally awake, and morally straight.</tspan>
      </text>
      
      <!-- Cub Sign -->
      <image x="2000" y="75" width="600" height="600" href="${cubSign}" />
    ` : '';
    
    return `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <!-- Background -->
        <rect x="0" y="0" width="${width}" height="${height}" fill="white" />
        
        <!-- Border -->
        <rect x="35" y="35" width="${width - 70}" height="${height - 70}" fill="none" stroke="black" stroke-width="15" />
        
        <!-- Rank emblem -->
        <image x="2775" y="75" width="600" height="600" href="${rankEmblem}" />
        
        <!-- Year -->
        <text
          x="${width - 150}"
          y="${height / 2}"
          font-family="Arial, sans-serif"
          font-size="144"
          text-anchor="middle"
          transform="rotate(90 ${width - 150} ${height / 2})"
        >
          ${year}
        </text>
        
        ${additionalContent}
      </svg>
    `;
  }
  
  // Utility function to download SVG
  function downloadSVG(svgEl, fileName) {
    if (!svgEl) return;
    
    const svgData = new XMLSerializer().serializeToString(svgEl);
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
  
  // Utility function to download PNG
  function downloadPNG(svgEl, fileName) {
    if (!svgEl) return;
    
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
      ctx.drawImage(img, 0, 0);
      const pngUrl = canvas.toDataURL('image/png');
      
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = fileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  }
});