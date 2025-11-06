import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import api from '@/lib/api';
import type { PatientReport } from '@/types/api';

type ReportsResponse = { status: 'success'; reports: PatientReport[] };
type SummaryResponse = { textCorpus: string; healthMetrics: Record<string, string | number | null> };

export async function fetchReports(patientId: string): Promise<PatientReport[]> {
  try {
    const pid = patientId.trim();
    const { data } = await api.get<ReportsResponse>(`/api/reports/${encodeURIComponent(pid)}`);
    if (data?.status === 'success' && Array.isArray(data.reports)) return data.reports;
    throw new Error('Unexpected response while fetching reports');
  } catch (err: any) {
    throw new Error(err?.response?.data?.error || err?.message || 'Failed to fetch reports');
  }
}

export async function fetchSummary(patientId: string): Promise<SummaryResponse> {
  try {
    const pid = patientId.trim();
    const { data } = await api.get<SummaryResponse>(`/api/reports/${encodeURIComponent(pid)}/summary`);
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
    queryKey: ['reports', (patientId || '').trim()],
    queryFn: () => fetchReports(patientId),
    enabled: !!patientId && (options?.enabled ?? true),
    staleTime: options?.staleTime ?? 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });
}

export function useReportsSummary(
  patientId: string,
  options?: { enabled?: boolean; staleTime?: number }
): UseQueryResult<SummaryResponse, Error> {
  return useQuery<SummaryResponse, Error>({
    queryKey: ['reports', (patientId || '').trim(), 'summary'],
    queryFn: () => fetchSummary(patientId),
    enabled: !!patientId && (options?.enabled ?? true),
    staleTime: options?.staleTime ?? 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });
}


