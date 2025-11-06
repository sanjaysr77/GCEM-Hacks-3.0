import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Upload Report</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label>PDF File</Label>
              <Input type="file" accept="application/pdf" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFile(e.target.files?.[0] || null)} />
            </div>
            <div className="grid gap-2">
              <Label>Patient ID</Label>
              <Input placeholder="PAT001" value={patientId} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPatientId(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Hospital ID</Label>
              <Input placeholder="HSP001" value={hospitalId} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHospitalId(e.target.value)} />
            </div>
            <Button type="submit" disabled={isPending || !file || !patientId || !hospitalId}>
              {isPending ? 'Uploading…' : 'Upload'}
            </Button>
          </form>
          {error && <p className="mt-3 text-sm text-red-600">{(error as any).message}</p>}
        </CardContent>
      </Card>
      {result && (
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>Uploaded</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-slate-50 p-3 rounded border overflow-auto">{JSON.stringify(result, null, 2)}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


