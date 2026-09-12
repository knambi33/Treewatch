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
} from '../types.js';

export const SEED_ORGANISATIONS: Organisation[] = [
  {
    id: 'ORG-CSR-01',
    name: 'Green Earth CSR Foundation',
    type: 'CSR',
    contactEmail: 'csr@greenearthcorp.com',
    contactPhone: '+91 44 2833 4900',
    publicSlug: 'green-earth-csr',
    description: 'Corporate sustainability and ESG afforestation initiative aiming for 100,000 surviving native trees across Southern India.',
    location: 'Chennai & Bengaluru',
  },
  {
    id: 'ORG-NGO-02',
    name: 'Cauvery Delta Revival NGO',
    type: 'NGO',
    contactEmail: 'projects@cauverydelta.org',
    contactPhone: '+91 4362 278100',
    publicSlug: 'cauvery-delta-revival',
    description: 'Community-led ecological restoration organisation planting riverbank soil-stabilizing native trees.',
    location: 'Thanjavur & Trichy, Tamil Nadu',
  },
  {
    id: 'ORG-SCH-03',
    name: "St. Xavier's Model Matriculation School",
    type: 'School',
    contactEmail: 'eco-club@stxaviers-school.edu.in',
    contactPhone: '+91 44 2499 1820',
    publicSlug: 'st-xaviers-green-campus',
    description: 'Youth environmental stewardship programme where each student class adopts, tags, and nurtures native trees on campus.',
    location: 'Mylapore, Chennai',
  },
  {
    id: 'ORG-PRIVATE',
    name: 'Private / Individual',
    type: 'Community',
    contactEmail: 'individual@treewatch.in',
    contactPhone: '+91 1800 123 4567',
    publicSlug: 'individual-planters',
    description: 'Independent citizens, farmers, homesteaders, and private landowners planting and tracking survival of trees on private and residential lands.',
    location: 'Pan-India / Private Lands',
  },
];

export const SEED_USERS: User[] = [
  {
    id: 'USR-PLANTER-01',
    name: 'Ravi Kumar',
    email: 'ravi.kumar@treewatch.in',
    mobile: '+91 98401 23456',
    role: 'planter',
    roleTitle: 'Community Planter & Caretaker',
    organisationId: 'ORG-CSR-01',
    organisationName: 'Green Earth CSR Foundation',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    badges: ['🌱 Tree Planter', '📷 3-Month Guardian'],
  },
  {
    id: 'USR-STUDENT-02',
    name: 'Arun',
    email: 'arun.class8a@stxaviers-school.edu.in',
    mobile: '+91 94441 98765',
    role: 'school_student',
    roleTitle: 'Eco-Club Student Guardian',
    organisationId: 'ORG-SCH-03',
    organisationName: "St. Xavier's Model Matriculation School",
    studentClass: 'Class VIII-A',
    avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
    badges: ['🌱 Tree Planter', '📷 3-Month Guardian', '🌿 6-Month Guardian'],
  },
  {
    id: 'USR-TEACHER-03',
    name: 'Sister Mary Thomas',
    email: 'principal@stxaviers-school.edu.in',
    mobile: '+91 98410 44321',
    role: 'school_admin',
    roleTitle: 'Principal & Eco-Coordinator',
    organisationId: 'ORG-SCH-03',
    organisationName: "St. Xavier's Model Matriculation School",
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'USR-NGO-04',
    name: 'Priya Sharma',
    email: 'priya.sharma@cauverydelta.org',
    mobile: '+91 98840 55678',
    role: 'ngo_lead',
    roleTitle: 'Field Project Director',
    organisationId: 'ORG-NGO-02',
    organisationName: 'Cauvery Delta Revival NGO',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'USR-CSR-05',
    name: 'Ananya Sen',
    email: 'ananya.sen@greenearthcorp.com',
    mobile: '+91 99620 11223',
    role: 'csr_manager',
    roleTitle: 'Chief Sustainability Officer',
    organisationId: 'ORG-CSR-01',
    organisationName: 'Green Earth CSR Foundation',
    avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'USR-COMMUNITY-06',
    name: 'Suresh Babu',
    email: 'suresh.babu@annanagar-rwa.org',
    mobile: '+91 98408 88990',
    role: 'community_lead',
    roleTitle: 'RWA Greenery Secretary',
    organisationId: 'ORG-CSR-01',
    organisationName: 'Green Earth CSR Foundation',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'USR-ADMIN-07',
    name: 'Dr. K. Ramanathan',
    email: 'arborist.audit@treewatch.in',
    mobile: '+91 94440 12121',
    role: 'admin',
    roleTitle: 'Lead Verification Arborist & System Administrator',
    organisationId: 'ORG-CSR-01',
    organisationName: 'Green Earth CSR Foundation',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'USR-INDIVIDUAL-08',
    name: 'Kavitha Ramachandran',
    email: 'kavitha.nature@gmail.com',
    mobile: '+91 98402 33445',
    role: 'planter',
    roleTitle: 'Private Landowner / Citizen Planter',
    organisationId: 'ORG-PRIVATE',
    organisationName: 'Private / Individual',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    badges: ['🌱 Tree Planter', '🏡 Private Homestead Steward'],
  },
];

