import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReportsSummary } from '@/hooks/useReports';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BarChart3, Search, FileText, Activity, Loader2, AlertCircle, TrendingUp } from 'lucide-react';

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
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <BarChart3 className="h-7 w-7 text-blue-600" />
              </motion.div>
              <span className="gradient-text">Patient Summary</span>
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
                    Load
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
            className="flex items-center justify-center gap-2 p-12 text-slate-500"
          >
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Analyzing patient data...</span>
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
            className="grid gap-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-2 border-blue-200/50 shadow-xl bg-white/80 backdrop-blur-sm card-hover">
                <CardHeader className="bg-gradient-to-r from-blue-500/5 to-purple-500/5 border-b border-blue-200/20">
                  <CardTitle className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-blue-600" />
                    <span className="text-xl font-bold">Text Corpus</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <p className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                      {data.textCorpus || '—'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-2 border-green-200/50 shadow-xl bg-white/80 backdrop-blur-sm card-hover">
                <CardHeader className="bg-gradient-to-r from-green-500/5 to-emerald-500/5 border-b border-green-200/20">
                  <CardTitle className="flex items-center gap-3">
                    <Activity className="h-6 w-6 text-green-600" />
                    <span className="text-xl font-bold">Health Metrics (Latest)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {Object.entries(data.healthMetrics || {}).map(([k, v], index) => (
                      <motion.div
                        key={k}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-2 border-blue-200/50 shadow-md hover:shadow-lg transition-shadow"
                      >
                        <span className="font-semibold text-slate-700">{k}:</span>
                        <span className="text-lg font-bold text-blue-600">{String(v)}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {chartData.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="border-2 border-purple-200/50 shadow-xl bg-white/80 backdrop-blur-sm card-hover">
                  <CardHeader className="bg-gradient-to-r from-purple-500/5 to-pink-500/5 border-b border-purple-200/20">
                    <CardTitle className="flex items-center gap-3">
                      <TrendingUp className="h-6 w-6 text-purple-600" />
                      <span className="text-xl font-bold">Key Metrics Visualization</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="metric" stroke="#64748b" />
                          <YAxis stroke="#64748b" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'white',
                              border: '1px solid #e2e8f0',
                              borderRadius: '8px',
                            }}
                          />
                          <Bar
                            dataKey="value"
                            fill="url(#colorGradient)"
                            radius={[8, 8, 0, 0]}
                          />
                          <defs>
                            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#3b82f6" />
                              <stop offset="100%" stopColor="#8b5cf6" />
                            </linearGradient>
                          </defs>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


