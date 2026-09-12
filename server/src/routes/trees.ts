import { Router } from 'express';
import { store } from '../db/store.js';

export const treesRouter = Router();

// GET /api/trees - Filterable list of trees
treesRouter.get('/', (req, res) => {
  const { projectId, organisationId, species, status, health, caretakerId, search, limit, offset } = req.query;

  let list = store.getTrees({
    projectId: projectId as string,
    organisationId: organisationId as string,
    species: species as string,
    status: status as string,
    health: health as string,
    caretakerId: caretakerId as string,
    search: search as string,
  });

  const total = list.length;
  const numLimit = limit ? parseInt(limit as string, 10) : 100;
  const numOffset = offset ? parseInt(offset as string, 10) : 0;
  const paginated = list.slice(numOffset, numOffset + numLimit);

  res.json({
    success: true,
    total,
    trees: paginated,
  });
});

// GET /api/trees/:id - Detailed tree profile
treesRouter.get('/:id', (req, res) => {
  const tree = store.getTreeById(req.params.id);
  if (!tree) {
    return res.status(404).json({ success: false, message: 'Tree not found' });
  }

  const timeline = store.getTreeTimeline(tree.id);
  const verifications = store.getTreeVerifications(tree.id);
  const photos = store.getTreePhotos(tree.id);

  res.json({
    success: true,
    tree,
    timeline,
    verifications,
    photos,
  });
});

// POST /api/trees - Register a new planted tree
treesRouter.post('/', (req, res) => {
  const {
    projectId,
    species,
    commonName,
    scientificName,
    plantedDate,
    latitude,
    longitude,
    gpsAccuracyMeters,
    planterId,
    planterName,
    caretakerId,
    caretakerName,
    landCategory,
    baselinePhotoUrl,
    notes,
    studentClass,
    studentName,
  } = req.body;

  if (!species) {
    return res.status(400).json({ success: false, message: 'Species is required' });
  }

  const newTree = store.registerTree({
    projectId,
    species,
    commonName,
    scientificName,
    plantedDate,
    latitude: typeof latitude === 'number' ? latitude : parseFloat(latitude) || 13.0827,
    longitude: typeof longitude === 'number' ? longitude : parseFloat(longitude) || 80.2707,
    gpsAccuracyMeters: typeof gpsAccuracyMeters === 'number' ? gpsAccuracyMeters : 6,
    planterId,
    planterName,
    caretakerId,
    caretakerName,
    landCategory,
    baselinePhotoUrl,
    notes,
    studentClass,
    studentName,
  });

  res.status(201).json({
    success: true,
    message: 'Tree registered successfully',
    tree: newTree,
  });
});
