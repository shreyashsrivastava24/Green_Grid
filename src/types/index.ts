export type PageId =
  | 'login'
  | 'dashboard'
  | 'facilities'
  | 'facility-detail'
  | 'analytics'
  | 'billing'
  | 'renewable'
  | 'alerts'
  | 'recommendations'
  | 'settings';

export type FacilityStatus = 'Normal' | 'High Usage' | 'Critical';

export interface Facility {
  id: string;
  name: string;
  location: string;
  type: string;
  currentConsumptionKw: number;
  monthlyConsumptionKwh: number;
  estimatedCostInr: number;
  status: FacilityStatus;
  solarCapacityKwp: number;
  peakThresholdKw: number;
  peakUsageWindow: string;
  gridSharePercent: number;
  renewableSharePercent: number;
  floorAreaSqFt: number;
  monthlySavingsInr: number;
}

export interface ConsumptionDataPoint {
  time: string;
  grid: number;
  solar: number;
  total: number;
  cost: number;
}

export interface FacilityComparisonPoint {
  name: string;
  consumption: number;
  cost: number;
  solar: number;
  efficiency: number; // kWh per sq ft
}

export interface MonthlyCostPoint {
  month: string;
  gridCost: number;
  solarSavings: number;
  netCost: number;
  budget: number;
}

export type AlertSeverity = 'Critical' | 'Warning' | 'Info';
export type AlertStatus = 'Active' | 'Acknowledged' | 'Resolved';

export interface Alert {
  id: string;
  title: string;
  facilityId: string;
  facilityName: string;
  severity: AlertSeverity;
  status: AlertStatus;
  timestamp: string;
  currentValue: string;
  thresholdValue: string;
  description: string;
  metric: string;
}

export type RecommendationPriority = 'High' | 'Medium' | 'Low';

export interface Recommendation {
  id: string;
  title: string;
  facilityId: string;
  facilityName: string;
  priority: RecommendationPriority;
  category: 'Peak Shaving' | 'HVAC Optimization' | 'Lighting' | 'Solar & Battery' | 'Equipment Schedule';
  estimatedEnergySavingKwh: number;
  estimatedSavingPercent: number;
  estimatedCostSavingInr: number;
  reason: string;
  description: string;
  implementationEffort: 'Immediate (Automated)' | 'Low (1-2 days)' | 'Medium (1 week)' | 'High (Hardware)';
  isApplied: boolean;
}

export interface Bill {
  id: string;
  invoiceNo: string;
  billingPeriod: string;
  dueDate: string;
  facilityName: string;
  unitsConsumedKwh: number;
  solarGeneratedKwh: number;
  netBilledUnitsKwh: number;
  baseRatePerKwh: number;
  baseEnergyChargesInr: number;
  peakHourSurchargesInr: number;
  fixedDemandChargesInr: number;
  solarCreditInr: number;
  taxesAndDutiesInr: number;
  totalAmountInr: number;
  status: 'Paid' | 'Due' | 'Overdue';
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  department: string;
  organization: string;
  avatarUrl: string;
  phone: string;
}
