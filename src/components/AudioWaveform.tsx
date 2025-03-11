
import { useEffect, useRef, useState } from 'react';

interface AudioWaveformProps {
  audioSrc: string;
}

const AudioWaveform = ({ audioSrc }: AudioWaveformProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const dataHistoryRef = useRef<Array<Uint8Array>>([]);
  const fadeTimeoutRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [opacity, setOpacity] = useState(1);

  // Initialize audio context and analyzer
  useEffect(() => {
    if (!audioSrc) return;

    const initAudio = () => {
      // Create audio context
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      
      // Check if we already have an audio context
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
        analyserRef.current = audioContextRef.current.createAnalyser();
        
        // Configure analyzer for FFT display
        analyserRef.current.fftSize = 2048;
        analyserRef.current.smoothingTimeConstant = 0.8;
      }

      // Connect audio element to analyzer if not already connected
      if (audioRef.current && !sourceRef.current) {
        sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
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
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }
      // Reset source reference so it can be recreated for new audio elements
      sourceRef.current = null;
    };
  }, [audioSrc]);

  // Handle fade effect when paused/played
  useEffect(() => {
    if (isPlaying) {
      // Fade in when playing starts
      setOpacity(1);
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
        fadeTimeoutRef.current = null;
      }
    } else {
      // Fade out over 2 seconds when paused
      const startTime = Date.now();
      const duration = 2000; // 2 seconds
      const initialOpacity = 1;
      const targetOpacity = 0;
      
      const fadeOut = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentOpacity = initialOpacity - progress * (initialOpacity - targetOpacity);
        
        setOpacity(currentOpacity);
        
        if (progress < 1) {
          fadeTimeoutRef.current = window.setTimeout(fadeOut, 16); // ~60fps
        } else {
          fadeTimeoutRef.current = null;
        }
      };
      
      fadeOut();
    }
    
    return () => {
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }
    };
  }, [isPlaying]);

  // Draw FFT spectrum on canvas
  useEffect(() => {
    if (!canvasRef.current || !analyserRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    // Initialize history array for 2-second averaging (assuming 60fps)
    const historyLength = 120; // 2 seconds at 60fps
    dataHistoryRef.current = [];

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      
      // Get frequency data
      analyserRef.current!.getByteFrequencyData(dataArray);
      
      // Add current data to history
      dataHistoryRef.current.push(new Uint8Array(dataArray));
      
      // Keep history at max length
      if (dataHistoryRef.current.length > historyLength) {
        dataHistoryRef.current.shift();
      }
      
      // Calculate average over history
      const averagedData = new Uint8Array(bufferLength);
      if (dataHistoryRef.current.length > 0) {
        for (let i = 0; i < bufferLength; i++) {
          let sum = 0;
          for (let j = 0; j < dataHistoryRef.current.length; j++) {
            sum += dataHistoryRef.current[j][i];
          }
          averagedData[i] = Math.round(sum / dataHistoryRef.current.length);
        }
      }
      
      // Clear canvas
      ctx.fillStyle = 'rgb(248, 250, 252)'; // Use slate-50 for background
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw FFT spectrum with current opacity
      ctx.globalAlpha = opacity;
      
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;
      
      // Calculate max frequency to display (20kHz)
      const nyquist = audioContextRef.current!.sampleRate / 2;
      const maxFreqFraction = Math.min(20000 / nyquist, 1);
      const maxBinIndex = Math.floor(bufferLength * maxFreqFraction);
      
      for (let i = 0; i < maxBinIndex; i++) {
        const barHeight = (averagedData[i] / 255) * canvas.height;
        
        // Calculate blue gradient based on position and amplitude
        const blueValue = Math.max(140 - averagedData[i] / 2, 0);
        const gradient = ctx.createLinearGradient(x, canvas.height, x, canvas.height - barHeight);
        gradient.addColorStop(0, `rgb(46, 150, 255)`); // Blue-500
        gradient.addColorStop(1, `rgb(184, 219, 255)`); // Blue-200
        
        ctx.fillStyle = gradient;
        
        // Draw bar
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        
        x += barWidth + 1;
        
        // Only display up to 20kHz
        if (x > canvas.width) break;
      }
      
      // Reset opacity for labels
      ctx.globalAlpha = 1;
      
      // Draw frequency axis labels
      ctx.fillStyle = 'rgb(100, 116, 139)'; // slate-500 for readable labels
      ctx.font = '10px system-ui, sans-serif';
      ctx.textAlign = 'center';
      
      // Add frequency markers as requested
      const markers = [50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];
      
      markers.forEach(freq => {
        if (freq <= nyquist) {
          // Calculate x position as fraction of visible spectrum (0-20kHz)
          const xPos = (freq / 20000) * canvas.width;
          
          // Draw small tick mark
          ctx.fillRect(xPos, canvas.height - 12, 1, 4);
          
          // Draw frequency label
          const label = freq >= 1000 ? `${freq/1000}kHz` : `${freq}Hz`;
          ctx.fillText(label, xPos, canvas.height - 2);
        }
      });
    };

    if (isPlaying) {
      draw();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, opacity]);

  return (
    <div className="space-y-4">
      <canvas 
        ref={canvasRef} 
        className="w-full h-48 bg-slate-50 rounded-md border border-slate-200"
        width={1200}
        height={300}
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
