document.addEventListener('DOMContentLoaded', function() {
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
    const pack = packInput.value;
    const council = councilInput.value;
    const town = townInput.value;
    
    parsedScoutNames = scoutsTextarea.value
      .split('\n')
      .map(name => name.trim())
      .filter(name => name.length > 0);
    
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
  }
  
  // Initialize previews
  updateNamePreview();
  updateRankPreview();
  
  // SVG Generation Functions
  function generateNamePlaqueSVG(scoutName, pack, council, town) {
    // SVG dimensions
    const width = 600;
    const height = 200;
    
    // Calculate font sizes based on name length
    const nameFontSize = Math.min(48, Math.max(24, 400 / Math.max(1, scoutName.length)));
    
    return `
      <rect x="0" y="0" width="${width}" height="${height}" fill="white" stroke="black" stroke-width="2" />
      
      <!-- Border design -->
      <rect x="10" y="10" width="${width - 20}" height="${height - 20}" fill="none" stroke="black" stroke-width="1" />
      
      <!-- Scout emblem - simplified fleur-de-lis -->
      <g transform="translate(300, 40) scale(0.5)">
        <path
          d="M0,-30 C-10,-20 -15,-10 -15,0 C-15,10 -10,20 0,30 C10,20 15,10 15,0 C15,-10 10,-20 0,-30 Z"
          fill="none"
          stroke="black"
          stroke-width="2"
        />
        <line x1="0" y1="0" x2="0" y2="40" stroke="black" stroke-width="2" />
        <path
          d="M-15,40 C-10,35 -5,30 0,30 C5,30 10,35 15,40"
          fill="none"
          stroke="black"
          stroke-width="2"
        />
      </g>
      
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
        font-size="16"
        text-anchor="middle"
      >
        ${pack}
      </text>
      
      <!-- <!-- Council and town -->
      <text
        x="${width / 2}"
        y="${height - 30}"
        font-family="Arial, sans-serif"
        font-size="14"
        text-anchor="middle"
      >
        ${council} ${town ? `• ${town}` : ''}
      </text>
    `;
  }
  
  function generateRankPlaqueSVG(rank, year) {
    // SVG dimensions
    const width = 600;
    const height = 300;
    
    // Get rank emblem path based on rank
    let rankEmblem = '';
    
    switch (rank) {
      case 'Tiger':
        rankEmblem = `
          <g transform="translate(300, 120) scale(0.8)">
            <circle cx="0" cy="0" r="50" fill="none" stroke="black" strokeWidth="2" />
            <path d="M-30,-30 C-10,0 -10,30 -30,30 C0,10 30,30 30,30 C30,-30 0,-10 -30,-30" fill="none" stroke="black" strokeWidth="2" />
            <circle cx="-15" cy="-5" r="5" fill="black" />
            <circle cx="15" cy="-5" r="5" fill="black" />
          </g>
        `;
        break;
      case 'Wolf':
        rankEmblem = `
          <g transform="translate(300, 120) scale(0.8)">
            <path d="M0,-40 L-40,0 L-20,40 L20,40 L40,0 Z" fill="none" stroke="black" strokeWidth="2" />
            <circle cx="-15" cy="-5" r="5" fill="black" />
            <circle cx="15" cy="-5" r="5" fill="black" />
            <path d="M-10,15 C0,25 10,15 0,5 C-10,15 0,25 10,15" fill="none" stroke="black" strokeWidth="2" />
          </g>
        `;
        break;
      case 'Bear':
        rankEmblem = `
          <g transform="translate(300, 120) scale(0.8)">
            <circle cx="0" cy="0" r="40" fill="none" stroke="black" strokeWidth="2" />
            <circle cx="-15" cy="-15" r="8" fill="black" />
            <circle cx="15" cy="-15" r="8" fill="black" />
            <path d="M-10,10 C0,20 10,10 0,0 C-10,10 0,20 10,10" fill="none" stroke="black" strokeWidth="2" />
            <path d="M-30,-30 C-40,-10 -40,20 -20,30" fill="none" stroke="black" strokeWidth="2" />
            <path d="M30,-30 C40,-10 40,20 20,30" fill="none" stroke="black" strokeWidth="2" />
          </g>
        `;
        break;
      case 'Webelos':
        rankEmblem = `
          <g transform="translate(300, 120) scale(0.8)">
            <path d="M0,-50 L14,-15 L50,-15 L20,5 L30,40 L0,20 L-30,40 L-20,5 L-50,-15 L-14,-15 Z" fill="none" stroke="black" strokeWidth="2" />
          </g>
        `;
        break;
      case 'Arrow of Light':
        rankEmblem = `
          <g transform="translate(300, 120) scale(0.8)">
            <path d="M-60,0 L60,0" stroke="black" strokeWidth="3" />
            <path d="M40,-20 L60,0 L40,20" fill="none" stroke="black" strokeWidth="3" />
            <path d="M-30,-30 L0,30 L30,-30" fill="none" stroke="black" strokeWidth="3" />
          </g>
        `;
        break;
      case 'Eagle':
        rankEmblem = `
          <g transform="translate(300, 120) scale(0.8)">
            <path d="M0,-50 L15,-15 L50,-15 L25,5 L35,40 L0,15 L-35,40 L-25,5 L-50,-15 L-15,-15 Z" fill="none" stroke="black" strokeWidth="2" />
            <path d="M-20,-10 C-10,0 0,-5 0,-15 C0,-5 10,0 20,-10" fill="none" stroke="black" strokeWidth="2" />
          </g>
        `;
        break;
      default:
        // Default scout emblem (fleur-de-lis)
        rankEmblem = `
          <g transform="translate(300, 120) scale(1.5)">
            <path
              d="M0,-30 C-10,-20 -15,-10 -15,0 C-15,10 -10,20 0,30 C10,20 15,10 15,0 C15,-10 10,-20 0,-30 Z"
              fill="none"
              stroke="black"
              strokeWidth="2"
            />
            <line x1="0" y1="0" x2="0" y2="40" stroke="black" strokeWidth="2" />
            <path
              d="M-15,40 C-10,35 -5,30 0,30 C5,30 10,35 15,40"
              fill="none"
              stroke="black"
              strokeWidth="2"
            />
          </g>
        `;
    }
    
    return `
      <!-- Background -->
      <rect x="0" y="0" width="${width}" height="${height}" fill="white" stroke="black" strokeWidth="2" />
      
      <!-- Border design -->
      <rect x="15" y="15" width="${width - 30}" height="${height - 30}" fill="none" stroke="black" strokeWidth="1" />
      
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
      ${rankEmblem}
      
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
});