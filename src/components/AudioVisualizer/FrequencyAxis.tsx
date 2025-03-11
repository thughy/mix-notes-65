
import React from 'react';

interface FrequencyAxisProps {
  getXForFrequency: (freq: number) => number;
  markers: number[];
}

const FrequencyAxis: React.FC<FrequencyAxisProps> = ({ getXForFrequency, markers }) => {
  return (
    <div className="relative w-full h-4 mt-1">
      {markers.map(freq => {
        const label = freq >= 1000 ? `${freq/1000}kHz` : `${freq}Hz`;
        const leftPosition = `${(getXForFrequency(freq) / 12)}%`;
        
        return (
          <div 
            key={freq} 
            className="absolute -translate-x-1/2 flex flex-col items-center"
            style={{ left: leftPosition }}
          >
            <div className="w-px h-2 bg-slate-500"></div>
            <span className="text-xs text-slate-500">{label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default FrequencyAxis;
