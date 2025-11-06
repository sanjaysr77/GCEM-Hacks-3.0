import { useState } from 'react';
import { useReportsSummary } from '@/hooks/useReports';

export default function SummaryPage() {
  const [patientId, setPatientId] = useState('');
  const { data, error, isLoading } = useReportsSummary(patientId, { enabled: !!patientId });

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <h1>Summary</h1>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          placeholder="Enter patientId"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
        />
      </div>
      {isLoading && <p>Loading…</p>}
      {error && <p style={{ color: 'red' }}>{error.message}</p>}

      {data && (
        <div style={{ display: 'grid', gap: 12 }}>
          <section>
            <h2>Text Corpus</h2>
            <p style={{ whiteSpace: 'pre-wrap' }}>{data.textCorpus || '—'}</p>
          </section>
          <section>
            <h2>Health Metrics (latest)</h2>
            <ul>
              {Object.entries(data.healthMetrics || {}).map(([k, v]) => (
                <li key={k}>
                  <strong>{k}:</strong> {v as any}
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}


