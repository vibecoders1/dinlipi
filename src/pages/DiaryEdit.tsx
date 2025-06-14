import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Bold, Italic, Plus, X } from 'lucide-react';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { toast } from '../hooks/use-toast';

const DiaryEdit = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    date: '',
    tags: [] as string[],
  });
  const [newTag, setNewTag] = useState('');

  // Sample data - in real app, this would come from Supabase
  const sampleEntries = [
    {
      id: 1,
      date: new Date(2025, 5, 11),
      title: t('diary.entries.relaxing_sunday'),
      content: t('diary.entries.relaxing_sunday'),
      tags: [t('diary.tags.book'), t('diary.tags.life')],
    },
    {
      id: 2,
      date: new Date(2025, 5, 8),
      title: t('diary.entries.productive_work'),
      content: t('diary.entries.productive_work'),
      tags: [t('diary.tags.work')],
    },
    {
      id: 3,
      date: new Date(2025, 5, 6),
      title: t('diary.entries.cooking_recipe'),
      content: t('diary.entries.cooking_recipe'),
      tags: [t('diary.tags.food')],
    }
  ];

  useEffect(() => {
    const foundEntry = sampleEntries.find(e => e.id === Number(id));
    if (foundEntry) {
      setFormData({
        title: foundEntry.title,
        content: foundEntry.content,
        date: foundEntry.date.toISOString().split('T')[0],
        tags: foundEntry.tags || [],
      });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: t('messages.error'),
        description: t('diary.title_content_required'),
        variant: "destructive",
      });
      return;
    }

    try {
      // In real app, update in Supabase
      toast({
        title: t('messages.success'),
        description: t('diary.entry_updated'),
      });
      
      navigate(`/diary/${id}`);
    } catch (error: any) {
      console.error('Error updating entry:', error);
      toast({
        title: t('messages.error'),
        description: error.message || t('messages.save_failed'),
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Layout 
      title={t('diary.edit_entry')}
      showBack
      onBack={() => navigate(`/diary/${id}`)}
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

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-app-text font-medium">
              {t('diary.title')}
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder={t('diary.title_placeholder')}
              className="bg-app-surface border-app-border text-app-text placeholder:text-app-text-muted"
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label className="text-app-text font-medium">
              {t('diary.content')}
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

          {/* Tags */}
          <div className="space-y-2">
            <Label className="text-app-text font-medium">
              {t('diary.tags_label')}
            </Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('diary.add_tag_placeholder')}
                className="bg-app-surface border-app-border text-app-text placeholder:text-app-text-muted"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={addTag}
                className="border-app-border text-app-text hover:bg-app-surface"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="secondary"
                    className="bg-app-purple/20 text-app-purple hover:bg-app-purple/30 flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:bg-app-purple/40 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-app-purple hover:bg-app-purple-dark text-white font-medium py-3"
          >
            {t('diary.update_entry')}
          </Button>
        </form>
      </div>
    </Layout>
  );
};

export default DiaryEdit;