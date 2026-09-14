import { treeScoreService } from '../services/treeScoreService.js';
import { adminConfig } from '../services/adminConfigService.js';
import { store } from '../db/store.js';
import { Tree, Verification, CareActivity } from '../types.js';

console.log('🌲 ========================================');
console.log('   TreeView Index™ Test Suite (Section 66)');
console.log('========================================\n');

let passedTests = 0;
let failedTests = 0;

function assert(description: string, condition: boolean, extraInfo?: string) {
  if (condition) {
    console.log(`✅ [PASS] ${description}`);
    passedTests++;
  } else {
    console.error(`❌ [FAIL] ${description} ${extraInfo ? `-> ${extraInfo}` : ''}`);
    failedTests++;
  }
}

// TEST 1: Newly planted tree
// Expected: Low TreeScore (no survival points, ~10-22)
{
  const newTree: Tree = {
    id: 'TEST-TREE-NEW',
    treeCode: 'TREE-TEST-001',
    projectId: 'PRJ-CHN-01',
    projectName: 'Chennai Coastal Green Belt',
    organisationId: 'ORG-CSR-01',
    organisationName: 'Green Earth CSR Foundation',
    species: 'Neem',
    commonName: 'Vembu',
    scientificName: 'Azadirachta indica',
    plantedDate: new Date().toISOString().split('T')[0],
    latitude: 13.0827,
    longitude: 80.2707,
    gpsAccuracyMeters: 6,
    planterId: 'USR-01',
    planterName: 'Ravi',
    caretakerId: 'USR-01',
    caretakerName: 'Ravi',
    landCategory: 'Park',
    status: 'Planted',
    currentHealth: 'Healthy',
    evidenceQuality: 'High',
    baselinePhotoUrl: 'https://example.com/base.jpg',
    latestPhotoUrl: 'https://example.com/base.jpg',
    ageMonths: 0,
    checkInCount: 0,
    createdAt: new Date().toISOString(),
  };

  const score = treeScoreService.calculateTreeScore(newTree, [], []);
  assert(
    'Test 1: Newly planted tree receives low score and 0 survival points',
    score.totalScore <= 22 &&
      score.components.survival_score === 0 &&
      (score.category === '🌱 Newly Planted' || score.category === '🌿 Establishing'),
    `Score was ${score.totalScore}, survival was ${score.components.survival_score}, category was ${score.category}`
  );
}

