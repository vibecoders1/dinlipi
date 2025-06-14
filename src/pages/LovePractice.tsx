import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import { Card } from '../components/ui/card';

const LovePractice = () => {
  const { t } = useTranslation();

  const practiceItems = [
    t('practices.day_1'),
    t('practices.day_2'),
    t('practices.day_3'),
    t('practices.day_4'),
    t('practices.day_5'),
    t('practices.day_6'),
    t('practices.day_7'),
  ];

  return (
    <Layout 
      title={t('practices.7_day_love')} 
      showBack
    >
      <div className="p-4 space-y-3">
        {practiceItems.map((item, index) => (
          <Card
            key={index}
            className="bg-app-surface border-app-border p-4 cursor-pointer hover:bg-app-border transition-colors"
          >
            <p className="text-app-text font-medium">{item}</p>
          </Card>
        ))}
      </div>
    </Layout>
  );
};

export default LovePractice;