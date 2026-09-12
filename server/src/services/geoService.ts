import { GpsStatus } from '../types.js';

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
}

export interface GpsVerificationResult {
  distanceMeters: number;
  toleranceMeters: number;
  status: GpsStatus;
  isVerified: boolean;
  message: string;
  flag?: string;
}

/**
 * Computes geodesic distance between two points using the Haversine formula
 * Returns distance in meters
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Radius of the Earth in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // 1 decimal place
}

/**
 * Validates current GPS coordinates against registered tree coordinates and configured tolerance
 */
export function verifyGpsCoordinates(
  registered: GeoLocation,
  current: GeoLocation,
  toleranceMeters: number = 25
): GpsVerificationResult {
  if (
    typeof registered.latitude !== 'number' ||
    typeof registered.longitude !== 'number' ||
    typeof current.latitude !== 'number' ||
    typeof current.longitude !== 'number'
  ) {
    return {
      distanceMeters: 0,
      toleranceMeters,
      status: 'Unavailable',
      isVerified: false,
      message: 'GPS location coordinates unavailable',
      flag: 'GPS Unavailable - coordinates not recorded',
    };
  }

  // Check accuracy: if current GPS accuracy is worse than 35m, flag low accuracy
  const currentAccuracy = current.accuracyMeters ?? 10;
  if (currentAccuracy > 35) {
    const dist = calculateHaversineDistance(
      registered.latitude,
      registered.longitude,
      current.latitude,
      current.longitude
    );
    return {
      distanceMeters: dist,
      toleranceMeters,
      status: 'Low Accuracy',
      isVerified: dist <= toleranceMeters,
      message: `Low GPS accuracy (±${Math.round(currentAccuracy)}m). Distance: ${dist}m`,
      flag: `Low GPS Accuracy (±${Math.round(currentAccuracy)}m, threshold 35m)`,
    };
  }

  const distance = calculateHaversineDistance(
    registered.latitude,
    registered.longitude,
    current.latitude,
    current.longitude
  );

  if (distance <= toleranceMeters) {
    return {
      distanceMeters: distance,
      toleranceMeters,
      status: 'Verified',
      isVerified: true,
      message: `LOCATION VERIFIED ✓ (${distance}m from registered coordinates)`,
    };
  } else {
    return {
      distanceMeters: distance,
      toleranceMeters,
      status: 'Mismatch',
      isVerified: false,
      message: `LOCATION MISMATCH ⚠ (${distance}m exceeds ${toleranceMeters}m limit)`,
      flag: `Location Mismatch (${distance}m > ${toleranceMeters}m)`,
    };
  }
}
