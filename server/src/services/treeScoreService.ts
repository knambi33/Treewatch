import {
  Tree,
  Verification,
  CareActivity,
  TreeScoreRecord,
  TreeScoreComponents,
  TreeScoreCategory,
  GuardianScore,
  ProjectScore,
  OrganisationScore,
  GeoScore,
  TreeScoreHistoryItem,
} from '../types.js';
import { adminConfig } from './adminConfigService.js';

// Linear interpolation utility
function interpolate(
  val: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  if (val <= inMin) return outMin;
  if (val >= inMax) return outMax;
  return outMin + ((val - inMin) / (inMax - inMin)) * (outMax - outMin);
}

export class TreeScoreService {
  /**
   * Component A: Verified Planting (Max 10 points)
   * Section 4
   */
  public calculatePlantingScore(tree: Tree): number {
    let points = 0;

    // Tree registered
    if (tree.id && tree.treeCode) points += 2;

    // Species recorded
    if (tree.species && tree.species.trim().length > 0) points += 1;

    // Planting date recorded
    if (tree.plantedDate) points += 1;

    // Baseline photograph
    if (tree.baselinePhotoUrl && tree.baselinePhotoUrl.trim().length > 0) points += 2;

    // GPS captured
    if (tree.latitude !== undefined && tree.longitude !== undefined && (tree.latitude !== 0 || tree.longitude !== 0)) {
      points += 2;
    }

    // Planting / project information complete
    if (tree.projectId && tree.planterName && tree.landCategory) {
      points += 2;
    }

    return Math.min(10, points);
  }

  /**
   * Component B: Location & Identity Verification (Max 10 points)
   * Section 5
   */
  public calculateLocationScore(tree: Tree): number {
    let gpsPoints = 0;
    const accuracy = tree.gpsAccuracyMeters || 999;

    if (!tree.latitude || !tree.longitude) {
      gpsPoints = 0;
    } else if (accuracy <= 10) {
      gpsPoints = 8;
    } else if (accuracy <= 20) {
      gpsPoints = 7;
    } else if (accuracy <= 50) {
      gpsPoints = 4;
    } else {
      gpsPoints = 2;
    }

    // Tree Identity: 2 points for Tree ID / QR association
    const identityPoints = (tree.treeCode && (tree.qrCodeUrl || tree.id)) ? 2 : 0;

    return Math.min(10, gpsPoints + identityPoints);
  }

  /**
   * Component C: Monitoring Compliance (Max 15 points)
   * Section 6
   */
  public calculateMonitoringCompliance(
    tree: Tree,
    verifications: Verification[]
  ): { score: number; complianceRate: number; validCount: number; dueCount: number } {
    const ageMonths = Math.max(0, tree.ageMonths || 0);

    // If newly planted (< 1 month) and no check-in yet, due is 0
    if (ageMonths === 0 && verifications.length === 0) {
      return { score: 0, complianceRate: 0, validCount: 0, dueCount: 0 };
    }

    const dueCount = Math.max(1, ageMonths);

    // Valid verifications: must have photo, valid GPS (not mismatch), not rejected
    const validVerifications = verifications.filter((v) => {
      const hasPhoto = !!v.photoUrl;
      const validGps = v.gpsStatus !== 'Mismatch';
      const notRejected = v.verificationStatus !== 'Reviewed-Rejected';
      const noException = !v.flags || !v.flags.some((f) => f.toLowerCase().includes('mismatch'));
      return hasPhoto && validGps && notRejected && noException;
    });

    const validCount = validVerifications.length;
    const complianceRate = Math.min(1.0, validCount / dueCount);
    const score = Math.round(15 * complianceRate * 10) / 10;

    return { score: Math.min(15, score), complianceRate, validCount, dueCount };
  }

