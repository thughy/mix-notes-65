
import { useEffect, useRef, useState } from 'react';

interface AudioWaveformProps {
  audioSrc: string;
  frequencyFilter?: {
    type: 'lowpass' | 'bandpass' | 'highpass';
    low: number;
    high?: number;
  };
}

const AudioWaveform = ({ audioSrc, frequencyFilter }: AudioWaveformProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Initialize audio context and analyzer
  useEffect(() => {
    if (!audioSrc) return;

    const initAudio = () => {
      // Create audio context
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;

      // Connect audio element to analyzer
      if (audioRef.current) {
        sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
        
        // Create filter if frequency filter is provided
        if (frequencyFilter) {
          filterRef.current = audioContextRef.current.createBiquadFilter();
          
          if (frequencyFilter.type === 'lowpass') {
            filterRef.current.type = 'lowpass';
            filterRef.current.frequency.value = frequencyFilter.high || frequencyFilter.low;
          } else if (frequencyFilter.type === 'highpass') {
            filterRef.current.type = 'highpass';
            filterRef.current.frequency.value = frequencyFilter.low;
          } else if (frequencyFilter.type === 'bandpass') {
            filterRef.current.type = 'bandpass';
            filterRef.current.frequency.value = (frequencyFilter.low + (frequencyFilter.high || 0)) / 2;
            filterRef.current.Q.value = 1.0; // Q factor for bandpass width
          }
          
          // Connect source to filter to analyzer to destination
          sourceRef.current.connect(filterRef.current);
          filterRef.current.connect(analyserRef.current);
          analyserRef.current.connect(audioContextRef.current.destination);
        } else {
          // Connect source directly to analyzer to destination
          sourceRef.current.connect(analyserRef.current);
          analyserRef.current.connect(audioContextRef.current.destination);
        }
      }
    };

    initAudio();

    // Cleanup
    return () => {
      if (audioContextRef.current) {
        if (audioContextRef.current.state !== 'closed') {
          audioContextRef.current.close();
        }
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [audioSrc, frequencyFilter]);

  // Draw waveform on canvas
  useEffect(() => {
    if (!canvasRef.current || !analyserRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      
      analyserRef.current!.getByteTimeDomainData(dataArray);
      
      ctx.fillStyle = 'rgb(240, 240, 240)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.lineWidth = 2;
      ctx.strokeStyle = frequencyFilter ? 'rgb(0, 100, 220)' : 'rgb(0, 150, 255)';
      ctx.beginPath();
      
      const sliceWidth = canvas.width / bufferLength;
      let x = 0;
      
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * (canvas.height / 2);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        
        x += sliceWidth;
      }
      
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };

    if (isPlaying) {
      draw();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, frequencyFilter]);

  // Handle play/pause
  const togglePlayback = () => {
    if (!audioRef.current) return;
    
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }
    
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="space-y-4">
      <canvas 
        ref={canvasRef} 
        className="w-full h-32 bg-slate-100 rounded-md border border-slate-200"
        width={1000}
        height={200}
      />
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