// TEST 2: Tree survives 12 months with excellent monitoring
// Expected: Significantly higher score (>= 60)
{
  const tree12m: Tree = {
    id: 'TEST-TREE-12M',
    treeCode: 'TREE-TEST-002',
    projectId: 'PRJ-CHN-01',
    projectName: 'Chennai Coastal Green Belt',
    organisationId: 'ORG-CSR-01',
    organisationName: 'Green Earth CSR Foundation',
    species: 'Pongamia',
    commonName: 'Pungai',
    scientificName: 'Millettia pinnata',
    plantedDate: '2025-09-01',
    latitude: 13.0827,
    longitude: 80.2707,
    gpsAccuracyMeters: 5,
    planterId: 'USR-01',
    planterName: 'Ravi',
    caretakerId: 'USR-01',
    caretakerName: 'Ravi',
    landCategory: 'Park',
    status: 'Verified Alive',
    currentHealth: 'Healthy',
    evidenceQuality: 'High',
    baselinePhotoUrl: 'https://example.com/base.jpg',
    latestPhotoUrl: 'https://example.com/latest.jpg',
    lastVerifiedDate: '2026-08-25',
    ageMonths: 12,
    checkInCount: 12,
    createdAt: '2025-09-01T08:00:00Z',
  };

  const verifs: Verification[] = [];
  for (let i = 1; i <= 12; i++) {
    verifs.push({
      id: `VRF-${i}`,
      treeId: tree12m.id,
      treeCode: tree12m.treeCode,
      photoId: `PHT-${i}`,
      photoUrl: 'https://example.com/photo.jpg',
      verificationMonth: `2026-${i.toString().padStart(2, '0')}`,
      submittedAt: `2026-${i.toString().padStart(2, '0')}-15T10:00:00Z`,
      submittedByUserId: 'USR-01',
      submittedByUserName: 'Ravi',
      currentLat: 13.08271,
      currentLng: 80.27071,
      gpsDistanceMeters: 3,
      gpsToleranceMeters: 25,
      gpsStatus: 'Verified',
      gpsAccuracyMeters: 5,
      sameTreeConfidenceScore: 92,
      sameTreeClassification: 'High confidence',
      sameTreePersistentFeatures: ['Trunk bifurcation matched'],
      speciesDetected: 'Pongamia',
      speciesConfidenceScore: 94,
      healthAssessment: 'Healthy',
      healthIndicators: {
        foliageDensity: 'Dense / Normal',
        canopyCondition: 'Vibrant Green',
        trunkCondition: 'Intact & Sturdy',
        growthObservation: 'Good canopy',
      },
      evidenceQuality: 'High',
      verificationStatus: 'Auto-Approved',
      flags: [],
    });
  }

  const score = treeScoreService.calculateTreeScore(tree12m, verifs, [
    { id: 'C1', treeId: tree12m.id, activityType: 'Watering', date: '2026-08-01', recordedByUserId: 'USR-01', recordedByUserName: 'Ravi' },
    { id: 'C2', treeId: tree12m.id, activityType: 'Protection', date: '2026-08-01', recordedByUserId: 'USR-01', recordedByUserName: 'Ravi' },
  ]);

  assert(
    'Test 2: Tree surviving 12 months with high monitoring has high score (>= 60)',
    score.totalScore >= 60 && score.components.survival_score >= 20,
    `Score was ${score.totalScore}, survival was ${score.components.survival_score}`
  );
}

// TEST 3: Tree survives 36 months and meets establishment criteria
// Expected: TreeView Established™
{
  const tree36m: Tree = {
    id: 'TEST-TREE-36M',
    treeCode: 'TREE-TEST-003',
    projectId: 'PRJ-CHN-01',
    projectName: 'Chennai Coastal Green Belt',
    organisationId: 'ORG-CSR-01',
    organisationName: 'Green Earth CSR Foundation',
    species: 'Banyan',
    commonName: 'Aala Maram',
    scientificName: 'Ficus benghalensis',
    plantedDate: '2023-06-10',
    latitude: 13.0827,
    longitude: 80.2707,
    gpsAccuracyMeters: 4,
    planterId: 'USR-01',
    planterName: 'Ravi',
    caretakerId: 'USR-01',
    caretakerName: 'Ravi',
    landCategory: 'Park',
    status: 'Verified Alive',
    currentHealth: 'Healthy',
    evidenceQuality: 'High',
    baselinePhotoUrl: 'https://example.com/base.jpg',
    latestPhotoUrl: 'https://example.com/latest.jpg',
    lastVerifiedDate: '2026-08-25',
    ageMonths: 38,
    checkInCount: 26,
    createdAt: '2023-06-10T08:00:00Z',
  };

  const verifs: Verification[] = [];
  for (let i = 1; i <= 26; i++) {
    verifs.push({
      id: `VRF-${i}`,
      treeId: tree36m.id,
      treeCode: tree36m.treeCode,
      photoId: `PHT-${i}`,
      photoUrl: 'https://example.com/photo.jpg',
      verificationMonth: `2024-01`,
      submittedAt: `2024-01-15T10:00:00Z`,
      submittedByUserId: 'USR-01',
      submittedByUserName: 'Ravi',
      currentLat: 13.08271,
      currentLng: 80.27071,
      gpsDistanceMeters: 2,
      gpsToleranceMeters: 25,
      gpsStatus: 'Verified',
      gpsAccuracyMeters: 4,
      sameTreeConfidenceScore: 95,
      sameTreeClassification: 'High confidence',
      sameTreePersistentFeatures: ['Aerial roots'],
      speciesDetected: 'Banyan',
      speciesConfidenceScore: 98,
      healthAssessment: 'Healthy',
      healthIndicators: {
        foliageDensity: 'Dense / Normal',
        canopyCondition: 'Vibrant Green',
        trunkCondition: 'Intact & Sturdy',
        growthObservation: 'Massive trunk expansion',
      },
      evidenceQuality: 'High',
      verificationStatus: 'Auto-Approved',
      flags: [],
    });
  }

  const score = treeScoreService.calculateTreeScore(tree36m, verifs, []);
  assert(
    'Test 3: 36-month surviving tree meets establishment criteria (TreeView Established™)',
    score.isEstablished === true && score.totalScore >= 80,
    `isEstablished: ${score.isEstablished}, score: ${score.totalScore}`
  );
}

