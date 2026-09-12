import { CompleteAIVerificationResult, IVisionProvider } from '../types.js';
import { HealthCondition } from '../../../types.js';

interface SpeciesInfo {
  species: string;
  scientificName: string;
  typicalCharacteristics: string[];
}

const SPECIES_DATABASE: Record<string, SpeciesInfo> = {
  neem: {
    species: 'Neem',
    scientificName: 'Azadirachta indica',
    typicalCharacteristics: ['Pinnate compound leaves with serrated margins', 'Dark brown deeply grooved bark', 'Broad rounded crown'],
  },
  pongamia: {
    species: 'Pongamia (Pungai)',
    scientificName: 'Millettia pinnata',
    typicalCharacteristics: ['Glossy dark green leaflets', 'Smooth grey-brown bark', 'Dense spreading canopy'],
  },
  peepal: {
    species: 'Peepal (Sacred Fig)',
    scientificName: 'Ficus religiosa',
    typicalCharacteristics: ['Heart-shaped leaves with distinct extended drip-tip', 'Smooth pale grey bark', 'Extensive branching canopy'],
  },
  banyan: {
    species: 'Banyan',
    scientificName: 'Ficus benghalensis',
    typicalCharacteristics: ['Aerial prop roots descending from branches', 'Large leathery elliptic leaves', 'Expansive fluted trunk'],
  },
  'rain tree': {
    species: 'Rain Tree',
    scientificName: 'Samanea saman',
    typicalCharacteristics: ['Umbrella-shaped broad canopy', 'Bipinnate folding leaves', 'Rough fissured grey bark'],
  },
  teak: {
    species: 'Teak',
    scientificName: 'Tectona grandis',
    typicalCharacteristics: ['Large ovate-elliptic rough leaves', 'Tall straight cylindrical trunk', 'Fibrous scaly grey-brown bark'],
  },
  mango: {
    species: 'Mango',
    scientificName: 'Mangifera indica',
    typicalCharacteristics: ['Lanceolate dark green leathery leaves', 'Dome-shaped dense foliage', 'Thick rough dark-grey bark'],
  },
  gulmohar: {
    species: 'Gulmohar',
    scientificName: 'Delonix regia',
    typicalCharacteristics: ['Delicate feathery bipinnate leaves', 'Spreading umbrella habit', 'Smooth light-brown bark'],
  },
  coconut: {
    species: 'Coconut Palm',
    scientificName: 'Cocos nucifera',
    typicalCharacteristics: ['Ringed slender leaning trunk', 'Terminal crown of large pinnate fronds', 'Fibrous root base'],
  },
  mahua: {
    species: 'Mahua',
    scientificName: 'Madhuca longifolia',
    typicalCharacteristics: ['Clustered oblong leathery leaves at branch tips', 'Stout trunk with cracked bark', 'Dense rounded canopy'],
  },
};

export class MockVisionProvider implements IVisionProvider {
  public name = 'TreeWatch Intelligent Vision Simulator';

