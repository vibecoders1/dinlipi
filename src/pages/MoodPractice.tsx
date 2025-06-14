import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import { Card } from '../components/ui/card';

const MoodPractice = () => {
  const { t } = useTranslation();

  return (
    <Layout 
      title={t('home.mood_board')} 
      showBack
    >
      <div className="p-4">
        <Card className="bg-app-surface border-app-border p-6 text-center">
          <div className="space-y-4">
            <div className="text-6xl">🎨</div>
            <h2 className="text-lg font-medium text-app-text">
              {t('home.mood_board')}
            </h2>
            <p className="text-app-text-muted leading-relaxed">
              {t('messages.mood_board_practice')}
            </p>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default MoodPractice;