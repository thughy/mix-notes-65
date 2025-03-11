
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
  const peakFrequencyRef = useRef<number>(0);

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

  // Find the peak frequency
  const findPeakFrequency = (dataArray: Uint8Array, sampleRate: number): number => {
    let maxValue = 0;
    let maxIndex = 0;
    const bufferLength = dataArray.length;
    
    for (let i = 0; i < bufferLength; i++) {
      if (dataArray[i] > maxValue) {
        maxValue = dataArray[i];
        maxIndex = i;
      }
    }
    
    // Convert index to frequency
    const nyquist = sampleRate / 2;
    const frequencyBinWidth = nyquist / bufferLength;
    return Math.round(maxIndex * frequencyBinWidth);
  };

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
      
      // Find peak frequency
      if (audioContextRef.current) {
        peakFrequencyRef.current = findPeakFrequency(dataArray, audioContextRef.current.sampleRate);
      }
      
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
      ctx.fillStyle = '#1e293b'; // Dark slate background
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid lines
      ctx.strokeStyle = '#334155'; // Slate-700
      ctx.lineWidth = 1;
      
      // Horizontal grid lines (at -20dB, -40dB, -60dB, -80dB)
      for (let i = 1; i < 5; i++) {
        const y = (i * canvas.height) / 5;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Vertical grid lines (at frequency markers)
      const markers = [50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];
      markers.forEach(freq => {
        const xPos = getXForFrequency(freq);
        ctx.beginPath();
        ctx.moveTo(xPos, 0);
        ctx.lineTo(xPos, canvas.height);
        ctx.stroke();
      });
      
      // Draw FFT spectrum with current opacity
      ctx.globalAlpha = opacity;
      
      // Calculate logarithmic frequency scale from 20Hz to 20kHz
      const nyquist = audioContextRef.current!.sampleRate / 2;
      const minFreq = 20; // 20Hz
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
      
      // Draw filled area using path
      ctx.beginPath();
      ctx.moveTo(0, canvas.height); // Start at bottom left
      
      // Generate logarithmically spaced frequency points
      const frequencies: number[] = [];
      let freq = minFreq;
      
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
      
      // Draw the path for the filled area
      frequencies.forEach((f, i) => {
        const x = getXForFrequency(f);
        const dataIndex = getDataIndexForFrequency(f);
        
        if (dataIndex >= averagedData.length) return;
        
        const value = averagedData[dataIndex];
        // Invert the value since -80dB is at the bottom
        const y = canvas.height - (value / 255) * canvas.height;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      // Complete the path by going to the bottom right and back to bottom left
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      
      // Fill with a gradient from red to darker red
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(220, 38, 38, 0.9)'); // Red-600
      gradient.addColorStop(1, 'rgba(185, 28, 28, 0.7)'); // Red-700
      
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Draw a white line for the outline of the spectrum
      ctx.beginPath();
      frequencies.forEach((f, i) => {
        const x = getXForFrequency(f);
        const dataIndex = getDataIndexForFrequency(f);
        
        if (dataIndex >= averagedData.length) return;
        
        const value = averagedData[dataIndex];
        const y = canvas.height - (value / 255) * canvas.height;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Draw peak frequency display
      ctx.globalAlpha = 1; // Ensure text is fully opaque
      ctx.fillStyle = '#f8fafc'; // Slate-50
      ctx.font = '12px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`Peak: ${peakFrequencyRef.current}Hz`, 10, 20);
      
      // Reset opacity for frequency labels
      ctx.globalAlpha = 1;
      
      // Draw frequency axis labels at the bottom
      ctx.fillStyle = '#94a3b8'; // Slate-400
      ctx.font = '11px system-ui, sans-serif';
      ctx.textAlign = 'center';
      
      // Add frequency markers
      const frequencyLabels = [50, 100, 200, 500, '1k', '2k', '5k', '10k', '20k'];
      const frequencyValues = [50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];
      
      frequencyValues.forEach((freq, i) => {
        const xPos = getXForFrequency(freq);
        ctx.fillText(frequencyLabels[i].toString(), xPos, canvas.height - 5);
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
