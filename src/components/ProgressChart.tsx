
import { useMemo } from 'react';
import { 
  ResponsiveContainer, 
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MixEntry } from '@/types';

interface ProgressChartProps {
  mixes: MixEntry[];
}

const ProgressChart = ({ mixes }: ProgressChartProps) => {
  // Get latest ratings for radar chart
  const latestMix = useMemo(() => {
    if (mixes.length === 0) return null;
    return mixes.reduce((latest, current) => 
      new Date(current.date) > new Date(latest.date) ? current : latest
    );
  }, [mixes]);

  const radarData = useMemo(() => {
    if (!latestMix) return [];
    
    return Object.entries(latestMix.ratings).map(([key, value]) => ({
      subject: key.charAt(0).toUpperCase() + key.slice(1),
      value,
      fullMark: 10
    }));
  }, [latestMix]);

  return (
    <Card className="shadow-soft border border-slate-200 bg-white animate-scale-in">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-slate-800">
          Progress Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {mixes.length > 0 ? (
          <ResponsiveContainer width="100%" height={500}>
            <RadarChart data={radarData} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
              <PolarGrid strokeDasharray="3 3" stroke="#ddd" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#666', fontSize: 12 }} />
              <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fill: '#777' }} />
              <Radar
                name="Latest Mix"
                dataKey="value"
                stroke="#2E96FF"
                fill="#2E96FF"
                fillOpacity={0.5}
              />
              <Tooltip />
              <Legend wrapperStyle={{ paddingTop: 20 }} />
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[400px] flex items-center justify-center">
            <p className="text-slate-500 text-center">
              No mix data available yet. Add your first mix entry to start tracking progress.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProgressChart;
