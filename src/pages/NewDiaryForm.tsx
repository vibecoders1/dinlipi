import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Bold, Italic, Plus, X, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { DiaryService } from '../lib/database';
import { toast } from '../hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const NewDiaryForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    title: '',
    content: '',
    tags: [] as string[],
    photoFile: null as File | null,
    photoUrl: '',
    mood_id: '',
  });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [newTag, setNewTag] = useState('');
  const [moods, setMoods] = useState<any[]>([]);

  // Load moods and pre-populate date from URL parameters
  useEffect(() => {
    const loadMoods = async () => {
      try {
        const moodsData = await DiaryService.getMoods();
        setMoods(moodsData);
        // Set default to 'happy' mood
        const happyMood = moodsData.find(mood => mood.name === 'happy');
        if (happyMood) {
          setFormData(prev => ({ ...prev, mood_id: happyMood.id }));
        }
      } catch (error: any) {
        console.error('Error loading moods:', error);
      }
    };

    const dateParam = searchParams.get('date');
    if (dateParam) {
      const paramDate = new Date(dateParam);
      if (!isNaN(paramDate.getTime())) {
        setSelectedDate(paramDate);
        setFormData(prev => ({ ...prev, date: dateParam }));
      }
    }

    loadMoods();
  }, [searchParams]);

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
        title: formData.title,
        content: formData.content,
        date: formData.date,
        photo_url: formData.photoUrl || null,
        tags: formData.tags,
        mood_id: formData.mood_id || null,
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

  const handleInputChange = (field: string, value: string | string[] | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleInputChange('photoFile', file);
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
      title={t('diary.new_entry')}
      showBack
    >
      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date */}
          <div className="space-y-2">
            <Label className="text-app-text font-medium">
              {t('forms.date')}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-app-surface border-app-border text-app-text hover:bg-app-surface",
                    !selectedDate && "text-app-text-muted"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-app-surface border-app-border" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      setSelectedDate(date);
                      handleInputChange('date', date.toISOString().split('T')[0]);
                    }
                  }}
                  disabled={(date) => date > new Date()}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Mood */}
          <div className="space-y-2">
            <Label className="text-app-text font-medium">
              Mood
            </Label>
            <Select
              value={formData.mood_id}
              onValueChange={(value) => handleInputChange('mood_id', value)}
            >
              <SelectTrigger className="bg-app-surface border-app-border text-app-text hover:bg-app-surface">
                <SelectValue placeholder="Select your mood" />
              </SelectTrigger>
              <SelectContent className="bg-app-surface border-app-border z-50">
                {moods.map((mood) => (
                  <SelectItem 
                    key={mood.id} 
                    value={mood.id}
                    className="text-app-text hover:bg-app-purple/20 focus:bg-app-purple/20"
                  >
                    <div className="flex items-center gap-2">
                      <span>{mood.emoji}</span>
                      <span style={{ color: mood.color }}>{mood.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            {t('diary.create_entry')}
          </Button>
        </form>
      </div>
    </Layout>
  );
};

export default NewDiaryForm;