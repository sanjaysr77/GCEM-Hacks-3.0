import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import api from '@/lib/api';
import type { PatientReport } from '@/types/api';

type ReportsResponse = { status: 'success'; reports: PatientReport[] };
type SummaryResponse = { textCorpus: string; healthMetrics: Record<string, string | number | null> };

export async function fetchReports(patientId: string): Promise<PatientReport[]> {
  try {
    const { data } = await api.get<ReportsResponse>(`/api/reports/${encodeURIComponent(patientId)}`);
    if (data?.status === 'success' && Array.isArray(data.reports)) return data.reports;
    throw new Error('Unexpected response while fetching reports');
  } catch (err: any) {
    throw new Error(err?.response?.data?.error || err?.message || 'Failed to fetch reports');
  }
}

export async function fetchSummary(patientId: string): Promise<SummaryResponse> {
  try {
    const { data } = await api.get<SummaryResponse>(`/api/reports/${encodeURIComponent(patientId)}/summary`);
    if (data && typeof data === 'object' && 'textCorpus' in data) return data;
    throw new Error('Unexpected response while fetching summary');
  } catch (err: any) {
    throw new Error(err?.response?.data?.error || err?.message || 'Failed to fetch summary');
  }
}

export function useReports(
  patientId: string,
  options?: { enabled?: boolean; staleTime?: number }
): UseQueryResult<PatientReport[], Error> {
  return useQuery<PatientReport[], Error>({
    queryKey: ['reports', patientId],
    queryFn: () => fetchReports(patientId),
    enabled: !!patientId && (options?.enabled ?? true),
    staleTime: options?.staleTime ?? 5 * 60 * 1000,
  });
}

export function useReportsSummary(
  patientId: string,
  options?: { enabled?: boolean; staleTime?: number }
): UseQueryResult<SummaryResponse, Error> {
  return useQuery<SummaryResponse, Error>({
    queryKey: ['reports', patientId, 'summary'],
    queryFn: () => fetchSummary(patientId),
    enabled: !!patientId && (options?.enabled ?? true),
    staleTime: options?.staleTime ?? 5 * 60 * 1000,
  });
}


