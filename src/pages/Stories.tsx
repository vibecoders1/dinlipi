import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Plus, PlusCircle, Brain, Cloud, Camera, Pen, Music, Heart } from 'lucide-react';
import Layout from '../components/Layout';
import { Card } from '../components/ui/card';

const Stories = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const practiceCards = [
    {
      icon: PlusCircle,
      title: t('home.daily_creation'),
      description: '',
      color: 'bg-rose-500',
      onClick: () => navigate('/practice')
    },
    {
      icon: Brain,
      title: t('home.mood_board'),
      description: '',
      color: 'bg-app-purple',
      onClick: () => navigate('/mood-practice')
    },
    {
      icon: Cloud,
      title: t('home.word_thought'),
      description: '',
      color: 'bg-app-purple',
      onClick: () => navigate('/word-cloud')
    },
    {
      icon: Camera,
      title: t('home.photo_practice'),
      description: '',
      color: 'bg-app-purple',
      onClick: () => navigate('/practice')
    },
    {
      icon: Pen,
      title: t('home.drawing_practice'),
      description: '',
      color: 'bg-app-purple',
      onClick: () => navigate('/practice')
    },
    {
      icon: Pen,
      title: t('home.writing_practice'),
      description: '',
      color: 'bg-app-purple',
      onClick: () => navigate('/practice')
    },
    {
      icon: Music,
      title: t('home.music_practice'),
      description: '',
      color: 'bg-app-purple',
      onClick: () => navigate('/practice')
    },
    {
      icon: Heart,
      title: t('home.love_practice'),
      description: '',
      color: 'bg-app-purple',
      onClick: () => navigate('/love-practice')
    }
  ];

  return (
    <Layout
      title={t('home.daily_practice')}
      showAdd
      onAdd={() => navigate('/practice')}
    >
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {practiceCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card
                key={index}
                className="bg-app-surface border-app-border p-6 cursor-pointer hover:bg-app-border transition-colors"
                onClick={card.onClick}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={`p-4 rounded-2xl ${card.color}`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-sm font-medium text-app-text leading-tight">
                    {card.title}
                  </h3>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Floating Add Button */}
        <div className="fixed bottom-20 right-4">
          <button
            onClick={() => navigate('/practice')}
            className="bg-app-purple hover:bg-app-purple-dark w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors"
          >
            <Plus className="h-6 w-6 text-white" />
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Stories;