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
} from '../types.js';
import { generateSeedData } from './seedData.js';

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
    console.log(`[DataStore] Initialized with ${this.trees.length} trees across ${this.projects.length} projects.`);
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
      notes: data.notes || 'Registered in TreeWatch field app.',
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

    // Add Timeline event
    this.timelineEvents.unshift({
      id: `TL-${newTree.id}-01`,
      treeId: newTree.id,
      timestamp: newTree.createdAt,
      eventType: 'Planted',
      title: `🌱 Tree Planted (${treeCode})`,
      description: `Registered with GPS coordinates (±${newTree.gpsAccuracyMeters}m). Baseline photo verified.`,
      photoUrl: newTree.baselinePhotoUrl,
      badge: 'Planted',
      actorName: newTree.planterName,
    });

    return newTree;
  }

  // Monthly Verification
  public recordVerification(verification: Verification, newPhoto: TreePhoto, newStatus: TreeStatus, newHealth: HealthCondition) {
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
      tree.ageMonths = Math.max(tree.ageMonths, Math.floor((Date.now() - new Date(tree.plantedDate).getTime()) / (30 * 24 * 3600 * 1000)));

      // Add to timeline
      this.timelineEvents.unshift({
        id: `TL-${tree.id}-${Date.now()}`,
        treeId: tree.id,
        timestamp: verification.submittedAt,
        eventType: 'AI Verification',
        title: `📷 Monthly Verification — ${newStatus}`,
        description: `GPS: ${verification.gpsStatus} (${verification.gpsDistanceMeters}m). Same-Tree Confidence: ${verification.sameTreeConfidenceScore}%. Health: ${newHealth}. Evidence Quality: ${verification.evidenceQuality}.`,
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

      this.timelineEvents.unshift({
        id: `TL-REV-${Date.now()}`,
        treeId: tree.id,
        timestamp: item.reviewedAt,
        eventType: 'Reviewer Action',
        title: `Arborist Review: ${params.action}`,
        description: `Decision by ${params.reviewerName}. Remarks: "${params.reviewerRemarks}". Status updated to ${tree.status}.`,
        badge: params.action,
        actorName: params.reviewerName,
      });
    }

    return item;
  }
}

export const store = new DataStore();
