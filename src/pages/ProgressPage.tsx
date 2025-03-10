
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import ProgressChart from '@/components/ProgressChart';
import { useMixStore } from '@/utils/mixStore';

const ProgressPage = () => {
  const navigate = useNavigate();
  const { state } = useMixStore();
  
  // Redirect to home if no mixes exist
  useEffect(() => {
    if (state.mixes.length === 0) {
      navigate('/');
    }
  }, [state.mixes, navigate]);
  
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="pt-24 pb-16 px-4 container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-slate-800">Progress Tracker</h1>
          </div>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <ProgressChart mixes={state.mixes} />
          
          <div className="mt-8 bg-white p-6 rounded-lg shadow-soft border border-slate-200">
            <h2 className="text-xl font-semibold mb-4">Understanding Your Progress</h2>
            <p className="text-slate-600 mb-4">
              This chart tracks your mix quality ratings over time. Here's how to interpret and use this data:
            </p>
            
            <ul className="space-y-3 text-slate-700">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-1.5 mr-2"></span>
                <span><strong>Track Trends:</strong> Look for upward trends in specific aspects of your mixing.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-1.5 mr-2"></span>
                <span><strong>Identify Weaknesses:</strong> Focus on categories with consistently lower ratings.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-1.5 mr-2"></span>
                <span><strong>Celebrate Improvements:</strong> Note areas where your ratings have significantly improved.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-1.5 mr-2"></span>
                <span><strong>Context Matters:</strong> Remember that venue acoustics and equipment can impact your mix quality.</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
      
      <footer className="py-6 border-t border-slate-200 bg-white">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          Mix Logger • Keep track of your sound engineering progress
        </div>
      </footer>
    </div>
  );
};

export default ProgressPage;
