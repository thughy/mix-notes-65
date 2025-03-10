
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { ChevronLeft, Save, Music, Radio, Tv, Headphones, CheckCircle } from 'lucide-react';
import RatingSlider from './RatingSlider';
import { useMixStore } from '@/utils/mixStore';
import { MixEntry as MixEntryType, MixRatings, RatingCategory } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';

// Default values for a new mix entry
const defaultMixEntry: Omit<MixEntryType, 'id' | 'createdAt' | 'updatedAt'> = {
  date: new Date().toISOString().split('T')[0],
  venue: '',
  artist: '',
  event: '',
  generalNotes: '',
  roomMixNotes: '',
  livestreamMixNotes: '',
  inEarMixNotes: '',
  futureUpdates: '',
  ratings: {
    clarity: 5,
    balance: 5,
    vocals: 5,
    instruments: 5,
    lowEnd: 5,
    stereoImage: 5,
    dynamics: 5,
    effects: 5,
    overall: 5
  }
};

// Get the rating categories
const ratingCategories: RatingCategory[] = [
  'clarity',
  'balance',
  'vocals',
  'instruments',
  'lowEnd',
  'stereoImage',
  'dynamics',
  'effects',
  'overall'
];

const MixEntryForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { addMix, updateMix, state } = useMixStore();
  const isMobile = useIsMobile();
  
  // If id is provided, find the mix to edit, otherwise create a new one
  const [formData, setFormData] = useState<Omit<MixEntryType, 'id' | 'createdAt' | 'updatedAt'>>(defaultMixEntry);
  const [activeTab, setActiveTab] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Load existing mix data if editing
  useEffect(() => {
    if (id) {
      const existingMix = state.mixes.find(mix => mix.id === id);
      if (existingMix) {
        const { id: _, createdAt: __, updatedAt: ___, ...rest } = existingMix;
        setFormData(rest);
      } else {
        toast.error('Mix entry not found');
        navigate('/');
      }
    }
  }, [id, state.mixes, navigate]);
  
  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle rating changes
  const handleRatingChange = (category: RatingCategory, value: number) => {
    setFormData(prev => ({
      ...prev,
      ratings: {
        ...prev.ratings,
        [category]: value
      }
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate required fields
      if (!formData.date || !formData.venue || !formData.artist) {
        toast.error('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }
      
      // Add or update the mix
      if (id) {
        updateMix(id, formData);
        toast.success('Mix updated successfully');
      } else {
        addMix(formData);
        toast.success('Mix created successfully');
      }
      
      // Navigate back to the home page
      navigate('/');
    } catch (error) {
      console.error('Error saving mix:', error);
      toast.error('An error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl px-4 pb-16 animate-slide-in">
      <Button
        type="button"
        variant="ghost"
        onClick={() => navigate('/')}
        className="mb-4"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Dashboard
      </Button>
      
      <Card className="shadow-soft border border-slate-200 overflow-hidden">
        <CardHeader className="bg-blue-50 dark:bg-blue-900/20 border-b border-slate-200">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Music className="h-5 w-5 text-blue-600" />
            {id ? 'Edit Mix Entry' : 'New Mix Entry'}
          </CardTitle>
          <CardDescription>
            Record your thoughts and ratings for this mix session
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-0">
          <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start overflow-auto p-0 rounded-none border-b">
              <TabsTrigger 
                value="general" 
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 transition-all"
              >
                <Music className="h-4 w-4 mr-1" />
                General Info
              </TabsTrigger>
              <TabsTrigger 
                value="ratings" 
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 transition-all"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
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
            </TabsList>
            
            <TabsContent value="general" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="date" className="text-sm font-medium">
                      Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="venue" className="text-sm font-medium">
                      Venue <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="venue"
                      name="venue"
                      value={formData.venue}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. Riverside Auditorium"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="artist" className="text-sm font-medium">
                      Artist/Band <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="artist"
                      name="artist"
                      value={formData.artist}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. The Sound Architects"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="event" className="text-sm font-medium">
                      Event
                    </Label>
                    <Input
                      id="event"
                      name="event"
                      value={formData.event}
                      onChange={handleInputChange}
                      placeholder="e.g. Summer Tour 2023"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Label htmlFor="generalNotes" className="text-sm font-medium">
                  General Notes
                </Label>
                <Textarea
                  id="generalNotes"
                  name="generalNotes"
                  value={formData.generalNotes}
                  onChange={handleInputChange}
                  placeholder="Overall thoughts about the mix and performance..."
                  className="mt-1 h-32"
                />
              </div>
              
              <div className="mt-6">
                <Label htmlFor="futureUpdates" className="text-sm font-medium">
                  Future Updates
                </Label>
                <Textarea
                  id="futureUpdates"
                  name="futureUpdates"
                  value={formData.futureUpdates}
                  onChange={handleInputChange}
                  placeholder="Note any changes or improvements for next time..."
                  className="mt-1 h-32"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="ratings" className="p-6">
              <p className="text-sm text-slate-600 mb-6">
                Rate various aspects of your mix on a scale from 1-10
              </p>
              
              <div>
                {ratingCategories.map((category) => (
                  <RatingSlider
                    key={category}
                    category={category}
                    value={formData.ratings[category]}
                    onChange={(value) => handleRatingChange(category, value)}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="room" className="p-6">
              <div>
                <Label htmlFor="roomMixNotes" className="text-sm font-medium">
                  Room Mix Notes
                </Label>
                <Textarea
                  id="roomMixNotes"
                  name="roomMixNotes"
                  value={formData.roomMixNotes}
                  onChange={handleInputChange}
                  placeholder="Notes about PA, acoustics, EQ decisions for the main room mix..."
                  className="mt-1 h-64"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="livestream" className="p-6">
              <div>
                <Label htmlFor="livestreamMixNotes" className="text-sm font-medium">
                  Livestream Mix Notes
                </Label>
                <Textarea
                  id="livestreamMixNotes"
                  name="livestreamMixNotes"
                  value={formData.livestreamMixNotes}
                  onChange={handleInputChange}
                  placeholder="Notes about the broadcast mix, compression settings, platform-specific adjustments..."
                  className="mt-1 h-64"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="inear" className="p-6">
              <div>
                <Label htmlFor="inEarMixNotes" className="text-sm font-medium">
                  In-Ear Monitor Mix Notes
                </Label>
                <Textarea
                  id="inEarMixNotes"
                  name="inEarMixNotes"
                  value={formData.inEarMixNotes}
                  onChange={handleInputChange}
                  placeholder="Notes about musician monitor preferences, feedback from performers..."
                  className="mt-1 h-64"
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t border-slate-200 p-4 bg-slate-50">
          {isMobile && (
            <div className="flex gap-2 w-full">
              <Button
                type="button"
                variant="outline"
                className="w-1/2"
                onClick={() => {
                  const tabs = ['general', 'ratings', 'room', 'livestream', 'inear'];
                  const currentIndex = tabs.indexOf(activeTab);
                  const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
                  setActiveTab(tabs[prevIndex]);
                }}
              >
                Previous
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-1/2"
                onClick={() => {
                  const tabs = ['general', 'ratings', 'room', 'livestream', 'inear'];
                  const currentIndex = tabs.indexOf(activeTab);
                  const nextIndex = (currentIndex + 1) % tabs.length;
                  setActiveTab(tabs[nextIndex]);
                }}
              >
                Next
              </Button>
            </div>
          )}
          
          {!isMobile && (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {id ? 'Update Mix' : 'Save Mix'}
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
      
      {isMobile && (
        <Button 
          type="submit" 
          className="w-full mt-4 py-6" 
          disabled={isSubmitting}
        >
          <Save className="mr-2 h-4 w-4" />
          {id ? 'Update Mix' : 'Save Mix'}
        </Button>
      )}
    </form>
  );
};

export default MixEntryForm;
