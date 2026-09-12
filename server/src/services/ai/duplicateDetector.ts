import crypto from 'crypto';
import { TreePhoto } from '../../types.js';

export interface DuplicateCheckResult {
  isDuplicateSuspected: boolean;
  duplicateType?: 'Identical File Reused' | 'Cross-Tree Reused' | 'Old Photo Resubmitted';
  confidence: number;
  matchedPhotoId?: string;
  matchedTreeId?: string;
  flagMessage?: string;
}

/**
 * Computes a fast SHA-256 or perceptual signature from an image string or buffer
 */
export function generatePhotoFingerprint(data: string | Buffer): string {
  return crypto.createHash('sha256').update(data).digest('hex').substring(0, 32);
}

/**
 * Detects duplicate or reused photographs against historical database photos
 */
export function detectDuplicatePhoto(
  newPhotoHash: string,
  currentTreeId: string,
  existingPhotos: TreePhoto[]
): DuplicateCheckResult {
  if (!newPhotoHash) {
    return { isDuplicateSuspected: false, confidence: 0 };
  }

  for (const photo of existingPhotos) {
    if (photo.imageHash && photo.imageHash === newPhotoHash) {
      if (photo.treeId !== currentTreeId) {
        return {
          isDuplicateSuspected: true,
          duplicateType: 'Cross-Tree Reused',
          confidence: 96,
          matchedPhotoId: photo.id,
          matchedTreeId: photo.treeId,
          flagMessage: `Potential cross-tree photo reuse — same image matches Tree ${photo.treeId}. Review required.`,
        };
      } else {
        return {
          isDuplicateSuspected: true,
          duplicateType: 'Old Photo Resubmitted',
          confidence: 99,
          matchedPhotoId: photo.id,
          matchedTreeId: photo.treeId,
          flagMessage: 'Potential duplicate / reused photograph from previous check-in — review required.',
        };
      }
    }
  }

  return {
    isDuplicateSuspected: false,
    confidence: 0,
  };
}
