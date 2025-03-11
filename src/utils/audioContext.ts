
// Utility for creating and managing AudioContext

// Create a single AudioContext that can be reused
export const createAudioContext = (): AudioContext => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  return new AudioContext();
};

// Create an analyzer node for frequency data
export const createAnalyzer = (audioContext: AudioContext): AnalyserNode => {
  const analyzer = audioContext.createAnalyser();
  
  // Configure analyzer for FFT display
  analyzer.fftSize = 2048;
  analyzer.smoothingTimeConstant = 0.8;
  
  return analyzer;
};

// Connect an audio element to the audio context and analyzer
export const connectAudioElementToAnalyzer = (
  audioContext: AudioContext,
  analyzer: AnalyserNode,
  audioElement: HTMLAudioElement
): MediaElementAudioSourceNode => {
  const source = audioContext.createMediaElementSource(audioElement);
  source.connect(analyzer);
  analyzer.connect(audioContext.destination);
  return source;
};
