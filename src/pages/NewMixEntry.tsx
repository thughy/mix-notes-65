
import { useNavigate } from 'react-router-dom';
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

const NewMixEntry = () => {
  const navigate = useNavigate();
  const { addMix } = useMixStore();

  const handleSubmit = (formData: any) => {
    if (!formData.venue || !formData.artist) {
      toast.error('Please fill out venue and artist fields');
      return;
    }

    console.log('Creating new mix with data:', formData);
    
    const newMix: Omit<MixEntry, 'id' | 'createdAt' | 'updatedAt'> = formData;
    
    addMix(newMix);
    toast.success('Mix entry saved successfully!');
    
    // Navigate after a small delay to ensure state update completes
    setTimeout(() => {
      navigate('/');
    }, 500);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="pt-24 pb-16 px-4 container mx-auto">
        <MixForm
          initialData={initialFormData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitButtonText="Save Mix Entry"
          title="New Mix Entry"
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

export default NewMixEntry;
