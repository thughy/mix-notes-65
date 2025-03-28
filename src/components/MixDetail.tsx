import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  CalendarDays, 
  MapPin, 
  Music, 
  Radio, 
  Tv, 
  Headphones, 
  ClipboardList, 
  Star, 
  ArrowRight, 
  Edit, 
  Trash2,
  AudioLines,
  Youtube
} from 'lucide-react';
import { toast } from 'sonner';
import { MixEntry } from '@/types';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import AudioWaveform from './AudioVisualizer/AudioWaveform';

interface MixDetailProps {
  mix: MixEntry;
  onDelete: (id: string) => void;
}

const MixDetail = ({ mix, onDelete }: MixDetailProps) => {
  const navigate = useNavigate();

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  // Calculate average rating
  const averageRating = Object.values(mix.ratings).reduce((sum, rating) => sum + rating, 0) / Object.keys(mix.ratings).length;

  // Handle delete action
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this mix entry? This action cannot be undone.')) {
      onDelete(mix.id);
      toast.success('Mix entry deleted');
    }
  };

  // Process YouTube URL to ensure it works properly
  const getProcessedYoutubeUrl = (url: string | undefined) => {
    if (!url) return '';
    
    // If URL already has 'embed', ensure correct format
    if (url.includes('embed')) {
      return url;
    }
    
    // Extract video ID from various YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    
    return url;
  };

  return (
    <Card className="shadow-soft border border-slate-200 bg-white animate-scale-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-semibold text-slate-800">
              {mix.artist}
            </CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
              {formatDate(mix.date)}
              {mix.event && (
                <>
                  <span className="mx-1">•</span>
                  <span>{mix.event}</span>
                </>
              )}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <MapPin className="h-3 w-3 mr-1" />
              {mix.venue}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
              {averageRating.toFixed(1)}/10
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="w-full justify-start overflow-auto p-0 rounded-none border-b border-slate-200">
            <TabsTrigger 
              value="general" 
              className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 transition-all"
            >
              <Music className="h-4 w-4 mr-1" />
              General
            </TabsTrigger>
            <TabsTrigger 
              value="ratings" 
              className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 transition-all"
            >
              <Star className="h-4 w-4 mr-1" />
              Ratings
            </TabsTrigger>
            <TabsTrigger 
              value="room" 
              className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 transition-all"
            >
              <Radio className="h-4 w-4 mr-1" />
              Room Mix
            </TabsTrigger>
            <TabsTrigger 
              value="livestream" 
              className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 transition-all"
            >
              <Tv className="h-4 w-4 mr-1" />
              Livestream
            </TabsTrigger>
            <TabsTrigger 
              value="inear" 
              className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 transition-all"
            >
              <Headphones className="h-4 w-4 mr-1" />
              In-Ear Mix
            </TabsTrigger>
            <TabsTrigger 
              value="boardmix" 
              className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 transition-all"
            >
              <AudioLines className="h-4 w-4 mr-1" />
              Board Mix
            </TabsTrigger>
            <TabsTrigger 
              value="watchstream" 
              className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 transition-all"
            >
              <Youtube className="h-4 w-4 mr-1" />
              Watch Stream
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="p-6">
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-slate-500 mb-2 flex items-center">
                  <Music className="h-4 w-4 mr-1 text-blue-600" />
                  General Notes
                </h4>
                <p className="text-slate-700 whitespace-pre-line">
                  {mix.generalNotes || 'No general notes recorded.'}
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="text-sm font-medium text-slate-500 mb-2 flex items-center">
                  <ClipboardList className="h-4 w-4 mr-1 text-blue-600" />
                  Future Updates
                </h4>
                <p className="text-slate-700 whitespace-pre-line">
                  {mix.futureUpdates || 'No future updates recorded.'}
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="ratings" className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(mix.ratings).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <span className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <div className="flex items-center gap-1.5">
                    <div className="flex">
                      {[...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-6 mx-px rounded-sm ${
                            i < value 
                              ? i < 3 
                                ? 'bg-amber-400' 
                                : i < 7 
                                  ? 'bg-green-400' 
                                  : 'bg-blue-500'
                              : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-semibold ml-2 min-w-[30px] text-center">
                      {value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="room" className="p-6">
            <h4 className="text-sm font-medium text-slate-500 mb-2 flex items-center">
              <Radio className="h-4 w-4 mr-1 text-blue-600" />
              Room Mix Notes
            </h4>
            <p className="text-slate-700 whitespace-pre-line">
              {mix.roomMixNotes || 'No room mix notes recorded.'}
            </p>
          </TabsContent>
          
          <TabsContent value="livestream" className="p-6">
            <h4 className="text-sm font-medium text-slate-500 mb-2 flex items-center">
              <Tv className="h-4 w-4 mr-1 text-blue-600" />
              Livestream Mix Notes
            </h4>
            <p className="text-slate-700 whitespace-pre-line">
              {mix.livestreamMixNotes || 'No livestream mix notes recorded.'}
            </p>
          </TabsContent>
          
          <TabsContent value="inear" className="p-6">
            <h4 className="text-sm font-medium text-slate-500 mb-2 flex items-center">
              <Headphones className="h-4 w-4 mr-1 text-blue-600" />
              In-Ear Monitor Mix Notes
            </h4>
            <p className="text-slate-700 whitespace-pre-line">
              {mix.inEarMixNotes || 'No in-ear monitor mix notes recorded.'}
            </p>
          </TabsContent>
          
          <TabsContent value="boardmix" className="p-6">
            <h4 className="text-sm font-medium text-slate-500 mb-2 flex items-center">
              <AudioLines className="h-4 w-4 mr-1 text-blue-600" />
              Board Mix Audio Spectrum
            </h4>
            {mix.audioSrc ? (
              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-md">
                  <AudioWaveform audioSrc={mix.audioSrc} />
                </div>
                <p className="text-xs text-slate-500 italic text-center">
                  Audio frequency spectrum with 5-second averaging. X-axis shows frequency (Hz), Y-axis shows amplitude.
                </p>
              </div>
            ) : (
              <p className="text-slate-500 italic">No board mix audio uploaded for this entry.</p>
            )}
          </TabsContent>
          
          <TabsContent value="watchstream" className="p-6">
            <h4 className="text-sm font-medium text-slate-500 mb-2 flex items-center">
              <Youtube className="h-4 w-4 mr-1 text-blue-600" />
              Watch Stream
            </h4>
            {mix.youtubeUrl ? (
              <div className="aspect-video w-full max-w-2xl rounded-md overflow-hidden border border-slate-200 mt-2">
                <iframe 
                  width="100%" 
                  height="100%"
                  src={getProcessedYoutubeUrl(mix.youtubeUrl)}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <p className="text-slate-500 italic">No YouTube video link provided for this mix.</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t border-slate-200 p-4">
        <Button
          variant="outline"
          size="sm"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          onClick={() => navigate(`/edit/${mix.id}`)}
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit Mix
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MixDetail;