  public async analyseMonthlyPhoto(params: {
    currentPhotoUrl: string;
    baselinePhotoUrl: string;
    registeredSpecies: string;
    registeredTreeCode: string;
    captureMethod: 'In-App Camera' | 'Gallery Upload';
    simulatedCondition?: HealthCondition;
    simulatedSameTreeConfidence?: number;
  }): Promise<CompleteAIVerificationResult> {
    const { registeredSpecies, captureMethod, simulatedCondition, simulatedSameTreeConfidence } = params;
    const speciesKey = (registeredSpecies || 'neem').toLowerCase().trim();
    const speciesMatch = Object.keys(SPECIES_DATABASE).find((k) => speciesKey.includes(k)) || 'neem';
    const speciesInfo = SPECIES_DATABASE[speciesMatch];

    // 1. Stage 1: Image Quality Check
    const blurScore = Math.floor(82 + Math.random() * 15);
    const brightnessScore = Math.floor(78 + Math.random() * 18);
    const isQualitySufficient = blurScore > 50 && brightnessScore > 40;
    const warnings: string[] = [];
    if (captureMethod === 'Gallery Upload') {
      warnings.push('Gallery Photo — Lower Verification Confidence');
    }

    // 2. Stage 2: Tree Detection
    const treeDetected = true;
    const treeConfidence = Math.floor(92 + Math.random() * 7);

    // 3. Stage 3: Species Identification
    // Determine realistic confidence based on registered species
    const speciesConfidence = Math.floor(88 + Math.random() * 9); // e.g. 91%
    const alternatives = [
      { species: 'Pongamia', confidence: Math.floor(15 + Math.random() * 10) },
      { species: 'Teak', confidence: Math.floor(8 + Math.random() * 8) },
    ];

    // 4. Stage 4: Same-Tree Comparison (persistent physical features)
    let sameTreeConfidence = simulatedSameTreeConfidence ?? Math.floor(86 + Math.random() * 11);
    let sameTreeClassification: 'High confidence' | 'Medium confidence' | 'Low confidence' = 'High confidence';

    if (sameTreeConfidence >= 85) {
      sameTreeClassification = 'High confidence';
    } else if (sameTreeConfidence >= 68) {
      sameTreeClassification = 'Medium confidence';
    } else {
      sameTreeClassification = 'Low confidence';
    }

    const persistentFeatures = [
      'Trunk vertical inclination & base flare matches baseline',
      'Primary branch bifurcation angle corresponds to month 0',
      'Background ground soil boundary and permanent markers aligned',
      'Canopy perimeter expansion consistent with natural growth',
    ];

    // 5. Stage 5: Indicative Health Assessment
    const healthCondition: HealthCondition = simulatedCondition ?? (
      sameTreeConfidence < 50
        ? 'Dead / Missing'
        : sameTreeConfidence < 72
        ? 'Moderate Stress'
        : 'Healthy'
    );

    let foliageDensity: 'Dense / Normal' | 'Sparse / Defoliated' | 'No Foliage' = 'Dense / Normal';
    let canopyCondition: 'Vibrant Green' | 'Moderate Wilting / Yellowing' | 'Severe Browning / Dried' = 'Vibrant Green';
    let trunkCondition: 'Intact & Sturdy' | 'Minor Damage / Leaning' | 'Severely Damaged / Broken' = 'Intact & Sturdy';
    let growthObservation = 'Healthy vegetative expansion observed. New leaf flushes present.';

    if (healthCondition === 'Moderate Stress') {
      foliageDensity = 'Sparse / Defoliated';
      canopyCondition = 'Moderate Wilting / Yellowing';
      trunkCondition = 'Minor Damage / Leaning';
      growthObservation = 'Foliage shows signs of mild water deficit stress or leaf miner presence. Caretaker attention suggested.';
    } else if (healthCondition === 'Poor Health') {
      foliageDensity = 'Sparse / Defoliated';
      canopyCondition = 'Severe Browning / Dried';
      trunkCondition = 'Minor Damage / Leaning';
      growthObservation = 'Significant canopy thinning and dry branch tips detected. Immediate remedial watering and mulching recommended.';
    } else if (healthCondition === 'Dead / Missing') {
      foliageDensity = 'No Foliage';
      canopyCondition = 'Severe Browning / Dried';
      trunkCondition = 'Severely Damaged / Broken';
      growthObservation = 'Absence of live crown foliage. Desiccated stem or missing seedling detected.';
    }

    // 6. Stage 6: Evidence Quality Score
    let evidenceQuality: 'High' | 'Medium' | 'Low' = 'High';
    if (captureMethod === 'Gallery Upload') {
      evidenceQuality = sameTreeConfidence >= 80 ? 'Medium' : 'Low';
    } else {
      if (sameTreeConfidence >= 85 && isQualitySufficient) {
        evidenceQuality = 'High';
      } else if (sameTreeConfidence >= 65) {
        evidenceQuality = 'Medium';
      } else {
        evidenceQuality = 'Low';
      }
    }

    // 7. Stage 7 & 8: Exception Flags & Review Queue Determination
    const flags: string[] = [];
    const reviewReasons: string[] = [];

    if (sameTreeConfidence < 70) {
      flags.push(`Low same-tree similarity (${sameTreeConfidence}%)`);
      reviewReasons.push(`Unable to confidently verify same tree (${sameTreeConfidence}% confidence)`);
    }

    if (healthCondition === 'Dead / Missing' || healthCondition === 'Poor Health') {
      flags.push(`Tree health flagged: ${healthCondition}`);
      reviewReasons.push(`Automated health detector flagged tree as ${healthCondition}`);
    }

    if (speciesConfidence < 65) {
      flags.push('Species identification uncertain');
      reviewReasons.push('Species identification confidence below verification threshold');
    }

    if (captureMethod === 'Gallery Upload') {
      flags.push('Gallery photo submitted instead of direct in-app camera');
    }

    const requiresHumanReview = flags.length > 0;

    return {
      imageQuality: {
        isQualitySufficient,
        blurScore,
        brightnessScore,
        resolutionOk: true,
        warnings,
      },
      treeDetection: {
        treeDetected,
        confidenceScore: treeConfidence,
        detectedElements: ['Trunk', 'Canopy Foliage', 'Ground Root Collar', 'Surrounding Soil'],
      },
      speciesIdentification: {
        likelySpecies: speciesInfo.species,
        scientificName: speciesInfo.scientificName,
        confidenceScore: speciesConfidence,
        isConfident: speciesConfidence >= 70,
        alternativeSpecies: alternatives,
      },
      sameTreeComparison: {
        confidenceScore: sameTreeConfidence,
        classification: sameTreeClassification,
        persistentCharacteristics: persistentFeatures,
        growthObservations: 'Trunk girth and branch structure indicate stable seasonal development.',
        isSameTreeLikely: sameTreeConfidence >= 68,
      },
      healthAssessment: {
        healthCondition,
        confidenceScore: Math.floor(87 + Math.random() * 10),
        indicators: {
          foliageDensity,
          canopyCondition,
          trunkCondition,
          growthObservation,
        },
        indicativeDisclaimer: 'Indicative assessment only — not a professional arborist diagnosis.',
      },
      evidenceQuality,
      flags,
      requiresHumanReview,
      reviewReasons,
    };
  }
}
