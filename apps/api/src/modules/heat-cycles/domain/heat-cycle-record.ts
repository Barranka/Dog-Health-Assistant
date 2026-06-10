export interface HeatCycleRecord {
  id: string;
  dogId: string;
  startDate: Date;
  endDate: Date | null;
  duration: number | null;
  status: 'active' | 'completed';
  predicted: boolean;
  notes: string | null;
  createdAt: Date;
}
