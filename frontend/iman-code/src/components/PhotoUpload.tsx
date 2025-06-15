
import { useState } from 'react';
import { User } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Upload, ArrowLeft } from 'lucide-react';

interface PhotoUploadProps {
  user: User;
  onComplete: (updatedUser: User) => void;
  onSkip: () => void;
}

const PhotoUpload = ({ user, onComplete, onSkip }: PhotoUploadProps) => {
  // Fix Sarah's broken image by providing a working placeholder
  const defaultPhoto = user.photo && user.photo.includes('broken') 
    ? 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=600&fit=crop&crop=face'
    : user.photo;
  
  const [photo, setPhoto] = useState(defaultPhoto);
  const [isUploading, setIsUploading] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhoto(event.target?.result as string);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleComplete = () => {
    const updatedUser = { ...user, photo };
    onComplete(updatedUser);
  };

  return (
    <div className="min-h-screen bg-brand flex flex-col">
      {/* Header */}
      <div className="px-6 py-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">📸</h1>
        <h2 className="text-2xl font-bold text-white mb-2">Add your best photo</h2>
        <p className="text-white/90">Show your personality!</p>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-t-3xl px-6 pt-8">
        <div className="space-y-8">
          {/* Photo Preview */}
          <div className="flex justify-center">
            <div className="w-48 h-64 rounded-3xl overflow-hidden bg-gray-100 border-4 border-gray-200">
              <img
                src={photo}
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Upload Section */}
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Upload a photo</h3>
              <p className="text-gray-600 text-sm">Choose a clear photo that shows your face</p>
            </div>
            
            <Label
              htmlFor="photo-upload"
              className="cursor-pointer bg-brand/5 hover:bg-brand/10 border-2 border-dashed border-brand/30 rounded-3xl p-8 text-center transition-colors block"
            >
              <div className="flex flex-col items-center space-y-3">
                {isUploading ? (
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-brand rounded-full flex items-center justify-center">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <span className="text-brand font-semibold text-lg block">Tap to upload photo</span>
                      <span className="text-sm text-gray-500">JPEG or PNG, max 5MB</span>
                    </div>
                  </>
                )}
              </div>
            </Label>
            
            <Input
              id="photo-upload"
              type="file"
              accept="image/jpeg,image/png"
              onChange={handlePhotoUpload}
              className="hidden"
              disabled={isUploading}
            />
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 pb-8">
            <Button 
              onClick={handleComplete}
              className="w-full bg-brand hover:bg-brand/90 text-white font-bold py-4 rounded-2xl text-lg"
              disabled={isUploading}
            >
              <Camera className="w-5 h-5 mr-2" />
              Continue with this photo
            </Button>
            
            <Button 
              variant="outline" 
              onClick={onSkip}
              className="w-full border-2 border-gray-300 text-gray-600 hover:bg-gray-50 py-4 rounded-2xl text-lg font-semibold"
              disabled={isUploading}
            >
              Skip for now
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center pb-4">
            You can always update your photo later in your profile settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhotoUpload;
