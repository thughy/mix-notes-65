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
  const [isPlaying, setIsPlaying] = useState(false);

  // Initialize audio context and analyzer
  useEffect(() => {
    if (!audioSrc) return;

    const initAudio = () => {
      // Create audio context
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      
      // Configure analyzer for FFT display
      analyserRef.current.fftSize = 2048;
      analyserRef.current.smoothingTimeConstant = 0.8;

      // Connect audio element to analyzer
      if (audioRef.current) {
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
    };
  }, [audioSrc]);

  // Draw FFT spectrum on canvas
  useEffect(() => {
    if (!canvasRef.current || !analyserRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    // Initialize history array for 5-second averaging (assuming 60fps)
    const historyLength = 300; // 5 seconds at 60fps
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
      ctx.fillStyle = 'rgb(240, 240, 240)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw FFT spectrum
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;
      
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (averagedData[i] / 255) * canvas.height;
        
        // Set gradient color based on frequency
        const hue = i / bufferLength * 240; // Blue to red spectrum
        ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
        
        // Draw bar
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        
        x += barWidth + 1;
        
        // Only display the lower half of the spectrum (more meaningful for audio)
        if (x > canvas.width) break;
      }
      
      // Draw frequency axis labels
      ctx.fillStyle = 'rgb(80, 80, 80)';
      ctx.font = '10px Arial';
      
      // Calculate some frequency markers (logarithmic scale)
      const nyquist = audioContextRef.current!.sampleRate / 2;
      const markers = [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];
      
      markers.forEach(freq => {
        if (freq <= nyquist) {
          const xPos = (freq / nyquist) * (canvas.width / 2);
          ctx.fillText(`${freq < 1000 ? freq : (freq/1000) + 'k'}`, xPos, canvas.height - 5);
        }
      });
      
      // Draw amplitude axis label
      ctx.save();
      ctx.translate(10, canvas.height / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('Amplitude (dB)', 0, 0);
      ctx.restore();
    };

    if (isPlaying) {
      draw();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);

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
