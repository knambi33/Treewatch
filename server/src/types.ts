export type UserRole = 
  | 'planter'
  | 'school_student'
  | 'school_admin'
  | 'ngo_lead'
  | 'csr_manager'
  | 'community_lead'
  | 'admin';

export type TreeStatus = 
  | 'Planted'
  | 'Verified Alive'
  | 'Healthy'
  | 'Needs Attention'
  | 'Stressed'
  | 'Poor Health'
  | 'Dead'
  | 'Missing'
  | 'Removed'
  | 'Verification Pending'
  | 'Verification Exception';

export type HealthCondition = 
  | 'Healthy'
  | 'Moderate Stress'
  | 'Poor Health'
  | 'Dead / Missing'
  | 'Unable to Assess';

export type EvidenceQuality = 'High' | 'Medium' | 'Low';

export type GpsStatus = 'Verified' | 'Mismatch' | 'Unavailable' | 'Low Accuracy';

export type SameTreeConfidenceLevel = 'High confidence' | 'Medium confidence' | 'Low confidence';

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: UserRole;
  roleTitle: string;
  organisationId?: string;
  organisationName?: string;
  assignedProjectIds?: string[];
  avatarUrl?: string;
  studentClass?: string; // for school mode e.g. "Class VIII-A"
  badges?: string[];
}

export interface Organisation {
  id: string;
  name: string;
  type: 'CSR' | 'NGO' | 'School' | 'Community' | 'Municipality';
  contactEmail: string;
  contactPhone: string;
  logoUrl?: string;
  publicSlug: string;
  description: string;
  location: string;
}

export interface ProjectGeography {
  district: string;
  state: string;
  centerLat: number;
  centerLng: number;
  radiusKm: number;
}

export interface Project {
  id: string;
  organisationId: string;
  organisationName: string;
  name: string;
  description: string;
  targetTrees: number;
  startDate: string;
  endDate?: string;
  geography: ProjectGeography;
  gpsToleranceMeters: number; // default 25m
  partnerNgoId?: string;
  partnerNgoName?: string;
}

export interface TreePhoto {
  id: string;
  treeId: string;
  photoUrl: string;
  capturedAt: string;
  latitude: number;
  longitude: number;
  gpsAccuracyMeters: number;
  captureMethod: 'In-App Camera' | 'Gallery Upload';
  photoType: 'Baseline' | 'Monthly Verification' | 'Inspection';
  deviceInfo?: string;
  imageHash?: string;
}

export interface HealthIndicatorDetails {
  foliageDensity: 'Dense / Normal' | 'Sparse / Defoliated' | 'No Foliage';
  canopyCondition: 'Vibrant Green' | 'Moderate Wilting / Yellowing' | 'Severe Browning / Dried';
  trunkCondition: 'Intact & Sturdy' | 'Minor Damage / Leaning' | 'Severely Damaged / Broken';
  growthObservation: string;
}

export interface Verification {
  id: string;
  treeId: string;
  treeCode: string;
  photoId: string;
  photoUrl: string;
  verificationMonth: string; // e.g. "2026-08"
  submittedAt: string;
  submittedByUserId: string;
  submittedByUserName: string;
  currentLat: number;
  currentLng: number;
  gpsDistanceMeters: number;
  gpsToleranceMeters: number;
  gpsStatus: GpsStatus;
  gpsAccuracyMeters: number;
  sameTreeConfidenceScore: number; // e.g. 94%
  sameTreeClassification: SameTreeConfidenceLevel;
  sameTreePersistentFeatures: string[]; // e.g. ["Trunk bifurcation matches", "Surrounding landmark aligned"]
  speciesDetected: string;
  speciesConfidenceScore: number; // e.g. 91%
  healthAssessment: HealthCondition;
  healthIndicators: HealthIndicatorDetails;
  evidenceQuality: EvidenceQuality;
  verificationStatus: 'Auto-Approved' | 'Pending Review' | 'Reviewed-Approved' | 'Reviewed-Rejected';
  flags: string[];
  reviewerId?: string;
  reviewerName?: string;
  reviewerRemarks?: string;
  verifiedAt?: string;
  overrideHealthByPlanter?: {
    overridden: boolean;
    userHealth: HealthCondition;
    reason?: string;
  };
}

export interface TimelineEvent {
  id: string;
  treeId: string;
  timestamp: string;
  eventType: 'Planted' | 'GPS Verified' | 'Photo Captured' | 'AI Verification' | 'Health Assessment' | 'Reviewer Action' | 'Status Changed';
  title: string;
  description: string;
  photoUrl?: string;
  badge?: string;
  actorName?: string;
}

export interface Tree {
  id: string;
  treeCode: string; // e.g. TREE-TN-CHN-00001234
  projectId: string;
  projectName: string;
  organisationId: string;
  organisationName: string;
  species: string;
  commonName: string;
  scientificName: string;
  plantedDate: string;
  latitude: number;
  longitude: number;
  gpsAccuracyMeters: number;
  planterId: string;
  planterName: string;
  caretakerId: string;
  caretakerName: string;
  landCategory: 'School' | 'Park' | 'Roadside' | 'Private' | 'Forest' | 'Community';
  status: TreeStatus;
  currentHealth: HealthCondition;
  evidenceQuality: EvidenceQuality;
  baselinePhotoUrl: string;
  latestPhotoUrl: string;
  lastVerifiedDate?: string;
  qrCodeUrl?: string;
  notes?: string;
  ageMonths: number;
  checkInCount: number;
  studentClass?: string;
  studentName?: string;
  createdAt: string;
}

