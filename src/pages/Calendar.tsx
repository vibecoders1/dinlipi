import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card } from '../components/ui/card';

const Calendar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(11);

  // Sample calendar data - in a real app this would come from state/API
  const calendarData = [
    { date: 1, day: t('calendar.days.friday'), entries: 0 },
    { date: 2, day: t('calendar.days.saturday'), entries: 1 },
    { date: 3, day: t('calendar.days.sunday'), entries: 0 },
    { date: 4, day: t('calendar.days.monday'), entries: 0 },
    { date: 5, day: t('calendar.days.tuesday'), entries: 1 },
    { date: 6, day: t('calendar.days.wednesday'), entries: 0 },
    { date: 7, day: t('calendar.days.thursday'), entries: 1 },
    { date: 8, day: t('calendar.days.friday'), entries: 0 },
    { date: 9, day: t('calendar.days.saturday'), entries: 0 },
    { date: 10, day: t('calendar.days.sunday'), entries: 0 },
    { date: 11, day: t('calendar.days.monday'), entries: 1, isToday: true },
    { date: 12, day: t('calendar.days.tuesday'), entries: 0 },
    { date: 13, day: t('calendar.days.wednesday'), entries: 0 },
    { date: 14, day: t('calendar.days.thursday'), entries: 0 },
    { date: 15, day: t('calendar.days.friday'), entries: 0 },
    { date: 16, day: t('calendar.days.saturday'), entries: 0 },
    { date: 17, day: t('calendar.days.sunday'), entries: 0 },
    { date: 18, day: t('calendar.days.monday'), entries: 0 },
    { date: 19, day: t('calendar.days.tuesday'), entries: 0 },
    { date: 20, day: t('calendar.days.wednesday'), entries: 0 },
    { date: 21, day: t('calendar.days.thursday'), entries: 0 },
    { date: 22, day: t('calendar.days.friday'), entries: 0 },
    { date: 23, day: t('calendar.days.saturday'), entries: 0 },
    { date: 24, day: t('calendar.days.sunday'), entries: 0 },
    { date: 25, day: t('calendar.days.monday'), entries: 0 },
    { date: 26, day: t('calendar.days.tuesday'), entries: 0 },
    { date: 27, day: t('calendar.days.wednesday'), entries: 0 },
    { date: 28, day: t('calendar.days.thursday'), entries: 0 },
    { date: 29, day: t('calendar.days.friday'), entries: 0 },
    { date: 30, day: t('calendar.days.saturday'), entries: 0 },
    { date: 31, day: t('calendar.days.sunday'), entries: 0 },
  ];

  return (
    <Layout>
      <div className="p-4 space-y-4">
        {/* Month Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-app-text">
              {t('calendar.months.july')}, {t('calendar.year')}
            </h2>
            <ChevronDown className="h-4 w-4 text-app-text-muted" />
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-app-surface rounded-lg p-3 border border-app-border">
          <div className="grid grid-cols-7 gap-1">
            {/* Day headers */}
            {[
              t('calendar.days.friday'),
              t('calendar.days.saturday'), 
              t('calendar.days.sunday'),
              t('calendar.days.monday'),
              t('calendar.days.tuesday'),
              t('calendar.days.wednesday'),
              t('calendar.days.thursday')
            ].map((day, index) => (
              <div key={index} className="text-center py-1">
                <span className="text-xs text-app-text-muted font-medium">{day}</span>
              </div>
            ))}

            {/* Calendar dates */}
            {calendarData.map((item) => (
              <div
                key={item.date}
                className={`h-8 w-8 flex flex-col items-center justify-center text-center cursor-pointer rounded-md transition-colors ${
                  item.isToday
                    ? 'bg-app-purple text-white'
                    : selectedDate === item.date
                    ? 'bg-app-purple/20 text-app-purple'
                    : 'text-app-text hover:bg-app-border'
                }`}
                onClick={() => setSelectedDate(item.date)}
              >
                <span className="text-sm font-medium">{item.date}</span>
                {item.entries > 0 && (
                  <div className="w-1 h-1 bg-rose-400 rounded-full -mt-1"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Entry for selected date */}
        {selectedDate === 11 && (
          <Card className="bg-app-surface border-app-border p-4 mt-6">
            <div className="flex items-start gap-3">
              <div className="bg-app-purple text-white rounded-lg p-3 text-center min-w-12">
                <div className="text-xl font-bold">11</div>
                <div className="text-xs">{t('calendar.days.monday')}</div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-app-text leading-relaxed">
                  {t('calendar.entry_text')}
                </p>
                <div className="mt-3 w-12 h-12 bg-app-border rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-app-text-muted rounded opacity-50"></div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Floating Add Button */}
        <div className="fixed bottom-20 right-4">
          <button 
            onClick={() => navigate('/new-prayer')}
            className="bg-app-purple hover:bg-app-purple-dark w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors"
            aria-label={t('diary.add_new')}
          >
            <Plus className="h-6 w-6 text-white" />
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Calendar;