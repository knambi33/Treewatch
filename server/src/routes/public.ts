import { Router } from 'express';
import { store } from '../db/store.js';
import { calculateSurvivalMetrics } from '../services/reportService.js';

export const publicRouter = Router();

// GET /api/public/organisations/:slug - Public Transparency Portal
publicRouter.get('/organisations/:slug', (req, res) => {
  const org = store.organisations.find((o) => o.publicSlug === req.params.slug || o.id === req.params.slug);
  if (!org) {
    return res.status(404).json({ success: false, message: 'Public organisation not found' });
  }

  const trees = store.trees.filter((t) => t.organisationId === org.id);
  const metrics = calculateSurvivalMetrics(trees);
  const projects = store.projects.filter((p) => p.organisationId === org.id);

  // Strip PII (names, phone, user IDs)
  const publicTrees = trees.map((t) => ({
    id: t.id,
    treeCode: t.treeCode,
    projectName: t.projectName,
    species: t.species,
    commonName: t.commonName,
    plantedDate: t.plantedDate,
    latitude: t.latitude,
    longitude: t.longitude,
    status: t.status,
    currentHealth: t.currentHealth,
    evidenceQuality: t.evidenceQuality,
    baselinePhotoUrl: t.baselinePhotoUrl,
    latestPhotoUrl: t.latestPhotoUrl,
    lastVerifiedDate: t.lastVerifiedDate,
  }));

  res.json({
    success: true,
    transparencyData: {
      organisationName: org.name,
      organisationType: org.type,
      description: org.description,
      location: org.location,
      metrics,
      projects: projects.map((p) => ({
        id: p.id,
        name: p.name,
        target: p.targetTrees,
        district: p.geography.district,
      })),
      trees: publicTrees,
      auditedAt: new Date().toISOString(),
      governanceStatement:
        'All survival statistics are derived from cryptographic GPS geotagging, computer-vision same-tree analysis, and certified arborist audit trails. Trees awaiting monthly check-ins are recorded explicitly as Pending and are not counted as alive.',
    },
  });
});