  /**
   * Component D: Survival (Max 35 points)
   * Section 7 & 9
   * Uses progressive curve based on verified survival months
   */
  public calculateSurvivalScore(
    tree: Tree,
    verifications: Verification[]
  ): { score: number; verifiedSurvivalDays: number; isDead: boolean } {
    const isDead = ['Dead', 'Missing', 'Removed'].includes(tree.status);

    // Calculate verified survival duration
    let survivalMonths = 0;
    let verifiedSurvivalDays = 0;

    const plantedTime = new Date(tree.plantedDate || tree.createdAt).getTime();

    if (isDead) {
      // Find date of last verified alive check
      const validAliveChecks = verifications.filter(
        (v) => !['Dead / Missing'].includes(v.healthAssessment) && v.gpsStatus !== 'Mismatch'
      );
      if (validAliveChecks.length > 0) {
        const lastAliveTime = new Date(
          validAliveChecks[validAliveChecks.length - 1].submittedAt
        ).getTime();
        verifiedSurvivalDays = Math.max(0, Math.floor((lastAliveTime - plantedTime) / (1000 * 60 * 60 * 24)));
        survivalMonths = verifiedSurvivalDays / 30.4375;
      } else {
        verifiedSurvivalDays = 0;
        survivalMonths = 0;
      }
    } else {
      // Tree is alive or pending: survival based on age and verifications
      const lastCheckTime = tree.lastVerifiedDate
        ? new Date(tree.lastVerifiedDate).getTime()
        : Date.now();
      verifiedSurvivalDays = Math.max(0, Math.floor((lastCheckTime - plantedTime) / (1000 * 60 * 60 * 24)));
      survivalMonths = Math.min(tree.ageMonths || 0, verifiedSurvivalDays / 30.4375);
      if (tree.ageMonths && tree.checkInCount >= tree.ageMonths) {
        survivalMonths = tree.ageMonths;
      } else if (survivalMonths <= 0 && tree.ageMonths) {
        survivalMonths = tree.ageMonths;
        verifiedSurvivalDays = Math.floor(tree.ageMonths * 30.4375);
      }
    }

    // Suggested Default Milestones:
    // 0m -> 0
    // 1m -> 3
    // 3m -> 7
    // 6m -> 12
    // 12m -> 20
    // 18m -> 25
    // 24m -> 29
    // 36m+ -> 35
    let points = 0;
    if (survivalMonths <= 0) {
      points = 0;
    } else if (survivalMonths <= 1) {
      points = interpolate(survivalMonths, 0, 1, 0, 3);
    } else if (survivalMonths <= 3) {
      points = interpolate(survivalMonths, 1, 3, 3, 7);
    } else if (survivalMonths <= 6) {
      points = interpolate(survivalMonths, 3, 6, 7, 12);
    } else if (survivalMonths <= 12) {
      points = interpolate(survivalMonths, 6, 12, 12, 20);
    } else if (survivalMonths <= 18) {
      points = interpolate(survivalMonths, 12, 18, 20, 25);
    } else if (survivalMonths <= 24) {
      points = interpolate(survivalMonths, 18, 24, 25, 29);
    } else if (survivalMonths <= 36) {
      points = interpolate(survivalMonths, 24, 36, 29, 35);
    } else {
      points = 35;
    }

    return {
      score: Math.min(35, Math.round(points * 10) / 10),
      verifiedSurvivalDays,
      isDead,
    };
  }

  /**
   * Component E: Health & Growth (Max 20 points)
   * Section 11 & 12
   */
  public calculateHealthScore(tree: Tree, verifications: Verification[]): number {
    if (['Dead', 'Missing', 'Removed'].includes(tree.status)) {
      return 0;
    }

    // Newly planted with 0 verifications has unverified health (0 points)
    if (verifications.length === 0) {
      return 0;
    }

    const health = tree.currentHealth;
    if (health === 'Dead / Missing') return 0;
    if (health === 'Poor Health') return 8;
    if (health === 'Unable to Assess') return 10;
    if (health === 'Moderate Stress') return 14;

    // Healthy condition with continuity curve (Section 12):
    // 1 valid verification: 14 points
    // 2 valid verifications: 17 points
    // 3+ valid verifications: 20 points
    const validCount = verifications.filter(
      (v) => v.healthAssessment === 'Healthy' && v.gpsStatus !== 'Mismatch'
    ).length;

    if (validCount >= 3) return 20;
    if (validCount === 2) return 17;
    return 14;
  }

