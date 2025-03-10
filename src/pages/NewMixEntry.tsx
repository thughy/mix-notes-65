
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, Save } from 'lucide-react';
import Header from '@/components/Header';
import RatingSlider from '@/components/RatingSlider';
import { MixEntry, MixRatings, RatingCategory } from '@/types';
import { useMixStore } from '@/utils/mixStore';

const initialRatings: MixRatings = {
  clarity: 5,
  balance: 5,
  vocals: 5,
  instruments: 5,
  lowEnd: 5,
  stereoImage: 5,
  dynamics: 5,
  effects: 5,
  overall: 5
};

const NewMixEntry = () => {
  const navigate = useNavigate();
  const { addMix } = useMixStore();
  
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [venue, setVenue] = useState('');
  const [artist, setArtist] = useState('');
  const [event, setEvent] = useState('');
  const [generalNotes, setGeneralNotes] = useState('');
  const [roomMixNotes, setRoomMixNotes] = useState('');
  const [livestreamMixNotes, setLivestreamMixNotes] = useState('');
  const [inEarMixNotes, setInEarMixNotes] = useState('');
  const [futureUpdates, setFutureUpdates] = useState('');
  const [ratings, setRatings] = useState<MixRatings>(initialRatings);

  const handleRatingChange = (category: RatingCategory, value: number) => {
    setRatings(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!venue || !artist) {
      toast.error('Please fill out venue and artist fields');
      return;
    }
    
    const newMix: Omit<MixEntry, 'id' | 'createdAt' | 'updatedAt'> = {
      date,
      venue,
      artist,
      event,
      generalNotes,
      roomMixNotes,
      livestreamMixNotes,
      inEarMixNotes,
      futureUpdates,
      ratings
    };
    
    addMix(newMix);
    toast.success('Mix entry saved successfully!');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="pt-24 pb-16 px-4 container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(-1)}
              className="mr-4"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-slate-800">New Mix Entry</h1>
          </div>
          <Button onClick={handleSubmit}>
            <Save className="mr-1 h-4 w-4" />
            Save Mix
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="shadow-soft border border-slate-200 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-slate-800">
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input 
                    id="date" 
                    type="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="venue">Venue</Label>
                  <Input 
                    id="venue" 
                    placeholder="Enter venue name" 
                    value={venue} 
                    onChange={(e) => setVenue(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="artist">Artist/Band</Label>
                  <Input 
                    id="artist" 
                    placeholder="Enter artist/band name" 
                    value={artist} 
                    onChange={(e) => setArtist(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event">Event</Label>
                  <Input 
                    id="event" 
                    placeholder="Enter event name" 
                    value={event} 
                    onChange={(e) => setEvent(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft border border-slate-200 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-slate-800">
                Mix Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="generalNotes">General Notes</Label>
                <Textarea 
                  id="generalNotes" 
                  placeholder="Overall thoughts on the mix..." 
                  value={generalNotes} 
                  onChange={(e) => setGeneralNotes(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="roomMixNotes">Room Mix Notes</Label>
                <Textarea 
                  id="roomMixNotes" 
                  placeholder="Notes about the room mix..." 
                  value={roomMixNotes} 
                  onChange={(e) => setRoomMixNotes(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="livestreamMixNotes">Livestream Mix Notes</Label>
                <Textarea 
                  id="livestreamMixNotes" 
                  placeholder="Notes about the livestream mix..." 
                  value={livestreamMixNotes} 
                  onChange={(e) => setLivestreamMixNotes(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="inEarMixNotes">In-Ear Mix Notes</Label>
                <Textarea 
                  id="inEarMixNotes" 
                  placeholder="Notes about the in-ear monitor mix..." 
                  value={inEarMixNotes} 
                  onChange={(e) => setInEarMixNotes(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="futureUpdates">Future Updates</Label>
                <Textarea 
                  id="futureUpdates" 
                  placeholder="Changes to try for next time..." 
                  value={futureUpdates} 
                  onChange={(e) => setFutureUpdates(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft border border-slate-200 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-slate-800">
                Mix Ratings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-8">
                  <RatingSlider 
                    label="Clarity" 
                    value={ratings.clarity} 
                    onChange={(value) => handleRatingChange('clarity', value)} 
                  />
                  <RatingSlider 
                    label="Balance" 
                    value={ratings.balance} 
                    onChange={(value) => handleRatingChange('balance', value)} 
                  />
                  <RatingSlider 
                    label="Vocals" 
                    value={ratings.vocals} 
                    onChange={(value) => handleRatingChange('vocals', value)} 
                  />
                  <RatingSlider 
                    label="Instruments" 
                    value={ratings.instruments} 
                    onChange={(value) => handleRatingChange('instruments', value)} 
                  />
                  <RatingSlider 
                    label="Low End" 
                    value={ratings.lowEnd} 
                    onChange={(value) => handleRatingChange('lowEnd', value)} 
                  />
                </div>
                <div className="space-y-8">
                  <RatingSlider 
                    label="Stereo Image" 
                    value={ratings.stereoImage} 
                    onChange={(value) => handleRatingChange('stereoImage', value)} 
                  />
                  <RatingSlider 
                    label="Dynamics" 
                    value={ratings.dynamics} 
                    onChange={(value) => handleRatingChange('dynamics', value)} 
                  />
                  <RatingSlider 
                    label="Effects" 
                    value={ratings.effects} 
                    onChange={(value) => handleRatingChange('effects', value)} 
                  />
                  <RatingSlider 
                    label="Overall" 
                    value={ratings.overall} 
                    onChange={(value) => handleRatingChange('overall', value)} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button type="submit" size="lg">
              <Save className="mr-1 h-4 w-4" />
              Save Mix Entry
            </Button>
          </div>
        </form>
      </main>
      
      <footer className="py-6 border-t border-slate-200 bg-white">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          Mix Notes • Keep track of your sound engineering progress
        </div>
      </footer>
    </div>
  );
};

export default NewMixEntry;
