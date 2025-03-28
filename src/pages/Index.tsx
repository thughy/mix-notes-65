
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import RecentMixes from '@/components/RecentMixes';
import MixDetail from '@/components/MixDetail';
import { useMixStore } from '@/utils/mixStore';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUser } from '@clerk/clerk-react';

const Index = () => {
  const navigate = useNavigate();
  const { state, deleteMix, setActiveMix } = useMixStore();
  const isMobile = useIsMobile();
  const { isSignedIn, user } = useUser();
  
  useEffect(() => {
    if (state.mixes.length > 0 && !state.activeMixId) {
      setActiveMix(state.mixes[0].id);
    }
  }, [state.mixes, state.activeMixId, setActiveMix]);
  
  const activeMix = state.mixes.find(mix => mix.id === state.activeMixId);
  
  const handleDeleteMix = (id: string) => {
    deleteMix(id);
    if (state.mixes.length > 1) {
      const newActiveId = state.mixes.find(mix => mix.id !== id)?.id;
      if (newActiveId) setActiveMix(newActiveId);
    }
  };
  
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="pt-24 pb-16 px-4 container mx-auto">
        {!isSignedIn ? (
          <div className="bg-white rounded-lg shadow-soft border border-slate-200 p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Welcome to Mix Notes</h2>
            <p className="text-slate-600 mb-6 max-w-lg mx-auto">
              Please sign in to access your mix entries or create a new account.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/login')}>
                Sign In
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/register')}>
                Create Account
              </Button>
            </div>
          </div>
        ) : state.mixes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-soft border border-slate-200 p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Welcome to Mix Notes, {user?.firstName || user?.primaryEmailAddress?.emailAddress.split('@')[0]}</h2>
            <p className="text-slate-600 mb-6 max-w-lg mx-auto">
              Start tracking your sound engineering progress by creating your first mix entry.
              Log your thoughts, track ratings, and see your improvement over time.
            </p>
            <Button size="lg" onClick={() => navigate('/new')}>
              Create Your First Mix Entry
            </Button>
          </div>
        ) : isMobile ? (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-slate-800">
                Mix Entries
              </h2>
            </div>
            
            <div>
              <RecentMixes
                mixes={state.mixes}
                onSelectMix={setActiveMix}
                selectedMixId={state.activeMixId}
              />
              
              {activeMix && (
                <div className="mt-6">
                  <MixDetail
                    mix={activeMix}
                    onDelete={handleDeleteMix}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <RecentMixes
                mixes={state.mixes}
                onSelectMix={setActiveMix}
                selectedMixId={state.activeMixId}
              />
            </div>
            
            <div className="lg:col-span-2">
              {activeMix && (
                <MixDetail
                  mix={activeMix}
                  onDelete={handleDeleteMix}
                />
              )}
            </div>
          </div>
        )}
      </main>
      
      <footer className="py-6 border-t border-slate-200 bg-white">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          Mix Notes by Worship Sound Guy
        </div>
      </footer>
    </div>
  );
};

export default Index;
