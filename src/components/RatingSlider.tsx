
import { useState, useEffect, useRef } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { RatingCategory } from '@/types';

// Map of rating categories to descriptive labels
const ratingLabels: Record<RatingCategory, string> = {
  clarity: 'Clarity & Definition',
  balance: 'Tonal Balance',
  vocals: 'Vocal Presence',
  instruments: 'Instrument Separation',
  lowEnd: 'Low End Control',
  stereoImage: 'Stereo Image',
  dynamics: 'Dynamic Range',
  effects: 'Effects & Processing',
  overall: 'Overall Mix Quality'
};

// Descriptions for the rating values
const ratingDescriptions: Record<number, string> = {
  1: 'Poor',
  2: 'Problematic',
  3: 'Below Average',
  4: 'Fair',
  5: 'Average',
  6: 'Above Average',
  7: 'Good',
  8: 'Very Good',
  9: 'Excellent',
  10: 'Outstanding'
};

interface RatingSliderProps {
  category: RatingCategory;
  value: number;
  onChange: (value: number) => void;
}

const RatingSlider = ({ category, value, onChange }: RatingSliderProps) => {
  const [localValue, setLocalValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (newValue: number[]) => {
    const value = newValue[0];
    setLocalValue(value);
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    
    // Debounce the onChange callback
    timeoutRef.current = window.setTimeout(() => {
      onChange(value);
    }, 300);
    
    // Trigger animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div className="mb-6 group">
      <div className="flex justify-between items-center mb-2">
        <Label 
          htmlFor={`slider-${category}`}
          className="text-sm font-medium text-slate-800 dark:text-slate-200 transition-colors group-hover:text-blue-700 dark:group-hover:text-blue-400"
        >
          {ratingLabels[category]}
        </Label>
        <div 
          className={`px-2 py-1 text-xs font-semibold rounded-full transition-all duration-300 
            ${isAnimating ? 'scale-110 text-white bg-blue-600' : 'bg-blue-100 text-blue-800'}`}
        >
          {localValue} - {ratingDescriptions[localValue] || ''}
        </div>
      </div>
      
      <Slider
        id={`slider-${category}`}
        defaultValue={[value]}
        max={10}
        min={1}
        step={1}
        onValueChange={handleChange}
        className="py-1"
      />
      
      <div className="flex justify-between px-1 mt-1 text-xs text-slate-500">
        <span>1</span>
        <span className="hidden sm:inline">3</span>
        <span className="hidden md:inline">5</span>
        <span className="hidden sm:inline">7</span>
        <span>10</span>
      </div>
    </div>
  );
};

export default RatingSlider;
