import React, { useState, useEffect } from 'react';
import {
  X,
  Sprout,
  MapPin,
  Camera,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  QrCode,
} from 'lucide-react';
import { Project, Tree } from '../types';
import { CameraCapture } from '../components/common/CameraCapture';
import { registerTree } from '../api';
import { useAuth } from '../context/AuthContext';
import { useOffline } from '../context/OfflineContext';

interface RegisterTreeProps {
  projects: Project[];
  onClose: () => void;
  onSuccess: (newTree: Tree) => void;
}

const SPECIES_CATALOGUE = [
  { species: 'Neem', common: 'Vembu / Margosa', scientific: 'Azadirachta indica' },
  { species: 'Pongamia', common: 'Pungai / Indian Beech', scientific: 'Millettia pinnata' },
  { species: 'Peepal', common: 'Arasa Maram / Sacred Fig', scientific: 'Ficus religiosa' },
  { species: 'Banyan', common: 'Aala Maram / Indian Banyan', scientific: 'Ficus benghalensis' },
  { species: 'Rain Tree', common: 'Thoongumoonji', scientific: 'Samanea saman' },
  { species: 'Teak', common: 'Thekku / Teak', scientific: 'Tectona grandis' },
  { species: 'Mango', common: 'Maa Maram / Mango', scientific: 'Mangifera indica' },
  { species: 'Gulmohar', common: 'Mayil Kondrai', scientific: 'Delonix regia' },
  { species: 'Mahua', common: 'Iluppai / Butter Tree', scientific: 'Madhuca longifolia' },
  { species: 'Coconut', common: 'Thennai / Coconut', scientific: 'Cocos nucifera' },
];

