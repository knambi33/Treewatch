import { AdminScoringConfig } from '../types.js';

class AdminConfigService {
  private config: AdminScoringConfig = {
    gpsToleranceMetersDefault: 25,
    gpsAccuracyMaxMeters: 50,
    monitoringGracePeriodDays: 7,
    aiSimilarityThresholdHigh: 85,
    aiSimilarityThresholdModerate: 70,
    establishmentMinAgeMonths: 36,
    establishmentMinVerifications: 24,
    bayesianConfidenceConstantK: 1000,
    minSampleNational: 25000,
    minSampleState: 5000,
    minSampleDistrict: 500,
    minSampleLocal: 100,
    methodologyVersion: 'TreeScore v1.0',
  };

  public getConfig(): AdminScoringConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<AdminScoringConfig>): AdminScoringConfig {
    this.config = {
      ...this.config,
      ...newConfig,
    };
    console.log(`[AdminConfigService] Updated scoring configuration. Version: ${this.config.methodologyVersion}`);
    return this.getConfig();
  }
}

export const adminConfig = new AdminConfigService();
