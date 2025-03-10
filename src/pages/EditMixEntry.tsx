
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import Header from '@/components/Header';
import MixForm from '@/components/MixForm';
import { MixEntry, MixRatings } from '@/types';
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

const initialFormData = {
  date: new Date().toISOString().split('T')[0],
  venue: '',
  artist: '',
  event: '',
  generalNotes: '',
  roomMixNotes: '',
  livestreamMixNotes: '',
  inEarMixNotes: '',
  futureUpdates: '',
  ratings: initialRatings,
  audioSrc: undefined,
  youtubeUrl: undefined
};

const EditMixEntry = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getMixById, updateMix } = useMixStore();
  
  const [mixData, setMixData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(true);

  // Load mix data on component mount
  useEffect(() => {
    if (id) {
      const mix = getMixById(id);
      if (mix) {
        setMixData({
          date: mix.date,
          venue: mix.venue,
          artist: mix.artist,
          event: mix.event || '',
          generalNotes: mix.generalNotes || '',
          roomMixNotes: mix.roomMixNotes || '',
          livestreamMixNotes: mix.livestreamMixNotes || '',
          inEarMixNotes: mix.inEarMixNotes || '',
          futureUpdates: mix.futureUpdates || '',
          ratings: mix.ratings,
          audioSrc: mix.audioSrc,
          youtubeUrl: mix.youtubeUrl
        });
      } else {
        toast.error('Mix not found');
        navigate('/');
      }
    }
    setIsLoading(false);
  }, [id, getMixById, navigate]);

  const handleSubmit = (formData: any) => {
    if (!id) {
      toast.error('Mix ID is missing');
      return;
    }
    
    if (!formData.venue || !formData.artist) {
      toast.error('Please fill out venue and artist fields');
      return;
    }
    
    const updatedMix: Partial<MixEntry> = formData;
    
    console.log('Updating mix with data:', updatedMix);
    
    updateMix(id, updatedMix);
    toast.success('Mix entry updated successfully!');
    
    // Navigate after a small delay to ensure state update completes
    setTimeout(() => {
      navigate('/');
    }, 500);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="pt-24 pb-16 px-4 container mx-auto flex items-center justify-center">
          <div className="text-slate-500">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="pt-24 pb-16 px-4 container mx-auto">
        <MixForm
          initialData={mixData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitButtonText="Update Mix Entry"
          title="Edit Mix Entry"
        />
      </main>
      
      <footer className="py-6 border-t border-slate-200 bg-white">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          Mix Notes by Worship Sound Guy
        </div>
      </footer>
    </div>
  );
};

export default EditMixEntry;
