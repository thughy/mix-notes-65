
import { useRef } from 'react';
import { useAudioVisualization } from '@/hooks/useAudioVisualization';

interface AudioWaveformProps {
  audioSrc: string;
}

const AudioWaveform = ({ audioSrc }: AudioWaveformProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const { isPlaying, setIsPlaying } = useAudioVisualization({
    audioSrc,
    canvasRef,
    audioRef
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        <canvas 
          ref={canvasRef} 
          className="w-full h-60 bg-slate-900 rounded-md border border-slate-700"
          width={1200}
          height={300}
        />
        <div className="absolute top-2 left-2 text-slate-300 text-xs">
          <div>-20 dB</div>
          <div className="mt-4">-40 dB</div>
          <div className="mt-4">-60 dB</div>
          <div className="mt-4">-80 dB</div>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <audio 
          ref={audioRef} 
          src={audioSrc} 
          controls 
          className="w-full" 
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        />
      </div>
    </div>
  );
};

export default AudioWaveform;
