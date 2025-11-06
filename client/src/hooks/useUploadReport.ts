import { useMutation } from '@tanstack/react-query';
import type { UseMutationResult } from '@tanstack/react-query';
import api from '@/lib/api';
import type { PatientReport } from '@/types/api';

type UploadVars = { file: File; patientId: string; hospitalId: string };

async function uploadReport({ file, patientId, hospitalId }: UploadVars): Promise<PatientReport> {
  const form = new FormData();
  form.append('file', file);
  form.append('patientId', patientId);
  form.append('hospitalId', hospitalId);

  try {
    const { data } = await api.post<PatientReport>('/api/reports/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  } catch (err: any) {
    throw new Error(err?.response?.data?.error || err?.message || 'Failed to upload report');
  }
}

export function useUploadReport(): UseMutationResult<PatientReport, Error, UploadVars> {
  return useMutation<PatientReport, Error, UploadVars>({
    mutationFn: uploadReport,
  });
}