// TEST 4: Tree dies after 14 months
// Expected: Score stops accumulating survival points, historical score remains
{
  const deadTree: Tree = {
    id: 'TEST-TREE-DEAD',
    treeCode: 'TREE-TEST-004',
    projectId: 'PRJ-CHN-01',
    projectName: 'Chennai Coastal Green Belt',
    organisationId: 'ORG-CSR-01',
    organisationName: 'Green Earth CSR Foundation',
    species: 'Neem',
    commonName: 'Vembu',
    scientificName: 'Azadirachta indica',
    plantedDate: '2025-04-01',
    latitude: 13.0827,
    longitude: 80.2707,
    gpsAccuracyMeters: 5,
    planterId: 'USR-01',
    planterName: 'Ravi',
    caretakerId: 'USR-01',
    caretakerName: 'Ravi',
    landCategory: 'Roadside',
    status: 'Dead',
    currentHealth: 'Dead / Missing',
    evidenceQuality: 'High',
    baselinePhotoUrl: 'https://example.com/base.jpg',
    latestPhotoUrl: 'https://example.com/dead.jpg',
    lastVerifiedDate: '2026-06-01',
    ageMonths: 16,
    checkInCount: 14,
    createdAt: '2025-04-01T08:00:00Z',
  };

  const verifs: Verification[] = [
    {
      id: 'VRF-ALIVE',
      treeId: deadTree.id,
      treeCode: deadTree.treeCode,
      photoId: 'P1',
      photoUrl: 'https://example.com/alive.jpg',
      verificationMonth: '2026-06',
      submittedAt: '2026-06-01T10:00:00Z', // 14 months alive
      submittedByUserId: 'USR-01',
      submittedByUserName: 'Ravi',
      currentLat: 13.0827,
      currentLng: 80.2707,
      gpsDistanceMeters: 2,
      gpsToleranceMeters: 25,
      gpsStatus: 'Verified',
      gpsAccuracyMeters: 5,
      sameTreeConfidenceScore: 90,
      sameTreeClassification: 'High confidence',
      sameTreePersistentFeatures: ['Trunk'],
      speciesDetected: 'Neem',
      speciesConfidenceScore: 90,
      healthAssessment: 'Healthy',
      healthIndicators: {
        foliageDensity: 'Dense / Normal',
        canopyCondition: 'Vibrant Green',
        trunkCondition: 'Intact & Sturdy',
        growthObservation: 'Alive',
      },
      evidenceQuality: 'High',
      verificationStatus: 'Auto-Approved',
      flags: [],
    },
  ];

  const score = treeScoreService.calculateTreeScore(deadTree, verifs, []);
  assert(
    'Test 4: Tree dies after 14 months — stops accumulating, lifetime score preserved',
    score.isDead === true && score.lifetimeScore !== undefined && score.lifetimeScore > 0 && score.components.health_score === 0,
    `isDead: ${score.isDead}, lifetimeScore: ${score.lifetimeScore}, healthScore: ${score.components.health_score}`
  );
}

