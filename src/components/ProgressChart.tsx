
import { useMemo, useState } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { MixEntry } from '@/types';
import { Button } from '@/components/ui/button';

interface ProgressChartProps {
  mixes: MixEntry[];
}

const ProgressChart = ({ mixes }: ProgressChartProps) => {
  const [selectedMixId, setSelectedMixId] = useState<string | null>(
    mixes.length > 0 ? mixes[0].id : null
  );
  const [comparisonMixId, setComparisonMixId] = useState<string | null>(null);

  // Get selected mix
  const selectedMix = useMemo(() => {
    if (!selectedMixId) return null;
    return mixes.find(mix => mix.id === selectedMixId) || null;
  }, [mixes, selectedMixId]);

  // Get comparison mix
  const comparisonMix = useMemo(() => {
    if (!comparisonMixId) return null;
    return mixes.find(mix => mix.id === comparisonMixId) || null;
  }, [mixes, comparisonMixId]);

  // Generate radar data
  const radarData = useMemo(() => {
    if (!selectedMix) return [];
    
    return Object.entries(selectedMix.ratings).map(([key, value]) => {
      const dataPoint: any = {
        subject: key.charAt(0).toUpperCase() + key.slice(1),
        [selectedMix.artist]: value,
        fullMark: 10
      };
      
      // Add comparison data if available
      if (comparisonMix) {
        dataPoint[comparisonMix.artist] = comparisonMix.ratings[key as keyof typeof comparisonMix.ratings];
      }
      
      return dataPoint;
    });
  }, [selectedMix, comparisonMix]);

  const handleClearComparison = () => {
    setComparisonMixId(null);
  };

  return (
    <Card className="shadow-soft border border-slate-200 bg-white animate-scale-in">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-slate-800">
          Progress Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {mixes.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="mix-select">Select Mix</Label>
                <Select
                  value={selectedMixId || ''}
                  onValueChange={setSelectedMixId}
                >
                  <SelectTrigger id="mix-select">
                    <SelectValue placeholder="Select a mix" />
                  </SelectTrigger>
                  <SelectContent>
                    {mixes.map(mix => (
                      <SelectItem key={mix.id} value={mix.id}>
                        {mix.artist} at {mix.venue} ({mix.date})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comparison-select">Compare With (Optional)</Label>
                <div className="flex space-x-2">
                  <Select
                    value={comparisonMixId || ''}
                    onValueChange={setComparisonMixId}
                  >
                    <SelectTrigger id="comparison-select" className="flex-1">
                      <SelectValue placeholder="Select a mix to compare" />
                    </SelectTrigger>
                    <SelectContent>
                      {mixes
                        .filter(mix => mix.id !== selectedMixId)
                        .map(mix => (
                          <SelectItem key={mix.id} value={mix.id}>
                            {mix.artist} at {mix.venue} ({mix.date})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {comparisonMixId && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleClearComparison}
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {selectedMix && (
              <div className="space-y-6">
                <ResponsiveContainer width="100%" height={500}>
                  <RadarChart data={radarData} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
                    <PolarGrid strokeDasharray="3 3" stroke="#ddd" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#666', fontSize: 12 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fill: '#777' }} />
                    <Radar
                      name={selectedMix.artist}
                      dataKey={selectedMix.artist}
                      stroke="#2E96FF"
                      fill="#2E96FF"
                      fillOpacity={0.5}
                    />
                    {comparisonMix && (
                      <Radar
                        name={comparisonMix.artist}
                        dataKey={comparisonMix.artist}
                        stroke="#FF6B2E"
                        fill="#FF6B2E"
                        fillOpacity={0.5}
                      />
                    )}
                    <Tooltip />
                    <Legend wrapperStyle={{ paddingTop: 20 }} />
                  </RadarChart>
                </ResponsiveContainer>

                <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                  <h3 className="text-lg font-medium mb-4">Mix Notes Comparison</h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-blue-600 mb-2">{selectedMix.artist} at {selectedMix.venue}</h4>
                      <p className="text-sm text-slate-700 mb-2">{selectedMix.generalNotes}</p>
                      {selectedMix.futureUpdates && (
                        <div className="mt-4">
                          <h5 className="text-sm font-medium text-slate-900">Future Updates:</h5>
                          <p className="text-sm italic text-slate-600">{selectedMix.futureUpdates}</p>
                        </div>
                      )}
                    </div>
                    
                    {comparisonMix && (
                      <div>
                        <h4 className="font-medium text-orange-600 mb-2">{comparisonMix.artist} at {comparisonMix.venue}</h4>
                        <p className="text-sm text-slate-700 mb-2">{comparisonMix.generalNotes}</p>
                        {comparisonMix.futureUpdates && (
                          <div className="mt-4">
                            <h5 className="text-sm font-medium text-slate-900">Future Updates:</h5>
                            <p className="text-sm italic text-slate-600">{comparisonMix.futureUpdates}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
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
