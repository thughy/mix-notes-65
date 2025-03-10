
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, Save, Upload } from 'lucide-react';
import RatingSlider from '@/components/RatingSlider';
import { MixEntry, MixRatings, RatingCategory } from '@/types';

interface MixFormProps {
  initialData: {
    date: string;
    venue: string;
    artist: string;
    event: string;
    generalNotes: string;
    roomMixNotes: string;
    livestreamMixNotes: string;
    inEarMixNotes: string;
    futureUpdates: string;
    ratings: MixRatings;
    audioSrc?: string;
    youtubeUrl?: string;
  };
  onSubmit: (formData: any) => void;
  onCancel: () => void;
  submitButtonText: string;
  title: string;
}

const MixForm = ({ 
  initialData, 
  onSubmit, 
  onCancel, 
  submitButtonText, 
  title 
}: MixFormProps) => {
  const [date, setDate] = useState(initialData.date);
  const [venue, setVenue] = useState(initialData.venue);
  const [artist, setArtist] = useState(initialData.artist);
  const [event, setEvent] = useState(initialData.event);
  const [generalNotes, setGeneralNotes] = useState(initialData.generalNotes);
  const [roomMixNotes, setRoomMixNotes] = useState(initialData.roomMixNotes);
  const [livestreamMixNotes, setLivestreamMixNotes] = useState(initialData.livestreamMixNotes);
  const [inEarMixNotes, setInEarMixNotes] = useState(initialData.inEarMixNotes);
  const [futureUpdates, setFutureUpdates] = useState(initialData.futureUpdates);
  const [ratings, setRatings] = useState<MixRatings>(initialData.ratings);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | undefined>(initialData.audioSrc);
  const [youtubeUrl, setYoutubeUrl] = useState(initialData.youtubeUrl || '');

  const handleRatingChange = (category: RatingCategory, value: number) => {
    setRatings(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      const url = URL.createObjectURL(file);
      setAudioSrc(url);
    }
  };

  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return '';
    
    // If URL already has 'embed', return it
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = {
      date,
      venue,
      artist,
      event,
      generalNotes,
      roomMixNotes,
      livestreamMixNotes,
      inEarMixNotes,
      futureUpdates,
      ratings,
      audioSrc,
      youtubeUrl: youtubeUrl ? getYoutubeEmbedUrl(youtubeUrl) : undefined
    };
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onCancel}
            className="mr-4"
            type="button"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-slate-800">{title}</h1>
        </div>
        <Button type="submit">
          <Save className="mr-1 h-4 w-4" />
          {submitButtonText}
        </Button>
      </div>
      
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
            Audio Recording
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="audioUpload">Upload Mix Recording</Label>
            <div className="flex items-center space-x-2">
              <Input 
                id="audioUpload" 
                type="file" 
                accept="audio/*"
                onChange={handleAudioUpload}
                className="flex-1"
              />
              <Button type="button" size="sm" variant="outline">
                <Upload className="h-4 w-4 mr-1" /> Upload
              </Button>
            </div>
            {audioSrc && (
              <div className="mt-4 bg-slate-100 p-4 rounded-md">
                <audio src={audioSrc} controls className="w-full" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-soft border border-slate-200 bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-slate-800">
            Livestream
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="youtubeUrl">YouTube Video Link</Label>
            <Input 
              id="youtubeUrl" 
              type="text" 
              placeholder="Paste YouTube URL here" 
              value={youtubeUrl} 
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="flex-1"
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
                category="clarity"
                value={ratings.clarity} 
                onChange={(value) => handleRatingChange('clarity', value)} 
              />
              <RatingSlider 
                category="balance"
                value={ratings.balance} 
                onChange={(value) => handleRatingChange('balance', value)} 
              />
              <RatingSlider 
                category="vocals"
                value={ratings.vocals} 
                onChange={(value) => handleRatingChange('vocals', value)} 
              />
              <RatingSlider 
                category="instruments"
                value={ratings.instruments} 
                onChange={(value) => handleRatingChange('instruments', value)} 
              />
              <RatingSlider 
                category="lowEnd"
                value={ratings.lowEnd} 
                onChange={(value) => handleRatingChange('lowEnd', value)} 
              />
            </div>
            <div className="space-y-8">
              <RatingSlider 
                category="stereoImage"
                value={ratings.stereoImage} 
                onChange={(value) => handleRatingChange('stereoImage', value)} 
              />
              <RatingSlider 
                category="dynamics"
                value={ratings.dynamics} 
                onChange={(value) => handleRatingChange('dynamics', value)} 
              />
              <RatingSlider 
                category="effects"
                value={ratings.effects} 
                onChange={(value) => handleRatingChange('effects', value)} 
              />
              <RatingSlider 
                category="overall"
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
          {submitButtonText}
        </Button>
      </div>
    </form>
  );
};

export default MixForm;
