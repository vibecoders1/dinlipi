import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Calendar, Brain, Settings, Layers } from 'lucide-react';
import { Button } from './ui/button';

const BottomNavigation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      icon: BookOpen,
      label: t('navigation.diary'),
      path: '/',
    },
    {
      icon: Layers,
      label: 'Stories',
      path: '/stories',
    },
    {
      icon: Brain,
      label: t('navigation.mood'),
      path: '/mood',
    },
    {
      icon: Settings,
      label: t('navigation.settings'),
      path: '/settings',
    },
  ];

  return (
    <nav className="border-t border-app-border bg-app-surface">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Button
              key={item.path}
              variant="ghost"
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 py-3 px-4 h-auto min-w-0 ${
                isActive 
                  ? 'text-app-purple' 
                  : 'text-app-text-muted hover:text-app-text'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium truncate max-w-16">
                {item.label}
              </span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;