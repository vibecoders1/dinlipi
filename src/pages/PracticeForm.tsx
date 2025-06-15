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
    title: '',
    content: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a practice title",
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
        practice_type: 'daily_creation',
        title: formData.title,
        content: formData.content,
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
          {/* Practice Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-app-text font-medium">
              Practice Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter practice title"
              className="bg-app-surface border-app-border text-app-text placeholder:text-app-text-muted"
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-app-text font-medium">
              Description
            </Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Describe your practice goals and approach..."
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