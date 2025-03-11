
import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import AudioWaveform from '@/components/AudioVisualizer/AudioWaveform';

interface AudioSectionProps {
  audioFile: File | null;
  audioSrc: string | undefined;
  setAudioFile: (file: File | null) => void;
  setAudioSrc: (src: string | undefined) => void;
}

const AudioSection = ({
  audioFile,
  audioSrc,
  setAudioFile,
  setAudioSrc
}: AudioSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      const url = URL.createObjectURL(file);
      setAudioSrc(url);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="shadow-soft border border-slate-200 bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-slate-800">
          Audio Recording
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <Label htmlFor="audioUpload">Upload Mix Recording</Label>
          <div className="flex items-center space-x-2">
            <Input 
              ref={fileInputRef}
              id="audioUpload" 
              type="file" 
              accept="audio/*"
              onChange={handleAudioUpload}
              className="hidden"
            />
            <Input 
              readOnly
              value={audioFile?.name || (audioSrc && !audioSrc.startsWith('blob:') ? "Audio file loaded" : "No file selected")}
              className="flex-1"
              onClick={triggerFileInput}
            />
            <Button type="button" size="sm" variant="outline" onClick={triggerFileInput}>
              <Upload className="h-4 w-4 mr-1" /> Upload
            </Button>
          </div>
          {audioSrc && (
            <div className="mt-4 rounded-md overflow-hidden">
              <AudioWaveform audioSrc={audioSrc} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioSection;
