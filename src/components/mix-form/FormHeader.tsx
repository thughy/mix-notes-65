
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Save } from 'lucide-react';

interface FormHeaderProps {
  title: string;
  submitButtonText: string;
  onCancel: () => void;
}

const FormHeader = ({
  title,
  submitButtonText,
  onCancel
}: FormHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onCancel}
          className="mr-4"
          type="button"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-slate-800">{title}</h1>
      </div>
      <Button type="submit">
        <Save className="mr-1 h-4 w-4" />
        {submitButtonText}
      </Button>
    </div>
  );
};

export default FormHeader;
