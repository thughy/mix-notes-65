
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BasicInfoSectionProps {
  date: string;
  venue: string;
  artist: string;
  event: string;
  setDate: (date: string) => void;
  setVenue: (venue: string) => void;
  setArtist: (artist: string) => void;
  setEvent: (event: string) => void;
}

const BasicInfoSection = ({
  date,
  venue,
  artist,
  event,
  setDate,
  setVenue,
  setArtist,
  setEvent
}: BasicInfoSectionProps) => {
  return (
    <Card className="shadow-soft border border-slate-200 bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-slate-800">
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input 
              id="date" 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="venue">Venue</Label>
            <Input 
              id="venue" 
              placeholder="Enter venue name" 
              value={venue} 
              onChange={(e) => setVenue(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="artist">Artist/Band</Label>
            <Input 
              id="artist" 
              placeholder="Enter artist/band name" 
              value={artist} 
              onChange={(e) => setArtist(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="event">Event</Label>
            <Input 
              id="event" 
              placeholder="Enter event name" 
              value={event} 
              onChange={(e) => setEvent(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInfoSection;