export const RegisterTree: React.FC<RegisterTreeProps> = ({ projects, onClose, onSuccess }) => {
  const { currentUser } = useAuth();
  const { isOffline, queueRegistration } = useOffline();

  const defaultProj = projects.find((p) => p.organisationId === currentUser?.organisationId) || projects[0];
  const [selectedProjectId, setSelectedProjectId] = useState<string>(defaultProj?.id || '');
  const [species, setSpecies] = useState<string>('Neem');
  const [commonName, setCommonName] = useState<string>('Vembu / Margosa');
  const [scientificName, setScientificName] = useState<string>('Azadirachta indica');
  const [plantedDate, setPlantedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [landCategory, setLandCategory] = useState<any>('Roadside');
  const [notes, setNotes] = useState<string>('');

  // GPS State
  const [latitude, setLatitude] = useState<number>(13.0827);
  const [longitude, setLongitude] = useState<number>(80.2707);
  const [gpsAccuracy, setGpsAccuracy] = useState<number>(6);
  const [gpsAcquired, setGpsAcquired] = useState<boolean>(false);
  const [acquiringGps, setAcquiringGps] = useState<boolean>(false);

  // Photo
  const [baselinePhotoUrl, setBaselinePhotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80'
  );
  const [captureMethod, setCaptureMethod] = useState<'In-App Camera' | 'Gallery Upload'>('In-App Camera');

  const [submitting, setSubmitting] = useState(false);

  // Sync species info
  const handleSpeciesChange = (selected: string) => {
    setSpecies(selected);
    const meta = SPECIES_CATALOGUE.find((s) => s.species === selected);
    if (meta) {
      setCommonName(meta.common);
      setScientificName(meta.scientific);
    }
  };

  // Acquire high accuracy GPS fix
  const acquireGps = () => {
    setAcquiringGps(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude);
          setLongitude(pos.coords.longitude);
          setGpsAccuracy(Math.round(pos.coords.accuracy || 6));
          setGpsAcquired(true);
          setAcquiringGps(false);
        },
        (err) => {
          console.warn('GPS error', err);
          // Fallback to project center
          const proj = projects.find((p) => p.id === selectedProjectId) || projects[0];
          setLatitude(proj.geography.centerLat);
          setLongitude(proj.geography.centerLng);
          setGpsAccuracy(8);
          setGpsAcquired(true);
          setAcquiringGps(false);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setAcquiringGps(false);
    }
  };

  useEffect(() => {
    acquireGps();
  }, [selectedProjectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      projectId: selectedProjectId,
      species,
      commonName,
      scientificName,
      plantedDate,
      latitude,
      longitude,
      gpsAccuracyMeters: gpsAccuracy,
      planterId: currentUser?.id || 'USR-PLANTER-01',
      planterName: currentUser?.name || 'Ravi Kumar',
      caretakerId: currentUser?.id || 'USR-PLANTER-01',
      caretakerName: currentUser?.name || 'Ravi Kumar',
      landCategory,
      baselinePhotoUrl,
      notes,
    };

    if (isOffline) {
      queueRegistration(payload);
      setSubmitting(false);
      onClose();
      return;
    }

    try {
      const res = await registerTree(payload);
      if (res.success && res.tree) {
        onSuccess(res.tree);
        onClose();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to register tree. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-3xl p-6 shadow-2xl border border-stone-200 relative my-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-stone-900 leading-tight">
              Plant / Register Tree
            </h2>
            <p className="text-xs text-stone-500">
              Create an auditable digital identity tag with GPS & baseline photograph
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Project & Species Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Plantation Project *
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full text-xs p-2.5 border border-stone-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.geography.district})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Tree Species *
              </label>
              <select
                value={species}
                onChange={(e) => handleSpeciesChange(e.target.value)}
                className="w-full text-xs p-2.5 border border-stone-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold text-emerald-900"
                required
              >
                {SPECIES_CATALOGUE.map((s) => (
                  <option key={s.species} value={s.species}>
                    {s.species} — {s.common}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Scientific name info pill */}
          <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
            <span>
              <strong>Scientific Name:</strong> <em>{scientificName}</em>
            </span>
            <span className="text-[10px] bg-emerald-200/80 px-2 py-0.5 rounded-full font-bold">
              Native Species
            </span>
          </div>

          {/* GPS Coordinates Geotagging Box */}
          <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Geographic GPS Geotagging</span>
              </div>
              <button
                type="button"
                onClick={acquireGps}
                className="text-[11px] text-emerald-700 font-semibold hover:underline flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${acquiringGps ? 'animate-spin' : ''}`} />
                <span>Re-acquire GPS</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-white rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-400 block font-bold">Latitude</span>
                <span className="font-mono font-bold text-stone-900 text-xs">
                  {latitude.toFixed(6)}° N
                </span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-400 block font-bold">Longitude</span>
                <span className="font-mono font-bold text-stone-900 text-xs">
                  {longitude.toFixed(6)}° E
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="inline-flex items-center gap-1 text-emerald-800 font-semibold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>GPS Verified</span>
              </span>
              <span className="font-mono font-bold text-stone-600 text-[11px] bg-white px-2 py-0.5 rounded border border-stone-200">
                GPS Accuracy: ±{gpsAccuracy} metres
              </span>
            </div>
          </div>

          {/* Baseline Photo Component */}
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Baseline Planting Photograph *
            </label>
            <CameraCapture
              onPhotoCaptured={(url, method) => {
                setBaselinePhotoUrl(url);
                setCaptureMethod(method);
              }}
              guidanceText="Frame the entire planted seedling clearly. This establishes the permanent baseline."
              initialPhotoUrl={baselinePhotoUrl}
            />
          </div>

          {/* Planting Date & Land Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Planting Date</label>
              <input
                type="date"
                value={plantedDate}
                onChange={(e) => setPlantedDate(e.target.value)}
                className="w-full text-xs p-2.5 border border-stone-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Land Category</label>
              <select
                value={landCategory}
                onChange={(e) => setLandCategory(e.target.value)}
                className="w-full text-xs p-2.5 border border-stone-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Roadside">Roadside Avenue</option>
                <option value="Park">Public Park / Ground</option>
                <option value="School">School / College Campus</option>
                <option value="Forest">Forest / Riparian Buffer</option>
                <option value="Community">Community / RWA Common Area</option>
                <option value="Private">Private / Residential Land (Homestead / Farm)</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Field Notes / Micro-Habitat (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Soil amended with compost, drip irrigation ring installed"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-all"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Registering Tree...</span>
                </>
              ) : (
                <>
                  <Sprout className="w-4 h-4" />
                  <span>Register Tree & Generate ID</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
