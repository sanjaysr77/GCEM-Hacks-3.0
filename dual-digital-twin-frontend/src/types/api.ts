export interface ClinicalMetric {
  value: string | number;
  unit?: string;
  normalRange?: string;
  organ?: string;
}

export interface EmotionHints {
  keywords: string[];
  inferredTone: string;
}

export interface ParsedData {
  diagnosisSummary?: string;
  remarks?: string;
  riskLevel?: 'Low' | 'Moderate' | 'High';
  contextText?: string;
  emotionHints?: EmotionHints;
  clinicalMetrics?: Record<string, ClinicalMetric>;
}

export interface PatientReport {
  _id?: string;
  patientId: string;
  hospitalId?: string;
  reportHash: string;
  hederaTxId?: string | null;
  uploadedAt: string;
  parsedData: ParsedData;
}


