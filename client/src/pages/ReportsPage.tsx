import { useState } from 'react';
import { useReports } from '@/hooks/useReports';

export default function ReportsPage() {
  const [patientId, setPatientId] = useState('');
  const { data, error, isLoading } = useReports(patientId, { enabled: !!patientId });

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <h1>Reports</h1>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          placeholder="Enter patientId"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
        />
      </div>

      {isLoading && <p>Loading…</p>}
      {error && <p style={{ color: 'red' }}>{error.message}</p>}

      <ul style={{ display: 'grid', gap: 8, padding: 0, listStyle: 'none' }}>
        {(data ?? []).map((r) => (
          <li key={r._id ?? r.reportHash} style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6 }}>
            <div><strong>Date:</strong> {new Date(r.uploadedAt).toLocaleString()}</div>
            <div><strong>Report Hash:</strong> {r.reportHash}</div>
            <div><strong>Hedera Tx:</strong> {r.hederaTxId ?? '—'}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}


