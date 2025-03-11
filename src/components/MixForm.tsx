
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { MixRatings, RatingCategory } from '@/types';
import FormHeader from './mix-form/FormHeader';
import BasicInfoSection from './mix-form/BasicInfoSection';
import NotesSection from './mix-form/NotesSection';
import AudioSection from './mix-form/AudioSection';
import YoutubeSection from './mix-form/YoutubeSection';
import RatingsSection from './mix-form/RatingsSection';

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
  onSubmit: (formData: any, audioFile?: File) => void;
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
  // Basic information state
  const [date, setDate] = useState(initialData.date);
  const [venue, setVenue] = useState(initialData.venue);
  const [artist, setArtist] = useState(initialData.artist);
  const [event, setEvent] = useState(initialData.event);
  
  // Notes state
  const [generalNotes, setGeneralNotes] = useState(initialData.generalNotes);
  const [roomMixNotes, setRoomMixNotes] = useState(initialData.roomMixNotes);
  const [livestreamMixNotes, setLivestreamMixNotes] = useState(initialData.livestreamMixNotes);
  const [inEarMixNotes, setInEarMixNotes] = useState(initialData.inEarMixNotes);
  const [futureUpdates, setFutureUpdates] = useState(initialData.futureUpdates);
  
  // Ratings state
  const [ratings, setRatings] = useState<MixRatings>(initialData.ratings);
  
  // Audio and YouTube state
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | undefined>(initialData.audioSrc);
  const [youtubeUrl, setYoutubeUrl] = useState(initialData.youtubeUrl || '');

  const handleRatingChange = (category: RatingCategory, value: number) => {
    setRatings(prev => ({
      ...prev,
      [category]: value
    }));
  };

  useEffect(() => {
    return () => {
      if (audioSrc && audioSrc.startsWith('blob:')) {
        URL.revokeObjectURL(audioSrc);
      }
    };
  }, [audioSrc]);

  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return '';
    
    if (url.includes('embed')) {
      return url;
    }
    
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
    
    onSubmit(formData, audioFile || undefined);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormHeader 
        title={title} 
        submitButtonText={submitButtonText} 
        onCancel={onCancel} 
      />
      
      <BasicInfoSection 
        date={date}
        venue={venue}
        artist={artist}
        event={event}
        setDate={setDate}
        setVenue={setVenue}
        setArtist={setArtist}
        setEvent={setEvent}
      />
      
      <NotesSection 
        generalNotes={generalNotes}
        roomMixNotes={roomMixNotes}
        livestreamMixNotes={livestreamMixNotes}
        inEarMixNotes={inEarMixNotes}
        futureUpdates={futureUpdates}
        setGeneralNotes={setGeneralNotes}
        setRoomMixNotes={setRoomMixNotes}
        setLivestreamMixNotes={setLivestreamMixNotes}
        setInEarMixNotes={setInEarMixNotes}
        setFutureUpdates={setFutureUpdates}
      />

      <AudioSection 
        audioFile={audioFile}
        audioSrc={audioSrc}
        setAudioFile={setAudioFile}
        setAudioSrc={setAudioSrc}
      />

      <YoutubeSection 
        youtubeUrl={youtubeUrl}
        setYoutubeUrl={setYoutubeUrl}
      />
      
      <RatingsSection 
        ratings={ratings}
        handleRatingChange={handleRatingChange}
      />
      
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
