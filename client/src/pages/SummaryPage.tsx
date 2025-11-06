import { useMemo, useState } from 'react';
import { useReportsSummary } from '@/hooks/useReports';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2 items-center">
          <Input
            className="w-64"
            placeholder="Enter patientId"
            value={patientId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPatientId(e.target.value)}
          />
          <Button disabled={!patientId}>Load</Button>
        </CardContent>
      </Card>
      {isLoading && <p className="text-sm text-slate-500">Loading…</p>}
      {error && <p className="text-sm text-red-600">{error.message}</p>}

      {data && (
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Text Corpus</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-slate-700">{data.textCorpus || '—'}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Health Metrics (latest)</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-1">
                {Object.entries(data.healthMetrics || {}).map(([k, v]) => (
                  <li key={k}><span className="font-medium">{k}:</span> {String(v)}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
          {chartData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}