export const SEED_PROJECTS: Project[] = [
  {
    id: 'PRJ-CHN-01',
    organisationId: 'ORG-CSR-01',
    organisationName: 'Green Earth CSR Foundation',
    name: 'Chennai Coastal Green Belt',
    description: 'Salt-tolerant native tree plantation along the East Coast corridor for cyclone resilience and urban micro-climate cooling.',
    targetTrees: 15000,
    startDate: '2026-06-05',
    geography: {
      district: 'Chennai',
      state: 'Tamil Nadu',
      centerLat: 13.0827,
      centerLng: 80.2707,
      radiusKm: 18,
    },
    gpsToleranceMeters: 25,
    partnerNgoId: 'ORG-NGO-02',
    partnerNgoName: 'Cauvery Delta Revival NGO',
  },
  {
    id: 'PRJ-CVR-02',
    organisationId: 'ORG-NGO-02',
    organisationName: 'Cauvery Delta Revival NGO',
    name: 'Cauvery River Basin Afforestation',
    description: 'Riparian buffer restoration planting dense native ficus and pongamia groves along flood embankments.',
    targetTrees: 25000,
    startDate: '2026-05-15',
    geography: {
      district: 'Thanjavur',
      state: 'Tamil Nadu',
      centerLat: 10.787,
      centerLng: 79.1378,
      radiusKm: 30,
    },
    gpsToleranceMeters: 25,
  },
  {
    id: 'PRJ-UMF-03',
    organisationId: 'ORG-CSR-01',
    organisationName: 'Green Earth CSR Foundation',
    name: 'Urban Micro-Forests Phase 2',
    description: 'Miyawaki-style dense pocket forests in public parks and neighborhood grounds in Coimbatore.',
    targetTrees: 5000,
    startDate: '2026-06-15',
    geography: {
      district: 'Coimbatore',
      state: 'Tamil Nadu',
      centerLat: 11.0168,
      centerLng: 76.9558,
      radiusKm: 12,
    },
    gpsToleranceMeters: 20,
    partnerNgoId: 'ORG-NGO-02',
    partnerNgoName: 'Cauvery Delta Revival NGO',
  },
  {
    id: 'PRJ-SXG-04',
    organisationId: 'ORG-SCH-03',
    organisationName: "St. Xavier's Model Matriculation School",
    name: "St. Xavier's Green Campus 2026",
    description: 'Student-led campus bio-diversity initiative with each class adopting and monitoring 50 native trees.',
    targetTrees: 500,
    startDate: '2026-06-10',
    geography: {
      district: 'Chennai',
      state: 'Tamil Nadu',
      centerLat: 13.0334,
      centerLng: 80.2677,
      radiusKm: 3,
    },
    gpsToleranceMeters: 15,
  },
  {
    id: 'PRJ-BLR-05',
    organisationId: 'ORG-CSR-01',
    organisationName: 'Green Earth CSR Foundation',
    name: 'Bengaluru IT Corridor Green Canopy',
    description: 'Corporate tech park perimeter reforestation and roadside avenues in Electronic City and Whitefield.',
    targetTrees: 8000,
    startDate: '2026-07-01',
    geography: {
      district: 'Bengaluru Urban',
      state: 'Karnataka',
      centerLat: 12.9716,
      centerLng: 77.5946,
      radiusKm: 25,
    },
    gpsToleranceMeters: 25,
  },
  {
    id: 'PRJ-IND-06',
    organisationId: 'ORG-PRIVATE',
    organisationName: 'Private / Individual',
    name: 'Independent Citizen & Landowner Plantations',
    description: 'Self-governed individual and private plantation records across residential gardens, private homesteads, and farmlands.',
    targetTrees: 5000,
    startDate: '2026-01-01',
    geography: {
      district: 'Pan-India',
      state: 'All States',
      centerLat: 13.0827,
      centerLng: 80.2707,
      radiusKm: 500,
    },
    gpsToleranceMeters: 50,
  },
];

