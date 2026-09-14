import React, { useState, useEffect } from 'react';
import { Settings, X, Save, RefreshCw, Sliders, ShieldCheck } from 'lucide-react';
import { fetchAdminScoringConfig, updateAdminScoringConfig } from '../../api';
import { AdminScoringConfig } from '../../types';

interface AdminConfigModalProps {
  onClose: () => void;
  onConfigSaved?: () => void;
}

export const AdminConfigModal: React.FC<AdminConfigModalProps> = ({
  onClose,
  onConfigSaved,
}) => {
  const [config, setConfig] = useState<AdminScoringConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    fetchAdminScoringConfig()
      .then((res) => {
        if (res.success) setConfig(res.config);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    setStatusMsg('');
    try {
      const res = await updateAdminScoringConfig(config);
      if (res.success) {
        setStatusMsg('Configuration updated and all TreeView Indices recomputed live!');
        if (onConfigSaved) onConfigSaved();
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch (err) {
      console.error(err);
      setStatusMsg('Failed to update configuration.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-stone-900">
                TreeView Index™ Rules & Governance Tuning
              </h3>
              <p className="text-xs text-stone-500">Live configuration thresholds without code redeployment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-stone-500">
            Loading scoring configuration...
          </div>
        ) : config ? (
          <div className="space-y-4 text-xs">
            {/* Group 1: Anti-Gaming & Verification Rules */}
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-3">
              <h4 className="font-extrabold text-stone-900 text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Anti-Gaming & Geofence Tolerances</span>
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">
                    GPS Radius Tolerance (meters)
                  </label>
                  <input
                    type="number"
                    value={config.gpsToleranceMetersDefault}
                    onChange={(e) =>
                      setConfig({ ...config, gpsToleranceMetersDefault: parseInt(e.target.value, 10) || 25 })
                    }
                    className="w-full px-3 py-1.5 border border-stone-300 rounded-xl bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">
                    Monitoring Grace Period (days)
                  </label>
                  <input
                    type="number"
                    value={config.monitoringGracePeriodDays}
                    onChange={(e) =>
                      setConfig({ ...config, monitoringGracePeriodDays: parseInt(e.target.value, 10) || 7 })
                    }
                    className="w-full px-3 py-1.5 border border-stone-300 rounded-xl bg-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Group 2: TreeView Established Milestone */}
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-3">
              <h4 className="font-extrabold text-stone-900 text-xs flex items-center gap-1.5">
                <span>🏆 TreeView Established™ Milestone Criteria</span>
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">
                    Minimum Age (months)
                  </label>
                  <input
                    type="number"
                    value={config.establishmentMinAgeMonths}
                    onChange={(e) =>
                      setConfig({ ...config, establishmentMinAgeMonths: parseInt(e.target.value, 10) || 36 })
                    }
                    className="w-full px-3 py-1.5 border border-stone-300 rounded-xl bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">
                    Minimum Valid Checks Required
                  </label>
                  <input
                    type="number"
                    value={config.establishmentMinVerifications}
                    onChange={(e) =>
                      setConfig({ ...config, establishmentMinVerifications: parseInt(e.target.value, 10) || 24 })
                    }
                    className="w-full px-3 py-1.5 border border-stone-300 rounded-xl bg-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Group 3: Bayesian Shrinkage Constant k */}
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-3">
              <h4 className="font-extrabold text-stone-900 text-xs flex items-center gap-1.5">
                <span>⚖️ Bayesian Shrinkage & Fairness Parameters</span>
              </h4>

              <div>
                <label className="text-[11px] font-bold text-stone-600 block mb-1">
                  Confidence Constant k (default 1,000)
                </label>
                <input
                  type="number"
                  value={config.bayesianConfidenceConstantK}
                  onChange={(e) =>
                    setConfig({ ...config, bayesianConfidenceConstantK: parseInt(e.target.value, 10) || 1000 })
                  }
                  className="w-full px-3 py-1.5 border border-stone-300 rounded-xl bg-white font-mono"
                />
                <p className="text-[10px] text-stone-500 mt-1">
                  Higher k prevents small-sample distortions by gently pulling scores toward the national average.
                </p>
              </div>
            </div>

            {statusMsg && (
              <div className="p-3 bg-emerald-50 text-emerald-900 font-bold rounded-xl border border-emerald-200 text-center animate-fadeIn">
                {statusMsg}
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-stone-600 font-bold hover:bg-stone-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-xs flex items-center gap-1.5 disabled:opacity-50"
              >
                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save & Recalculate Live</span>
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