  /**
   * Component F: Care & Maintenance (Max 10 points)
   * Section 13
   */
  public calculateMaintenanceScore(
    tree: Tree,
    careActivities: CareActivity[] = []
  ): number {
    let points = 0;

    // 1. Care plan assigned (1 point)
    if (careActivities.some((c) => c.activityType === 'Care Plan Assigned')) {
      points += 1;
    }

    // 2. Caretaker continuity (1 point)
    if (tree.caretakerId && tree.checkInCount >= 2) {
      points += 1;
    }

    // 3. Watering evidence (2 points)
    if (careActivities.some((c) => c.activityType === 'Watering') || tree.checkInCount >= 2) {
      points += 2;
    }

    // 4. Protection / guarding (2 points)
    if (
      careActivities.some((c) => c.activityType === 'Protection' || c.activityType === 'Guarding' || c.activityType === 'Staking') ||
      tree.landCategory === 'School' ||
      tree.landCategory === 'Private'
    ) {
      points += 2;
    }

    // 5. Weeding / mulching (2 points)
    if (
      careActivities.some((c) => c.activityType === 'Mulching' || c.activityType === 'Weeding') ||
      (tree.notes && tree.notes.toLowerCase().includes('mulch'))
    ) {
      points += 2;
    }

    // 6. Maintenance records / soil improvement (2 points)
    if (
      careActivities.some((c) => c.activityType === 'Soil Improvement' || c.activityType === 'Pest Control') ||
      (tree.notes && tree.notes.toLowerCase().includes('compost')) ||
      tree.checkInCount >= 3
    ) {
      points += 2;
    }

    return Math.min(10, points);
  }

  /**
   * TreeView Established™ Milestone Evaluation
   * Section 16
   */
  public evaluateEstablished(
    tree: Tree,
    verifications: Verification[],
    complianceRate: number
  ): boolean {
    const config = adminConfig.getConfig();

    const isAlive = !['Dead', 'Missing', 'Removed'].includes(tree.status);
    const meetsAge = (tree.ageMonths || 0) >= config.establishmentMinAgeMonths; // 36 months
    const validVerifications = verifications.filter(
      (v) => v.gpsStatus !== 'Mismatch' && v.verificationStatus !== 'Reviewed-Rejected'
    ).length;
    const meetsVerifications = validVerifications >= config.establishmentMinVerifications; // 24 checks
    const notDeadHealth = tree.currentHealth !== 'Dead / Missing';
    const speciesIdentified = !!tree.species && tree.species !== 'Unknown';
    const meetsCompliance = validVerifications >= config.establishmentMinVerifications || complianceRate >= 0.65;
    const noActiveException = tree.status !== 'Verification Exception';

    return (
      isAlive &&
      meetsAge &&
      meetsVerifications &&
      notDeadHealth &&
      speciesIdentified &&
      meetsCompliance &&
      noActiveException
    );
  }

  /**
   * Visual Category Resolver
   * Section 15
   */
  public resolveCategory(score: number): TreeScoreCategory {
    if (score >= 95) return '🏆 TreeView Champion';
    if (score >= 80) return '🌳 Established';
    if (score >= 60) return '🌳 Thriving';
    if (score >= 40) return '🌳 Surviving';
    if (score >= 20) return '🌿 Establishing';
    return '🌱 Newly Planted';
  }

  /**
   * Actionable Improvement Tip Generator
   * Section 20
   */
  public generateImprovementTip(components: TreeScoreComponents, isDead: boolean): string {
    if (isDead) {
      return 'Tree verified as dead. Lifetime TreeView Index and verification history are permanently preserved.';
    }

    if (components.monitoring_score < 10) {
      return 'Your biggest opportunity is completing monthly photographic check-ins on schedule.';
    }
    if (components.maintenance_score < 6) {
      return 'Record watering, mulching rings, and protective tree guards to raise Care & Maintenance points.';
    }
    if (components.health_score < 14) {
      return 'Tree shows signs of foliage stress. Inspect soil moisture and provide organic mulch.';
    }
    if (components.location_score < 8) {
      return 'Next verification, stand within 10 meters of the trunk for high-accuracy GPS geotagging.';
    }
    if (components.survival_score < 20) {
      return 'Maintain current health and check-in habits to unlock higher multi-year survival milestone tiers.';
    }
    return 'Outstanding stewardship! Keep up consistent monthly verifications towards TreeView Champion status.';
  }

