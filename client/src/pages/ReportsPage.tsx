import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useReports } from '@/hooks/useReports';

export default function ReportsPage() {
  const location = useLocation() as any;
  const incomingPatientId: string | undefined = useMemo(() => location?.state?.patientId, [location?.state]);
  const [patientId, setPatientId] = useState(incomingPatientId || '');
  useEffect(() => {
    if (incomingPatientId && incomingPatientId !== patientId) {
      setPatientId(incomingPatientId);
    }
  }, [incomingPatientId]);
  const { data, error, isLoading } = useReports(patientId, { enabled: !!patientId });

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-semibold">Reports</h1>
      <div className="flex gap-2">
        <input
          className="border rounded px-3 py-2 w-64 focus:outline-none focus:ring focus:ring-blue-200"
          placeholder="Enter patientId"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
        />
        <button
          className="px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
          disabled={!patientId}
        >
          Load
        </button>
      </div>

      {isLoading && <p className="text-sm text-slate-500">Loading…</p>}
      {error && <p className="text-sm text-red-600">{error.message}</p>}

      <ul className="grid gap-3 p-0 list-none">
        {(data ?? []).map((r) => (
          <li key={r._id ?? `${r.reportHash}-${r.uploadedAt}`} className="border rounded p-4">
            <div><span className="font-medium">Date:</span> {new Date(r.uploadedAt).toLocaleString()}</div>
            <div className="break-all"><span className="font-medium">Report Hash:</span> {r.reportHash}</div>
            <div className="break-all"><span className="font-medium">Hedera Tx:</span> {r.hederaTxId ?? '—'}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}


