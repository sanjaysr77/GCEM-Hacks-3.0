import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUploadReport } from '@/hooks/useUploadReport';

export default function UploadPage() {
  const [patientId, setPatientId] = useState('');
  const [hospitalId, setHospitalId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const { mutateAsync, isPending, error } = useUploadReport();
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !patientId || !hospitalId) return;
    const pid = patientId.trim();
    const hid = hospitalId.trim();
    const res = await mutateAsync({ file, patientId: pid, hospitalId: hid });
    setResult(res);
    // Navigate to Reports and signal a refresh
    navigate('/reports', { state: { refresh: Date.now(), patientId: pid } });
  }

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-semibold">Upload Report</h1>
      <form onSubmit={onSubmit} className="grid gap-3 max-w-md">
        <input
          className="block w-full text-sm text-slate-700 file:mr-4 file:rounded file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-blue-700 border rounded px-3 py-2"
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="Patient ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="Hospital ID"
          value={hospitalId}
          onChange={(e) => setHospitalId(e.target.value)}
        />
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
          type="submit"
          disabled={isPending || !file || !patientId || !hospitalId}
        >
          {isPending ? 'Uploading…' : 'Upload'}
        </button>
      </form>
      {error && <p className="text-sm text-red-600">{(error as any).message}</p>}
      {result && (
        <pre className="bg-slate-50 p-3 rounded border overflow-auto">{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
}