  /**
   * Full TreeScore™ Calculation for a single tree
   * Sections 3, 14, 18
   */
  public calculateTreeScore(
    tree: Tree,
    verifications: Verification[] = [],
    careActivities: CareActivity[] = [],
    previousScore?: TreeScoreRecord
  ): TreeScoreRecord {
    const config = adminConfig.getConfig();

    const planting_score = this.calculatePlantingScore(tree);
    const location_score = this.calculateLocationScore(tree);
    const { score: monitoring_score, complianceRate } = this.calculateMonitoringCompliance(tree, verifications);
    const { score: survival_score, verifiedSurvivalDays, isDead } = this.calculateSurvivalScore(tree, verifications);
    const health_score = this.calculateHealthScore(tree, verifications);
    const maintenance_score = this.calculateMaintenanceScore(tree, careActivities);

    const totalRaw =
      planting_score +
      location_score +
      monitoring_score +
      survival_score +
      health_score +
      maintenance_score;

    const totalScore = Math.min(100, Math.max(0, Math.round(totalRaw * 10) / 10));
    const category = this.resolveCategory(totalScore);
    const isEstablished = this.evaluateEstablished(tree, verifications, complianceRate);

    const treeDays = verifiedSurvivalDays;
    const treeYears = Math.round((treeDays / 365.25) * 100) / 100;

    const improvementTip = this.generateImprovementTip(
      { planting_score, location_score, monitoring_score, survival_score, health_score, maintenance_score },
      isDead
    );

    const changeFromPrevious = previousScore
      ? Math.round((totalScore - previousScore.totalScore) * 10) / 10
      : undefined;

    let scoreChangeReason = 'Initial planting baseline score';
    if (previousScore) {
      if (isDead) {
        scoreChangeReason = 'Verified dead — future survival accrual halted, lifetime score locked';
      } else if (changeFromPrevious !== undefined && changeFromPrevious > 0) {
        scoreChangeReason = 'Monthly verification & survival progress credited';
      } else if (changeFromPrevious !== undefined && changeFromPrevious < 0) {
        scoreChangeReason = 'Health stress or verification compliance decline';
      } else {
        scoreChangeReason = 'Monthly score recomputed';
      }
    }

    return {
      id: `SCR-${tree.id}-${Date.now()}`,
      treeId: tree.id,
      treeCode: tree.treeCode,
      scoreDate: new Date().toISOString().split('T')[0],
      methodologyVersion: config.methodologyVersion,
      components: {
        planting_score,
        location_score,
        monitoring_score,
        survival_score,
        health_score,
        maintenance_score,
      },
      totalScore,
      category,
      verifiedSurvivalDays,
      treeYears,
      treeDays,
      isEstablished,
      changeFromPrevious,
      scoreChangeReason,
      improvementTip,
      isDead,
      lifetimeScore: isDead ? totalScore : undefined,
      lastVerifiedAliveDate: tree.lastVerifiedDate,
    };
  }

  /**
   * Calculate GuardianScore™ (0 - 100)
   * Section 21
   */
  public calculateGuardianScore(
    guardianId: string,
    guardianName: string,
    assignedTrees: Tree[],
    verifications: Verification[],
    careActivities: CareActivity[]
  ): GuardianScore {
    const treesCount = assignedTrees.length;
    if (treesCount === 0) {
      return {
        guardianId,
        guardianName,
        scoreDate: new Date().toISOString().split('T')[0],
        treesCount: 0,
        aliveCount: 0,
        survivalScore: 0,
        monitoringScore: 0,
        careScore: 0,
        verificationQualityScore: 0,
        integrityScore: 100,
        totalGuardianScore: 0,
        badge: '🌱 New Caretaker',
      };
    }

    // 1. Tree Survival (40%)
    const aliveTrees = assignedTrees.filter((t) => !['Dead', 'Missing', 'Removed'].includes(t.status));
    const survivalRate = aliveTrees.length / treesCount;
    const survivalScore = Math.round(survivalRate * 1000) / 10;

    // 2. Monitoring compliance (25%)
    let totalCompliance = 0;
    assignedTrees.forEach((t) => {
      const treeVerifs = verifications.filter((v) => v.treeId === t.id);
      const { complianceRate } = this.calculateMonitoringCompliance(t, treeVerifs);
      totalCompliance += complianceRate;
    });
    const avgCompliance = totalCompliance / treesCount;
    const monitoringScore = Math.round(avgCompliance * 1000) / 10;

    // 3. Care & Maintenance (20%)
    let totalCare = 0;
    assignedTrees.forEach((t) => {
      const treeCare = careActivities.filter((c) => c.treeId === t.id);
      totalCare += this.calculateMaintenanceScore(t, treeCare);
    });
    const careScore = Math.round((totalCare / (treesCount * 10)) * 1000) / 10;

    // 4. Verification Quality (10%)
    const userVerifs = verifications.filter((v) => v.submittedByUserId === guardianId);
    let qualityScore = 80;
    if (userVerifs.length > 0) {
      const highQuality = userVerifs.filter(
        (v) => v.evidenceQuality === 'High' && v.gpsStatus === 'Verified'
      ).length;
      qualityScore = Math.round((highQuality / userVerifs.length) * 1000) / 10;
    }

    // 5. Honest Reporting (5%): Base 80, +2 points per honest reporting of dead tree
    const deadReports = assignedTrees.filter((t) => ['Dead', 'Missing'].includes(t.status)).length;
    const integrityScore = Math.min(100, 80 + deadReports * 2);

    // Weighted sum
    const total =
      survivalScore * 0.4 +
      monitoringScore * 0.25 +
      careScore * 0.2 +
      qualityScore * 0.1 +
      integrityScore * 0.05;

    const totalGuardianScore = Math.round(Math.min(100, Math.max(0, total)) * 10) / 10;

    let badge = '🌱 Tree Caretaker';
    if (totalGuardianScore >= 90) badge = '🏆 Tree Guardian Champion';
    else if (totalGuardianScore >= 80) badge = '🌳 Master Tree Guardian';
    else if (totalGuardianScore >= 60) badge = '🌿 Active Tree Guardian';

    return {
      guardianId,
      guardianName,
      scoreDate: new Date().toISOString().split('T')[0],
      treesCount,
      aliveCount: aliveTrees.length,
      survivalScore,
      monitoringScore,
      careScore,
      verificationQualityScore: qualityScore,
      integrityScore,
      totalGuardianScore,
      badge,
    };
  }

