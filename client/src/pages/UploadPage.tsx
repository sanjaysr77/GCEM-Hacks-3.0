import { useState } from 'react';
import { useUploadReport } from '@/hooks/useUploadReport';

export default function UploadPage() {
  const [patientId, setPatientId] = useState('');
  const [hospitalId, setHospitalId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const { mutateAsync, isPending, error } = useUploadReport();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !patientId || !hospitalId) return;
    const res = await mutateAsync({ file, patientId, hospitalId });
    setResult(res);
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <h1>Upload Report</h1>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, maxWidth: 480 }}>
        <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <input placeholder="Patient ID" value={patientId} onChange={(e) => setPatientId(e.target.value)} />
        <input placeholder="Hospital ID" value={hospitalId} onChange={(e) => setHospitalId(e.target.value)} />
        <button type="submit" disabled={isPending || !file || !patientId || !hospitalId}>
          {isPending ? 'Uploading…' : 'Upload'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{(error as any).message}</p>}
      {result && (
        <pre style={{ background: '#f6f6f6', padding: 12, borderRadius: 6 }}>{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
}


