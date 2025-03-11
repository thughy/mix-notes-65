import { useEffect, useRef, useState } from 'react';
import { createAudioContext, createAnalyzer, connectAudioElementToAnalyzer } from '@/utils/audioContext';

interface UseAudioVisualizationProps {
  audioSrc: string;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  audioRef: React.RefObject<HTMLAudioElement>;
}

interface UseAudioVisualizationReturn {
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  opacity: number;
}

export const useAudioVisualization = ({ 
  audioSrc, 
  canvasRef, 
  audioRef 
}: UseAudioVisualizationProps): UseAudioVisualizationReturn => {
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
      // Check if we already have an audio context
      if (!audioContextRef.current) {
        audioContextRef.current = createAudioContext();
        analyserRef.current = createAnalyzer(audioContextRef.current);
      }

      // Connect audio element to analyzer if not already connected
      if (audioRef.current && !sourceRef.current) {
        sourceRef.current = connectAudioElementToAnalyzer(
          audioContextRef.current,
          analyserRef.current,
          audioRef.current
        );
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
      
      // Calculate logarithmic frequency scale from 1Hz to 20kHz
      const nyquist = audioContextRef.current!.sampleRate / 2;
      const minFreq = 1; // 1Hz
      const maxFreq = 20000; // 20kHz
      
      const getXForFrequency = (freq: number) => {
        // Use logarithmic scale for better visualization of lower frequencies
        const logMin = Math.log10(minFreq);
        const logMax = Math.log10(maxFreq);
        const xPos = (Math.log10(freq) - logMin) / (logMax - logMin) * canvas.width;
        return xPos;
      };
      
      const getDataIndexForFrequency = (freq: number) => {
        // Map frequency to FFT bin index
        return Math.round((freq / nyquist) * (bufferLength - 1));
      };
      
      // Draw frequency bands using logarithmic scale
      const frequencies: number[] = [];
      let freq = minFreq;
      
      // Generate logarithmically spaced frequency points
      while (freq <= maxFreq) {
        frequencies.push(freq);
        // Increase by smaller steps at lower frequencies for better resolution
        if (freq < 100) {
          freq += 5;
        } else if (freq < 1000) {
          freq += 50;
        } else if (freq < 10000) {
          freq += 500;
        } else {
          freq += 1000;
        }
      }
      
      // Draw each frequency band
      for (let i = 0; i < frequencies.length - 1; i++) {
        const f1 = frequencies[i];
        const f2 = frequencies[i + 1];
        
        const x1 = getXForFrequency(f1);
        const x2 = getXForFrequency(f2);
        const width = x2 - x1;
        
        // Get data for this frequency
        const dataIndex = getDataIndexForFrequency(f1);
        if (dataIndex >= averagedData.length) continue;
        
        const value = averagedData[dataIndex];
        const barHeight = (value / 255) * canvas.height;
        
        // Create gradient color based on frequency and amplitude
        const gradient = ctx.createLinearGradient(x1, canvas.height, x1, canvas.height - barHeight);
        gradient.addColorStop(0, `rgb(46, 150, 255)`); // Blue-500
        gradient.addColorStop(1, `rgb(184, 219, 255)`); // Blue-200
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x1, canvas.height - barHeight, width, barHeight);
      }
      
      // Reset opacity for labels
      ctx.globalAlpha = 1;
      
      // Draw frequency axis labels
      ctx.fillStyle = 'rgb(100, 116, 139)'; // slate-500 for readable labels
      ctx.font = '10px system-ui, sans-serif';
      ctx.textAlign = 'center';
      
      // Add frequency markers
      const markers = [1, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];
      
      markers.forEach(freq => {
        const xPos = getXForFrequency(freq);
        
        // Draw small tick mark
        ctx.fillRect(xPos, canvas.height - 12, 1, 4);
        
        // Format label text
        let label;
        if (freq >= 1000) {
          label = `${freq/1000}kHz`;
        } else if (freq === 1) {
          label = `${freq}Hz`;
        } else {
          label = `${freq}Hz`;
        }
        
        ctx.fillText(label, xPos, canvas.height - 2);
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

  return { isPlaying, setIsPlaying, opacity };
};
