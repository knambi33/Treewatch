import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Download, Printer, QrCode } from 'lucide-react';
import { Tree } from '../../types';

interface QRViewerModalProps {
  tree: Tree;
  onClose: () => void;
}

export const QRViewerModal: React.FC<QRViewerModalProps> = ({ tree, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-stone-200 relative text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
          <QrCode className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-stone-900">TreeView ID Tag</h3>
        <p className="text-xs text-stone-700 mt-0.5">Attach near tree for instant profile verification • Every tree counts, Verified Live</p>

        {/* QR Card Container */}
        <div id="printable-qr-tag" className="my-5 p-4 bg-stone-50 border-2 border-dashed border-emerald-300 rounded-2xl flex flex-col items-center">
          <div className="bg-white p-3 rounded-xl shadow-xs border border-stone-200 mb-3">
            <QRCodeSVG
              value={`https://treeview.in/tree/${tree.treeCode}`}
              size={180}
              level="H"
              includeMargin={true}
            />
          </div>

          <div className="font-mono text-sm font-bold text-stone-900 tracking-wider">
            {tree.treeCode}
          </div>
          <div className="text-xs font-semibold text-emerald-800 mt-0.5">
            {tree.species} ({tree.commonName})
          </div>
          <div className="text-[10px] text-stone-600 mt-1">
            📍 {tree.latitude.toFixed(4)}° N, {tree.longitude.toFixed(4)}° E (±{tree.gpsAccuracyMeters}m)
          </div>
          <div className="text-[9px] text-stone-600 mt-1 uppercase tracking-wider font-semibold">
            {tree.projectName}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Physical Tag</span>
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
