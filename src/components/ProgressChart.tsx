
import { useMemo } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RatingCategory, MixEntry, ChartData } from '@/types';
import { useState } from 'react';

interface ProgressChartProps {
  mixes: MixEntry[];
}

type ChartType = 'line' | 'radar' | 'area' | 'bar';

const ProgressChart = ({ mixes }: ProgressChartProps) => {
  const [chartType, setChartType] = useState<ChartType>('line');
  const [selectedCategories, setSelectedCategories] = useState<RatingCategory[]>([
    'overall', 'clarity', 'balance'
  ]);

  // Format the dates to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // Prepare data for charts
  const chartData = useMemo(() => {
    return mixes
      .slice() // Create a shallow copy
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(mix => ({
        name: formatDate(mix.date),
        date: mix.date,
        venue: mix.venue,
        artist: mix.artist,
        ...mix.ratings
      }));
  }, [mixes]);

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

  // Color palette for the charts
  const colorPalette = [
    '#2E96FF', // Primary blue
    '#4EAEFD', // Lighter blue
    '#0073E6', // Darker blue
    '#6BBFFF', // Light pastel blue
    '#005CB8', // Navy blue
    '#33ADFF', // Sky blue
    '#0066CC', // Royal blue
    '#80C7FF', // Baby blue
    '#004D99', // Deep blue
  ];

  // Toggle a category selection
  const toggleCategory = (category: RatingCategory) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Render different chart types
  const renderChart = () => {
    switch (chartType) {
      case 'radar':
        return (
          <ResponsiveContainer width="100%" height={500}>
            <RadarChart data={radarData} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
              <PolarGrid strokeDasharray="3 3" stroke="#ddd" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#666', fontSize: 12 }} />
              <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fill: '#777' }} />
              <Radar
                name="Latest Mix"
                dataKey="value"
                stroke={colorPalette[0]}
                fill={colorPalette[0]}
                fillOpacity={0.5}
              />
              <Tooltip />
              <Legend wrapperStyle={{ paddingTop: 20 }} />
            </RadarChart>
          </ResponsiveContainer>
        );
        
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={500}>
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="name" tick={{ fill: '#666', fontSize: 12 }} />
              <YAxis domain={[0, 10]} tick={{ fill: '#666', fontSize: 12 }} />
              <Tooltip />
              <Legend wrapperStyle={{ paddingTop: 10 }} />
              {selectedCategories.map((category, index) => (
                <Area
                  key={category}
                  type="monotone"
                  dataKey={category}
                  name={category.charAt(0).toUpperCase() + category.slice(1)}
                  stroke={colorPalette[index % colorPalette.length]}
                  fill={colorPalette[index % colorPalette.length]}
                  fillOpacity={0.2}
                  activeDot={{ r: 6 }}
                  strokeWidth={2}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );
        
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="name" tick={{ fill: '#666', fontSize: 12 }} />
              <YAxis domain={[0, 10]} tick={{ fill: '#666', fontSize: 12 }} />
              <Tooltip />
              <Legend wrapperStyle={{ paddingTop: 10 }} />
              {selectedCategories.map((category, index) => (
                <Bar
                  key={category}
                  dataKey={category}
                  name={category.charAt(0).toUpperCase() + category.slice(1)}
                  fill={colorPalette[index % colorPalette.length]}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
        
      case 'line':
      default:
        return (
          <ResponsiveContainer width="100%" height={500}>
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="name" tick={{ fill: '#666', fontSize: 12 }} />
              <YAxis domain={[0, 10]} tick={{ fill: '#666', fontSize: 12 }} />
              <Tooltip />
              <Legend wrapperStyle={{ paddingTop: 10 }} />
              {selectedCategories.map((category, index) => (
                <Line
                  key={category}
                  type="monotone"
                  dataKey={category}
                  name={category.charAt(0).toUpperCase() + category.slice(1)}
                  stroke={colorPalette[index % colorPalette.length]}
                  activeDot={{ r: 6 }}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <Card className="shadow-soft border border-slate-200 bg-white animate-scale-in">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-slate-800">
          Progress Tracker
        </CardTitle>
        <div className="flex flex-wrap gap-3 mt-4">
          <Select
            value={chartType}
            onValueChange={(value) => setChartType(value as ChartType)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chart Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="line">Line Chart</SelectItem>
              <SelectItem value="radar">Radar Chart</SelectItem>
              <SelectItem value="area">Area Chart</SelectItem>
              <SelectItem value="bar">Bar Chart</SelectItem>
            </SelectContent>
          </Select>
          
          {chartType !== 'radar' && (
            <div className="flex flex-wrap gap-2 ml-auto">
              {Object.keys(mixes[0]?.ratings || {}).map((category) => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category as RatingCategory)}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                    selectedCategories.includes(category as RatingCategory)
                      ? 'bg-blue-100 text-blue-800 ring-1 ring-blue-400'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {mixes.length > 0 ? (
          renderChart()
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
