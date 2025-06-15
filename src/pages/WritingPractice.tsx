import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PenTool, BookOpen, FileText, Search, Edit2, Trash2 } from 'lucide-react';
import Layout from '../components/Layout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';

interface WritingPractice {
  id: string;
  title: string;
  content: string;
  media_url: string | null;
  created_at: string;
}

const WritingPractice = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [practices, setPractices] = useState<WritingPractice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPractice, setEditingPractice] = useState<WritingPractice | null>(null);
  const [filteredPractices, setFilteredPractices] = useState<WritingPractice[]>([]);

  const prompts = [
    "Write about a childhood memory that still makes you smile",
    "Describe your perfect day in vivid detail",
    "Write a letter to your future self",
    "Create a short story that starts with 'The last person on Earth sat alone in a room...'",
    "Write about something you learned recently",
    "Describe a place that makes you feel peaceful",
    "Write about a conversation that changed your perspective"
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
        .eq('practice_type', 'writing')
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
          practice_type: 'writing',
          title: title.trim(),
          content: content.trim()
        });

      if (error) throw error;

      setTitle('');
      setContent('');
      setShowForm(false);
      fetchPractices();
      toast({
        title: "Writing practice saved!",
        description: "Your writing practice has been recorded."
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

  const handleEdit = (practice: WritingPractice) => {
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
        description: "Your writing practice has been updated."
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
        description: "Your writing practice has been deleted."
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
      title={t('home.writing_practice')} 
      showBack
      showAdd
      onAdd={() => setShowForm(true)}
    >
      <div className="p-4 space-y-4">
        {/* Today's Prompt */}
        <Card className="bg-app-surface border-app-border p-4">
          <div className="flex items-start space-x-3">
            <div className="bg-app-purple p-2 rounded-xl">
              <PenTool className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-app-text mb-1">Today's Writing Prompt</h3>
              <p className="text-app-text-muted text-sm">{todayPrompt}</p>
            </div>
          </div>
        </Card>

        {/* Search */}
        <Card className="bg-app-surface border-app-border p-4">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-app-text-muted" />
            <Input
              placeholder="Search your writing practices..."
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
                {editingPractice ? 'Edit Writing Practice' : 'New Writing Practice'}
              </h3>
              <Input
                placeholder="Give your writing a title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-app-bg border-app-border"
              />
              <Textarea
                placeholder="Start writing here... Let your thoughts flow freely."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="bg-app-bg border-app-border min-h-32"
              />
              <div className="flex space-x-2">
                <Button 
                  onClick={handleFormSubmit}
                  disabled={!title.trim()}
                  className="bg-app-purple hover:bg-app-purple-dark"
                >
                  {editingPractice ? 'Update Writing' : 'Save Writing'}
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
            <FileText className="h-12 w-12 text-app-text-muted mx-auto mb-3" />
            <p className="text-app-text-muted">No writing practices yet</p>
            <p className="text-sm text-app-text-muted mt-1">Start your writing journey today!</p>
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
                    <p className="text-app-text-muted text-sm whitespace-pre-wrap">
                      {practice.content.length > 200 
                        ? `${practice.content.substring(0, 200)}...` 
                        : practice.content}
                    </p>
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

export default WritingPractice;