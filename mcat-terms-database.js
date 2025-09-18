// MCAT Quiz Terms Database - Based on Official MCAT Content
// Copy terms from here when creating new pages

const mcatTermsDatabase = {
  // PHYSICS (PHY)
  mechanics: {
    terms: ["translational motion", "force", "equilibrium", "work", "energy", "Newton's third law", "friction", "static friction", "kinetic friction", "center of mass", "vector analysis", "torques", "lever arms", "mechanical advantage", "work-kinetic energy theorem", "conservative forces", "kinetic energy", "potential energy", "conservation of energy", "power"],
    hints: {
      "Newton's third law": "Forces equal and opposite",
      "work": "W = F d cos θ",
      "kinetic energy": "½ m v²",
      "potential energy": "mgh for gravity, ½kx² for springs",
      "power": "Rate of energy transfer",
      "torques": "Rotational force",
      "conservative forces": "Path-independent work"
    }
  },

  periodicMotion: {
    terms: ["amplitude", "frequency", "phase", "wavelength", "wave speed", "transverse waves", "longitudinal waves", "interference", "Young's double-slit", "diffraction", "single-slit", "X-ray diffraction", "polarization", "linear polarization", "circular polarization", "electromagnetic waves", "oscillating fields", "electromagnetic spectrum", "photon energy"],
    hints: {
      "amplitude": "Maximum displacement from equilibrium",
      "frequency": "Number of cycles per second",
      "photon energy": "E = hf",
      "electromagnetic waves": "c = speed of light",
      "interference": "Wave superposition",
      "diffraction": "Wave bending around obstacles"
    }
  },

  fluids: {
    terms: ["density", "specific gravity", "buoyancy", "Archimedes' principle", "hydrostatic pressure", "Pascal's law", "viscosity", "Poiseuille flow", "continuity equation", "turbulence", "surface tension", "Bernoulli's equation"],
    hints: {
      "buoyancy": "Upward force on submerged objects",
      "hydrostatic pressure": "P = ρgh",
      "continuity equation": "A·v = constant",
      "Bernoulli's equation": "Energy conservation in fluids",
      "Pascal's law": "Pressure transmitted equally"
    }
  },

  thermodynamics: {
    terms: ["thermodynamic laws", "PV diagrams", "entropy", "enthalpy", "calorimetry", "heat transfer", "phase changes", "first law", "second law", "isothermal", "adiabatic", "isobaric", "isochoric"],
    hints: {
      "first law": "Energy conservation",
      "second law": "Entropy always increases",
      "entropy": "Measure of disorder",
      "enthalpy": "Heat content at constant pressure",
      "calorimetry": "Measuring heat changes"
    }
  },

  electrostatics: {
    terms: ["charge", "conductors", "insulators", "charge conservation", "Coulomb's law", "electric field", "field lines", "electrostatic energy", "electric potential", "current", "electromotive force", "voltage", "resistance", "Ohm's law", "resistivity", "capacitance", "dielectrics", "conductivity"],
    hints: {
      "current": "I = ΔQ/Δt",
      "Ohm's law": "V = IR", 
      "resistivity": "ρ = R·A/L",
      "capacitance": "Ability to store charge",
      "electric field": "Force per unit charge"
    }
  },

  optics: {
    terms: ["reflection", "refraction", "Snell's law", "dispersion", "total internal reflection", "spherical mirrors", "focal length", "thin lenses", "diopters", "optical instruments", "human eye"],
    hints: {
      "Snell's law": "n₁sin(θ₁) = n₂sin(θ₂)",
      "thin lenses": "1/p + 1/q = 1/f",
      "diopters": "Lens power units",
      "total internal reflection": "Complete reflection at interface"
    }
  },

  // GENERAL CHEMISTRY (GC.
  gasPhase: {
    terms: ["kinetic molecular theory", "absolute temperature", "Kelvin scale", "pressure", "mercury barometer", "molar volume", "STP", "ideal gas law", "Boyle's law", "Charles's law", "Avogadro's law", "heat capacity", "Boltzmann constant", "real gas behavior", "Van der Waals equation", "partial pressure", "mole fraction", "Dalton's law"],
    hints: {
      "ideal gas law": "PV = nRT",
      "STP": "22.4 L/mol",
      "Boyle's law": "P₁V₁ = P₂V₂",
      "Charles's law": "V₁/T₁ = V₂/T₂",
      "Dalton's law": "Total pressure = sum of partial pressures"
    }
  },

  atomicStructure: {
    terms: ["orbitals", "quantum states", "Pauli principle", "electronic notation", "Bohr model", "uncertainty principle", "effective nuclear charge", "photoelectric effect", "alkali metals", "alkaline earth", "halogens", "noble gases", "transition metals", "ionization energy", "electron affinity", "electronegativity", "atomic size", "ionic size"],
    hints: {
      "Pauli principle": "No two electrons same quantum state",
      "photoelectric effect": "Light ejects electrons",
      "ionization energy": "Energy to remove electron",
      "electronegativity": "Attraction for electrons",
      "effective nuclear charge": "Net positive charge felt by electron"
    }
  },

  stoichiometry: {
    terms: ["molecular formula", "empirical formula", "percent composition", "mole", "density", "oxidation numbers", "balancing equations", "limiting reagent", "theoretical yield", "percent yield"],
    hints: {
      "empirical formula": "Simplest whole number ratio",
      "limiting reagent": "Reactant that runs out first",
      "theoretical yield": "Maximum possible product",
      "oxidation numbers": "Electron bookkeeping"
    }
  },

  bonding: {
    terms: ["covalent bonding", "Lewis structures", "resonance", "hybridization", "sigma bonds", "pi bonds", "molecular geometry", "VSEPR", "intermolecular forces", "hydrogen bonding", "dipole-dipole", "London dispersion", "van der Waals"],
    hints: {
      "Lewis structures": "Electron dot diagrams",
      "hybridization": "Mixing atomic orbitals",
      "VSEPR": "Valence Shell Electron Pair Repulsion",
      "hydrogen bonding": "Strongest intermolecular force",
      "London dispersion": "Weakest intermolecular force"
    }
  },

  solutions: {
    terms: ["hydration", "hydronium", "solubility", "concentration", "molarity", "Ksp", "common-ion effect", "complex ions", "pH effects", "saturated", "supersaturated"],
    hints: {
      "hydration": "Water surrounding ions",
      "hydronium": "H₃O⁺ ion",
      "Ksp": "Solubility product constant",
      "common-ion effect": "Decreased solubility with common ion",
      "molarity": "Moles solute per liter solution"
    }
  },

  acidBase: {
    terms: ["Brønsted-Lowry", "pH", "Ka", "Kb", "pKa", "pKb", "buffers", "titration", "equivalence point", "indicators", "neutralization", "strong acid", "weak acid", "conjugate pairs"],
    hints: {
      "Brønsted-Lowry": "Proton donor/acceptor definition",
      "pH": "-log[H⁺]",
      "Ka": "Acid dissociation constant",
      "buffers": "Resist pH changes",
      "equivalence point": "Moles acid = moles base"
    }
  },

  kinetics: {
    terms: ["reaction rate", "rate law", "reaction order", "rate constant", "activation energy", "catalyst", "enzyme kinetics", "equilibrium constant", "Le Chatelier's principle"],
    hints: {
      "rate law": "Rate = k[A]ᵐ[B]ⁿ",
      "activation energy": "Minimum energy for reaction",
      "catalyst": "Lowers activation energy",
      "Le Chatelier's principle": "System shifts to relieve stress"
    }
  },

  // ORGANIC CHEMISTRY (OC.
  stereochemistry: {
    terms: ["structural isomers", "stereoisomers", "conformers", "R configuration", "S configuration", "E configuration", "Z configuration", "optical activity", "chiral", "achiral", "enantiomers", "diastereomers", "meso compounds"],
    hints: {
      "enantiomers": "Non-superimposable mirror images",
      "diastereomers": "Stereoisomers that aren't enantiomers",
      "chiral": "Has nonsuperimposable mirror image",
      "optical activity": "Rotates plane-polarized light",
      "meso compounds": "Chiral centers but achiral overall"
    }
  },

  functionalGroups: {
    terms: ["aldehydes", "ketones", "alcohols", "carboxylic acids", "esters", "amides", "phenols", "aromatic", "heterocyclic", "oxidation", "reduction", "substitution", "addition", "elimination", "aldol condensation", "esterification", "hydrolysis"],
    hints: {
      "aldehydes": "R-CHO group",
      "ketones": "R-CO-R group",
      "carboxylic acids": "R-COOH group",
      "aldol condensation": "Aldehyde + ketone reaction",
      "esterification": "Acid + alcohol → ester"
    }
  },

  spectroscopy: {
    terms: ["infrared", "IR spectroscopy", "fingerprint region", "visible absorption", "UV absorption", "conjugation", "NMR spectroscopy", "chemical shift", "spin-spin splitting", "integration"],
    hints: {
      "infrared": "Molecular vibrations",
      "fingerprint region": "Unique IR pattern below 1500 cm⁻¹",
      "UV absorption": "π→π* and n→π* transitions",
      "NMR spectroscopy": "Nuclear magnetic resonance",
      "chemical shift": "Position of NMR peak"
    }
  },

  // BIOCHEMISTRY (BC.
  macromolecules: {
    terms: ["nucleotides", "nucleic acids", "DNA", "RNA", "purines", "pyrimidines", "sugar-phosphate backbone", "amino acids", "proteins", "peptide bonds", "primary structure", "secondary structure", "tertiary structure", "quaternary structure", "isoelectric point", "protein folding", "denaturation"],
    hints: {
      "purines": "Adenine and guanine",
      "pyrimidines": "Cytosine, thymine, uracil",
      "primary structure": "Amino acid sequence",
      "isoelectric point": "pH where protein has no net charge",
      "protein folding": "3D structure formation"
    }
  },

  enzymes: {
    terms: ["enzyme classification", "active site", "substrate", "product", "enzyme kinetics", "Michaelis-Menten", "Km", "Vmax", "competitive inhibition", "noncompetitive inhibition", "allosteric regulation", "feedback inhibition", "cofactors", "coenzymes"],
    hints: {
      "Km": "Substrate concentration at half Vmax",
      "competitive inhibition": "Inhibitor competes with substrate",
      "allosteric regulation": "Regulation at site other than active site",
      "cofactors": "Metal ions required for activity",
      "coenzymes": "Organic molecules required for activity"
    }
  },

  bioenergetics: {
    terms: ["ATP", "ADP", "phosphorylation", "free energy", "Gibbs free energy", "equilibrium constant", "coupled reactions", "energy coupling", "thermodynamics", "entropy", "enthalpy", "spontaneous reactions"],
    hints: {
      "ATP": "Adenosine triphosphate - cellular energy currency",
      "free energy": "Energy available to do work",
      "coupled reactions": "Unfavorable reaction driven by favorable one",
      "spontaneous reactions": "ΔG < 0"
    }
  }
};

// Usage Instructions:
// 1. Find your topic in mcatTermsDatabase
// 2. Copy the terms you want to use  
// 3. Create HTML using: <span data-quiz="TERM" data-hint="HINT">TERM</span>
// 4. Use the hints object for appropriate hint text

export default mcatTermsDatabase;