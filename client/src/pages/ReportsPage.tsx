import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
      <Card>
        <CardHeader>
          <CardTitle>Reports</CardTitle>
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

      <div className="grid gap-3">
        {(data ?? []).map((r) => (
          <Card key={r._id ?? `${r.reportHash}-${r.uploadedAt}`}> 
            <CardContent className="py-4 grid gap-1">
              <div><span className="font-medium">Date:</span> {new Date(r.uploadedAt).toLocaleString()}</div>
              <div className="break-all"><span className="font-medium">Report Hash:</span> {r.reportHash}</div>
              <div className="break-all flex items-center gap-2">
                <span className="font-medium">Hedera Tx:</span> {r.hederaTxId ? <Badge>{r.hederaTxId}</Badge> : <Badge variant="secondary">—</Badge>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


