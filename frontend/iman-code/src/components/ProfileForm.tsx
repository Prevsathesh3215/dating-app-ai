import { useState } from 'react';
import { User, Badge } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface ProfileFormProps {
  onComplete: (user: User) => void;
}

const ProfileForm = ({ onComplete }: ProfileFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    relationshipGoal: '',
    bio: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

    if (!formData.relationshipGoal) {
      newErrors.relationshipGoal = 'Please select your relationship goal';
    }

    if (formData.bio.length > 100) {
      newErrors.bio = 'Bio must be 100 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
      relationshipGoal: formData.relationshipGoal as User['relationshipGoal'],
      bio: formData.bio,
      photo: '/placeholder.svg', // Default placeholder
      badges: [],
      ratings: {
        communication: [],
        respectfulness: []
      }
    };

    onComplete(user);
  };

  return (
    <div className="min-h-screen bg-brand flex flex-col">
      {/* Header */}
      <div className="px-6 py-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">❤️‍🔥</h1>
        <h2 className="text-2xl font-bold text-white mb-2">Welcome to Unfiltered</h2>
        <p className="text-white/90">It's Me, Not You</p>
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

          {/* Relationship Goal */}
          <div>
            <Label className="text-gray-800 font-semibold mb-2 block">What are you looking for? *</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, relationshipGoal: value }))}>
              <SelectTrigger className={`border-2 rounded-2xl py-3 px-4 text-lg h-auto ${errors.relationshipGoal ? 'border-red-400' : 'border-gray-200'}`}>
                <SelectValue placeholder="Choose your intention" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="Friendship">Friendship</SelectItem>
                <SelectItem value="Casual Dates">Casual Dates</SelectItem>
                <SelectItem value="Intimacy Without Commitment">Intimacy Without Commitment</SelectItem>
                <SelectItem value="Long-Term Relationship">Long-Term Relationship</SelectItem>
              </SelectContent>
            </Select>
            {errors.relationshipGoal && <p className="text-red-500 text-sm mt-1">{errors.relationshipGoal}</p>}
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