// Species catalogue
interface SpeciesMeta {
  species: string;
  common: string;
  scientific: string;
}

const SPECIES_LIST: SpeciesMeta[] = [
  { species: 'Neem', common: 'Vembu / Margosa', scientific: 'Azadirachta indica' },
  { species: 'Pongamia', common: 'Pungai / Indian Beech', scientific: 'Millettia pinnata' },
  { species: 'Peepal', common: 'Arasa Maram / Sacred Fig', scientific: 'Ficus religiosa' },
  { species: 'Banyan', common: 'Aala Maram / Indian Banyan', scientific: 'Ficus benghalensis' },
  { species: 'Rain Tree', common: 'Thoongumoonji / Samanea', scientific: 'Samanea saman' },
  { species: 'Teak', common: 'Thekku / Teak', scientific: 'Tectona grandis' },
  { species: 'Mango', common: 'Maa Maram / Indian Mango', scientific: 'Mangifera indica' },
  { species: 'Gulmohar', common: 'Mayil Kondrai / Flamboyant', scientific: 'Delonix regia' },
  { species: 'Mahua', common: 'Iluppai / Butter Tree', scientific: 'Madhuca longifolia' },
  { species: 'Coconut', common: 'Thennai / Coconut Palm', scientific: 'Cocos nucifera' },
];

const PHOTO_SAMPLES = {
  healthyNeem: [
    'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&auto=format&fit=crop&q=80',
  ],
  healthySapling: [
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80',
  ],
  stressedTree: [
    'https://images.unsplash.com/photo-1508873696983-2df5703bc20d?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=600&auto=format&fit=crop&q=80',
  ],
  deadTree: [
    'https://images.unsplash.com/photo-1516214104703-d870798883c5?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80',
  ],
};

