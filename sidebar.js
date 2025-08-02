// Sidebar navigation data organized by category
const sidebarCategories = [
  { title: "Home",
    items: [
      { href: "index.html", text: "Home" },
      { href: "about.html", text: "About" },
      { href: "insights.html", text: "Insights" },
    ]
  },
  {
    title: "Biological and Biochemical Foundations",
    items: [
            { href: "organs.html", text: "Organ Systems Overview <span class='dollar-green'>☑</span>" },

      // Biochemistry & Macromolecules
      { href: "aa.html", text: "Amino Acids & Proteins <span class='dollar-green'>☑</span>" },
      { href: "carbohydrates.html", text: "Carbohydrates<span class='dollar-green'>☑</span>" },
      { href: "nucleotides.html", text: "Nucleotides & Nucleic Acids" },
            { href: "fats.html", text: "Fats & Lipids <span class='dollar-green'>☑</span>" },

      { href: "phospholipids.html", text: "Phospholipids, Phosphatids, & Other Fat Derivatives <span class='dollar-green'>☑</span>" },
      
      // Enzymes & Regulation
      { href: "Enzyme.html", text: "Enzyme Function & Kinetics <span class='dollar-green'>☑</span>" },
      { href: "Co.html", text: "Cofactors" },
      { href: "feedback.html", text: "Feedback Regulation" },
      { href: "regulation.html", text: "Regulation" },
      
      // Molecular Biology
      { href: "dnarna.html", text: "Denaturation" },
      { href: "replication.html", text: "DNA Replication <span class='dollar-green'>☑</span>" },
      { href: "transcription.html", text: "Transcription" },
      { href: "translation.html", text: "Translation <span class='dollar-green'>☑</span>" },
      { href: "code.html", text: "The Triplet Code" },
      { href: "post-transcriptional.html", text: "Post-Transcriptional Modifications" },
      { href: "coiling.html", text: "Coiling, Packing, Telomeres & Centromeres <span class='dollar-green'>☑</span>" },
      { href: "DNApro.html", text: "DNA in Prokaryotes & Eukaryotes <span class='dollar-green'>☑</span>" },
      
      // Genetics & Evolution
      { href: "alleles.html", text: "Alleles & Genes <span class='dollar-green'>☑</span>" },
      { href: "sexlinked.html", text: "Sex-Linked Inheritance" },
      { href: "evolution.html", text: "Evolution & Genetics" },
      { href: "genengine.html", text: "Gene Engineering" },
      { href: "ethics.html", text: "Ethics in Genetics" },
      
      // Metabolism & Bioenergetics
      { href: "bioenergetics.html", text: "Bioenergetics & Thermodynamics <span class='dollar-green'>☑</span>" },
      { href: "phosphorylation.html", text: "Phosphorylation & Energy Transfer" },
      { href: "redox.html", text: "Bio Redox" },
      { href: "half.html", text: "Half-reactions, Flavoproteins, & Electron Carriers" },
      { href: "glycolysis.html", text: "Glycolysis & Pyruvate Processing <span class='dollar-green'>☑</span>" },
      { href: "feeder.html", text: "Feeder Pathways & Gluconeogenesis" },
      { href: "citric.html", text: "Citric Acid Cycle" },
      { href: "oxidative.html", text: "Oxidative Phosphorylation" },
      { href: "etc.html", text: "Electron Transport Chain" },
      { href: "metabolic.html", text: "Metabolic Regulation" },
      { href: "metabolism.html", text: "Errors of Metabolism" },
      
      // Cell Biology
      { href: "cellmembrane.html", text: "Cell Membrane Structure & Function <span class='dollar-green'>☑</span>" },
      { href: "junctions.html", text: "Cell Junctions & Communication" },
      { href: "organelles.html", text: "Organelles & Their Functions <span class='dollar-green'>☑</span>" },
      { href: "cellcycle.html", text: "Cell Cycle & Division <span class='dollar-green'>☑</span>" },
      { href: "apoptosis.html", text: "Apoptosis & Cell Death<span class='dollar-green'>☑</span>" },
      { href: "mitosis.html", text: "Mitosis & Meiosis Overview <span class='dollar-green'>☑</span>" },
      
      // Development & Reproduction
      { href: "stemcells.html", text: "Stem Cells & Differentiation <span class='dollar-green'>☑</span>" },
      { href: "gameteogenesis.html", text: "Gameteogenesis & Fertilization <span class='dollar-green'>☑</span>" },
      
      // Tissue Biology
      { href: "connective.html", text: "Connective Tissue & Extracellular Matrix <span class='dollar-green'>☑</span>" },
      
      // Microbiology
      { href: "prokmot.html", text: "Prokaryotic Organelles & Motility" },
      { href: "viruses.html", text: "Viruses & Other Infectious Agents <span class='dollar-green'>☑</span>" },
      
      // Immunology & Disease
      { href: "immunology.html", text: "Immunology <span class='dollar-green'>☑</span>" },
      { href: "cancer.html", text: "Cancer Biology <span class='dollar-green'>☑</span>" },
      
      // Physiology
      { href: "hormones.html", text: "Hormones & the Endocrine System" },
      { href: "signal.html", text: "Signal Transduction" },
      { href: "oxstress.html", text: "Oxidative Stress & Mitochondria" },
      
      // Laboratory Techniques
      { href: "separation.html", text: "Separation Techniques <span class='dollar-green'>☑</span>" },
      { href: "isoelectric.html", text: "Isoelectric Point" },
      { href: "electrophoresis.html", text: "Electrophoresis" },
    ]
  },
  {
    title: "Chemical and Physical Foundations",
    items: [
      { href: "mechanics.html", text: "Mechanics <span class='dollar-green'>☑</span>" },
      { href: "periodicmotion.html", text: "Periodic Motion <span class='dollar-green'>☑</span>" },
      { href: "fluids.html", text: "Fluids" },
      { href: "thermodynamics.html", text: "Thermodynamics" },
      { href: "electrostatics.html", text: "Electrostatics <span class='dollar-green'>☑</span>" },
      { href: "optics.html", text: "Optics" },
      { href: "solutions.html", text: "Solutions <span class='dollar-green'>☑</span>" },
      { href: "acidsbases.html", text: "Acids & Bases" },
      { href: "gasphase.html", text: "Gas Phase <span class='dollar-green'>☑</span>" },
      { href: "atomicstructure.html", text: "Atomic Structure <span class='dollar-green'>☑</span>" },
      { href: "stoichiometry.html", text: "Stoichiometry" },
      { href: "bonding.html", text: "Bonding & Molecular Structure <span class='dollar-green'>☑</span>" },
      { href: "sterics.html", text: "Stereochemistry" },
      { href: "functionalgroups.html", text: "Functional Groups <span class='dollar-green'>☑</span>" },
      { href: "spectro.html", text: "Spectroscopy" },

    ]
  },
  {
    title: "Psychological, Social, and Biological Foundations",
    items: [
      { href: "Biological.html", text: "Biological Foundations of Behavior <span class='dollar-green'>☑</span>" },
      { href: "Theories.html", text: "All Psychological and Social Theories <span class='dollar-green'>☑</span>" },
      { href: "psych.html", text: "Psychological Concepts <span class='dollar-green'>☑</span>" },
      { href: "social.html", text: "Sociological Concepts <span class='dollar-green'>☑</span>" },
    ]
  },
  { title:"Figures + Equations", items: [
      { href: "figures.html", text: "Figures + Equations <span class='dollar-green'>☑</span>" },
    ]
  },

];

