
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RatingSlider from '@/components/RatingSlider';
import { MixRatings, RatingCategory } from '@/types';

interface RatingsSectionProps {
  ratings: MixRatings;
  handleRatingChange: (category: RatingCategory, value: number) => void;
}

const RatingsSection = ({
  ratings,
  handleRatingChange
}: RatingsSectionProps) => {
  return (
    <Card className="shadow-soft border border-slate-200 bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-slate-800">
          Mix Ratings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <RatingSlider 
              category="clarity"
              value={ratings.clarity} 
              onChange={(value) => handleRatingChange('clarity', value)} 
            />
            <RatingSlider 
              category="balance"
              value={ratings.balance} 
              onChange={(value) => handleRatingChange('balance', value)} 
            />
            <RatingSlider 
              category="vocals"
              value={ratings.vocals} 
              onChange={(value) => handleRatingChange('vocals', value)} 
            />
            <RatingSlider 
              category="instruments"
              value={ratings.instruments} 
              onChange={(value) => handleRatingChange('instruments', value)} 
            />
            <RatingSlider 
              category="lowEnd"
              value={ratings.lowEnd} 
              onChange={(value) => handleRatingChange('lowEnd', value)} 
            />
          </div>
          <div className="space-y-8">
            <RatingSlider 
              category="stereoImage"
              value={ratings.stereoImage} 
              onChange={(value) => handleRatingChange('stereoImage', value)} 
            />
            <RatingSlider 
              category="dynamics"
              value={ratings.dynamics} 
              onChange={(value) => handleRatingChange('dynamics', value)} 
            />
            <RatingSlider 
              category="effects"
              value={ratings.effects} 
              onChange={(value) => handleRatingChange('effects', value)} 
            />
            <RatingSlider 
              category="overall"
              value={ratings.overall} 
              onChange={(value) => handleRatingChange('overall', value)} 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RatingsSection;
