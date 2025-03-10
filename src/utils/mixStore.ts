
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { MixEntry, MixStoreState } from '@/types';

// Mock data for initial state
const initialMixes: MixEntry[] = [
  {
    id: uuidv4(),
    date: new Date().toISOString().split('T')[0],
    venue: 'Horizon Auditorium',
    artist: 'Crystal Echoes',
    event: 'Summer Tour 2023',
    generalNotes: 'Overall good performance. Acoustic treatment in venue helped with clarity.',
    roomMixNotes: 'Main speakers well balanced, but needed more subs in the back of the venue.',
    livestreamMixNotes: 'Compression settings need refinement. Stream feedback indicated good vocal clarity.',
    inEarMixNotes: 'Vocalist requested more reverb in their mix. Guitarist needed more click track.',
    futureUpdates: 'Add an extra mic for the acoustic guitar. Adjust drum overheads position.',
    ratings: {
      clarity: 7,
      balance: 8,
      vocals: 9,
      instruments: 7,
      lowEnd: 6,
      stereoImage: 8,
      dynamics: 7,
      effects: 8,
      overall: 8
    },
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: uuidv4(),
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    venue: 'Riverside Club',
    artist: 'The Amplifiers',
    event: 'Weekend Sessions',
    generalNotes: 'Small venue with challenging acoustics. Good crowd response.',
    roomMixNotes: 'Had to cut a lot of low-mids to avoid muddiness. Ceiling reflections were problematic.',
    livestreamMixNotes: 'Used more aggressive HPF on all channels for the stream mix.',
    inEarMixNotes: 'Band was happy with the monitor mix. Drummer requested more kick in the future.',
    futureUpdates: 'Bring extra acoustic treatment panels. Consider different mic placement for drums.',
    ratings: {
      clarity: 6,
      balance: 6,
      vocals: 8,
      instruments: 7,
      lowEnd: 5,
      stereoImage: 6,
      dynamics: 7,
      effects: 7,
      overall: 6
    },
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 7 * 24 * 60 * 60 * 1000
  }
];

// Local storage key
const LOCAL_STORAGE_KEY = 'sound_engineer_mix_logs';

// Create a hook for managing mix data
export const useMixStore = () => {
  // Initialize state from localStorage or with default data
  const [state, setState] = useState<MixStoreState>(() => {
    try {
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      return storedData ? JSON.parse(storedData) : { mixes: initialMixes, activeMixId: null };
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      return { mixes: initialMixes, activeMixId: null };
    }
  });

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
      console.log('Saved to localStorage:', state);
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  }, [state]);

  // Actions for managing mixes
  const addMix = (mix: Omit<MixEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const timestamp = Date.now();
    const newMix: MixEntry = {
      ...mix,
      id: uuidv4(),
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    console.log('Adding new mix:', newMix);
    
    setState((prev) => {
      const updatedState = {
        ...prev,
        mixes: [newMix, ...prev.mixes],
        activeMixId: newMix.id
      };
      console.log('Updated state after adding mix:', updatedState);
      return updatedState;
    });
  };

  const updateMix = (id: string, updates: Partial<MixEntry>) => {
    console.log('Updating mix with ID:', id, 'Updates:', updates);
    setState(prev => {
      const updatedMixes = prev.mixes.map(mix => 
        mix.id === id 
          ? { ...mix, ...updates, updatedAt: Date.now() } 
          : mix
      );
      console.log('Updated mixes array:', updatedMixes);
      return {
        ...prev,
        mixes: updatedMixes
      };
    });
  };

  const deleteMix = (id: string) => {
    setState(prev => ({
      ...prev,
      mixes: prev.mixes.filter(mix => mix.id !== id),
      activeMixId: prev.activeMixId === id ? null : prev.activeMixId
    }));
  };

  const setActiveMix = (id: string | null) => {
    setState(prev => ({
      ...prev,
      activeMixId: id
    }));
  };

  const getActiveMix = () => {
    return state.mixes.find(mix => mix.id === state.activeMixId);
  };
  
  const getMixById = (id: string) => {
    return state.mixes.find(mix => mix.id === id);
  };

  return {
    state,
    addMix,
    updateMix,
    deleteMix,
    setActiveMix,
    getActiveMix,
    getMixById
  };
};
