// Mock parser that returns structured parsedData for a report file
// In a real implementation, this would analyze the uploaded report content

async function parseReport(filePath) {
  return {
    diagnosisSummary: 'Hypothyroidism with mild stress symptoms',
    remarks: 'Requires medication adjustment',
    riskLevel: 'Moderate',
    contextText: 'Patient reports fatigue and difficulty focusing over the last 2 weeks.',
    emotionHints: {
      keywords: ['fatigue', 'stress', 'focus'],
      inferredTone: 'Tired but compliant',
    },
    clinicalMetrics: {
      BP: { value: '120/80', unit: 'mmHg', normalRange: '120/80', organ: 'heart' },
      TSH: { value: 9.5, unit: 'mIU/L', normalRange: '0.4–4.5', organ: 'thyroid' },
      HbA1c: { value: 6.2, unit: '%', normalRange: '<5.7', organ: 'pancreas' },
    },
  };
}

module.exports = { parseReport };