// Function to generate sidebar HTML with dropdown categories
function createSidebar(activePage = '') {
  const sidebarHTML = `
    <div class="left-sidebar">
      <h3>MCAT Topics</h3>
      ${sidebarCategories.map(category => `
        <div class="category-section">
          <div class="category-header" onclick="toggleCategory('${category.title.replace(/\s+/g, '-').toLowerCase()}')">${category.title}</div>
          <div class="category-items" id="${category.title.replace(/\s+/g, '-').toLowerCase()}">
            ${category.items.map(item => {
              // Try to get score from localStorage using a key like "score-figures.html"
              const scoreKey = `score-${item.href}`;
              const score = localStorage.getItem(scoreKey);
              return `<a href="${item.href}" class="nav-item${item.href === activePage ? ' active' : ''}">
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
        background:rgb(255, 255, 255);
        color: black;
        padding: 10px;
        cursor: pointer;
        border-radius: 4px;
        border: 1px solid black;
        margin: 5px 0;
        font-weight: bold;
        transition: background-color 0.3s;
        font-size: 14px;
      }
      .category-header:hover {
        background:rgb(138, 138, 138);
      }
      .category-items {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease-out;
        padding: 0;
      }
      .category-items.expanded {
        max-height: calc(100vh - 200px);
        transition: max-height 0.5s ease-in;
        overflow-y: auto;
      }
      .nav-item {
        display: block;
        padding: 2px 16px;
        text-decoration: none;
        color: #333;
        border-left: 3px solid transparent;
        transition: all 0.3s;
        font-size: 12px;
        font-weight: normal;
        line-height: 1.3;
      }
      .nav-item:hover {
        background: #f5f5f5;
        border-left: 3px solidrgb(34, 34, 34);
        font-size: 13px;
        transform: translateX(3px);
      }
      .nav-item.active {
        background: #e8f4fd;
        border-left: 3px solidrgb(154, 154, 154);
        font-weight: bold;
      }
    </style>
  `;
  return sidebarHTML;
}

// Function to toggle category visibility
function toggleCategory(categoryId) {
  const categoryItems = document.getElementById(categoryId);
  categoryItems.classList.toggle('expanded');
}

// Function to expand category containing active page
function expandActiveCategory(activePage) {
  sidebarCategories.forEach(category => {
    const hasActivePage = category.items.some(item => item.href === activePage);
    if (hasActivePage) {
      const categoryId = category.title.replace(/\s+/g, '-').toLowerCase();
      setTimeout(() => {
        const categoryItems = document.getElementById(categoryId);
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
    document.body.insertBefore(sidebarContainer, document.body.firstChild);
  }
  
  // Replace with generated sidebar
  sidebarContainer.outerHTML = createSidebar(currentPage);
  
  // Expand the category containing the active page
  expandActiveCategory(currentPage);
}

// Initialize sidebar when DOM is loaded
document.addEventListener('DOMContentLoaded', initSidebar);