// TEST 5: Verification missed
// Expected: Verification Pending, NOT Dead
{
  const pendingTree: Tree = {
    id: 'TEST-TREE-PENDING',
    treeCode: 'TREE-TEST-005',
    projectId: 'PRJ-CHN-01',
    projectName: 'Chennai Coastal Green Belt',
    organisationId: 'ORG-CSR-01',
    organisationName: 'Green Earth CSR Foundation',
    species: 'Neem',
    commonName: 'Vembu',
    scientificName: 'Azadirachta indica',
    plantedDate: '2026-01-01',
    latitude: 13.0827,
    longitude: 80.2707,
    gpsAccuracyMeters: 5,
    planterId: 'USR-01',
    planterName: 'Ravi',
    caretakerId: 'USR-01',
    caretakerName: 'Ravi',
    landCategory: 'Roadside',
    status: 'Verification Pending',
    currentHealth: 'Healthy',
    evidenceQuality: 'High',
    baselinePhotoUrl: 'https://example.com/base.jpg',
    latestPhotoUrl: 'https://example.com/base.jpg',
    lastVerifiedDate: '2026-06-01',
    ageMonths: 8,
    checkInCount: 5,
    createdAt: '2026-01-01T08:00:00Z',
  };

  const score = treeScoreService.calculateTreeScore(pendingTree, [], []);
  assert(
    'Test 5: Missed verification is marked Verification Pending, not dead',
    pendingTree.status === 'Verification Pending' && score.isDead === false,
    `Status: ${pendingTree.status}, isDead: ${score.isDead}`
  );
}

// TEST 6: GPS mismatch
// Expected: Verification Exception, points not awarded
{
  const exceptionTree: Tree = {
    id: 'TEST-TREE-EXCEPTION',
    treeCode: 'TREE-TEST-006',
    projectId: 'PRJ-CHN-01',
    projectName: 'Chennai Coastal Green Belt',
    organisationId: 'ORG-CSR-01',
    organisationName: 'Green Earth CSR Foundation',
    species: 'Teak',
    commonName: 'Thekku',
    scientificName: 'Tectona grandis',
    plantedDate: '2026-01-01',
    latitude: 13.0827,
    longitude: 80.2707,
    gpsAccuracyMeters: 5,
    planterId: 'USR-01',
    planterName: 'Ravi',
    caretakerId: 'USR-01',
    caretakerName: 'Ravi',
    landCategory: 'Forest',
    status: 'Verification Exception',
    currentHealth: 'Healthy',
    evidenceQuality: 'Low',
    baselinePhotoUrl: 'https://example.com/base.jpg',
    latestPhotoUrl: 'https://example.com/base.jpg',
    ageMonths: 6,
    checkInCount: 3,
    createdAt: '2026-01-01T08:00:00Z',
  };

  // Check with GPS mismatch
  const mismatchVerifs: Verification[] = [
    {
      id: 'VRF-MISMATCH',
      treeId: exceptionTree.id,
      treeCode: exceptionTree.treeCode,
      photoId: 'P1',
      photoUrl: 'https://example.com/photo.jpg',
      verificationMonth: '2026-06',
      submittedAt: '2026-06-15T10:00:00Z',
      submittedByUserId: 'USR-01',
      submittedByUserName: 'Ravi',
      currentLat: 13.095, // 1.3km away!
      currentLng: 80.285,
      gpsDistanceMeters: 1400,
      gpsToleranceMeters: 25,
      gpsStatus: 'Mismatch',
      gpsAccuracyMeters: 15,
      sameTreeConfidenceScore: 30,
      sameTreeClassification: 'Low confidence',
      sameTreePersistentFeatures: [],
      speciesDetected: 'Teak',
      speciesConfidenceScore: 80,
      healthAssessment: 'Healthy',
      healthIndicators: {
        foliageDensity: 'Dense / Normal',
        canopyCondition: 'Vibrant Green',
        trunkCondition: 'Intact & Sturdy',
        growthObservation: 'Far away',
      },
      evidenceQuality: 'Low',
      verificationStatus: 'Pending Review',
      flags: ['GPS Mismatch (1400m > 25m)'],
    },
  ];

  const compliance = treeScoreService.calculateMonitoringCompliance(exceptionTree, mismatchVerifs);
  assert(
    'Test 6: GPS mismatch verification does not count towards valid monitoring compliance',
    compliance.validCount === 0 && compliance.score === 0,
    `validCount: ${compliance.validCount}, score: ${compliance.score}`
  );
}