  /**
   * Calculate ProjectScore™ (0 - 100)
   * Section 22
   */
  public calculateProjectScore(
    project: { id: string; name: string; targetTrees: number },
    projectTrees: Tree[],
    scores: Map<string, TreeScoreRecord>,
    verifications: Verification[]
  ): ProjectScore {
    const planted = projectTrees.length;
    if (planted === 0) {
      return {
        projectId: project.id,
        projectName: project.name,
        targetTrees: project.targetTrees,
        plantedTrees: 0,
        verifiedAlive: 0,
        survivalScore: 0,
        averageTreeScore: 0,
        monitoringComplianceScore: 0,
        healthScore: 0,
        maintenanceScore: 0,
        totalProjectScore: 0,
        establishedCount: 0,
        treeYears: 0,
        evidenceQuality: 'Medium',
      };
    }

    const alive = projectTrees.filter((t) => !['Dead', 'Missing', 'Removed'].includes(t.status)).length;
    const survivalRate = (alive / planted) * 100;

    let sumTreeScore = 0;
    let sumMonitoring = 0;
    let sumHealth = 0;
    let sumMaint = 0;
    let establishedCount = 0;
    let sumTreeYears = 0;

    projectTrees.forEach((t) => {
      const scr = scores.get(t.id);
      if (scr) {
        sumTreeScore += scr.totalScore;
        sumMonitoring += (scr.components.monitoring_score / 15) * 100;
        sumHealth += (scr.components.health_score / 20) * 100;
        sumMaint += (scr.components.maintenance_score / 10) * 100;
        if (scr.isEstablished) establishedCount++;
        sumTreeYears += scr.treeYears;
      }
    });

    const averageTreeScore = Math.round((sumTreeScore / planted) * 10) / 10;
    const avgMonitoring = Math.round((sumMonitoring / planted) * 10) / 10;
    const avgHealth = Math.round((sumHealth / planted) * 10) / 10;
    const avgMaint = Math.round((sumMaint / planted) * 10) / 10;

    // Formula: 40% survival + 25% avg TreeScore + 15% monitoring + 10% health + 10% maintenance
    const total =
      survivalRate * 0.4 +
      averageTreeScore * 0.25 +
      avgMonitoring * 0.15 +
      avgHealth * 0.1 +
      avgMaint * 0.1;

    const totalProjectScore = Math.round(Math.min(100, Math.max(0, total)) * 10) / 10;

    return {
      projectId: project.id,
      projectName: project.name,
      targetTrees: project.targetTrees,
      plantedTrees: planted,
      verifiedAlive: alive,
      survivalScore: Math.round(survivalRate * 10) / 10,
      averageTreeScore,
      monitoringComplianceScore: avgMonitoring,
      healthScore: avgHealth,
      maintenanceScore: avgMaint,
      totalProjectScore,
      establishedCount,
      treeYears: Math.round(sumTreeYears * 10) / 10,
      evidenceQuality: 'High',
    };
  }

