import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUploadReport } from '@/hooks/useUploadReport';
import { Upload, FileText, User, Building2, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';

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
    <div className="grid gap-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="max-w-2xl mx-auto border-2 border-blue-200/50 shadow-2xl bg-white/80 backdrop-blur-sm card-hover">
          <CardHeader className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border-b border-blue-200/30">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Upload className="h-7 w-7 text-blue-600" />
              </motion.div>
              <span className="gradient-text">Upload Medical Report</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={onSubmit} className="grid gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="grid gap-2"
              >
                <Label className="flex items-center gap-2 text-base font-semibold">
                  <FileText className="h-4 w-4 text-blue-600" />
                  PDF File
                </Label>
                <div className="relative">
                  <Input
                    type="file"
                    accept="application/pdf"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFile(e.target.files?.[0] || null)}
                    className="cursor-pointer"
                  />
                  {file && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-2 flex items-center gap-2 text-sm text-green-600"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>{file.name}</span>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="grid gap-2"
              >
                <Label className="flex items-center gap-2 text-base font-semibold">
                  <User className="h-4 w-4 text-blue-600" />
                  Patient ID
                </Label>
                <Input
                  placeholder="Enter patient ID (e.g., PAT001)"
                  value={patientId}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPatientId(e.target.value)}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="grid gap-2"
              >
                <Label className="flex items-center gap-2 text-base font-semibold">
                  <Building2 className="h-4 w-4 text-blue-600" />
                  Hospital ID
                </Label>
                <Input
                  placeholder="Enter hospital ID (e.g., HSP001)"
                  value={hospitalId}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHospitalId(e.target.value)}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  type="submit"
                  disabled={isPending || !file || !patientId || !hospitalId}
                  className="w-full h-12 text-base font-semibold"
                  size="lg"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Uploading to Blockchain...
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5 mr-2" />
                      Upload Report
                    </>
                  )}
                </Button>
              </motion.div>
            </form>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700"
                >
                  <AlertCircle className="h-5 w-5" />
                  <span>{(error as any).message}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="max-w-2xl mx-auto border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 shadow-2xl glow-effect">
              <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-b border-green-200/30">
                <CardTitle className="flex items-center gap-3 text-green-700">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <CheckCircle2 className="h-7 w-7" />
                  </motion.div>
                  <span className="text-2xl font-bold">Upload Successful!</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-green-700 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Report has been processed and recorded on the blockchain
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-green-200">
                  <pre className="text-xs overflow-auto max-h-64">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