// TEST 7: Duplicate photo
// Expected: Reused photo is detected and review required
{
  const isDuplicateFlagged = store.reviewQueue.some((q) =>
    q.flags.some((f) => f.toLowerCase().includes('reused') || f.toLowerCase().includes('duplicate'))
  );
  assert(
    'Test 7: Duplicate photo detected and flagged for review queue',
    isDuplicateFlagged === true,
    `Review queue has duplicate flag: ${isDuplicateFlagged}`
  );
}

// TEST 8: Low AI confidence
// Expected: Human review
{
  const lowConfItems = store.reviewQueue.filter((q) => q.aiSameTreeConfidence < 70);
  assert(
    'Test 8: Low AI confidence item routed to Human Verification Review Queue',
    lowConfItems.length > 0 && lowConfItems[0].status === 'Pending',
    `Found ${lowConfItems.length} items with AI confidence < 70%`
  );
}

// TEST 9: Small city with 20 trees and high score
// Expected: Not yet ranked on major leaderboard (fails minimum sample size)
{
  const dummyTrees: Tree[] = [];
  for (let i = 0; i < 20; i++) {
    dummyTrees.push({
      id: `SMALL-${i}`,
      treeCode: `TREE-SMALL-${i}`,
      projectId: 'PRJ-SMALL',
      projectName: 'Tiny Project',
      organisationId: 'ORG-01',
      organisationName: 'Org',
      species: 'Neem',
      commonName: 'Vembu',
      scientificName: 'Azadirachta indica',
      plantedDate: '2026-01-01',
      latitude: 12.0,
      longitude: 78.0,
      gpsAccuracyMeters: 5,
      planterId: 'U1',
      planterName: 'P',
      caretakerId: 'U1',
      caretakerName: 'P',
      landCategory: 'Park',
      status: 'Verified Alive',
      currentHealth: 'Healthy',
      evidenceQuality: 'High',
      baselinePhotoUrl: 'https://example.com/b.jpg',
      latestPhotoUrl: 'https://example.com/b.jpg',
      ageMonths: 8,
      checkInCount: 8,
      createdAt: '2026-01-01T08:00:00Z',
    });
  }

  const scores = new Map();
  dummyTrees.forEach((t) => {
    scores.set(t.id, {
      totalScore: 98.0,
      components: { monitoring_score: 15, health_score: 20, maintenance_score: 10 },
      isEstablished: false,
      treeYears: 0.5,
    });
  });

  const geoScore = treeScoreService.calculateGeoScore(
    'city',
    'tiny-town',
    'Tiny Town',
    'Tamil Nadu',
    dummyTrees,
    scores,
    75.0
  );

  assert(
    'Test 9: Small city with 20 trees is not yet eligible for major leaderboard (min sample 100)',
    geoScore.isEligibleForRanking === false && geoScore.eligibleTreeCount === 20,
    `isEligibleForRanking: ${geoScore.isEligibleForRanking}, count: ${geoScore.eligibleTreeCount}`
  );
}

// TEST 10: Large city with high volume
// Expected: Statistically adjusted Bayesian ranking
{
  const coimbatoreTrees = store.trees.filter((t) => t.projectName.includes('Coimbatore'));
  const geoScore = treeScoreService.calculateGeoScore(
    'city',
    'coimbatore',
    'Coimbatore',
    'Tamil Nadu',
    coimbatoreTrees,
    store.treeScores,
    75.0
  );

  assert(
    'Test 10: Statistically adjusted ranking calculated with Bayesian shrinkage formula',
    geoScore.adjustedScore > 0 &&
      geoScore.rawScore > 0 &&
      geoScore.adjustedScore <= geoScore.rawScore &&
      geoScore.adjustedScore >= 75.0,
    `Raw: ${geoScore.rawScore}, Adjusted: ${geoScore.adjustedScore}`
  );
}

console.log('\n========================================');
console.log(`Results: ${passedTests} passed, ${failedTests} failed.`);
console.log('========================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL 10 TREEVIEW INDEX™ SPECIFICATION TESTS PASSED!');
  process.exit(0);
}
