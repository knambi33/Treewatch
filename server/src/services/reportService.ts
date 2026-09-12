import { Project, SurvivalMetrics, Tree, Verification } from '../types.js';

export function calculateSurvivalMetrics(trees: Tree[]): SurvivalMetrics {
  const totalPlanted = trees.length;
  let verifiedAlive = 0;
  let healthy = 0;
  let moderateStress = 0;
  let poorHealth = 0;
  let dead = 0;
  let missing = 0;
  let removed = 0;
  let verificationPending = 0;
  let verificationException = 0;
  let needsAttention = 0;

  for (const tree of trees) {
    switch (tree.status) {
      case 'Verified Alive':
        verifiedAlive++;
        if (tree.currentHealth === 'Healthy') healthy++;
        else if (tree.currentHealth === 'Moderate Stress') moderateStress++;
        else if (tree.currentHealth === 'Poor Health') poorHealth++;
        break;
      case 'Healthy':
        verifiedAlive++;
        healthy++;
        break;
      case 'Needs Attention':
      case 'Stressed':
        verifiedAlive++;
        moderateStress++;
        needsAttention++;
        break;
      case 'Poor Health':
        verifiedAlive++;
        poorHealth++;
        needsAttention++;
        break;
      case 'Dead':
        dead++;
        break;
      case 'Missing':
        missing++;
        break;
      case 'Removed':
        removed++;
        break;
      case 'Verification Pending':
      case 'Planted':
        verificationPending++;
        break;
      case 'Verification Exception':
        verificationException++;
        break;
    }
  }

  // Methodology A: Verified Alive / Trees Due for Verification
  // Trees due for verification = Verified Alive + Dead + Missing + Needs Attention + Exceptions
  const treesDueForVerification = totalPlanted - verificationPending;
  const survivalRateMethodA_Percent =
    treesDueForVerification > 0
      ? Math.round((verifiedAlive / treesDueForVerification) * 1000) / 10
      : 0;

  // Methodology B: Verified Alive / Total Planted
  const survivalRateMethodB_Percent =
    totalPlanted > 0
      ? Math.round((verifiedAlive / totalPlanted) * 1000) / 10
      : 0;

  const verificationCompliancePercent =
    totalPlanted > 0
      ? Math.round(((totalPlanted - verificationPending) / totalPlanted) * 1000) / 10
      : 0;

  return {
    totalPlanted,
    verifiedAlive,
    healthy,
    moderateStress,
    poorHealth,
    dead,
    missing,
    removed,
    verificationPending,
    verificationException,
    needsAttention,
    treesDueForVerification,
    survivalRateMethodA_Percent,
    survivalRateMethodB_Percent,
    verificationCompliancePercent,
  };
}

export function generateProjectCsv(project: Project, trees: Tree[]): string {
  const headers = [
    'Tree Code',
    'Species',
    'Common Name',
    'Planting Date',
    'Latitude',
    'Longitude',
    'GPS Accuracy (m)',
    'Status',
    'Health Condition',
    'Evidence Quality',
    'Planter Name',
    'Caretaker Name',
    'Last Verified Date',
    'Land Category',
  ];

  const rows = trees.map((t) => [
    `"${t.treeCode}"`,
    `"${t.species}"`,
    `"${t.commonName}"`,
    `"${t.plantedDate}"`,
    t.latitude,
    t.longitude,
    `"±${t.gpsAccuracyMeters}m"`,
    `"${t.status}"`,
    `"${t.currentHealth}"`,
    `"${t.evidenceQuality}"`,
    `"${t.planterName}"`,
    `"${t.caretakerName}"`,
    `"${t.lastVerifiedDate || 'Pending'}"`,
    `"${t.landCategory}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

export function generateTreeAuditReport(tree: Tree, verifications: Verification[]) {
  return {
    treeCode: tree.treeCode,
    species: tree.species,
    scientificName: tree.scientificName,
    plantedDate: tree.plantedDate,
    registeredCoordinates: {
      latitude: tree.latitude,
      longitude: tree.longitude,
      accuracy: `±${tree.gpsAccuracyMeters}m`,
    },
    planter: tree.planterName,
    caretaker: tree.caretakerName,
    project: tree.projectName,
    organisation: tree.organisationName,
    currentStatus: tree.status,
    currentHealth: tree.currentHealth,
    evidenceQuality: tree.evidenceQuality,
    baselinePhotoUrl: tree.baselinePhotoUrl,
    latestPhotoUrl: tree.latestPhotoUrl,
    auditTrail: verifications.map((v) => ({
      month: v.verificationMonth,
      date: v.submittedAt,
      gpsStatus: v.gpsStatus,
      distanceFromRegistered: `${v.gpsDistanceMeters}m`,
      sameTreeConfidence: `${v.sameTreeConfidenceScore}% (${v.sameTreeClassification})`,
      healthAssessment: v.healthAssessment,
      evidenceQuality: v.evidenceQuality,
      flags: v.flags,
      photoUrl: v.photoUrl,
      verifiedBy: v.reviewerName || 'AI Verification Pipeline',
    })),
  };
}
