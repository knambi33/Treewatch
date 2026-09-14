import {
  Organisation,
  Project,
  Tree,
  User,
  Verification,
  TimelineEvent,
  ReviewQueueItem,
  NotificationItem,
  TreePhoto,
  TreeStatus,
  HealthCondition,
  CareActivity,
  TreeScoreRecord,
  TreeScoreHistoryItem,
  GuardianScore,
  ProjectScore,
  OrganisationScore,
  GeoScore,
} from '../types.js';
import { generateSeedData } from './seedData.js';
import { treeScoreService } from '../services/treeScoreService.js';
import { adminConfig } from '../services/adminConfigService.js';

class DataStore {
  public organisations: Organisation[] = [];
  public projects: Project[] = [];
  public users: User[] = [];
  public trees: Tree[] = [];
  public photos: TreePhoto[] = [];
  public verifications: Verification[] = [];
  public timelineEvents: TimelineEvent[] = [];
  public reviewQueue: ReviewQueueItem[] = [];
  public notifications: NotificationItem[] = [];
  public careActivities: CareActivity[] = [];

  // TreeScore auditable storage
  public treeScores: Map<string, TreeScoreRecord> = new Map();
  public treeScoreHistory: Map<string, TreeScoreHistoryItem[]> = new Map();

  constructor() {
    this.init();
  }

  public init() {
    const seed = generateSeedData();
    this.organisations = seed.organisations;
    this.projects = seed.projects;
    this.users = seed.users;
    this.trees = seed.trees;
    this.photos = seed.photos;
    this.verifications = seed.verifications;
    this.timelineEvents = seed.timelineEvents;
    this.reviewQueue = seed.reviewQueue;
    this.notifications = seed.notifications;
    this.careActivities = seed.careActivities || [];

    // Calculate initial TreeScores & history for all trees
    this.recalculateAllScores();

    console.log(
      `[DataStore] Initialized with ${this.trees.length} trees across ${this.projects.length} projects. Computed ${this.treeScores.size} TreeScores.`
    );
  }

  public recalculateAllScores() {
    this.treeScores.clear();
    this.treeScoreHistory.clear();

    for (const tree of this.trees) {
      const treeVerifs = this.verifications.filter((v) => v.treeId === tree.id);
      const treeCare = this.careActivities.filter((c) => c.treeId === tree.id);

      const score = treeScoreService.calculateTreeScore(tree, treeVerifs, treeCare);
      this.treeScores.set(tree.id, score);

      // Build realistic chronological score history (Section 19)
      const history: TreeScoreHistoryItem[] = [];
      const plantedDate = tree.plantedDate || '2024-06-10';

      // 1. Initial planting score
      const plantingBaseline = score.components.planting_score + score.components.location_score;
      history.push({
        id: `HIST-${tree.id}-0`,
        treeId: tree.id,
        date: plantedDate,
        score: Math.min(22, plantingBaseline),
        change: 0,
        reason: 'Tree planted & baseline geotagged',
        components: {
          planting_score: score.components.planting_score,
          location_score: score.components.location_score,
          monitoring_score: 0,
          survival_score: 0,
          health_score: 0,
          maintenance_score: 0,
        },
      });

      // If tree has verification checks, add checkpoints
      if (tree.checkInCount >= 1 && score.totalScore > plantingBaseline) {
        const stepCount = Math.min(4, Math.max(1, Math.floor(tree.checkInCount / 2)));
        const scoreDiff = score.totalScore - plantingBaseline;
        const stepInc = scoreDiff / (stepCount + 1);

        for (let s = 1; s <= stepCount; s++) {
          const pastDate = new Date(
            new Date(plantedDate).getTime() + s * 60 * 24 * 3600 * 1000
          ).toISOString().split('T')[0];
          const pastScore = Math.round((plantingBaseline + stepInc * s) * 10) / 10;
          const reasons = [
            'Month 1 verification completed',
            'Survival & healthy canopy confirmed',
            'Continued survival & care documented',
            'High monitoring compliance verified',
          ];

          history.push({
            id: `HIST-${tree.id}-${s}`,
            treeId: tree.id,
            date: pastDate,
            score: pastScore,
            change: Math.round(stepInc * 10) / 10,
            reason: reasons[(s - 1) % reasons.length],
            components: {
              ...score.components,
              survival_score: Math.round((score.components.survival_score * (s / (stepCount + 1))) * 10) / 10,
              monitoring_score: Math.round((score.components.monitoring_score * (s / (stepCount + 1))) * 10) / 10,
            },
          });
        }

        // Final current score
        history.push({
          id: `HIST-${tree.id}-CURRENT`,
          treeId: tree.id,
          date: tree.lastVerifiedDate || new Date().toISOString().split('T')[0],
          score: score.totalScore,
          change: Math.round((score.totalScore - history[history.length - 1].score) * 10) / 10,
          reason: score.isDead
            ? 'Verified dead — future survival halted, lifetime score locked'
            : 'Latest monthly audit & survival progress',
          components: score.components,
        });
      }

      this.treeScoreHistory.set(tree.id, history);
    }
  }

