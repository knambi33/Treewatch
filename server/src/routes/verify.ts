import { Router } from 'express';
import { store } from '../db/store.js';
import { verifyGpsCoordinates } from '../services/geoService.js';
import { visionVerificationService } from '../services/ai/visionService.js';
import { HealthCondition, TreePhoto, Verification } from '../types.js';

export const verifyRouter = Router();

// POST /api/verify - Monthly Tree Verification Endpoint
verifyRouter.post('/', async (req, res) => {
  try {
    const {
      treeId,
      photoUrl,
      currentLat,
      currentLng,
      gpsAccuracyMeters = 6,
      captureMethod = 'In-App Camera',
      userId,
      userName,
      overrideHealth,
      overrideReason,
      simulatedCondition,
      simulatedSameTreeConfidence,
    } = req.body;

    const tree = store.getTreeById(treeId);
    if (!tree) {
      return res.status(404).json({ success: false, message: 'Tree not found' });
    }

    const project = store.projects.find((p) => p.id === tree.projectId) || store.projects[0];
    const toleranceMeters = project.gpsToleranceMeters || 25;

    // 1. GPS Verification
    const gpsResult = verifyGpsCoordinates(
      { latitude: tree.latitude, longitude: tree.longitude },
      { latitude: currentLat, longitude: currentLng, accuracyMeters: gpsAccuracyMeters },
      toleranceMeters
    );

    // 2. AI Multi-Stage Pipeline Execution
    const existingPhotos = store.getTreePhotos(tree.id);
    const pipelineResult = await visionVerificationService.executeVerificationPipeline({
      treeId: tree.id,
      treeCode: tree.treeCode,
      currentPhotoUrl: photoUrl || tree.latestPhotoUrl,
      baselinePhotoUrl: tree.baselinePhotoUrl,
      registeredSpecies: tree.species,
      captureMethod,
      currentLat,
      currentLng,
      gpsStatus: gpsResult.status,
      gpsDistanceMeters: gpsResult.distanceMeters,
      gpsToleranceMeters: toleranceMeters,
      existingPhotos,
      simulatedCondition,
      simulatedSameTreeConfidence,
    });

    const ai = pipelineResult.aiResult;
    const finalHealth: HealthCondition = overrideHealth || ai.healthAssessment.healthCondition;

    // Build Verification Record
    const verificationId = `VRF-${tree.id}-${Date.now()}`;
    const photoId = `PHT-${tree.id}-${Date.now()}`;

    const newPhoto: TreePhoto = {
      id: photoId,
      treeId: tree.id,
      photoUrl: photoUrl || tree.latestPhotoUrl,
      capturedAt: new Date().toISOString(),
      latitude: currentLat,
      longitude: currentLng,
      gpsAccuracyMeters,
      captureMethod,
      photoType: 'Monthly Verification',
      imageHash: pipelineResult.photoHash,
    };

    const verification: Verification = {
      id: verificationId,
      treeId: tree.id,
      treeCode: tree.treeCode,
      photoId,
      photoUrl: newPhoto.photoUrl,
      verificationMonth: new Date().toISOString().substring(0, 7), // "2026-09"
      submittedAt: new Date().toISOString(),
      submittedByUserId: userId || tree.caretakerId,
      submittedByUserName: userName || tree.caretakerName,
      currentLat,
      currentLng,
      gpsDistanceMeters: gpsResult.distanceMeters,
      gpsToleranceMeters: toleranceMeters,
      gpsStatus: gpsResult.status,
      gpsAccuracyMeters,
      sameTreeConfidenceScore: ai.sameTreeComparison.confidenceScore,
      sameTreeClassification: ai.sameTreeComparison.classification,
      sameTreePersistentFeatures: ai.sameTreeComparison.persistentCharacteristics,
      speciesDetected: ai.speciesIdentification.likelySpecies,
      speciesConfidenceScore: ai.speciesIdentification.confidenceScore,
      healthAssessment: finalHealth,
      healthIndicators: ai.healthAssessment.indicators,
      evidenceQuality: ai.evidenceQuality,
      verificationStatus: pipelineResult.isFlagged ? 'Pending Review' : 'Auto-Approved',
      flags: pipelineResult.allFlags,
      overrideHealthByPlanter: overrideHealth
        ? {
            overridden: true,
            userHealth: overrideHealth,
            reason: overrideReason,
          }
        : undefined,
    };

    // Commit to DataStore
    store.recordVerification(verification, newPhoto, pipelineResult.suggestedStatus, finalHealth);

    res.json({
      success: true,
      verification,
      gpsResult,
      aiAnalysis: ai,
      suggestedStatus: pipelineResult.suggestedStatus,
      isFlaggedForReview: pipelineResult.isFlagged,
      flags: pipelineResult.allFlags,
      message: pipelineResult.isFlagged
        ? 'Verification submitted and flagged for arborist review'
        : 'Verification verified and approved successfully',
    });
  } catch (err: any) {
    console.error('Verification error:', err);
    res.status(500).json({ success: false, message: err.message || 'Internal server error' });
  }
});
