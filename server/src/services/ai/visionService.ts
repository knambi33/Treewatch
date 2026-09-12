import { IVisionProvider, CompleteAIVerificationResult } from './types.js';
import { MockVisionProvider } from './providers/mockVisionProvider.js';
import { GeminiVisionProvider } from './providers/geminiVisionProvider.js';
import { detectDuplicatePhoto, generatePhotoFingerprint } from './duplicateDetector.js';
import { TreePhoto } from '../../types.js';

export class VisionVerificationService {
  private provider: IVisionProvider;
  private duplicateCache: Map<string, string> = new Map();

  constructor() {
    // Select Gemini if key is provided, otherwise Mock Provider
    if (process.env.GEMINI_API_KEY) {
      this.provider = new GeminiVisionProvider();
    } else {
      this.provider = new MockVisionProvider();
    }
  }

  public setProvider(provider: IVisionProvider) {
    this.provider = provider;
  }

  public getProviderName(): string {
    return this.provider.name;
  }

  /**
   * Executes the 8-stage verification pipeline
   */
  public async executeVerificationPipeline(params: {
    treeId: string;
    treeCode: string;
    currentPhotoUrl: string;
    baselinePhotoUrl: string;
    registeredSpecies: string;
    captureMethod: 'In-App Camera' | 'Gallery Upload';
    currentLat: number;
    currentLng: number;
    gpsStatus: 'Verified' | 'Mismatch' | 'Unavailable' | 'Low Accuracy';
    gpsDistanceMeters: number;
    gpsToleranceMeters: number;
    existingPhotos: TreePhoto[];
    simulatedCondition?: any;
    simulatedSameTreeConfidence?: number;
  }): Promise<{
    aiResult: CompleteAIVerificationResult;
    photoHash: string;
    isFlagged: boolean;
    allFlags: string[];
    suggestedStatus: 'Verified Alive' | 'Needs Attention' | 'Stressed' | 'Poor Health' | 'Dead' | 'Verification Exception';
  }> {
    const photoHash = generatePhotoFingerprint(params.currentPhotoUrl + params.treeId + Date.now().toString());

    // 1. Run Core Vision Provider (Stages 1 - 6)
    const aiResult = await this.provider.analyseMonthlyPhoto({
      currentPhotoUrl: params.currentPhotoUrl,
      baselinePhotoUrl: params.baselinePhotoUrl,
      registeredSpecies: params.registeredSpecies,
      registeredTreeCode: params.treeCode,
      captureMethod: params.captureMethod,
    });

    const allFlags: string[] = [...aiResult.flags];

    // 2. Stage 7: Anti-fraud duplicate detection
    const duplicateCheck = detectDuplicatePhoto(photoHash, params.treeId, params.existingPhotos);
    if (duplicateCheck.isDuplicateSuspected && duplicateCheck.flagMessage) {
      allFlags.push(duplicateCheck.flagMessage);
      aiResult.requiresHumanReview = true;
      aiResult.reviewReasons.push(duplicateCheck.flagMessage);
    }

    // 3. Stage 8: GPS verification integration into flags
    if (params.gpsStatus === 'Mismatch') {
      allFlags.push(`Location Mismatch (${params.gpsDistanceMeters}m > ${params.gpsToleranceMeters}m threshold)`);
      aiResult.requiresHumanReview = true;
      aiResult.reviewReasons.push(`GPS location mismatch: photograph taken ${params.gpsDistanceMeters}m from registered tree position`);
    } else if (params.gpsStatus === 'Low Accuracy') {
      allFlags.push('Low GPS accuracy recorded during verification');
    }

    // Derive suggested tree status:
    // IMPORTANT: If there is a GPS mismatch or low same-tree confidence, DO NOT mark the tree dead.
    // Instead mark 'Verification Exception' or flag for review.
    let suggestedStatus: 'Verified Alive' | 'Needs Attention' | 'Stressed' | 'Poor Health' | 'Dead' | 'Verification Exception' = 'Verified Alive';

    if (params.gpsStatus === 'Mismatch') {
      suggestedStatus = 'Verification Exception';
    } else if (aiResult.sameTreeComparison.confidenceScore < 60) {
      suggestedStatus = 'Verification Exception';
    } else {
      const condition = aiResult.healthAssessment.healthCondition;
      if (condition === 'Healthy') {
        suggestedStatus = 'Verified Alive';
      } else if (condition === 'Moderate Stress') {
        suggestedStatus = 'Needs Attention';
      } else if (condition === 'Poor Health') {
        suggestedStatus = 'Poor Health';
      } else if (condition === 'Dead / Missing') {
        suggestedStatus = 'Dead';
      }
    }

    return {
      aiResult,
      photoHash,
      isFlagged: allFlags.length > 0 || aiResult.requiresHumanReview,
      allFlags,
      suggestedStatus,
    };
  }
}

export const visionVerificationService = new VisionVerificationService();
