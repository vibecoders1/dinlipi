import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { DiaryService } from '../lib/database';
import { Edit3, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { toast } from '../hooks/use-toast';

const DiaryView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [entry, setEntry] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEntry = async () => {
      if (!id || !user) {
        setLoading(false);
        return;
      }

      try {
        const entryData = await DiaryService.getDiaryEntryById(id);
        setEntry(entryData);
      } catch (error: any) {
        console.error('Error loading diary entry:', error);
        toast({
          title: t('messages.error'),
          description: error.message || 'Failed to load diary entry',
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadEntry();
  }, [id, user, t]);

  const handleEdit = () => {
    navigate(`/diary/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!entry || !user) return;

    try {
      await DiaryService.deleteDiaryEntry(entry.id);
      toast({
        title: t('messages.success'),
        description: t('diary.entry_deleted'),
      });
      navigate('/');
    } catch (error: any) {
      console.error('Error deleting entry:', error);
      toast({
        title: t('messages.error'),
        description: error.message || 'Failed to delete entry',
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Layout title={t('diary.view_entry')} showBack onBack={() => navigate('/')}>
        <div className="p-4 text-center">
          <p className="text-app-text-muted">{t('messages.loading', 'Loading...')}</p>
        </div>
      </Layout>
    );
  }

  if (!entry) {
    return (
      <Layout title={t('diary.entry_not_found')} showBack onBack={() => navigate('/')}>
        <div className="p-4 text-center">
          <CalendarIcon className="h-12 w-12 text-app-text-muted mx-auto mb-4" />
          <p className="text-app-text-muted">{t('diary.entry_not_found')}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      title={t('diary.view_entry')} 
      showBack
      onBack={() => navigate('/')}
    >
      <div className="p-4">
        <Card className="bg-app-surface border-app-border">
          <div className="p-6">
            {/* Date and Actions */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-app-text-muted">
                {formatDate(entry.date)}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEdit}
                  className="border-app-border text-app-text hover:bg-app-surface"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  {t('diary.edit')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                  className="border-red-500 text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t('diary.delete')}
                </Button>
              </div>
            </div>

            {/* Title */}
            <div className="flex items-center gap-3 mb-4">
              {entry.mood && (
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{entry.mood.emoji}</span>
                  <span className="text-sm" style={{ color: entry.mood.color }}>
                    {entry.mood.name}
                  </span>
                </div>
              )}
              <h1 className="text-2xl font-semibold text-app-text">
                {entry.title}
              </h1>
            </div>

            {/* Photo */}
            {entry.photo_url && (
              <div className="mb-4">
                <img 
                  src={entry.photo_url} 
                  alt="Diary entry" 
                  className="w-16 h-16 object-cover rounded-lg border border-app-border"
                />
              </div>
            )}

            {/* Content */}
            <div className="text-app-text mb-6 whitespace-pre-wrap">
              {entry.content}
            </div>

            {/* Tags */}
            {entry.tags && entry.tags.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-app-text-muted">
                  {t('diary.tags_label')}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {entry.tags.map((tag: string) => (
                    <Badge 
                      key={tag} 
                      variant="secondary"
                      className="bg-app-purple/20 text-app-purple hover:bg-app-purple/30"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-app-surface border-app-border">
          <DialogHeader>
            <DialogTitle className="text-app-text">
              {t('diary.confirm_delete')}
            </DialogTitle>
            <DialogDescription className="text-app-text-muted">
              {t('diary.delete_warning')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              className="border-app-border text-app-text hover:bg-app-surface"
            >
              {t('diary.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {t('diary.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default DiaryView;