import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Bold, Italic } from 'lucide-react';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { useAuth } from '../contexts/AuthContext';
import { DiaryService } from '../lib/database';
import { toast } from '../hooks/use-toast';

const NewPrayerForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    content: '',
    photoFile: null as File | null,
    photoUrl: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.content.trim()) {
      toast({
        title: t('messages.error'),
        description: t('messages.content_required'),
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: t('messages.error'),
        description: t('messages.signin_required'),
        variant: "destructive",
      });
      return;
    }

    try {
      await DiaryService.createDiaryEntry({
        user_id: user.id,
        title: t('entries.daily_entry'),
        content: formData.content,
        date: formData.date,
        photo_url: formData.photoUrl || null,
      });
      
      toast({
        title: t('messages.success'),
        description: t('messages.entry_saved'),
      });
      
      navigate('/');
    } catch (error: any) {
      console.error('Error saving entry:', error);
      toast({
        title: t('messages.error'),
        description: error.message || t('messages.save_failed'),
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleInputChange('photoFile', file);
  };

  return (
    <Layout 
      title={t('diary.new_entry')}
      showBack
    >
      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-app-text font-medium">
              {t('forms.date')}
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="bg-app-surface border-app-border text-app-text"
            />
          </div>

          {/* Question */}
          <div className="space-y-2">
            <Label className="text-app-text font-medium">
              {t('forms.how_was_day')}
            </Label>
            <div className="flex gap-2 mb-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="bg-app-purple text-white border-app-purple hover:bg-app-purple-dark"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="bg-app-purple text-white border-app-purple hover:bg-app-purple-dark"
              >
                <Italic className="h-4 w-4" />
              </Button>
            </div>
            <Textarea
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder={t('forms.description_placeholder')}
              rows={8}
              className="bg-app-surface border-app-border text-app-text placeholder:text-app-text-muted resize-none"
            />
          </div>

          {/* Photo Upload */}
          <div className="space-y-2">
            <Label htmlFor="photo" className="text-app-text font-medium">
              {t('forms.upload_photo')}
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="bg-app-purple text-white border-app-purple file:bg-white file:text-app-purple file:border-0 file:rounded file:px-3 file:py-1 file:mr-3"
              />
            </div>
            {!formData.photoFile && (
              <span className="text-sm text-app-text-muted">
                {t('forms.no_file_chosen')}
              </span>
            )}
          </div>

          {/* Photo URL */}
          <div className="space-y-2">
            <Label htmlFor="photoUrl" className="text-app-text font-medium">
              {t('forms.photo_url')}
            </Label>
            <Input
              id="photoUrl"
              value={formData.photoUrl}
              onChange={(e) => handleInputChange('photoUrl', e.target.value)}
              placeholder={t('forms.photo_url_placeholder')}
              className="bg-app-surface border-app-border text-app-text placeholder:text-app-text-muted"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-app-purple hover:bg-app-purple-dark text-white font-medium py-3"
          >
            {t('forms.save')}
          </Button>
        </form>
      </div>
    </Layout>
  );
};

export default NewPrayerForm;