  /**
   * Calculate Bayesian Confidence-Adjusted GeoScore
   * Section 26, 27, 28
   * Formula: AdjustedScore = (n / (n + k)) * LocalScore + (k / (n + k)) * NationalAverage
   */
  public calculateGeoScore(
    geoLevel: 'national' | 'state' | 'district' | 'city' | 'ward' | 'school',
    geoId: string,
    geoName: string,
    stateName: string | undefined,
    trees: Tree[],
    scores: Map<string, TreeScoreRecord>,
    nationalAverage: number = 75.0
  ): GeoScore {
    const config = adminConfig.getConfig();
    const count = trees.length;

    let minRequired = config.minSampleLocal;
    if (geoLevel === 'national') minRequired = config.minSampleNational;
    else if (geoLevel === 'state') minRequired = config.minSampleState;
    else if (geoLevel === 'district') minRequired = config.minSampleDistrict;
    else if (geoLevel === 'city') minRequired = config.minSampleLocal;
    else if (geoLevel === 'school') minRequired = 25; // School threshold

    const isEligibleForRanking = count >= minRequired;

    if (count === 0) {
      return {
        id: `GEO-${geoLevel}-${geoId}`,
        geoLevel,
        geoId,
        geoName,
        state: stateName,
        eligibleTreeCount: 0,
        minEligibleRequired: minRequired,
        isEligibleForRanking: false,
        rawScore: 0,
        adjustedScore: 0,
        verifiedSurvivalRate: 0,
        averageTreeScore: 0,
        monitoringCompliance: 0,
        healthRate: 0,
        evidenceQualityRate: 0,
        establishedCount: 0,
        treeYears: 0,
        rank: 999,
      };
    }

    const alive = trees.filter((t) => !['Dead', 'Missing', 'Removed'].includes(t.status)).length;
    const verifiedSurvivalRate = Math.round((alive / count) * 1000) / 10;

    let sumTreeScore = 0;
    let sumCompliance = 0;
    let sumHealth = 0;
    let establishedCount = 0;
    let sumTreeYears = 0;

    trees.forEach((t) => {
      const scr = scores.get(t.id);
      if (scr) {
        sumTreeScore += scr.totalScore;
        sumCompliance += (scr.components.monitoring_score / 15) * 100;
        sumHealth += (scr.components.health_score / 20) * 100;
        if (scr.isEstablished) establishedCount++;
        sumTreeYears += scr.treeYears;
      }
    });

    const averageTreeScore = Math.round((sumTreeScore / count) * 10) / 10;
    const monitoringCompliance = Math.round((sumCompliance / count) * 10) / 10;
    const healthRate = Math.round((sumHealth / count) * 10) / 10;
    const evidenceQualityRate = 92.5;

    // Component weights for GeoScore (Section 26):
    // Average TreeScore: 40%
    // Verified Survival: 30%
    // Monitoring Compliance: 15%
    // Health: 10%
    // Evidence Quality: 5%
    const rawScoreCalc =
      averageTreeScore * 0.4 +
      verifiedSurvivalRate * 0.3 +
      monitoringCompliance * 0.15 +
      healthRate * 0.1 +
      evidenceQualityRate * 0.05;

    const rawScore = Math.round(Math.min(100, Math.max(0, rawScoreCalc)) * 10) / 10;

    // Bayesian Shrinkage (Section 28)
    const k = config.bayesianConfidenceConstantK;
    const adjusted = (count / (count + k)) * rawScore + (k / (count + k)) * nationalAverage;
    const adjustedScore = Math.round(adjusted * 10) / 10;

    return {
      id: `GEO-${geoLevel}-${geoId}`,
      geoLevel,
      geoId,
      geoName,
      state: stateName,
      eligibleTreeCount: count,
      minEligibleRequired: minRequired,
      isEligibleForRanking,
      rawScore,
      adjustedScore,
      verifiedSurvivalRate,
      averageTreeScore,
      monitoringCompliance,
      healthRate,
      evidenceQualityRate,
      establishedCount,
      treeYears: Math.round(sumTreeYears * 10) / 10,
      rank: 1,
    };
  }
}

export const treeScoreService = new TreeScoreService();
