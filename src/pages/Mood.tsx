import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import Layout from '../components/Layout';
import { Card } from '../components/ui/card';
import { Progress } from '../components/ui/progress';

const Mood = () => {
  const { t } = useTranslation();

  const moodData = [
    { label: '😢', percentage: 10, color: 'bg-red-500' },
    { label: '😕', percentage: 15, color: 'bg-orange-500' },
    { label: '😐', percentage: 30, color: 'bg-yellow-500' },
    { label: '😊', percentage: 30, color: 'bg-green-500' },
    { label: '😄', percentage: 15, color: 'bg-emerald-500' },
  ];

  const moodWords = [
    t('mood.moods.depression'),
    t('mood.moods.anger'),
    t('mood.moods.fear'),
    t('mood.moods.mixed'),
    t('mood.moods.joy'),
    t('mood.moods.white'),
    t('mood.moods.black'),
    t('mood.moods.green'),
    t('mood.moods.beautiful'),
    t('mood.moods.spring'),
    t('mood.moods.rain'),
    t('mood.moods.cold'),
    t('mood.moods.hot'),
  ];

  // Sample chart data points for the mood tracker
  const chartPoints = [
    { x: 0, y: 60 },
    { x: 1, y: 65 },
    { x: 2, y: 70 },
    { x: 3, y: 75 },
    { x: 4, y: 80 },
    { x: 5, y: 85 },
  ];

  const pathData = chartPoints
    .map((point, index) => {
      const x = (point.x / 5) * 280 + 20;
      const y = 120 - (point.y / 100) * 80;
      return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    })
    .join(' ');

  return (
    <Layout title={t('mood.title')}>
      <div className="p-4 space-y-6">
        {/* Mood Tracker Chart */}
        <Card className="bg-app-surface border-app-border p-6">
          <h3 className="text-lg font-medium text-app-text mb-4">
            {t('mood.tracker')}
          </h3>
          <div className="h-32 bg-app-bg rounded-lg p-4 relative overflow-hidden">
            <svg width="100%" height="100%" viewBox="0 0 320 120" className="absolute inset-0">
              <path
                d={pathData}
                stroke="hsl(var(--app-purple))"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {chartPoints.map((point, index) => (
                <circle
                  key={index}
                  cx={(point.x / 5) * 280 + 20}
                  cy={120 - (point.y / 100) * 80}
                  r="4"
                  fill="hsl(var(--app-purple))"
                />
              ))}
            </svg>
            <div className="absolute bottom-2 left-4 right-4 flex justify-between text-xs text-app-text-muted">
              <span>01</span>
              <span>06</span>
              <span>11</span>
              <span>16</span>
              <span>21</span>
              <span>26</span>
            </div>
          </div>
        </Card>

        {/* Mood Bar */}
        <Card className="bg-app-surface border-app-border p-6">
          <h3 className="text-lg font-medium text-app-text mb-4">
            {t('mood.bar')}
          </h3>
          <div className="space-y-4">
            <div className="relative h-6 bg-app-bg rounded-full overflow-hidden">
              <div className="absolute inset-0 flex">
                {moodData.map((mood, index) => (
                  <div
                    key={index}
                    className={`h-full ${mood.color}`}
                    style={{ width: `${mood.percentage}%` }}
                  ></div>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center">
              {moodData.map((mood, index) => (
                <div key={index} className="flex flex-col items-center">
                  <span className="text-lg mb-1">{mood.label}</span>
                  <span className="text-xs text-app-text-muted">
                    {t(`mood.percentages.${['very_sad', 'sad', 'neutral', 'happy', 'very_happy'][index]}`)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Word Cloud */}
        <Card className="bg-app-surface border-app-border p-6">
          <h3 className="text-lg font-medium text-app-text mb-4">
            {t('mood.your_mood')}
          </h3>
          <div className="flex flex-wrap gap-2">
            {moodWords.map((word, index) => (
              <span
                key={index}
                className={`px-3 py-1 rounded-full text-sm ${
                  index < 5
                    ? 'bg-app-purple text-white'
                    : 'bg-app-bg text-app-text-muted'
                }`}
              >
                {word}
              </span>
            ))}
          </div>
        </Card>

        {/* Floating Add Button */}
        <div className="fixed bottom-20 right-4">
          <button className="bg-app-purple hover:bg-app-purple-dark w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors">
            <Plus className="h-6 w-6 text-white" />
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Mood;