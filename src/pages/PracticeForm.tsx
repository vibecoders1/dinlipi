import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { useAuth } from '../contexts/AuthContext';
import { DiaryService } from '../lib/database';
import { toast } from '../hooks/use-toast';

const PracticeForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    duration: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a practice name",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "Please sign in to create practices",
        variant: "destructive",
      });
      return;
    }

    try {
      await DiaryService.createPractice({
        user_id: user.id,
        name: formData.name,
        description: formData.description,
        duration_days: parseInt(formData.duration) || 7,
        type: 'daily_creation',
        is_active: true,
      });
      
      toast({
        title: "Success",
        description: "Practice created successfully!",
      });
      
      navigate('/');
    } catch (error: any) {
      console.error('Error creating practice:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create practice",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Layout 
      title={t('forms.create')} 
      showBack
    >
      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Practice Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-app-text font-medium">
              {t('forms.practice_name')}
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder={t('forms.practice_name').replace(':', '')}
              className="bg-app-surface border-app-border text-app-text placeholder:text-app-text-muted"
            />
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration" className="text-app-text font-medium">
              {t('forms.duration')}
            </Label>
            <Input
              id="duration"
              value={formData.duration}
              onChange={(e) => handleInputChange('duration', e.target.value)}
              placeholder={t('forms.duration').replace(':', '')}
              className="bg-app-surface border-app-border text-app-text placeholder:text-app-text-muted"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-app-text font-medium">
              {t('forms.description')}
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder={t('forms.description_placeholder')}
              rows={6}
              className="bg-app-surface border-app-border text-app-text placeholder:text-app-text-muted resize-none"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-app-purple hover:bg-app-purple-dark text-white font-medium py-3"
          >
            {t('forms.create')}
          </Button>
        </form>
      </div>
    </Layout>
  );
};

export default PracticeForm;