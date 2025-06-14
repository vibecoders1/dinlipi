import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Search, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import BottomNavigation from './BottomNavigation';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
  showAdd?: boolean;
  onAdd?: () => void;
  onBack?: () => void;
}

const Layout = ({ 
  children, 
  title, 
  showBack = false, 
  showSearch = false, 
  showAdd = false,
  onAdd,
  onBack 
}: LayoutProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-app-bg text-app-text flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-app-border">
        <div className="flex items-center gap-3">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack || (() => navigate(-1))}
              className="text-app-text hover:bg-app-surface"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-lg font-medium text-app-text">
            {title || t('app.name')}
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          {showSearch && (
            <Button
              variant="ghost"
              size="icon"
              className="text-app-text hover:bg-app-surface"
            >
              <Search className="h-5 w-5" />
            </Button>
          )}
          {showAdd && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onAdd}
              className="text-app-text hover:bg-app-surface"
            >
              <Plus className="h-5 w-5" />
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Layout;