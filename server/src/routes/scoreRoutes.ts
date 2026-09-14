import { Router } from 'express';
import { store } from '../db/store.js';
import { adminConfig } from '../services/adminConfigService.js';
import { CareActivity } from '../types.js';

export const scoreRouter = Router();

// Handler for TreeView Index (single tree score & breakdown)
const getTreeScoreHandler = (req: any, res: any) => {
  const tree = store.getTreeById(req.params.treeId);
  if (!tree) {
    return res.status(404).json({ success: false, message: 'Tree not found' });
  }

  const scoreRecord = store.getTreeScore(tree.id);
  const history = store.getTreeScoreHistory(tree.id);
  const careActivities = store.getCareActivities(tree.id);

  if (!scoreRecord) {
    return res.status(404).json({ success: false, message: 'Score record not found' });
  }

  res.json({
    success: true,
    treeId: tree.id,
    treeCode: tree.treeCode,
    score: scoreRecord.totalScore,
    category: scoreRecord.category,
    components: {
      planting: scoreRecord.components.planting_score,
      location: scoreRecord.components.location_score,
      monitoring: scoreRecord.components.monitoring_score,
      survival: scoreRecord.components.survival_score,
      health: scoreRecord.components.health_score,
      maintenance: scoreRecord.components.maintenance_score,
    },
    verifiedSurvivalDays: scoreRecord.verifiedSurvivalDays,
    treeYears: scoreRecord.treeYears,
    treeDays: scoreRecord.treeDays,
    established: scoreRecord.isEstablished,
    lastVerified: tree.lastVerifiedDate || tree.plantedDate,
    improvementTip: scoreRecord.improvementTip,
    isDead: scoreRecord.isDead,
    lifetimeScore: scoreRecord.lifetimeScore,
    methodologyVersion: scoreRecord.methodologyVersion,
    scoreDate: scoreRecord.scoreDate,
    history,
    careActivities,
  });
};

// GET /api/trees/:treeId/score & GET /api/treeview-index/:treeId (Section 48)
scoreRouter.get('/trees/:treeId/score', getTreeScoreHandler);
scoreRouter.get('/treeview-index/:treeId', getTreeScoreHandler);

// POST /api/trees/:treeId/care - Log a care & maintenance event
scoreRouter.post('/trees/:treeId/care', (req, res) => {
  const tree = store.getTreeById(req.params.treeId);
  if (!tree) {
    return res.status(404).json({ success: false, message: 'Tree not found' });
  }

  const { activityType, recordedByUserId, recordedByUserName, notes, photoUrl } = req.body;
  if (!activityType) {
    return res.status(400).json({ success: false, message: 'Activity type is required' });
  }

  const care: CareActivity = {
    id: `CARE-${tree.id}-${Date.now()}`,
    treeId: tree.id,
    activityType,
    date: new Date().toISOString().split('T')[0],
    recordedByUserId: recordedByUserId || tree.caretakerId || 'USR-PLANTER-01',
    recordedByUserName: recordedByUserName || tree.caretakerName || 'Guardian',
    notes: notes || 'Routine care recorded in TreeView app',
    photoUrl,
  };

  store.addCareActivity(care);
  const updatedScore = store.getTreeScore(tree.id);

  res.status(201).json({
    success: true,
    message: `Care activity (${activityType}) recorded successfully`,
    care,
    updatedScore,
  });
});

// GET /api/projects/:projectId/score - ProjectScore (Section 49)
scoreRouter.get('/projects/:projectId/score', (req, res) => {
  const projectScore = store.getProjectScore(req.params.projectId);
  if (!projectScore) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  res.json({
    success: true,
    projectScore,
  });
});

// GET /api/organisations/:orgId/score - OrganisationScore / CSR Impact
scoreRouter.get('/organisations/:orgId/score', (req, res) => {
  const orgScore = store.getOrganisationScore(req.params.orgId);
  if (!orgScore) {
    return res.status(404).json({ success: false, message: 'Organisation not found' });
  }

  res.json({
    success: true,
    orgScore,
  });
});

// GET /api/guardians/:id/score - GuardianScore (Section 21)
scoreRouter.get('/guardians/:id/score', (req, res) => {
  const guardianScore = store.getGuardianScore(req.params.id);
  res.json({
    success: true,
    guardianScore,
  });
});

// Handler for Filterable Geographic Leaderboard (Section 25, 29, 30, 31)
const getLeaderboardHandler = (req: any, res: any) => {
  const level = (req.query.level as any) || 'city';
  const competition = (req.query.competition as string) || 'overall';
  const timeRange = (req.query.timeRange as string) || 'all';

  let list = store.getGeoScores(level);

  // Sorting based on competition category (Section 30)
  if (competition === 'survival') {
    list.sort((a, b) => b.verifiedSurvivalRate - a.verifiedSurvivalRate);
  } else if (competition === 'health') {
    list.sort((a, b) => b.healthRate - a.healthRate);
  } else if (competition === 'verification') {
    list.sort((a, b) => b.monitoringCompliance - a.monitoringCompliance);
  } else if (competition === 'established') {
    list.sort((a, b) => b.establishedCount - a.establishedCount);
  } else if (competition === 'most_improved') {
    list.sort((a, b) => (b.scoreChange || 0) - (a.scoreChange || 0));
  } else {
    // default 'overall': sorted by adjusted Bayesian GeoScore
    list.sort((a, b) => b.adjustedScore - a.adjustedScore);
  }

  // Re-index ranks
  list.forEach((item, index) => {
    item.rank = index + 1;
  });

  const config = adminConfig.getConfig();

  res.json({
    success: true,
    level,
    competition,
    timeRange,
    methodologyVersion: config.methodologyVersion,
    bayesianConfidenceConstantK: config.bayesianConfidenceConstantK,
    updatedAt: new Date().toISOString(),
    leaderboard: list,
  });
};

// GET /api/geo/leaderboard & GET /api/treeview-leaders
scoreRouter.get('/geo/leaderboard', getLeaderboardHandler);
scoreRouter.get('/treeview-leaders', getLeaderboardHandler);

// GET /api/geo/:level/:geoId/score - Specific GeoScore (Section 50)
scoreRouter.get('/geo/:level/:geoId/score', (req, res) => {
  const level = req.params.level as any;
  const geoId = req.params.geoId;
  const list = store.getGeoScores(level);
  const found = list.find((g) => g.geoId.toLowerCase() === geoId.toLowerCase());

  if (!found) {
    return res.status(404).json({ success: false, message: 'Geographic score not found' });
  }

  res.json({
    success: true,
    geoScore: found,
  });
});

// GET /api/admin/scoring-config - Retrieve admin config (Section 70)
scoreRouter.get('/admin/scoring-config', (req, res) => {
  res.json({
    success: true,
    config: adminConfig.getConfig(),
  });
});

// PUT /api/admin/scoring-config - Update admin config dynamically (Section 70)
scoreRouter.put('/admin/scoring-config', (req, res) => {
  const updated = adminConfig.updateConfig(req.body);
  // Recalculate all scores with new configuration parameters
  store.recalculateAllScores();

  res.json({
    success: true,
    message: 'Scoring parameters updated and all TreeView Indices recomputed',
    config: updated,
  });
});
