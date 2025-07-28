// Sidebar navigation data organized by category
const sidebarCategories = [
  { title: "Home",
    items: [
      { href: "index.html", text: "Home" },
      { href: "about.html", text: "About" },
    ]
  },
  {
    title: "Biological and Biochemical Foundations",
    items: [
            { href: "organs(1).html", text: "Organ Systems Overview" },

      // Biochemistry & Macromolecules
      { href: "aa(1).html", text: "Amino Acids & Proteins" },
      { href: "carbohydrates(1).html", text: "Carbohydrates" },
      { href: "nucleotides(1).html", text: "Nucleotides & Nucleic Acids" },
      { href: "fats(1).html", text: "Fats & Lipids" },

      { href: "phospholipids(1).html", text: "Phospholipids, Phosphatids, & Other Fat Derivatives" },

      // Enzymes & Regulation
      { href: "Enzyme(1).html", text: "Enzyme Function & Kinetics" },
      { href: "Co(1).html", text: "Cofactors" },
      { href: "feedback(1).html", text: "Feedback Regulation" },
      { href: "regulation(1).html", text: "Regulation" },

      // Molecular Biology
      { href: "dnarna(1).html", text: "Denaturation" },
      { href: "replication(1).html", text: "DNA Replication" },
      { href: "transcription(1).html", text: "Transcription" },
      { href: "translation(1).html", text: "Translation" },
      { href: "code(1).html", text: "The Triplet Code" },
      { href: "post-transcriptional(1).html", text: "Post-Transcriptional Modifications" },
      { href: "coiling(1).html", text: "Coiling, Packing, Telomeres & Centromeres" },
      { href: "DNApro(1).html", text: "DNA in Prokaryotes & Eukaryotes" },
      
      // Genetics & Evolution
      { href: "alleles(1).html", text: "Alleles & Genes" },
      { href: "sexlinked(1).html", text: "Sex-Linked Inheritance" },
      { href: "evolution(1).html", text: "Evolution & Genetics" },
      { href: "genengine(1).html", text: "Gene Engineering" },
      { href: "ethics(1).html", text: "Ethics in Genetics" },

      // Metabolism & Bioenergetics
      { href: "bioenergetics(1).html", text: "Bioenergetics & Thermodynamics" },
      { href: "phosphorylation(1).html", text: "Phosphorylation & Energy Transfer" },
      { href: "redox(1).html", text: "Bio Redox" },
      { href: "half(1).html", text: "Half-reactions, Flavoproteins, & Electron Carriers" },
      { href: "glycolysis(1).html", text: "Glycolysis & Pyruvate Processing" },
      { href: "feeder(1).html", text: "Feeder Pathways & Gluconeogenesis" },
      { href: "citric(1).html", text: "Citric Acid Cycle" },
      { href: "oxidative(1).html", text: "Oxidative Phosphorylation" },
      { href: "etc(1).html", text: "Electron Transport Chain" },
      { href: "metabolic(1).html", text: "Metabolic Regulation" },
      { href: "metabolism(1).html", text: "Errors of Metabolism" },
      
      // Cell Biology
      { href: "cellmembrane(1).html", text: "Cell Membrane Structure & Function" },
      { href: "junctions(1).html", text: "Cell Junctions & Communication" },
      { href: "organelles(1).html", text: "Organelles & Their Functions" },
      { href: "cellcycle(1).html", text: "Cell Cycle & Division" },
      { href: "apoptosis(1).html", text: "Apoptosis & Cell Death" },
      { href: "mitosis(1).html", text: "Mitosis & Meiosis Overview" },

      // Development & Reproduction
      { href: "stemcells(1).html", text: "Stem Cells & Differentiation" },
      { href: "gameteogenesis(1).html", text: "Gameteogenesis & Fertilization" },

      // Tissue Biology
      { href: "connective(1).html", text: "Connective Tissue & Extracellular Matrix" },

      // Microbiology
      { href: "prokmot(1).html", text: "Prokaryotic Organelles & Motility" },
      { href: "viruses(1).html", text: "Viruses & Other Infectious Agents" },

      // Immunology & Disease
      { href: "immunology(1).html", text: "Immunology" },
      { href: "cancer(1).html", text: "Cancer Biology" },
      
      // Physiology
      { href: "hormones(1).html", text: "Hormones & the Endocrine System" },
      { href: "signal(1).html", text: "Signal Transduction" },
      { href: "oxstress(1).html", text: "Oxidative Stress & Mitochondria" },
      
      // Laboratory Techniques
      { href: "separation(1).html", text: "Separation Techniques" },
      { href: "isoelectric(1).html", text: "Isoelectric Point" },
      { href: "electrophoresis(1).html", text: "Electrophoresis" },
    ]
  },
  {
    title: "Chemical and Physical Foundations",
    items: [
      { href: "mechanics(1).html", text: "Mechanics" },
      { href: "periodicmotion(1).html", text: "Periodic Motion" },
      { href: "fluids(1).html", text: "Fluids" },
      { href: "thermodynamics(1).html", text: "Thermodynamics" },
      { href: "electrostatics(1).html", text: "Electrostatics" },
      { href: "optics(1).html", text: "Optics" },
      { href: "solutions(1).html", text: "Solutions" },
      { href: "acidsbases(1).html", text: "Acids & Bases" },
      { href: "gasphase(1).html", text: "Gas Phase" },
      { href: "atomicstructure(1).html", text: "Atomic Structure" },
      { href: "stoichiometry(1).html", text: "Stoichiometry" },
      { href: "bonding(1).html", text: "Bonding & Molecular Structure" },
      { href: "sterics(1).html", text: "Stereochemistry" },
      { href: "functionalgroups(1).html", text: "Functional Groups" },
      { href: "spectro(1).html", text: "Spectroscopy" },

    ]
  },
  {
    title: "Psychological, Social, and Biological Foundations",
    items: [
      { href: "Biological(1).html", text: "Biological Foundations of Behavior" },
      { href: "Theories(1).html", text: "All Psychological and Social Theories" },
      { href: "psych(1).html", text: "Psychological Concepts" },
      { href: "social(1).html", text: "Sociological Concepts" },
    ]
  },
  { title:"Figures + Equations", items: [
      { href: "figures(1).html", text: "Figures + Equations" },
    ]
  },

];

// Function to generate sidebar HTML with dropdown categories
function createSidebar(activePage = '') {
  const sidebarHTML = `
    <div class="left-sidebar">
      <h3>MCAT Topics - View Only</h3>
      ${sidebarCategories.map(category => `
        <div class="category-section">
          <div class="category-header" onclick="toggleCategory('${category.title.replace(/\s+/g, '-').toLowerCase()}')">${category.title}</div>
          <div class="category-items" id="${category.title.replace(/\s+/g, '-').toLowerCase()}">
            ${category.items.map(item => 
              `<a href="${item.href}" class="nav-item${item.href === activePage ? ' active' : ''}">${item.text}</a>`
            ).join('')}
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
