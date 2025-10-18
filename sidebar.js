// Sidebar navigation data organized by category
const sidebarCategories = [
  { title: "Home",
    items: [
      { href: "index.html", text: "Home" },
      { href: "main.html", text: "Dashboard" },
      { href: "about.html", text: "About" },
      { href: "figures.html", text: "Figures + Equations" },
      { href: "units.html", text: "Units & Conversions" },
      { href: "variables.html", text: "Common Variables" },
    ]
  },
  { title: "Comprehensive Checklists", items: [
    { isHeader: true, text: "" },
    { href: "acidderivatives.html", text: "Acid Derivatives Checklist - CHEM", highlight: "", textColor: "white" },
    { href: "acidbaseeq.html", text: "Acid-Base Equilibria Checklist - CHEM", highlight: "", textColor: "white" },
    { href: "alcohols.html", text: "Alcohols Checklist - CHEM", highlight: "", textColor: "white" },
    { href: "aldehydes.html", text: "Aldehydes & Ketones Checklist - CHEM", highlight: "", textColor: "white" },
    { href: "atom.html", text: "Atomic Structure Checklist - CHEM", highlight: "", textColor: "white" },
    { href: "circuits.html", text: "Circuits Checklist - PHY", highlight: "", textColor: "white" },
    { href: "fluidcirc.html", text: "Fluids / Circulation Checklist - PHY", highlight: "", textColor: "white" },

    { isHeader: true, text: "" },
    { href: "aachem.html", text: "Amino Acids & Proteins Checklist - BC", highlight: "", textColor: "white" },
    { href: "bioenergeticsq.html", text: "Bioenergetics Checklist - BC", highlight: "", textColor: "white" },
    { href: "carb.html", text: "Carbohydrates Checklist - BC", highlight: "", textColor: "white" },
    { href: "carbmetabolism.html", text: "Carbohydrate Metabolism Checklist - BC", highlight: "", textColor: "white" },
    { href: "celltheory.html", text: "Cell Theory Checklist - BIO", highlight: "", textColor: "white" },
    { href: "circulatory.html", text: "Circulatory System Checklist - BIO", highlight: "", textColor: "white" },
    { href: "digestive.html", text: "Digestive System Checklist - BIO", highlight: "", textColor: "white" },
    { href: "endocrine.html", text: "Endocrine System Checklist - BIO", highlight: "", textColor: "white" },
    { href: "ex.html", text: "Excretory System Checklist - BIO", highlight: "", textColor: "white" },
    { href: "oxphos.html", text: "Oxidative Phosphorylation Checklist - BC", highlight: "", textColor: "white" },

    { isHeader: true, text: "", textColor: "white" },
    { href: "associativelearning.html", text: "Associative Learning Checklist - PSY", highlight: "", textColor: "white" },
    { href: "attitudetheory.html", text: "Attitude Theory Checklist - PSY", highlight: "", textColor: "white" },
    { href: "consciousness.html", text: "Consciousness Checklist - PSY", highlight: "", textColor: "white" },
    { href: "culture.html", text: "Culture Checklist - PSY", highlight: "", textColor: "white" },
    { href: "demographics.html", text: "Demographics Checklist - PSY", highlight: "", textColor: "white" },
  ]},

  {
    title: "Biological and Biochemical Foundations",
    items: [
      { href: "organs.html", text: "Organ Systems Overview" },
      { href: "aa.html", text: "Amino Acids & Proteins" },
      { href: "carbohydrates.html", text: "Carbohydrates" },
      { href: "nucleotides.html", text: "Nucleotides & Nucleic Acids" },
      { href: "fats.html", text: "Fats & Lipids" },
      { href: "phospholipids.html", text: "Phospholipids, Phosphatids, & Other Fat Derivatives" },
      { href: "Enzyme.html", text: "Enzyme Function & Kinetics" },
      { href: "Co.html", text: "Cofactors" },
      { href: "feedback.html", text: "Feedback Regulation" },
      { href: "regulation.html", text: "Regulation" },
      { href: "dnarna.html", text: "Denaturation" },
      { href: "replication.html", text: "DNA Replication" },
      { href: "transcription.html", text: "Transcription" },
      { href: "translation.html", text: "Translation" },
      { href: "code.html", text: "The Triplet Code" },
      { href: "post-transcriptional.html", text: "Post-Transcriptional Modifications" },
      { href: "coiling.html", text: "Coiling, Packing, Telomeres & Centromeres" },
      { href: "DNApro.html", text: "DNA in Prokaryotes & Eukaryotes" },
      { href: "alleles.html", text: "Alleles & Genes" },
      { href: "sexlinked.html", text: "Sex-Linked Inheritance" },
      { href: "evolution.html", text: "Evolution & Genetics" },
      { href: "genengine.html", text: "Gene Engineering" },
      { href: "ethics.html", text: "Ethics in Genetics" },
      { href: "bioenergetics.html", text: "Bioenergetics & Thermodynamics" },
      { href: "phosphorylation.html", text: "Phosphorylation & Energy Transfer" },
      { href: "redox.html", text: "Bio Redox" },
      { href: "glycolysis.html", text: "Glycolysis & Pyruvate Processing" },
      { href: "feeder.html", text: "Feeder Pathways & Gluconeogenesis" },
      { href: "citric.html", text: "Citric Acid Cycle" },
      { href: "oxidative.html", text: "Oxidative Phosphorylation" },
      { href: "etc.html", text: "Electron Transport Chain" },
      { href: "metabolic.html", text: "Metabolic Regulation" },
      { href: "metabolism.html", text: "Errors of Metabolism" },
      { href: "cellmembrane.html", text: "Cell Membrane Structure & Function" },
      { href: "junctions.html", text: "Cell Junctions & Communication" },
      { href: "organelles.html", text: "Organelles & Their Functions" },
      { href: "cellcycle.html", text: "Cell Cycle & Division" },
      { href: "apoptosis.html", text: "Apoptosis & Cell Death" },
      { href: "mitosis.html", text: "Mitosis & Meiosis Overview" },
      { href: "stemcells.html", text: "Stem Cells & Differentiation" },
      { href: "gameteogenesis.html", text: "Gameteogenesis & Fertilization" },
      { href: "connective.html", text: "Connective Tissue & Extracellular Matrix" },
      { href: "prokmot.html", text: "Prokaryotic Organelles & Motility" },
      { href: "viruses.html", text: "Viruses & Other Infectious Agents" },
      { href: "immunology.html", text: "Immunology" },
      { href: "cancer.html", text: "Cancer Biology" },
      { href: "hormones.html", text: "Hormones & the Endocrine System" },
      { href: "signal.html", text: "Signal Transduction" },
      { href: "oxstress.html", text: "Oxidative Stress & Mitochondria" },
      { href: "separation.html", text: "Separation Techniques" },
      { href: "isoelectric.html", text: "Isoelectric Point" },
      { href: "electrophoresis.html", text: "Electrophoresis" },
    ]
  },
  {
    title: "Chemical and Physical Foundations",
    items: [
      { href: "mechanics.html", text: "Mechanics" },
      { href: "periodicmotion.html", text: "Periodic Motion" },
      { href: "fluids.html", text: "Fluids" },
      { href: "thermodynamics.html", text: "Thermodynamics" },
      { href: "electrostatics.html", text: "Electrostatics" },
      { href: "optics.html", text: "Optics" },
      { href: "solutions.html", text: "Solutions" },
      { href: "acidsbases.html", text: "Acids & Bases" },
      { href: "gasphase.html", text: "Gas Phase" },
      { href: "atomicstructure.html", text: "Atomic Structure" },
      { href: "stoichiometry.html", text: "Stoichiometry" },
      { href: "bonding.html", text: "Bonding & Molecular Structure" },
      { href: "sterics.html", text: "Stereochemistry" },
      { href: "functionalgroups.html", text: "Functional Groups" },
      { href: "spectro.html", text: "Spectroscopy" },
    ]
  },
  {
    title: "Psychological, Social, and Biological Foundations",
    items: [
      { href: "Biological.html", text: "Biological Foundations of Behavior" },
      { href: "Theories.html", text: "All Psychological and Social Theories" },
      { href: "psych.html", text: "Psychological Concepts" },
      { href: "social.html", text: "Sociological Concepts" },
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
