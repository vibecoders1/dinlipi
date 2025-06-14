import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, ChevronDown, BookOpen, Briefcase, Utensils, Heart, Calendar as CalendarIcon, Edit3, Trash2 } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { cn } from '../lib/utils';
import BottomNavigation from '../components/BottomNavigation';
import { useState, useMemo } from 'react';

const Index = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Sample diary entries with tags and dates
  const diaryEntries = [
    {
      id: 1,
      date: new Date(2025, 5, 11), // June 11, 2025
      title: t('diary.entries.relaxing_sunday'),
      content: t('diary.entries.relaxing_sunday'),
      tags: [t('diary.tags.book'), t('diary.tags.life')],
      icon: BookOpen
    },
    {
      id: 2,
      date: new Date(2025, 5, 8), // June 8, 2025
      title: t('diary.entries.productive_work'),
      content: t('diary.entries.productive_work'),
      tags: [t('diary.tags.work')],
      icon: Briefcase
    },
    {
      id: 3,
      date: new Date(2025, 5, 6), // June 6, 2025
      title: t('diary.entries.cooking_recipe'),
      content: t('diary.entries.cooking_recipe'),
      tags: [t('diary.tags.food')],
      icon: Utensils
    }
  ];

  // Generate calendar days for current month/year
  const generateCalendarDays = useMemo(() => {
    const firstDay = new Date(selectedYear, selectedMonth, 1);
    const lastDay = new Date(selectedYear, selectedMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);
    
    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      const hasEntry = diaryEntries.some(entry => 
        entry.date.getDate() === current.getDate() &&
        entry.date.getMonth() === current.getMonth() &&
        entry.date.getFullYear() === current.getFullYear()
      );
      
      days.push({
        date: new Date(current),
        day: current.getDate(),
        isCurrentMonth: current.getMonth() === selectedMonth,
        hasEntry,
        isSelected: selectedDate === current.getDate() && current.getMonth() === selectedMonth
      });
      
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  }, [selectedMonth, selectedYear, selectedDate, diaryEntries]);

  // Filter entries based on search and selected date
  const filteredEntries = useMemo(() => {
    let filtered = diaryEntries;
    
    if (selectedDate) {
      filtered = filtered.filter(entry => 
        entry.date.getDate() === selectedDate &&
        entry.date.getMonth() === selectedMonth &&
        entry.date.getFullYear() === selectedYear
      );
    }
    
    if (searchQuery) {
      filtered = filtered.filter(entry =>
        entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    return filtered;
  }, [diaryEntries, searchQuery, selectedDate, selectedMonth, selectedYear]);

  const monthNames = [
    t('calendar.months.january'),
    t('calendar.months.february'),
    t('calendar.months.march'),
    t('calendar.months.april'),
    t('calendar.months.may'),
    t('calendar.months.june'),
    t('calendar.months.july'),
    t('calendar.months.august'),
    t('calendar.months.september'),
    t('calendar.months.october'),
    t('calendar.months.november'),
    t('calendar.months.december')
  ];

  const dayNames = [
    t('calendar.days.sunday'),
    t('calendar.days.monday'),
    t('calendar.days.tuesday'),
    t('calendar.days.wednesday'),
    t('calendar.days.thursday'),
    t('calendar.days.friday'),
    t('calendar.days.saturday')
  ];

  const handleDateClick = (day: number) => {
    setSelectedDate(selectedDate === day ? null : day);
  };

  const handleEntryClick = (entryId: number) => {
    navigate(`/diary/${entryId}`);
  };

  return (
    <div className="min-h-screen bg-app-bg text-app-text flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-app-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-app-text">
            {t('navigation.diary')}
          </h1>
        </div>

        {/* Month/Year Selector */}
        <div className="flex items-center gap-2 mb-4">
          <Select
            value={selectedMonth.toString()}
            onValueChange={(value) => {
              setSelectedMonth(Number(value));
              setSelectedDate(null);
            }}
          >
            <SelectTrigger className="w-32 bg-app-surface border-app-border">
              <SelectValue>
                {monthNames[selectedMonth]}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-app-surface border-app-border">
              {monthNames.map((month, monthIndex) => (
                <SelectItem 
                  key={monthIndex} 
                  value={monthIndex.toString()}
                  className="text-app-text hover:bg-app-purple/20"
                >
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={selectedYear.toString()}
            onValueChange={(value) => {
              setSelectedYear(Number(value));
              setSelectedDate(null);
            }}
          >
            <SelectTrigger className="w-24 bg-app-surface border-app-border">
              <SelectValue>
                {selectedYear}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-app-surface border-app-border">
              {[...Array(10)].map((_, i) => {
                const year = new Date().getFullYear() - 5 + i;
                return (
                  <SelectItem 
                    key={year} 
                    value={year.toString()}
                    className="text-app-text hover:bg-app-purple/20"
                  >
                    {year}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-app-text-muted" />
          <Input
            placeholder={t('diary.search_placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-app-surface border-app-border text-app-text placeholder:text-app-text-muted"
          />
        </div>
      </header>

      {/* Calendar */}
      <div className="p-3 border-b border-app-border">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-xs text-app-text-muted py-1">
              {day.slice(0, 2)}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {generateCalendarDays.map((day, index) => (
            <button
              key={index}
              onClick={() => day.isCurrentMonth && handleDateClick(day.day)}
              className={cn(
                "h-8 w-8 flex items-center justify-center text-xs font-medium rounded transition-colors",
                day.isCurrentMonth 
                  ? "text-app-text hover:bg-app-surface" 
                  : "text-app-text-muted",
                day.hasEntry && day.isCurrentMonth && "bg-app-purple text-white",
                day.isSelected && "ring-1 ring-app-purple",
                !day.isCurrentMonth && "opacity-40"
              )}
            >
              {day.day}
            </button>
          ))}
        </div>
      </div>

      {/* Diary Entries */}
      <main className="flex-1 overflow-auto p-4">
        {selectedDate && (
          <div className="mb-4">
            <h2 className="text-lg font-medium text-app-text">
              {t('diary.entries_for_date', { date: `${monthNames[selectedMonth]} ${selectedDate}, ${selectedYear}` })}
            </h2>
          </div>
        )}

        <div className="space-y-4">
          {filteredEntries.map((entry) => {
            const IconComponent = entry.icon;
            return (
              <Card 
                key={entry.id}
                className="bg-app-surface border-app-border cursor-pointer hover:bg-app-surface/80 transition-colors"
                onClick={() => handleEntryClick(entry.id)}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-app-purple text-white p-2 rounded-lg">
                        <div className="text-lg font-bold">{entry.date.getDate()}</div>
                        <div className="text-xs">
                          {dayNames[entry.date.getDay()].slice(0, 3)}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-app-text mb-1">{entry.title}</h3>
                        <p className="text-app-text-muted text-sm line-clamp-2">
                          {entry.content}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-app-text-muted hover:text-app-text"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/diary/${entry.id}/edit`);
                        }}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-app-text-muted hover:text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle delete
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {entry.tags.map((tag) => (
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
              </Card>
            );
          })}

          {filteredEntries.length === 0 && (
            <div className="text-center py-12">
              <CalendarIcon className="h-12 w-12 text-app-text-muted mx-auto mb-4" />
              <p className="text-app-text-muted mb-4">
                {selectedDate 
                  ? t('diary.no_entries_for_date')
                  : searchQuery 
                    ? t('diary.no_search_results')
                    : t('diary.no_entries')
                }
              </p>
              <Button
                onClick={() => navigate('/diary/new')}
                className="bg-app-purple hover:bg-app-purple-dark text-white"
              >
                {t('diary.create_first_entry')}
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Floating Add Button */}
      <div className="fixed bottom-20 right-4">
        <Button
          onClick={() => navigate('/diary/new')}
          className="bg-app-purple hover:bg-app-purple-dark w-14 h-14 rounded-full shadow-lg"
          aria-label={t('diary.add_new')}
        >
          <Plus className="h-6 w-6 text-white" />
        </Button>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Index;