
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, GitCompare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import ProgressChart from '@/components/ProgressChart';
import { useMixStore } from '@/utils/mixStore';

const CompareMixes = () => {
  const navigate = useNavigate();
  const { state } = useMixStore();
  
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="pt-24 pb-16 px-4 container mx-auto">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="mr-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-slate-800">Compare Mixes</h1>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <ProgressChart mixes={state.mixes} />
        </div>
      </main>
      
      <footer className="py-6 border-t border-slate-200 bg-white">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          Mix Notes by Worship Sound Guy
        </div>
      </footer>
    </div>
  );
};

export default CompareMixes;
