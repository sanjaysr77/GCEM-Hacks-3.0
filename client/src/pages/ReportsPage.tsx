import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useReports } from '@/hooks/useReports';
import { FileText, Search, Calendar, Hash, Link2, Loader2, AlertCircle } from 'lucide-react';

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
    <div className="grid gap-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="border-2 border-blue-200/50 shadow-2xl bg-white/80 backdrop-blur-sm card-hover">
          <CardHeader className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border-b border-blue-200/30">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <FileText className="h-7 w-7 text-blue-600" />
              </motion.div>
              <span className="gradient-text">Patient Reports</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="text-sm font-medium text-slate-700 mb-2 block flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Patient ID
                </label>
                <Input
                  className="w-full"
                  placeholder="Enter patient ID (e.g., PAT001)"
                  value={patientId}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPatientId(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && patientId) {
                      // Trigger refetch if needed
                    }
                  }}
                />
              </div>
              <Button disabled={!patientId || isLoading} className="min-w-[100px]">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-2 p-8 text-slate-500"
          >
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading reports...</span>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700"
          >
            <AlertCircle className="h-5 w-5" />
            <span>{error.message}</span>
          </motion.div>
        )}

        {!isLoading && !error && data && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-4"
          >
            {data.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-12 text-center text-slate-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No reports found</p>
                  <p className="text-sm">Try a different patient ID</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="text-sm text-slate-600 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Found {data.length} report{data.length !== 1 ? 's' : ''}
                </div>
                <div className="grid gap-4">
                  {data.map((r, index) => (
                    <motion.div
                      key={r._id ?? `${r.reportHash}-${r.uploadedAt}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <Card className="border-2 border-slate-200 hover:border-blue-400 transition-all duration-300 shadow-lg hover:shadow-xl bg-gradient-to-br from-white to-blue-50/30 card-hover">
                        <CardContent className="py-6 space-y-4">
                          <div className="flex items-center gap-2 text-slate-700">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">Date:</span>
                            <span>{new Date(r.uploadedAt).toLocaleString()}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Hash className="h-4 w-4 text-blue-600 mt-0.5" />
                            <div className="flex-1">
                              <span className="font-medium text-slate-700">Report Hash:</span>
                              <p className="break-all text-sm font-mono text-slate-600 mt-1 bg-slate-50 p-2 rounded">
                                {r.reportHash}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Link2 className="h-4 w-4 text-blue-600" />
                            <span className="font-medium text-slate-700">Hedera Tx:</span>
                            {r.hederaTxId ? (
                              <Badge className="font-mono text-xs">{r.hederaTxId}</Badge>
                            ) : (
                              <Badge variant="secondary">Not recorded</Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