export interface ReviewQueueItem {
  id: string;
  treeId: string;
  treeCode: string;
  verificationId: string;
  species: string;
  projectName: string;
  organisationName: string;
  submittedAt: string;
  submittedByName: string;
  flags: string[];
  baselinePhotoUrl: string;
  currentPhotoUrl: string;
  registeredCoords: { lat: number; lng: number };
  currentCoords: { lat: number; lng: number };
  distanceMeters: number;
  gpsToleranceMeters: number;
  aiSameTreeConfidence: number;
  aiHealthAssessment: HealthCondition;
  aiSpeciesDetected: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Photo-Requested';
  reviewerRemarks?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  treeId: string;
  treeCode: string;
  title: string;
  message: string;
  type: 'monthly_reminder' | 'pending_3day' | 'pending_7day' | 'overdue_escalation' | 'review_update';
  sentAt: string;
  read: boolean;
  priority: 'normal' | 'high' | 'urgent';
}

export interface SurvivalMetrics {
  totalPlanted: number;
  verifiedAlive: number;
  healthy: number;
  moderateStress: number;
  poorHealth: number;
  dead: number;
  missing: number;
  removed: number;
  verificationPending: number;
  verificationException: number;
  needsAttention: number;
  // Two distinct calculation methodologies:
  // Methodology A: Verified Alive / Trees Due for Verification
  treesDueForVerification: number;
  survivalRateMethodA_Percent: number;
  // Methodology B: Verified Alive / Total Planted
  survivalRateMethodB_Percent: number;
  verificationCompliancePercent: number;
}

export type TreeScoreCategory = 
  | '🌱 Newly Planted'
  | '🌿 Establishing'
  | '🌳 Surviving'
  | '🌳 Thriving'
  | '🌳 Established'
  | '🏆 TreeView Champion'
  | '🏆 TreeWatch Champion';

export interface TreeScoreComponents {
  planting_score: number;     // Max 10
  location_score: number;     // Max 10
  monitoring_score: number;   // Max 15
  survival_score: number;     // Max 35
  health_score: number;       // Max 20
  maintenance_score: number;  // Max 10
}

export interface TreeScoreRecord {
  id: string;
  treeId: string;
  treeCode: string;
  scoreDate: string;
  methodologyVersion: string;
  components: TreeScoreComponents;
  totalScore: number;
  category: TreeScoreCategory;
  verifiedSurvivalDays: number;
  treeYears: number;
  treeDays: number;
  isEstablished: boolean;
  changeFromPrevious?: number;
  scoreChangeReason?: string;
  improvementTip: string;
  isDead: boolean;
  lifetimeScore?: number;
  lastVerifiedAliveDate?: string;
}

export interface TreeScoreHistoryItem {
  id: string;
  treeId: string;
  date: string;
  score: number;
  change: number;
  reason: string;
  components: TreeScoreComponents;
}

export interface CareActivity {
  id: string;
  treeId: string;
  activityType: 'Watering' | 'Mulching' | 'Weeding' | 'Protection' | 'Staking' | 'Pest Control' | 'Soil Improvement' | 'Guarding' | 'Care Plan Assigned';
  date: string;
  recordedByUserId: string;
  recordedByUserName: string;
  notes?: string;
  photoUrl?: string;
}

export interface GuardianScore {
  guardianId: string;
  guardianName: string;
  scoreDate: string;
  treesCount: number;
  aliveCount: number;
  survivalScore: number;       // 40% weight
  monitoringScore: number;     // 25% weight
  careScore: number;           // 20% weight
  verificationQualityScore: number; // 10% weight
  integrityScore: number;      // 5% weight (+2 points for reporting mortality)
  totalGuardianScore: number;  // 0 - 100
  badge: string;
}

export interface ProjectScore {
  projectId: string;
  projectName: string;
  targetTrees: number;
  plantedTrees: number;
  verifiedAlive: number;
  survivalScore: number;            // 40%
  averageTreeScore: number;         // 25%
  monitoringComplianceScore: number;// 15%
  healthScore: number;              // 10%
  maintenanceScore: number;         // 10%
  totalProjectScore: number;        // 0 - 100
  establishedCount: number;
  treeYears: number;
  evidenceQuality: EvidenceQuality;
}

export interface OrganisationScore {
  organisationId: string;
  organisationName: string;
  organisationType: string;
  plantedTrees: number;
  verifiedAlive: number;
  survivalRate: number;
  averageTreeScore: number;
  monitoringCompliance: number;
  healthRate: number;
  maintenanceRate: number;
  evidenceQualityScore: number;
  totalOrganisationScore: number;
  establishedCount: number;
  treeYears: number;
  hasInsufficientData: boolean;
}

export interface GeoScore {
  id: string;
  geoLevel: 'individual' | 'school' | 'ngo' | 'city' | 'district' | 'state' | 'national' | 'ward';
  geoId: string;
  geoName: string;
  state?: string;
  badge?: string;
  integrityScore?: number;
  eligibleTreeCount: number;
  minEligibleRequired: number;
  isEligibleForRanking: boolean;
  rawScore: number;
  adjustedScore: number;
  verifiedSurvivalRate: number;
  averageTreeScore: number;
  monitoringCompliance: number;
  healthRate: number;
  evidenceQualityRate: number;
  establishedCount: number;
  treeYears: number;
  rank: number;
  previousRank?: number;
  scoreChange?: number;
  isRisingLeader?: boolean;
}

export interface AdminScoringConfig {
  gpsToleranceMetersDefault: number;
  gpsAccuracyMaxMeters: number;
  monitoringGracePeriodDays: number;
  aiSimilarityThresholdHigh: number;
  aiSimilarityThresholdModerate: number;
  establishmentMinAgeMonths: number;
  establishmentMinVerifications: number;
  bayesianConfidenceConstantK: number;
  minSampleNational: number;
  minSampleState: number;
  minSampleDistrict: number;
  minSampleLocal: number;
  methodologyVersion: string;
}