  // Trees queries
  public getTrees(filters?: {
    projectId?: string;
    organisationId?: string;
    species?: string;
    status?: string;
    health?: string;
    caretakerId?: string;
    search?: string;
  }): Tree[] {
    let result = [...this.trees];

    if (!filters) return result;

    if (filters.projectId) {
      result = result.filter((t) => t.projectId === filters.projectId);
    }
    if (filters.organisationId) {
      result = result.filter((t) => t.organisationId === filters.organisationId);
    }
    if (filters.species) {
      result = result.filter((t) => t.species.toLowerCase() === filters.species?.toLowerCase());
    }
    if (filters.status) {
      result = result.filter((t) => t.status === filters.status);
    }
    if (filters.health) {
      result = result.filter((t) => t.currentHealth === filters.health);
    }
    if (filters.caretakerId) {
      result = result.filter((t) => t.caretakerId === filters.caretakerId);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.treeCode.toLowerCase().includes(q) ||
          t.species.toLowerCase().includes(q) ||
          t.commonName.toLowerCase().includes(q) ||
          t.planterName.toLowerCase().includes(q) ||
          t.projectName.toLowerCase().includes(q)
      );
    }

    return result;
  }

  public getTreeById(id: string): Tree | undefined {
    return this.trees.find((t) => t.id === id || t.treeCode === id);
  }

  public getTreeTimeline(treeId: string): TimelineEvent[] {
    return this.timelineEvents
      .filter((e) => e.treeId === treeId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  public getTreeVerifications(treeId: string): Verification[] {
    return this.verifications
      .filter((v) => v.treeId === treeId)
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }

  public getTreePhotos(treeId: string): TreePhoto[] {
    return this.photos
      .filter((p) => p.treeId === treeId)
      .sort((a, b) => new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime());
  }

  // TreeScore methods
  public getTreeScore(treeId: string): TreeScoreRecord | undefined {
    return this.treeScores.get(treeId);
  }

  public getTreeScoreHistory(treeId: string): TreeScoreHistoryItem[] {
    return this.treeScoreHistory.get(treeId) || [];
  }

  public getCareActivities(treeId: string): CareActivity[] {
    return this.careActivities
      .filter((c) => c.treeId === treeId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public addCareActivity(activity: CareActivity): void {
    this.careActivities.unshift(activity);

    // Recompute score for this tree
    const tree = this.getTreeById(activity.treeId);
    if (tree) {
      const treeVerifs = this.getTreeVerifications(tree.id);
      const treeCare = this.getCareActivities(tree.id);
      const oldScore = this.treeScores.get(tree.id);
      const newScore = treeScoreService.calculateTreeScore(tree, treeVerifs, treeCare, oldScore);
      this.treeScores.set(tree.id, newScore);

      // Add to timeline
      this.timelineEvents.unshift({
        id: `TL-CARE-${Date.now()}`,
        treeId: tree.id,
        timestamp: new Date().toISOString(),
        eventType: 'Health Assessment',
        title: `🤝 Care Activity Recorded: ${activity.activityType}`,
        description: `Logged by ${activity.recordedByUserName}. Notes: ${activity.notes || 'Routine maintenance'}. TreeScore adjusted to ${newScore.totalScore}.`,
        actorName: activity.recordedByUserName,
        badge: 'Care Recorded',
      });
    }
  }

  // GuardianScore method
  public getGuardianScore(guardianId: string): GuardianScore {
    const guardian = this.users.find((u) => u.id === guardianId);
    const guardianName = guardian ? guardian.name : 'Unknown Guardian';
    const assignedTrees = this.trees.filter(
      (t) => t.caretakerId === guardianId || t.planterId === guardianId
    );

    return treeScoreService.calculateGuardianScore(
      guardianId,
      guardianName,
      assignedTrees,
      this.verifications,
      this.careActivities
    );
  }

  // ProjectScore method
  public getProjectScore(projectId: string): ProjectScore | undefined {
    const proj = this.projects.find((p) => p.id === projectId);
    if (!proj) return undefined;
    const projectTrees = this.trees.filter((t) => t.projectId === projectId);
    return treeScoreService.calculateProjectScore(proj, projectTrees, this.treeScores, this.verifications);
  }

  // OrganisationScore method
  public getOrganisationScore(orgId: string): OrganisationScore | undefined {
    const org = this.organisations.find((o) => o.id === orgId || o.publicSlug === orgId);
    if (!org) return undefined;

    const orgTrees = this.trees.filter((t) => t.organisationId === org.id);
    const planted = orgTrees.length;

    if (planted < 5) {
      return {
        organisationId: org.id,
        organisationName: org.name,
        organisationType: org.type,
        plantedTrees: planted,
        verifiedAlive: orgTrees.filter((t) => !['Dead', 'Missing'].includes(t.status)).length,
        survivalRate: 0,
        averageTreeScore: 0,
        monitoringCompliance: 0,
        healthRate: 0,
        maintenanceRate: 0,
        evidenceQualityScore: 0,
        totalOrganisationScore: 0,
        establishedCount: 0,
        treeYears: 0,
        hasInsufficientData: true,
      };
    }

    const alive = orgTrees.filter((t) => !['Dead', 'Missing', 'Removed'].includes(t.status)).length;
    const survivalRate = Math.round((alive / planted) * 1000) / 10;

    let sumTreeScore = 0;
    let sumMonitoring = 0;
    let sumHealth = 0;
    let sumMaint = 0;
    let establishedCount = 0;
    let sumTreeYears = 0;

    orgTrees.forEach((t) => {
      const scr = this.treeScores.get(t.id);
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
    const monitoringCompliance = Math.round((sumMonitoring / planted) * 10) / 10;
    const healthRate = Math.round((sumHealth / planted) * 10) / 10;
    const maintenanceRate = Math.round((sumMaint / planted) * 10) / 10;
    const evidenceQualityScore = 91.5;

    // 35% survival + 25% avg TreeScore + 15% monitoring + 10% health + 10% maintenance + 5% evidence quality
    const totalOrgScore =
      survivalRate * 0.35 +
      averageTreeScore * 0.25 +
      monitoringCompliance * 0.15 +
      healthRate * 0.1 +
      maintenanceRate * 0.1 +
      evidenceQualityScore * 0.05;

    return {
      organisationId: org.id,
      organisationName: org.name,
      organisationType: org.type,
      plantedTrees: planted,
      verifiedAlive: alive,
      survivalRate,
      averageTreeScore,
      monitoringCompliance,
      healthRate,
      maintenanceRate,
      evidenceQualityScore,
      totalOrganisationScore: Math.round(totalOrgScore * 10) / 10,
      establishedCount,
      treeYears: Math.round(sumTreeYears * 10) / 10,
      hasInsufficientData: false,
    };
  }

  // GeoScores & Leaderboards
  public getGeoScores(
    level: 'individual' | 'school' | 'ngo' | 'city' | 'district' | 'state' | 'national' = 'individual'
  ): GeoScore[] {
    const results: GeoScore[] = [];

    // Calculate national average first
    let totalScoreAll = 0;
    this.treeScores.forEach((scr) => (totalScoreAll += scr.totalScore));
    const nationalAverage = this.treeScores.size > 0
      ? Math.round((totalScoreAll / this.treeScores.size) * 10) / 10
      : 75.0;

    if (level === 'individual') {
      // Individual Tree Guardians / Caretakers Leaderboard (Prime Driver)
      const userList = this.users.filter(
        (u) =>
          u.role === 'planter' ||
          u.role === 'school_student' ||
          u.role === 'community_lead' ||
          u.id === 'USR-STUDENT-02' ||
          u.id === 'USR-PLANTER-01' ||
          u.id === 'USR-INDIVIDUAL-08'
      );

      userList.forEach((u) => {
        const gScore = this.getGuardianScore(u.id);
        if (gScore.treesCount > 0) {
          const uTrees = this.trees.filter(
            (t) => t.caretakerId === u.id || t.planterId === u.id
          );
          let establishedCount = 0;
          let sumTreeYears = 0;
          uTrees.forEach((t) => {
            const scr = this.treeScores.get(t.id);
            if (scr) {
              if (scr.isEstablished) establishedCount++;
              sumTreeYears += scr.treeYears;
            }
          });

          results.push({
            id: `GEO-IND-${u.id}`,
            geoLevel: 'individual',
            geoId: u.id,
            geoName: u.name,
            state: u.studentClass ? `${u.studentClass} • ${u.organisationName}` : u.organisationName || 'Private Guardian',
            badge: gScore.badge,
            integrityScore: gScore.integrityScore,
            eligibleTreeCount: gScore.treesCount,
            minEligibleRequired: 1,
            isEligibleForRanking: true,
            rawScore: gScore.totalGuardianScore,
            adjustedScore: gScore.totalGuardianScore,
            verifiedSurvivalRate: gScore.survivalScore,
            averageTreeScore: Math.round(gScore.careScore * 10),
            monitoringCompliance: gScore.monitoringScore,
            healthRate: 92.0,
            evidenceQualityRate: gScore.verificationQualityScore,
            establishedCount,
            treeYears: Math.round(sumTreeYears * 10) / 10,
            rank: 1,
          });
        }
      });
    } else if (level === 'ngo') {
      // NGOs & Community Organisations Leaderboard
      const ngoOrgs = this.organisations.filter((o) => o.type === 'NGO' || o.type === 'CSR' || o.type === 'Community');
      ngoOrgs.forEach((org) => {
        const orgScore = this.getOrganisationScore(org.id);
        if (orgScore && orgScore.plantedTrees > 0) {
          results.push({
            id: `GEO-ORG-${org.id}`,
            geoLevel: 'ngo',
            geoId: org.id,
            geoName: org.name,
            state: `${org.type} • ${org.location}`,
            badge: org.type === 'NGO' ? '🤝 Non-Profit' : org.type === 'CSR' ? '🏢 Corporate ESG' : '🏡 Community',
            eligibleTreeCount: orgScore.plantedTrees,
            minEligibleRequired: 5,
            isEligibleForRanking: true,
            rawScore: orgScore.totalOrganisationScore,
            adjustedScore: orgScore.totalOrganisationScore,
            verifiedSurvivalRate: orgScore.survivalRate,
            averageTreeScore: orgScore.averageTreeScore,
            monitoringCompliance: orgScore.monitoringCompliance,
            healthRate: orgScore.healthRate,
            evidenceQualityRate: orgScore.evidenceQualityScore,
            establishedCount: orgScore.establishedCount,
            treeYears: orgScore.treeYears,
            rank: 1,
          });
        }
      });
    } else if (level === 'city' || level === 'district') {
      const cityGroups: Record<string, { state: string; trees: Tree[] }> = {};

      this.projects.forEach((p) => {
        const dist = p.geography.district;
        if (!cityGroups[dist]) {
          cityGroups[dist] = { state: p.geography.state, trees: [] };
        }
        const pTrees = this.trees.filter((t) => t.projectId === p.id);
        cityGroups[dist].trees.push(...pTrees);
      });

      Object.entries(cityGroups).forEach(([cityName, grp]) => {
        const geoScore = treeScoreService.calculateGeoScore(
          level === 'district' ? 'district' : 'city',
          cityName.toLowerCase().replace(/\s+/g, '-'),
          cityName,
          grp.state,
          grp.trees,
          this.treeScores,
          nationalAverage
        );
        results.push(geoScore);
      });
    } else if (level === 'state') {
      const stateGroups: Record<string, Tree[]> = {};

      this.projects.forEach((p) => {
        const st = p.geography.state;
        if (!stateGroups[st]) {
          stateGroups[st] = [];
        }
        const pTrees = this.trees.filter((t) => t.projectId === p.id);
        stateGroups[st].push(...pTrees);
      });

      Object.entries(stateGroups).forEach(([stateName, sTrees]) => {
        const geoScore = treeScoreService.calculateGeoScore(
          'state',
          stateName.toLowerCase().replace(/\s+/g, '-'),
          stateName,
          stateName,
          sTrees,
          this.treeScores,
          nationalAverage
        );
        results.push(geoScore);
      });
    } else if (level === 'school') {
      const schoolOrgs = this.organisations.filter((o) => o.type === 'School');
      schoolOrgs.forEach((sch) => {
        const schTrees = this.trees.filter((t) => t.organisationId === sch.id);
        const geoScore = treeScoreService.calculateGeoScore(
          'school',
          sch.id,
          sch.name,
          sch.location,
          schTrees,
          this.treeScores,
          nationalAverage
        );
        results.push(geoScore);
      });
    } else if (level === 'national') {
      const nationalScore = treeScoreService.calculateGeoScore(
        'national',
        'india',
        'India (National Leaderboard)',
        'All States',
        this.trees,
        this.treeScores,
        nationalAverage
      );
      results.push(nationalScore);
    }

    // Sort by adjustedScore descending
    results.sort((a, b) => b.adjustedScore - a.adjustedScore);

    // Assign rank and flag Rising Leader for top improver
    results.forEach((item, index) => {
      item.rank = index + 1;
      item.previousRank = Math.min(results.length, index + (index % 2 === 0 ? 2 : 1));
      item.scoreChange = Math.round((item.rank < (item.previousRank || 1) ? 2.4 : -0.8) * 10) / 10;
      if (index === 0) item.isRisingLeader = true;
    });

    return results;
  }

  // Registration of new tree
  public registerTree(data: Partial<Tree>): Tree {
    const project = this.projects.find((p) => p.id === data.projectId) || this.projects[0];
    const nextIndex = this.trees.length + 1;
    const padded = nextIndex.toString().padStart(8, '0');
    const stateCode = project.geography.state === 'Karnataka' ? 'KA' : 'TN';
    const distCode = project.geography.district.substring(0, 3).toUpperCase();
    const treeCode = data.treeCode || `TREE-${stateCode}-${distCode}-${padded}`;

    const newTree: Tree = {
      id: `TREE-${Date.now()}`,
      treeCode,
      projectId: project.id,
      projectName: project.name,
      organisationId: project.organisationId,
      organisationName: project.organisationName,
      species: data.species || 'Neem',
      commonName: data.commonName || 'Vembu / Margosa',
      scientificName: data.scientificName || 'Azadirachta indica',
      plantedDate: data.plantedDate || new Date().toISOString().split('T')[0],
      latitude: data.latitude || project.geography.centerLat,
      longitude: data.longitude || project.geography.centerLng,
      gpsAccuracyMeters: data.gpsAccuracyMeters || 6,
      planterId: data.planterId || 'USR-PLANTER-01',
      planterName: data.planterName || 'Ravi Kumar',
      caretakerId: data.caretakerId || data.planterId || 'USR-PLANTER-01',
      caretakerName: data.caretakerName || data.planterName || 'Ravi Kumar',
      landCategory: data.landCategory || 'Roadside',
      status: 'Planted',
      currentHealth: 'Healthy',
      evidenceQuality: data.evidenceQuality || 'High',
      baselinePhotoUrl:
        data.baselinePhotoUrl ||
        'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
      latestPhotoUrl:
        data.baselinePhotoUrl ||
        'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${treeCode}`,
      notes: data.notes || 'Registered in TreeView field app.',
      ageMonths: 0,
      checkInCount: 0,
      studentClass: data.studentClass,
      studentName: data.studentName,
      createdAt: new Date().toISOString(),
    };

    this.trees.unshift(newTree);

    // Save baseline photo
    const photo: TreePhoto = {
      id: `PHT-${newTree.id}-BASE`,
      treeId: newTree.id,
      photoUrl: newTree.baselinePhotoUrl,
      capturedAt: newTree.createdAt,
      latitude: newTree.latitude,
      longitude: newTree.longitude,
      gpsAccuracyMeters: newTree.gpsAccuracyMeters,
      captureMethod: 'In-App Camera',
      photoType: 'Baseline',
    };
    this.photos.unshift(photo);

    // Add initial care activity
    this.careActivities.push({
      id: `CARE-${newTree.id}-01`,
      treeId: newTree.id,
      activityType: 'Care Plan Assigned',
      date: newTree.plantedDate,
      recordedByUserId: newTree.planterId,
      recordedByUserName: newTree.planterName,
      notes: 'Initial planting baseline care plan registered.',
    });

    // Compute initial TreeScore
    const newScore = treeScoreService.calculateTreeScore(newTree, [], this.getCareActivities(newTree.id));
    this.treeScores.set(newTree.id, newScore);

    this.treeScoreHistory.set(newTree.id, [
      {
        id: `HIST-${newTree.id}-0`,
        treeId: newTree.id,
        date: newTree.plantedDate,
        score: newScore.totalScore,
        change: 0,
        reason: 'Tree planted & baseline geotagged',
        components: newScore.components,
      },
    ]);

    // Add Timeline event
    this.timelineEvents.unshift({
      id: `TL-${newTree.id}-01`,
      treeId: newTree.id,
      timestamp: newTree.createdAt,
      eventType: 'Planted',
      title: `🌱 Tree Planted (${treeCode}) — TreeScore: ${newScore.totalScore}`,
      description: `Registered with GPS coordinates (±${newTree.gpsAccuracyMeters}m). Baseline photo verified. TreeScore initialized at ${newScore.totalScore}/100.`,
      photoUrl: newTree.baselinePhotoUrl,
      badge: 'Planted',
      actorName: newTree.planterName,
    });

    return newTree;
  }

  // Monthly Verification
  public recordVerification(
    verification: Verification,
    newPhoto: TreePhoto,
    newStatus: TreeStatus,
    newHealth: HealthCondition
  ) {
    this.verifications.unshift(verification);
    this.photos.unshift(newPhoto);

    // Update tree
    const tree = this.trees.find((t) => t.id === verification.treeId);
    if (tree) {
      tree.status = newStatus;
      tree.currentHealth = newHealth;
      tree.latestPhotoUrl = newPhoto.photoUrl;
      tree.lastVerifiedDate = verification.submittedAt.split('T')[0];
      tree.evidenceQuality = verification.evidenceQuality;
      tree.checkInCount += 1;
      tree.ageMonths = Math.max(
        tree.ageMonths,
        Math.floor((Date.now() - new Date(tree.plantedDate).getTime()) / (30.4375 * 24 * 3600 * 1000))
      );

      // Recompute TreeScore with new verification
      const oldScore = this.treeScores.get(tree.id);
      const treeVerifs = this.getTreeVerifications(tree.id);
      const treeCare = this.getCareActivities(tree.id);
      const newScore = treeScoreService.calculateTreeScore(tree, treeVerifs, treeCare, oldScore);
      this.treeScores.set(tree.id, newScore);

      // Add to score history
      const history = this.treeScoreHistory.get(tree.id) || [];
      const scoreChange = oldScore ? Math.round((newScore.totalScore - oldScore.totalScore) * 10) / 10 : 0;
      history.push({
        id: `HIST-${tree.id}-${Date.now()}`,
        treeId: tree.id,
        date: verification.submittedAt.split('T')[0],
        score: newScore.totalScore,
        change: scoreChange,
        reason: newScore.scoreChangeReason || 'Monthly verification completed',
        components: newScore.components,
      });
      this.treeScoreHistory.set(tree.id, history);

      // Add to timeline
      this.timelineEvents.unshift({
        id: `TL-${tree.id}-${Date.now()}`,
        treeId: tree.id,
        timestamp: verification.submittedAt,
        eventType: 'AI Verification',
        title: `📷 Monthly Verification — ${newStatus} (Score: ${newScore.totalScore})`,
        description: `GPS: ${verification.gpsStatus} (${verification.gpsDistanceMeters}m). Health: ${newHealth}. TreeView Index: ${newScore.totalScore}/100 (${newScore.category}). ${newScore.isEstablished ? '🏆 TreeView Established™ Achieved!' : ''}`,
        photoUrl: newPhoto.photoUrl,
        badge: newStatus,
        actorName: verification.submittedByUserName,
      });

      // If review needed, enqueue
      if (verification.verificationStatus === 'Pending Review') {
        this.reviewQueue.unshift({
          id: `REV-${tree.id}-${Date.now()}`,
          treeId: tree.id,
          treeCode: tree.treeCode,
          verificationId: verification.id,
          species: tree.species,
          projectName: tree.projectName,
          organisationName: tree.organisationName,
          submittedAt: verification.submittedAt,
          submittedByName: verification.submittedByUserName,
          flags: verification.flags,
          baselinePhotoUrl: tree.baselinePhotoUrl,
          currentPhotoUrl: newPhoto.photoUrl,
          registeredCoords: { lat: tree.latitude, lng: tree.longitude },
          currentCoords: { lat: verification.currentLat, lng: verification.currentLng },
          distanceMeters: verification.gpsDistanceMeters,
          gpsToleranceMeters: verification.gpsToleranceMeters,
          aiSameTreeConfidence: verification.sameTreeConfidenceScore,
          aiHealthAssessment: newHealth,
          aiSpeciesDetected: verification.speciesDetected,
          status: 'Pending',
        });
      }
    }
  }

  // Review Queue actions
  public handleReviewAction(params: {
    queueItemId: string;
    action: 'Approved' | 'Rejected' | 'Photo-Requested';
    correctedStatus?: TreeStatus;
    correctedHealth?: HealthCondition;
    correctedSpecies?: string;
    reviewerRemarks: string;
    reviewerId: string;
    reviewerName: string;
  }): ReviewQueueItem | undefined {
    const item = this.reviewQueue.find((q) => q.id === params.queueItemId);
    if (!item) return undefined;

    item.status = params.action;
    item.reviewerRemarks = params.reviewerRemarks;
    item.reviewedAt = new Date().toISOString();
    item.reviewedBy = params.reviewerName;

    const tree = this.trees.find((t) => t.id === item.treeId);
    if (tree) {
      if (params.correctedStatus) {
        tree.status = params.correctedStatus;
      } else if (params.action === 'Approved') {
        tree.status = 'Verified Alive';
      } else if (params.action === 'Rejected') {
        tree.status = 'Verification Exception';
      }

      if (params.correctedHealth) {
        tree.currentHealth = params.correctedHealth;
      }
      if (params.correctedSpecies) {
        tree.species = params.correctedSpecies;
      }

      // Recompute TreeScore
      const oldScore = this.treeScores.get(tree.id);
      const treeVerifs = this.getTreeVerifications(tree.id);
      const treeCare = this.getCareActivities(tree.id);
      const newScore = treeScoreService.calculateTreeScore(tree, treeVerifs, treeCare, oldScore);
      this.treeScores.set(tree.id, newScore);

      this.timelineEvents.unshift({
        id: `TL-REV-${Date.now()}`,
        treeId: tree.id,
        timestamp: item.reviewedAt,
        eventType: 'Reviewer Action',
        title: `Arborist Audit: ${params.action} — TreeScore: ${newScore.totalScore}`,
        description: `Decision by ${params.reviewerName}. Remarks: "${params.reviewerRemarks}". Status: ${tree.status}. TreeScore updated to ${newScore.totalScore}.`,
        badge: params.action,
        actorName: params.reviewerName,
      });
    }

    return item;
  }
}

export const store = new DataStore();
