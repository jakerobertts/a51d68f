// Sidebar navigation data organized by category
const sidebarCategories = [
  { title: "Home",
    items: [
      { href: "index.html", text: "Home" },
      { href: "main.html", text: "Dashboard" },
      { href: "about.html", text: "About" },
      { href: "units.html", text: "Units & Conversions" },
      { href: "variables.html", text: "Common Variables" },
    ]
  },

  { 
    title: "Support Us", 
    items: [
      { href: "https://buymeacoffee.com/MCAT-able", text: "Buy Me A Coffee" }
    ] 
  }
];

// Helper function to darken a color for border
function darkenColor(hex) {
  if (!hex) return '#333';
  
  // Handle named colors
  if (hex === 'yellow') hex = '#ffff00';
  
  // Ensure hex format
  if (!hex.startsWith('#')) hex = '#' + hex;
  
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '#333';
  
  const r = Math.max(0, parseInt(result[1], 16) - 60);
  const g = Math.max(0, parseInt(result[2], 16) - 60);
  const b = Math.max(0, parseInt(result[3], 16) - 60);
  
  return `rgb(${r}, ${g}, ${b})`;
}

// Function to generate sidebar HTML with dropdown categories
function createSidebar(activePage = '') {
  const sidebarHTML = `
    <div class="left-sidebar">
      ${sidebarCategories.map(category => `
        <div class="category-section">
          <div class="category-header" onclick="toggleCategory('${category.title.replace(/\s+/g, '-').toLowerCase()}')">${category.title}</div>
          <div class="category-items" id="${category.title.replace(/\s+/g, '-').toLowerCase()}">
            ${category.items.map(item => {
              // Try to get score from localStorage using a key like "score-figures.html"
              const scoreKey = `score-${item.href}`;
              const score = localStorage.getItem(scoreKey);
              
              // Apply highlight style if item has highlight property and textColor if provided
              let highlightStyle = '';
              if (item.highlight) {
                highlightStyle += `background-color: ${item.highlight}; border-left: 4px solid ${darkenColor(item.highlight)}; font-weight: 600;`;
              }
              if (item.textColor) {
                highlightStyle += `color: ${item.textColor};`;
              }
              highlightStyle = highlightStyle ? `style="${highlightStyle}"` : '';
              
              if (item.isHeader) {
                return `<div class="nav-header" style="font-weight:bold; margin:8px 0 4px 0; color:#444;">${item.text}</div>`;
              }
              return `<a href="${item.href}" 
                        class="nav-item${item.href === activePage ? ' active' : ''}${item.highlight ? ' highlighted' : ''}" 
                        ${highlightStyle}>
                        ${item.text}
                        <span class="nav-score" style="float:right; color:#0078d4; font-weight:bold;">${score ? score : ''}</span>
                      </a>`;
            }).join('')}
          </div>
        </div>
      `).join('')}
    </div>
    <style>
      .category-section {
        padding: 0 10px;
        margin-bottom: 5px;
      }
      .category-header {
        color: rgb(237, 237, 237);
        padding: 10px;
        cursor: pointer;
        border: 1px solid rgb(202, 202, 202);
        border-radius: 4px;
        border: 1px solid blueviolet;
        margin: 5px 0;
        font-weight: bold;
        transition: background-color 0.3s;
        font-size: 14px;
      }
      .category-header:hover {
        background: rgb(1, 97, 137);
      }
      .category-items {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease-out;
        padding: 0;
        color: #f1f1f1;
      }
      .category-items.expanded {
        max-height: calc(100vh - 200px);
        transition: max-height 0.5s ease-in;
        overflow-y: auto;
        color: #f1f1f1;
      }
      .nav-item {
        display: block;
        padding: 4px 16px;
        text-decoration: none;
        color: #f1f1f1;
        border-left: 3px solid transparent;
        transition: all 0.3s;
        font-size: 12px;
        font-weight: normal;
        line-height: 1.3;
        margin: 1px 0;
        border-radius: 4px;
      }
      
      /* Highlighted items get special styling */
      .nav-item.highlighted {
        padding: 4px 16px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        transform: translateX(2px);
      }
      
      .nav-item:hover {
        background: #f5f5f5;
        border-left: 3px solid rgb(34, 34, 34);
        font-size: 13px;
        transform: translateX(3px);
        color: rgb(44, 44, 44);
      }
      
      .nav-item.highlighted:hover {
        transform: translateX(5px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.15);
      }
      
      .nav-item.active {
        background: #e8f4fd;
        color:rgb(87, 3, 214);
    .nav-header {
      font-size: 13px;
      padding: 4px 0 4px 8px;
      color: #f3f3f3;
      border-radius: 2px;
      letter-spacing: 1px;
    }
    </style>
  `;
  return sidebarHTML;
}

// Function to toggle category visibility
function toggleCategory(categoryID) {  // Fixed: removed extra period
  const categoryItems = document.getElementById(categoryID);  // Fixed: removed extra period
  categoryItems.classList.toggle('expanded');
}

// Function to expand category containing active page
function expandActiveCategory(activePage) {  // Fixed: changed activePagE to activePage
  sidebarCategories.forEach(category => {
    const hasActivePage = category.items.some(item => item.href === activePage);  // Fixed: removed extra period
    if (hasActivePage) {  // Fixed: changed hasActivePagE to hasActivePage
      const categoryId = category.title.replace(/\s+/g, '-').toLowerCase();
      setTimeout(() => {
        const categoryItems = document.getElementById(categoryId);  // Fixed: changed categoryID to categoryId
        if (categoryItems) {
          categoryItems.classList.add('expanded');
        }
      }, 100);
    }
  });
}

// Function to inject sidebar into the page
function initSidebar() {
  // Get current page filename
  const currentPage = window.location.pathname.split('/').pop();
  
  // Find existing sidebar or create container
  let sidebarContainer = document.querySelector('.left-sidebar');
  if (!sidebarContainer) {
    sidebarContainer = document.createElement('div');
    document.body.insertBefore(sidebarContainer, document.body.firstChild);  // Fixed: changed firstChilD to firstChild
  }
  
  // Replace with generated sidebar
  sidebarContainer.outerHTML = createSidebar(currentPage);

  // Expand the category containing the active page
  expandActiveCategory(currentPage);
}

// Initialize sidebar when DOM is loaded
document.addEventListener('DOMContentLoaded', initSidebar);
