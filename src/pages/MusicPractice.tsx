import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Music, Headphones, Radio, Search, Edit2, Trash2 } from 'lucide-react';
import Layout from '../components/Layout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';

interface MusicPractice {
  id: string;
  title: string;
  content: string;
  media_url: string | null;
  created_at: string;
}

const MusicPractice = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [practices, setPractices] = useState<MusicPractice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPractice, setEditingPractice] = useState<MusicPractice | null>(null);
  const [filteredPractices, setFilteredPractices] = useState<MusicPractice[]>([]);

  const prompts = [
    "Listen to a song that represents your current mood",
    "Discover a new genre you've never explored before",
    "Create a playlist for your morning routine",
    "Find a song from your childhood and reflect on the memories",
    "Listen to instrumental music and write what images come to mind",
    "Explore music from a different culture or country",
    "Practice humming or singing along to your favorite song"
  ];

  useEffect(() => {
    fetchPractices();
  }, [user]);

  useEffect(() => {
    const filtered = practices.filter(practice =>
      practice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (practice.content && practice.content.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredPractices(filtered);
  }, [practices, searchQuery]);

  const fetchPractices = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('practices')
        .select('*')
        .eq('user_id', user.id)
        .eq('practice_type', 'music')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPractices(data || []);
    } catch (error) {
      console.error('Error fetching practices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user || !title.trim()) return;

    try {
      const { error } = await supabase
        .from('practices')
        .insert({
          user_id: user.id,
          practice_type: 'music',
          title: title.trim(),
          content: content.trim()
        });

      if (error) throw error;

      setTitle('');
      setContent('');
      setShowForm(false);
      fetchPractices();
      toast({
        title: "Music practice saved!",
        description: "Your music practice has been recorded."
      });
    } catch (error) {
      console.error('Error saving practice:', error);
      toast({
        title: "Error",
        description: "Failed to save your practice.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (practice: MusicPractice) => {
    setEditingPractice(practice);
    setTitle(practice.title);
    setContent(practice.content || '');
    setShowForm(true);
  };

  const handleUpdate = async () => {
    if (!user || !editingPractice || !title.trim()) return;

    try {
      const { error } = await supabase
        .from('practices')
        .update({
          title: title.trim(),
          content: content.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', editingPractice.id);

      if (error) throw error;

      setTitle('');
      setContent('');
      setShowForm(false);
      setEditingPractice(null);
      fetchPractices();
      toast({
        title: "Practice updated!",
        description: "Your music practice has been updated."
      });
    } catch (error) {
      console.error('Error updating practice:', error);
      toast({
        title: "Error",
        description: "Failed to update your practice.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (practiceId: string) => {
    if (!confirm('Are you sure you want to delete this practice?')) return;

    try {
      const { error } = await supabase
        .from('practices')
        .delete()
        .eq('id', practiceId);

      if (error) throw error;

      fetchPractices();
      toast({
        title: "Practice deleted",
        description: "Your music practice has been deleted."
      });
    } catch (error) {
      console.error('Error deleting practice:', error);
      toast({
        title: "Error",
        description: "Failed to delete your practice.",
        variant: "destructive"
      });
    }
  };

  const handleFormSubmit = () => {
    if (editingPractice) {
      handleUpdate();
    } else {
      handleSubmit();
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingPractice(null);
    setTitle('');
    setContent('');
  };

  const todayPrompt = prompts[new Date().getDay() % prompts.length];

  return (
    <Layout 
      title={t('home.music_practice')} 
      showBack
      showAdd
      onAdd={() => setShowForm(true)}
    >
      <div className="p-4 space-y-4">
        {/* Today's Prompt */}
        <Card className="bg-app-surface border-app-border p-4">
          <div className="flex items-start space-x-3">
            <div className="bg-app-purple p-2 rounded-xl">
              <Music className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-app-text mb-1">Today's Musical Journey</h3>
              <p className="text-app-text-muted text-sm">{todayPrompt}</p>
            </div>
          </div>
        </Card>

        {/* Search */}
        <Card className="bg-app-surface border-app-border p-4">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-app-text-muted" />
            <Input
              placeholder="Search your music practices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-app-bg border-app-border"
            />
          </div>
        </Card>

        {/* New Practice Form */}
        {showForm && (
          <Card className="bg-app-surface border-app-border p-4">
            <div className="space-y-4">
              <h3 className="font-medium text-app-text">
                {editingPractice ? 'Edit Music Practice' : 'New Music Practice'}
              </h3>
              <Input
                placeholder="What song or artist did you explore today?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-app-bg border-app-border"
              />
              <Textarea
                placeholder="How did the music make you feel? What did you discover or learn?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="bg-app-bg border-app-border min-h-20"
              />
              <div className="flex space-x-2">
                <Button 
                  onClick={handleFormSubmit}
                  disabled={!title.trim()}
                  className="bg-app-purple hover:bg-app-purple-dark"
                >
                  {editingPractice ? 'Update Practice' : 'Save Practice'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCancelForm}
                  className="border-app-border"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Practice Entries */}
        {loading ? (
          <div className="text-center text-app-text-muted">Loading...</div>
        ) : practices.length === 0 ? (
          <Card className="bg-app-surface border-app-border p-6 text-center">
            <Radio className="h-12 w-12 text-app-text-muted mx-auto mb-3" />
            <p className="text-app-text-muted">No music practices yet</p>
            <p className="text-sm text-app-text-muted mt-1">Start your musical exploration today!</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredPractices.map((practice) => (
              <Card key={practice.id} className="bg-app-surface border-app-border p-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-app-text flex-1">{practice.title}</h4>
                    <div className="flex space-x-1 ml-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(practice)}
                        className="h-8 w-8 p-0 hover:bg-app-border"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(practice.id)}
                        className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  {practice.content && (
                    <p className="text-app-text-muted text-sm">{practice.content}</p>
                  )}
                  <p className="text-xs text-app-text-muted">
                    {new Date(practice.created_at).toLocaleDateString()}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MusicPractice;