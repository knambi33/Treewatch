import React, { useState } from 'react';
import { X, QrCode, Search, TreePine, ArrowRight } from 'lucide-react';
import { Tree } from '../../types';

interface QRScannerModalProps {
  trees: Tree[];
  onSelectTree: (tree: Tree) => void;
  onClose: () => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ trees, onSelectTree, onClose }) => {
  const [manualCode, setManualCode] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);
    const cleaned = manualCode.trim().toLowerCase();
    if (!cleaned) return;

    const matched = trees.find(
      (t) => t.treeCode.toLowerCase() === cleaned || t.id.toLowerCase() === cleaned
    );

    if (matched) {
      onSelectTree(matched);
      onClose();
    } else {
      setSearchError(`Tree with code "${manualCode}" not found.`);
    }
  };

  const pickSample = (tree: Tree) => {
    onSelectTree(tree);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-stone-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900">Scan or Search Tree ID</h3>
            <p className="text-xs text-stone-500">Instant lookup from physical QR tag or Tree ID</p>
          </div>
        </div>

        {/* Camera simulation viewport */}
        <div className="relative aspect-square w-full max-w-[260px] mx-auto bg-stone-950 rounded-2xl overflow-hidden border-2 border-dashed border-emerald-500 flex flex-col items-center justify-center p-4 mb-4">
          <div className="w-40 h-40 border-2 border-emerald-400 rounded-xl relative flex items-center justify-center">
            <div className="absolute inset-x-0 top-0 h-0.5 bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
            <QrCode className="w-16 h-16 text-stone-600 opacity-60" />
          </div>
          <span className="text-[11px] text-emerald-300 mt-3 font-medium">
            Point camera at tree QR code
          </span>
        </div>

        {/* Manual lookup input */}
        <form onSubmit={handleSearch} className="space-y-2">
          <label className="text-xs font-semibold text-stone-700 block">
            Or enter Tree ID manually:
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="e.g. TREE-TN-CHN-00001002 or SCH-00125"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1 shadow-sm transition-all"
            >
              <span>Open</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          {searchError && (
            <p className="text-xs text-rose-600 font-medium">{searchError}</p>
          )}
        </form>

        {/* Quick Sample tags to click */}
        <div className="mt-4 pt-3 border-t border-stone-100">
          <p className="text-[11px] font-medium text-stone-500 mb-2">Simulate scanning a tag:</p>
          <div className="flex flex-wrap gap-1.5">
            {trees.slice(0, 4).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => pickSample(t)}
                className="px-2.5 py-1 bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-stone-200 rounded-lg text-[11px] font-mono font-medium transition-all"
              >
                {t.treeCode}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
