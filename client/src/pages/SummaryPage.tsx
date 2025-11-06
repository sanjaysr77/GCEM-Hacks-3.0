import { useMemo, useState } from 'react';
import { useReportsSummary } from '@/hooks/useReports';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function SummaryPage() {
  const [patientId, setPatientId] = useState('');
  const { data, error, isLoading } = useReportsSummary(patientId, { enabled: !!patientId });

  const chartData = useMemo(() => {
    const hm = data?.healthMetrics || {} as Record<string, any>;
    const points: Array<{ metric: string; value: number }> = [];
    const num = (x: any) => (typeof x === 'number' ? x : Number(String(x).replace(/[^0-9.]/g, '')));
    if (hm.TSH != null) points.push({ metric: 'TSH', value: num(hm.TSH) });
    if (hm.HbA1c != null) points.push({ metric: 'HbA1c', value: num(hm.HbA1c) });
    return points;
  }, [data]);

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-semibold">Summary</h1>
      <div className="flex gap-2">
        <input
          className="border rounded px-3 py-2 w-64 focus:outline-none focus:ring focus:ring-blue-200"
          placeholder="Enter patientId"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
        />
        <button className="px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-50" disabled={!patientId}>Load</button>
      </div>
      {isLoading && <p className="text-sm text-slate-500">Loading…</p>}
      {error && <p className="text-sm text-red-600">{error.message}</p>}

      {data && (
        <div className="grid gap-4">
          <section className="grid gap-2">
            <h2 className="text-lg font-medium">Text Corpus</h2>
            <p className="whitespace-pre-wrap text-slate-700">{data.textCorpus || '—'}</p>
          </section>
          <section className="grid gap-2">
            <h2 className="text-lg font-medium">Health Metrics (latest)</h2>
            <ul className="grid gap-1">
              {Object.entries(data.healthMetrics || {}).map(([k, v]) => (
                <li key={k}><span className="font-medium">{k}:</span> {String(v)}</li>
              ))}
            </ul>
          </section>
          {chartData.length > 0 && (
            <section className="grid gap-2">
              <h2 className="text-lg font-medium">Key Metrics</h2>
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="metric" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}