export function generateSeedData(): {
  organisations: Organisation[];
  projects: Project[];
  users: User[];
  trees: Tree[];
  photos: TreePhoto[];
  verifications: Verification[];
  timelineEvents: TimelineEvent[];
  reviewQueue: ReviewQueueItem[];
  notifications: NotificationItem[];
} {
  const trees: Tree[] = [];
  const photos: TreePhoto[] = [];
  const verifications: Verification[] = [];
  const timelineEvents: TimelineEvent[] = [];
  const reviewQueue: ReviewQueueItem[] = [];
  const notifications: NotificationItem[] = [];

  // Dedicated Student Tree for Arun (Class VIII-A)
  const studentTree: Tree = {
    id: 'TREE-SCH-00125',
    treeCode: 'SCH-00125',
    projectId: 'PRJ-SXG-04',
    projectName: "St. Xavier's Green Campus 2026",
    organisationId: 'ORG-SCH-03',
    organisationName: "St. Xavier's Model Matriculation School",
    species: 'Neem',
    commonName: 'Vembu / Margosa',
    scientificName: 'Azadirachta indica',
    plantedDate: '2026-06-10',
    latitude: 13.0335,
    longitude: 80.2678,
    gpsAccuracyMeters: 4,
    planterId: 'USR-STUDENT-02',
    planterName: 'Arun',
    caretakerId: 'USR-STUDENT-02',
    caretakerName: 'Arun',
    landCategory: 'School',
    status: 'Verified Alive',
    currentHealth: 'Healthy',
    evidenceQuality: 'High',
    baselinePhotoUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    latestPhotoUrl: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=600&auto=format&fit=crop&q=80',
    lastVerifiedDate: '2026-08-15',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=SCH-00125',
    notes: 'Adopted by Arun, Class VIII-A. Planted on World Environment Week beside the biology laboratory quadrangle.',
    ageMonths: 3,
    checkInCount: 3,
    studentClass: 'Class VIII-A',
    studentName: 'Arun',
    createdAt: '2026-06-10T09:30:00Z',
  };
  trees.push(studentTree);

  // Baseline photo for student tree
  photos.push({
    id: 'PHT-SCH-01',
    treeId: studentTree.id,
    photoUrl: studentTree.baselinePhotoUrl,
    capturedAt: '2026-06-10T09:30:00Z',
    latitude: 13.0335,
    longitude: 80.2678,
    gpsAccuracyMeters: 4,
    captureMethod: 'In-App Camera',
    photoType: 'Baseline',
    imageHash: 'hash-sch-001-baseline',
  });

  // Timeline for student tree
  timelineEvents.push(
    {
      id: 'TL-SCH-01',
      treeId: studentTree.id,
      timestamp: '2026-06-10T09:30:00Z',
      eventType: 'Planted',
      title: '🌱 Tree Planted by Student Arun',
      description: 'Sapling planted during St. Xavier Eco-Campus Drive. Class VIII-A assigned as guardians.',
      photoUrl: studentTree.baselinePhotoUrl,
      badge: 'Planted',
      actorName: 'Arun (Class VIII-A)',
    },
    {
      id: 'TL-SCH-02',
      treeId: studentTree.id,
      timestamp: '2026-06-10T09:32:00Z',
      eventType: 'GPS Verified',
      title: '📍 GPS Geotagged (±4m)',
      description: 'Coordinates verified at 13.0335° N, 80.2678° E on campus quadrangle.',
      badge: 'GPS Verified',
    },
    {
      id: 'TL-SCH-03',
      treeId: studentTree.id,
      timestamp: '2026-07-12T10:15:00Z',
      eventType: 'AI Verification',
      title: '📷 Month 1 Verification — 95% Same Tree',
      description: 'AI analyzed photo. Same-tree confidence 95%. Health: Healthy 🟢.',
      photoUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&auto=format&fit=crop&q=80',
      badge: 'Month 1 Check',
    },
    {
      id: 'TL-SCH-04',
      treeId: studentTree.id,
      timestamp: '2026-08-15T11:00:00Z',
      eventType: 'AI Verification',
      title: '📷 Month 2 Verification — 93% Same Tree',
      description: 'Vigorous leaf growth. Health: Healthy 🟢. Evidence quality: High.',
      photoUrl: studentTree.latestPhotoUrl,
      badge: 'Month 2 Check',
    }
  );

  // Generate 104 additional trees (Total: 105 trees) across projects
  const projectList = SEED_PROJECTS;
  const projectTreeCounts = [35, 28, 16, 12, 13]; // matches 104

  let globalTreeIndex = 1;

  projectList.forEach((proj, pIdx) => {
    const count = projectTreeCounts[pIdx];
    const centerLat = proj.geography.centerLat;
    const centerLng = proj.geography.centerLng;

    for (let i = 0; i < count; i++) {
      globalTreeIndex++;
      const paddedNum = globalTreeIndex.toString().padStart(8, '0');
      const stateCode = proj.geography.state === 'Karnataka' ? 'KA' : 'TN';
      const distCode = proj.geography.district.substring(0, 3).toUpperCase();
      const treeCode = `TREE-${stateCode}-${distCode}-${paddedNum}`;

      // Jitter coords by 0.001 - 0.02 deg (~100m to 2km)
      const latOffset = (Math.random() - 0.5) * 0.035;
      const lngOffset = (Math.random() - 0.5) * 0.035;
      const lat = Math.round((centerLat + latOffset) * 100000) / 100000;
      const lng = Math.round((centerLng + lngOffset) * 100000) / 100000;

      const speciesMeta = SPECIES_LIST[(globalTreeIndex + i) % SPECIES_LIST.length];

      // Distribute statuses realistically
      let status: any = 'Verified Alive';
      let health: any = 'Healthy';
      let evidenceQuality: any = 'High';
      let photoSet = PHOTO_SAMPLES.healthyNeem;
      let checkInCount = Math.floor(2 + Math.random() * 2); // 2 or 3 check-ins
      let ageMonths = 3;

      if (i % 25 === 23) {
        // Dead tree case
        status = 'Dead';
        health = 'Dead / Missing';
        evidenceQuality = 'High';
        photoSet = PHOTO_SAMPLES.deadTree;
      } else if (i % 25 === 21) {
        // Missing tree case
        status = 'Missing';
        health = 'Dead / Missing';
        evidenceQuality = 'Medium';
        photoSet = PHOTO_SAMPLES.deadTree;
      } else if (i % 14 === 0) {
        // Stressed / Needs attention
        status = 'Needs Attention';
        health = 'Moderate Stress';
        evidenceQuality = 'High';
        photoSet = PHOTO_SAMPLES.stressedTree;
      } else if (i % 20 === 18) {
        // Poor Health
        status = 'Poor Health';
        health = 'Poor Health';
        evidenceQuality = 'Medium';
        photoSet = PHOTO_SAMPLES.stressedTree;
      } else if (i % 16 === 7) {
        // Verification Pending
        status = 'Verification Pending';
        health = 'Healthy';
        evidenceQuality = 'Medium';
        checkInCount = 1;
      } else if (i % 30 === 11) {
        // Verification Exception (e.g. GPS mismatch or duplicate photo)
        status = 'Verification Exception';
        health = 'Healthy';
        evidenceQuality = 'Low';
      }

      const baselineUrl = photoSet[0] || PHOTO_SAMPLES.healthySapling[0];
      const latestUrl = photoSet[photoSet.length - 1] || baselineUrl;
      const planter = i % 2 === 0 ? SEED_USERS[0] : SEED_USERS[3]; // Ravi or Priya
      const caretaker = planter;

      const tree: Tree = {
        id: `TREE-${globalTreeIndex}`,
        treeCode,
        projectId: proj.id,
        projectName: proj.name,
        organisationId: proj.organisationId,
        organisationName: proj.organisationName,
        species: speciesMeta.species,
        commonName: speciesMeta.common,
        scientificName: speciesMeta.scientific,
        plantedDate: '2026-06-05',
        latitude: lat,
        longitude: lng,
        gpsAccuracyMeters: Math.floor(4 + Math.random() * 6),
        planterId: planter.id,
        planterName: planter.name,
        caretakerId: caretaker.id,
        caretakerName: caretaker.name,
        landCategory: (proj.id === 'PRJ-SXG-04' ? 'School' : i % 3 === 0 ? 'Roadside' : 'Park') as any,
        status,
        currentHealth: health,
        evidenceQuality,
        baselinePhotoUrl: baselineUrl,
        latestPhotoUrl: latestUrl,
        lastVerifiedDate: status === 'Verification Pending' ? '2026-07-15' : '2026-08-20',
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${treeCode}`,
        notes: `Planted under ${proj.name}. Soil amended with organic compost and native mulch ring.`,
        ageMonths,
        checkInCount,
        createdAt: '2026-06-05T08:00:00Z',
      };
      trees.push(tree);

      // Add baseline photo
      const basePhoto: TreePhoto = {
        id: `PHT-${tree.id}-BASE`,
        treeId: tree.id,
        photoUrl: baselineUrl,
        capturedAt: '2026-06-05T08:15:00Z',
        latitude: lat,
        longitude: lng,
        gpsAccuracyMeters: tree.gpsAccuracyMeters,
        captureMethod: 'In-App Camera',
        photoType: 'Baseline',
        imageHash: `hash-${tree.id}-base`,
      };
      photos.push(basePhoto);

      // Add month 1 & 2 verifications if not pending
      if (status !== 'Verification Pending') {
        const isException = status === 'Verification Exception';
        const verifyLat = isException ? lat + 0.0015 : lat + (Math.random() - 0.5) * 0.0001;
        const verifyLng = isException ? lng + 0.0015 : lng + (Math.random() - 0.5) * 0.0001;
        const dist = isException ? 142 : Math.floor(4 + Math.random() * 12);

        const verify: Verification = {
          id: `VRF-${tree.id}-02`,
          treeId: tree.id,
          treeCode: tree.treeCode,
          photoId: `PHT-${tree.id}-M2`,
          photoUrl: latestUrl,
          verificationMonth: '2026-08',
          submittedAt: '2026-08-20T11:20:00Z',
          submittedByUserId: planter.id,
          submittedByUserName: planter.name,
          currentLat: verifyLat,
          currentLng: verifyLng,
          gpsDistanceMeters: dist,
          gpsToleranceMeters: proj.gpsToleranceMeters,
          gpsStatus: isException ? 'Mismatch' : 'Verified',
          gpsAccuracyMeters: 6,
          sameTreeConfidenceScore: isException ? 48 : Math.floor(88 + Math.random() * 9),
          sameTreeClassification: isException ? 'Low confidence' : 'High confidence',
          sameTreePersistentFeatures: [
            'Trunk bark texture and bifurcation aligns with baseline',
            'Surrounding background curb matches reference photo',
          ],
          speciesDetected: speciesMeta.species,
          speciesConfidenceScore: 92,
          healthAssessment: health,
          healthIndicators: {
            foliageDensity: health === 'Healthy' ? 'Dense / Normal' : 'Sparse / Defoliated',
            canopyCondition: health === 'Healthy' ? 'Vibrant Green' : 'Moderate Wilting / Yellowing',
            trunkCondition: 'Intact & Sturdy',
            growthObservation: 'Stable seasonal canopy expansion.',
          },
          evidenceQuality,
          verificationStatus: isException ? 'Pending Review' : 'Auto-Approved',
          flags: isException ? [`Location Mismatch (${dist}m > ${proj.gpsToleranceMeters}m limit)`, 'Low same-tree confidence (48%)'] : [],
        };
        verifications.push(verify);

        // If exception, put into Review Queue
        if (isException) {
          reviewQueue.push({
            id: `REV-${tree.id}`,
            treeId: tree.id,
            treeCode: tree.treeCode,
            verificationId: verify.id,
            species: tree.species,
            projectName: proj.name,
            organisationName: proj.organisationName,
            submittedAt: '2026-08-20T11:25:00Z',
            submittedByName: planter.name,
            flags: [`GPS Mismatch (${dist}m > ${proj.gpsToleranceMeters}m)`, 'Same-Tree Similarity Low (48%)'],
            baselinePhotoUrl: baselineUrl,
            currentPhotoUrl: latestUrl,
            registeredCoords: { lat: tree.latitude, lng: tree.longitude },
            currentCoords: { lat: verifyLat, lng: verifyLng },
            distanceMeters: dist,
            gpsToleranceMeters: proj.gpsToleranceMeters,
            aiSameTreeConfidence: 48,
            aiHealthAssessment: health,
            aiSpeciesDetected: speciesMeta.species,
            status: 'Pending',
          });
        }
      } else {
        // Notification for pending tree
        notifications.push({
          id: `NOTIF-${tree.id}`,
          userId: planter.id,
          treeId: tree.id,
          treeCode: tree.treeCode,
          title: '🌱 Monthly Tree Check-in Due',
          message: `${tree.treeCode} (${speciesMeta.species}) needs its monthly photograph. Please check in today.`,
          type: 'monthly_reminder',
          sentAt: '2026-08-15T09:00:00Z',
          read: false,
          priority: 'normal',
        });
      }

      // Timeline events
      timelineEvents.push(
        {
          id: `TL-${tree.id}-01`,
          treeId: tree.id,
          timestamp: tree.createdAt,
          eventType: 'Planted',
          title: `🌱 Tree Planted by ${planter.name}`,
          description: `${speciesMeta.species} planted under project ${proj.name}. Baseline photo & GPS geotagged.`,
          photoUrl: baselineUrl,
          badge: 'Planted',
          actorName: planter.name,
        },
        {
          id: `TL-${tree.id}-02`,
          treeId: tree.id,
          timestamp: '2026-07-15T10:00:00Z',
          eventType: 'AI Verification',
          title: '📷 Month 1 Verification — Verified Alive',
          description: 'GPS verified. Same-tree confidence 94%. Health assessed as Healthy 🟢.',
          badge: 'Verified',
        }
      );
    }
  });

  return {
    organisations: SEED_ORGANISATIONS,
    projects: SEED_PROJECTS,
    users: SEED_USERS,
    trees,
    photos,
    verifications,
    timelineEvents,
    reviewQueue,
    notifications,
  };
}
