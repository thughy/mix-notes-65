
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface YoutubeSectionProps {
  youtubeUrl: string;
  setYoutubeUrl: (url: string) => void;
}

const YoutubeSection = ({
  youtubeUrl,
  setYoutubeUrl
}: YoutubeSectionProps) => {
  return (
    <Card className="shadow-soft border border-slate-200 bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-slate-800">
          Livestream
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="youtubeUrl">YouTube Video Link</Label>
          <Input 
            id="youtubeUrl" 
            type="text" 
            placeholder="Paste YouTube URL here" 
            value={youtubeUrl} 
            onChange={(e) => setYoutubeUrl(e.target.value)}
            className="flex-1"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default YoutubeSection;
