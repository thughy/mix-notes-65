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
      if (!audioContextRef.current) {
        audioContextRef.current = createAudioContext();
        analyserRef.current = createAnalyzer(audioContextRef.current);
      }

      if (audioRef.current && !sourceRef.current) {
        sourceRef.current = connectAudioElementToAnalyzer(
          audioContextRef.current,
          analyserRef.current,
          audioRef.current
        );
      }
    };

    initAudio();

    return () => {
      cleanupAudio();
    };
  }, [audioSrc]);

  // Cleanup function for audio resources
  const cleanupAudio = () => {
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
    }
    
    sourceRef.current = null;
  };

  // Handle fade effect when paused/played
  useEffect(() => {
    if (isPlaying) {
      handlePlayingStart();
    } else {
      handlePlayingStop();
    }
    
    return () => {
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }
    };
  }, [isPlaying]);

  // Start visualization and reset opacity when playing starts
  const handlePlayingStart = () => {
    setOpacity(1);
    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
      fadeTimeoutRef.current = null;
    }
    startVisualization();
  };

  // Fade out when playing stops
  const handlePlayingStop = () => {
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
  };

  // Start the visualization loop
  const startVisualization = () => {
    if (!canvasRef.current || !analyserRef.current || !isPlaying) return;

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
      
      if (!analyserRef.current) return;
      
      // Get frequency data
      analyserRef.current.getByteFrequencyData(dataArray);
      
      updatePeakFrequency(dataArray);
      updateDataHistory(dataArray, historyLength);
      drawVisualization(ctx, canvas, bufferLength);
    };

    draw();
  };

  // Find the peak frequency
  const updatePeakFrequency = (dataArray: Uint8Array) => {
    if (!audioContextRef.current) return;
    
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
    const nyquist = audioContextRef.current.sampleRate / 2;
    const frequencyBinWidth = nyquist / bufferLength;
    peakFrequencyRef.current = Math.round(maxIndex * frequencyBinWidth);
  };

  // Update the data history for averaging
  const updateDataHistory = (dataArray: Uint8Array, historyLength: number) => {
    dataHistoryRef.current.push(new Uint8Array(dataArray));
    
    // Keep history at max length
    if (dataHistoryRef.current.length > historyLength) {
      dataHistoryRef.current.shift();
    }
  };

  // Draw the visualization on the canvas
  const drawVisualization = (
    ctx: CanvasRenderingContext2D, 
    canvas: HTMLCanvasElement,
    bufferLength: number
  ) => {
    if (!audioContextRef.current) return;
    
    // Calculate average over history
    const averagedData = calculateAveragedData(bufferLength);
    
    // Clear canvas
    ctx.fillStyle = '#1e293b'; // Dark slate background
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    drawGridLines(ctx, canvas);
    drawSpectrum(ctx, canvas, averagedData);
    drawLabels(ctx, canvas);
  };

  // Calculate averaged data from history
  const calculateAveragedData = (bufferLength: number): Uint8Array => {
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
    
    return averagedData;
  };

  // Draw grid lines on the canvas
  const drawGridLines = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
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
      const xPos = getXForFrequency(freq, canvas.width);
      ctx.beginPath();
      ctx.moveTo(xPos, 0);
      ctx.lineTo(xPos, canvas.height);
      ctx.stroke();
    });
  };

  // Draw the FFT spectrum
  const drawSpectrum = (
    ctx: CanvasRenderingContext2D, 
    canvas: HTMLCanvasElement,
    averagedData: Uint8Array
  ) => {
    if (!audioContextRef.current) return;
    
    // Set opacity for the spectrum
    ctx.globalAlpha = opacity;
    
    const nyquist = audioContextRef.current.sampleRate / 2;
    const minFreq = 1; // 1Hz
    const maxFreq = 20000; // 20kHz
    
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
    
    // Draw filled area
    drawFilledArea(ctx, canvas, frequencies, averagedData, nyquist);
    
    // Draw outline
    drawOutline(ctx, canvas, frequencies, averagedData, nyquist);
  };

  // Draw the filled area of the spectrum
  const drawFilledArea = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    frequencies: number[],
    averagedData: Uint8Array,
    nyquist: number
  ) => {
    // Draw filled area using path
    ctx.beginPath();
    ctx.moveTo(0, canvas.height); // Start at bottom left
    
    // Draw the path for the filled area
    frequencies.forEach((f, i) => {
      const x = getXForFrequency(f, canvas.width);
      const dataIndex = getDataIndexForFrequency(f, averagedData.length, nyquist);
      
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
  };

  // Draw the outline of the spectrum
  const drawOutline = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    frequencies: number[],
    averagedData: Uint8Array,
    nyquist: number
  ) => {
    // Draw a white line for the outline of the spectrum
    ctx.beginPath();
    frequencies.forEach((f, i) => {
      const x = getXForFrequency(f, canvas.width);
      const dataIndex = getDataIndexForFrequency(f, averagedData.length, nyquist);
      
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
  };

  // Draw labels and text on the canvas
  const drawLabels = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
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
      const xPos = getXForFrequency(freq, canvas.width);
      ctx.fillText(frequencyLabels[i].toString(), xPos, canvas.height - 5);
    });
  };

  // Utility function to get X position for a frequency
  const getXForFrequency = (freq: number, canvasWidth: number): number => {
    // Use logarithmic scale for better visualization of lower frequencies
    const minFreq = 1; // 1Hz
    const maxFreq = 20000; // 20kHz
    const logMin = Math.log10(minFreq);
    const logMax = Math.log10(maxFreq);
    const xPos = (Math.log10(freq) - logMin) / (logMax - logMin) * canvasWidth;
    return xPos;
  };

  // Utility function to get data index for a frequency
  const getDataIndexForFrequency = (freq: number, bufferLength: number, nyquist: number): number => {
    // Map frequency to FFT bin index
    return Math.round((freq / nyquist) * (bufferLength - 1));
  };

  return { isPlaying, setIsPlaying, opacity };
};
