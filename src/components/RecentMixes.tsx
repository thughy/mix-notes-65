
import { useState } from 'react';
import { MixEntry } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CalendarDays, MapPin, Music, Star, Search, SortAsc, SortDesc } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface RecentMixesProps {
  mixes: MixEntry[];
  onSelectMix: (id: string) => void;
  selectedMixId: string | null;
}

type SortField = 'date' | 'venue' | 'artist' | 'rating';
type SortDirection = 'asc' | 'desc';

const RecentMixes = ({ mixes, onSelectMix, selectedMixId }: RecentMixesProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  // Calculate average rating
  const getAverageRating = (ratings: MixEntry['ratings']) => {
    return Object.values(ratings).reduce((sum, rating) => sum + rating, 0) / Object.keys(ratings).length;
  };

  // Filter mixes based on search term
  const filteredMixes = mixes.filter(mix => {
    const searchLower = searchTerm.toLowerCase();
    return (
      mix.artist.toLowerCase().includes(searchLower) ||
      mix.venue.toLowerCase().includes(searchLower) ||
      mix.event.toLowerCase().includes(searchLower) ||
      mix.generalNotes.toLowerCase().includes(searchLower)
    );
  });

  // Sort mixes based on selected field and direction
  const sortedMixes = [...filteredMixes].sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case 'date':
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        break;
      case 'venue':
        comparison = a.venue.localeCompare(b.venue);
        break;
      case 'artist':
        comparison = a.artist.localeCompare(b.artist);
        break;
      case 'rating':
        comparison = getAverageRating(a.ratings) - getAverageRating(b.ratings);
        break;
    }
    
    return sortDirection === 'desc' ? -comparison : comparison;
  });

  // Toggle sort direction or change sort field
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Render sort icon
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'desc' ? (
      <SortDesc className="h-3.5 w-3.5 text-slate-400" />
    ) : (
      <SortAsc className="h-3.5 w-3.5 text-slate-400" />
    );
  };

  return (
    <Card className="shadow-soft border border-slate-200 bg-white animate-scale-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold text-slate-800">
            Recent Mixes
          </CardTitle>
          <Badge variant="secondary">
            {filteredMixes.length} {filteredMixes.length === 1 ? 'Entry' : 'Entries'}
          </Badge>
        </div>
        
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search mixes..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        {filteredMixes.length > 0 && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            <Button
              variant="ghost"
              size="sm"
              className={`text-xs ${sortField === 'date' ? 'bg-blue-50 text-blue-700' : ''}`}
              onClick={() => handleSort('date')}
            >
              Sort by Date {renderSortIcon('date')}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`text-xs ${sortField === 'artist' ? 'bg-blue-50 text-blue-700' : ''}`}
              onClick={() => handleSort('artist')}
            >
              Sort by Artist {renderSortIcon('artist')}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`text-xs ${sortField === 'venue' ? 'bg-blue-50 text-blue-700' : ''}`}
              onClick={() => handleSort('venue')}
            >
              Sort by Venue {renderSortIcon('venue')}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`text-xs ${sortField === 'rating' ? 'bg-blue-50 text-blue-700' : ''}`}
              onClick={() => handleSort('rating')}
            >
              Sort by Rating {renderSortIcon('rating')}
            </Button>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-0 max-h-[500px] overflow-y-auto">
        {sortedMixes.length === 0 ? (
          <div className="p-6 text-center text-slate-500">
            {searchTerm ? 'No matches found for your search.' : 'No mix entries found. Create your first mix entry!'}
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {sortedMixes.map(mix => (
              <div
                key={mix.id}
                onClick={() => onSelectMix(mix.id)}
                className={`p-4 cursor-pointer transition-colors hover:bg-blue-50 ${
                  selectedMixId === mix.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
              >
                <h3 className="font-medium text-slate-800 mb-1">{mix.artist}</h3>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                  <div className="flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                    {formatDate(mix.date)}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {mix.venue}
                  </div>
                  
                  {mix.event && (
                    <div className="flex items-center gap-1">
                      <Music className="h-3.5 w-3.5 text-slate-400" />
                      {mix.event}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1 ml-auto">
                    <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                    {getAverageRating(mix.ratings).toFixed(1)}
                  </div>
                </div>
                
                {mix.generalNotes && (
                  <p className="mt-2 text-sm text-slate-600 line-clamp-2">
                    {mix.generalNotes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentMixes;
