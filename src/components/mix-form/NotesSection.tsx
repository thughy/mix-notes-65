
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface NotesSectionProps {
  generalNotes: string;
  roomMixNotes: string;
  livestreamMixNotes: string;
  inEarMixNotes: string;
  futureUpdates: string;
  setGeneralNotes: (notes: string) => void;
  setRoomMixNotes: (notes: string) => void;
  setLivestreamMixNotes: (notes: string) => void;
  setInEarMixNotes: (notes: string) => void;
  setFutureUpdates: (notes: string) => void;
}

const NotesSection = ({
  generalNotes,
  roomMixNotes,
  livestreamMixNotes,
  inEarMixNotes,
  futureUpdates,
  setGeneralNotes,
  setRoomMixNotes,
  setLivestreamMixNotes,
  setInEarMixNotes,
  setFutureUpdates
}: NotesSectionProps) => {
  return (
    <Card className="shadow-soft border border-slate-200 bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-slate-800">
          Mix Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="generalNotes">General Notes</Label>
          <Textarea 
            id="generalNotes" 
            placeholder="Overall thoughts on the mix..." 
            value={generalNotes} 
            onChange={(e) => setGeneralNotes(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="roomMixNotes">Room Mix Notes</Label>
          <Textarea 
            id="roomMixNotes" 
            placeholder="Notes about the room mix..." 
            value={roomMixNotes} 
            onChange={(e) => setRoomMixNotes(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="livestreamMixNotes">Livestream Mix Notes</Label>
          <Textarea 
            id="livestreamMixNotes" 
            placeholder="Notes about the livestream mix..." 
            value={livestreamMixNotes} 
            onChange={(e) => setLivestreamMixNotes(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="inEarMixNotes">In-Ear Mix Notes</Label>
          <Textarea 
            id="inEarMixNotes" 
            placeholder="Notes about the in-ear monitor mix..." 
            value={inEarMixNotes} 
            onChange={(e) => setInEarMixNotes(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="futureUpdates">Future Updates</Label>
          <Textarea 
            id="futureUpdates" 
            placeholder="Changes to try for next time..." 
            value={futureUpdates} 
            onChange={(e) => setFutureUpdates(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default NotesSection;
