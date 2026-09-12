import { EvidenceQuality, HealthCondition, HealthIndicatorDetails, SameTreeConfidenceLevel } from '../../types.js';

export interface ImageQualityAnalysis {
  isQualitySufficient: boolean;
  blurScore: number; // 0 - 100
  brightnessScore: number; // 0 - 100
  resolutionOk: boolean;
  warnings: string[];
}

export interface TreeDetectionResult {
  treeDetected: boolean;
  confidenceScore: number; // 0 - 100
  boundingBox?: { x: number; y: number; width: number; height: number };
  detectedElements: string[]; // e.g. ['Trunk', 'Canopy', 'Foliage', 'Ground soil']
}

export interface SpeciesIdentificationResult {
  likelySpecies: string;
  scientificName: string;
  confidenceScore: number; // 0 - 100
  isConfident: boolean; // e.g. >= 70%
  alternativeSpecies: Array<{ species: string; confidence: number }>;
}

export interface SameTreeComparisonResult {
  confidenceScore: number; // 0 - 100
  classification: SameTreeConfidenceLevel; // 'High confidence' | 'Medium confidence' | 'Low confidence'
  persistentCharacteristics: string[];
  growthObservations: string;
  isSameTreeLikely: boolean;
}

export interface HealthAssessmentResult {
  healthCondition: HealthCondition;
  confidenceScore: number; // 0 - 100
  indicators: HealthIndicatorDetails;
  indicativeDisclaimer: string;
}

export interface CompleteAIVerificationResult {
  imageQuality: ImageQualityAnalysis;
  treeDetection: TreeDetectionResult;
  speciesIdentification: SpeciesIdentificationResult;
  sameTreeComparison: SameTreeComparisonResult;
  healthAssessment: HealthAssessmentResult;
  evidenceQuality: EvidenceQuality;
  flags: string[];
  requiresHumanReview: boolean;
  reviewReasons: string[];
}

export interface IVisionProvider {
  name: string;
  analyseMonthlyPhoto(params: {
    currentPhotoUrl: string;
    baselinePhotoUrl: string;
    registeredSpecies: string;
    registeredTreeCode: string;
    captureMethod: 'In-App Camera' | 'Gallery Upload';
  }): Promise<CompleteAIVerificationResult>;
}
