const BUNDLES = {
    BB: {
        id: 'BB',
        name: 'Biological and Biochemical Foundations',
        price: 999,
        sections: [
            'Organ Systems Overview',
            'Amino Acids & Proteins',
            'Carbohydrates',
            'Nucleotides & Nucleic Acids',
            'Fats & Lipids',
            'Phospholipids, Phosphatids, & Other Fat Derivatives',
            'Enzyme Function & Kinetics',
            'Cofactors',
            'Binding',
            'Feedback Regulation',
            'Regulation',
            'Denaturation',
            'DNA Replication',
            'Transcription',
            'Translation',
            'The Triplet Code',
            'Post-Transcriptional Modifications',
            'Coiling, Packing, Telomeres & Centromeres',
            'DNA in Prokaryotes & Eukaryotes',
            'Alleles & Genes',
            'Sex-Linked Inheritance',
            'Evolution & Genetics',
            'Gene Engineering',
            'Ethics in Genetics',
            'Bioenergetics & Thermodynamics',
            'Phosphorylation & Energy Transfer',
            'Bio Redox',
            'Half-reactions, Flavoproteins, & Electron Carriers',
            'Glycolysis & Pyruvate Processing',
            'Feeder Pathways & Gluconeogenesis',
            'Citric Acid Cycle',
            'Oxidative Phosphorylation',
            'Electron Transport Chain',
            'Metabolic Regulation',
            'Errors of Metabolism',
            'Cell Membrane Structure & Function',
            'Cell Junctions & Communication',
            'Organelles & Their Functions',
            'Cell Cycle & Mitosis',
            'Apoptosis & Cell Death',
            'Mitosis & Meiosis Overview',
            'Stem Cells & Differentiation',
            'Gametogenesis & Fertilization',
            'Connective Tissue & Extracellular Matrix',
            'Prokaryotic Organelles & Motility',
            'Viruses & Other Agents',
            'Immunology',
            'Cancer Biology',
            'Hormones & the Endocrine System',
            'Signal Transduction',
            'Oxidative Stress & Mitochondria',
            'Separation Techniques',
            'Isoelectric Point',
            'Electrophoresis'
        ]
    },
    CP: {
        id: 'CP',
        name: 'Chemical and Physical Foundations',
        price: 499,
        sections: [
            'Mechanics',
            'Periodic Motion',
            'Fluids',
            'Thermodynamics',
            'Electrostatics',
            'Optics',
            'Solutions',
            'Acids & Bases',
            'Gas Phase',
            'Atomic Structure',
            'Stoichiometry',
            'Bonding & Molecular Structure',
            'Stereochemistry',
            'Functional Groups',
            'Spectroscopy'
        ]
    },
    PS: {
        id: 'PS',
        name: 'Psychological, Social, and Biological Foundations',
        price: 599,
        sections: [
            'Biological Foundations of Behavior',
            'All Psychological and Social Theories',
            'Psychological Concepts',
            'Sociological Concepts'
        ]
    }
};

BUNDLES.getSections = function(bundleI<strong>D.</strong>   {
    return Object.values(this[bundleId].categories).flat();
};

BUNDLES.getCategory = function(sectionName.{
    for (const [bundleId, bundle] of Object.entries(this)) {
        for (const [category, sections] of Object.entries(bundle.categories || {})) {
            if (sections.includes(sectionNamE.) {
                return { bundleId, category };
            }
        }
    }
    return null;
};

module.exports = { BUNDLES };