import { useState } from 'react';
import { User, Badge } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';

interface ProfileFormProps {
  onComplete: (user: User) => void;
  onBack?: () => void;
}

const ProfileForm = ({ onComplete, onBack }: ProfileFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    primaryIntention: '',
    secondaryIntention: '',
    bio: '',
    lifePhase: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const intentionOptions = [
    'Friendship',
    'Casual Dates',
    'Intimacy Without Commitment',
    'Long-Term Relationship'
  ];

  const lifePhaseOptions = [
    "Single and independent",
    "Career-focused",
    "Exploring",
    "Settling down",
    "Starting over",
    "Retirement transition",
    "Studying"
  ];

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    const age = parseInt(formData.age);
    if (isNaN(age) || age < 18 || age > 99) {
      newErrors.age = 'Age must be between 18 and 99';
    }

    if (!formData.gender) {
      newErrors.gender = 'Please select your gender';
    }

    if (!formData.primaryIntention) {
      newErrors.primaryIntention = 'Please select your primary intention';
    }

    if (!formData.lifePhase) {
      newErrors.lifePhase = 'Please select your current life phase';
    }

    if (formData.bio.length > 100) {
      newErrors.bio = 'Bio must be 100 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getRelationshipGoalText = () => {
    if (formData.primaryIntention && formData.secondaryIntention) {
      return `Primarily looking for ${formData.primaryIntention} but open to ${formData.secondaryIntention}`;
    } else if (formData.primaryIntention) {
      return `Looking for ${formData.primaryIntention}`;
    }
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const user: User = {
      id: Date.now().toString(),
      name: formData.name,
      age: parseInt(formData.age),
      gender: formData.gender as User['gender'],
      relationshipGoal: getRelationshipGoalText() as User['relationshipGoal'],
      bio: formData.bio,
      photo: '/placeholder.svg', // Default placeholder
      badges: [],
      ratings: {
        communication: [],
        respectfulness: []
      },
      lifePhase: formData.lifePhase
    };

    onComplete(user);
  };

  return (
    <div className="min-h-screen bg-brand flex flex-col">
      {/* Header */}
      <div className="px-6 py-8 text-center relative">
        {/* Back button */}
        {onBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="absolute left-4 top-8 text-white hover:bg-white/10 p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
        
        <h2 className="text-2xl font-bold text-white">Tell Us About Yourself</h2>
      </div>

      {/* Form Card */}
      <div className="flex-1 bg-white rounded-t-3xl px-6 pt-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <Label htmlFor="name" className="text-gray-800 font-semibold mb-2 block">What's your name? *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your first name"
              className={`border-2 rounded-2xl py-3 px-4 text-lg ${errors.name ? 'border-red-400' : 'border-gray-200 focus:border-brand'}`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Age */}
          <div>
            <Label htmlFor="age" className="text-gray-800 font-semibold mb-2 block">How old are you? *</Label>
            <Input
              id="age"
              type="number"
              min="18"
              max="99"
              value={formData.age}
              onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
              placeholder="Enter your age"
              className={`border-2 rounded-2xl py-3 px-4 text-lg ${errors.age ? 'border-red-400' : 'border-gray-200 focus:border-brand'}`}
            />
            {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
          </div>

          {/* Gender */}
          <div>
            <Label className="text-gray-800 font-semibold mb-2 block">What's your gender? *</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
              <SelectTrigger className={`border-2 rounded-2xl py-3 px-4 text-lg h-auto ${errors.gender ? 'border-red-400' : 'border-gray-200'}`}>
                <SelectValue placeholder="Select your gender" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Non-Binary">Non-Binary</SelectItem>
                <SelectItem value="Prefer Not to Say">Prefer Not to Say</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
          </div>

          {/* Relationship Intentions */}
          <div>
            <Label className="text-gray-800 font-semibold mb-3 block">What are you looking for? *</Label>
            
            {/* Primary Intention */}
            <div className="mb-4">
              <Label className="text-gray-600 font-medium mb-2 block text-sm">Primary intention</Label>
              <ToggleGroup 
                type="single" 
                value={formData.primaryIntention}
                onValueChange={(value) => {
                  setFormData(prev => ({ 
                    ...prev, 
                    primaryIntention: value || '',
                    // Clear secondary if it's the same as primary
                    secondaryIntention: prev.secondaryIntention === value ? '' : prev.secondaryIntention
                  }))
                }}
                className="flex flex-wrap gap-2 justify-start"
              >
                {intentionOptions.map((option) => (
                  <ToggleGroupItem 
                    key={option} 
                    value={option}
                    className="border-2 border-gray-200 rounded-2xl px-4 py-2 text-sm font-medium data-[state=on]:bg-brand data-[state=on]:text-white data-[state=on]:border-brand hover:bg-brand/5"
                  >
                    {option}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            {/* Secondary Intention */}
            {formData.primaryIntention && (
              <div className="mb-4">
                <Label className="text-gray-600 font-medium mb-2 block text-sm">
                  Secondary intention (optional)
                </Label>
                <ToggleGroup 
                  type="single" 
                  value={formData.secondaryIntention}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, secondaryIntention: value || '' }))}
                  className="flex flex-wrap gap-2 justify-start"
                >
                  {intentionOptions
                    .filter(option => option !== formData.primaryIntention)
                    .map((option) => (
                      <ToggleGroupItem 
                        key={option} 
                        value={option}
                        className="border-2 border-gray-200 rounded-2xl px-4 py-2 text-sm font-medium data-[state=on]:bg-brand data-[state=on]:text-white data-[state=on]:border-brand hover:bg-brand/5"
                      >
                        {option}
                      </ToggleGroupItem>
                    ))}
                </ToggleGroup>
              </div>
            )}

            {errors.primaryIntention && <p className="text-red-500 text-sm mt-1">{errors.primaryIntention}</p>}
          </div>

          {/* New Life Phase Field */}
          <div>
            <Label className="text-gray-800 font-semibold mb-3 block">
              What phase best reflects your current stage in life? *
            </Label>
            <ToggleGroup
              type="single"
              value={formData.lifePhase}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, lifePhase: value || '' }))
              }
              className="flex flex-wrap gap-2 justify-start"
            >
              {lifePhaseOptions.map((option) => (
                <ToggleGroupItem
                  key={option}
                  value={option}
                  className="border-2 border-gray-200 rounded-2xl px-4 py-2 text-sm font-medium data-[state=on]:bg-brand data-[state=on]:text-white data-[state=on]:border-brand hover:bg-brand/5"
                >
                  {option}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            {errors.lifePhase && (
              <p className="text-red-500 text-sm mt-1">{errors.lifePhase}</p>
            )}
          </div>

          {/* Bio */}
          <div>
            <Label htmlFor="bio" className="text-gray-800 font-semibold mb-2 block">
              Tell us about yourself ({formData.bio.length}/100)
            </Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Write something that shows your personality..."
              maxLength={100}
              rows={4}
              className={`border-2 rounded-2xl py-3 px-4 text-lg resize-none ${errors.bio ? 'border-red-400' : 'border-gray-200 focus:border-brand'}`}
            />
            {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
          </div>

          <div className="pt-4 pb-8">
            <Button 
              type="submit" 
              className="w-full bg-brand hover:bg-brand/90 text-white font-bold py-4 rounded-2xl text-lg"
            >
              Continue
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
