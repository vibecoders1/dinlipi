import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Archive, Palette, Type, Info, Star, ChevronRight, LogOut, User, Sun, Moon, Check } from 'lucide-react';
import Layout from '../components/Layout';
import LanguageSelector from '../components/LanguageSelector';
import { Card } from '../components/ui/card';
import { Switch } from '../components/ui/switch';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import { toast } from '../hooks/use-toast';

const Settings = () => {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const { theme, fontSize, setTheme, setFontSize } = useSettings();
  const [themeDialogOpen, setThemeDialogOpen] = useState(false);
  const [fontSizeDialogOpen, setFontSizeDialogOpen] = useState(false);
  const [aboutDialogOpen, setAboutDialogOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Success",
        description: "Signed out successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error", 
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    setThemeDialogOpen(false);
    toast({
      title: "Theme Updated",
      description: `Switched to ${newTheme} mode`,
    });
  };

  const handleFontSizeChange = (newFontSize: 'small' | 'medium' | 'large') => {
    setFontSize(newFontSize);
    setFontSizeDialogOpen(false);
    toast({
      title: "Font Size Updated",
      description: `Changed to ${newFontSize} font size`,
    });
  };

  const settingsItems = [
    {
      icon: Shield,
      title: t('settings.passcode'),
      type: 'toggle',
      value: true,
    },
    {
      icon: Archive,
      title: t('settings.backup_restore'),
      type: 'navigation',
    },
  ];

  const customizationItems = [
    {
      icon: Palette,
      title: t('settings.theme'),
      type: 'custom',
      action: () => setThemeDialogOpen(true),
      value: theme === 'dark' ? t('settings.dark_mode') : t('settings.light_mode'),
    },
    {
      icon: Type,
      title: t('settings.font_size'),
      type: 'custom',
      action: () => setFontSizeDialogOpen(true),
      value: t(`settings.font_${fontSize}`),
    },
  ];

  const dataItems = [
    {
      icon: Info,
      title: t('settings.about'),
      type: 'custom',
      action: () => setAboutDialogOpen(true),
    },
    {
      icon: Star,
      title: t('settings.rate_app'),
      type: 'navigation',
    },
  ];

  return (
    <Layout title={t('settings.title')}>
      <div className="p-4 space-y-6">
        {/* User Profile */}
        <Card className="bg-app-surface border-app-border p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-app-purple rounded-full">
              <User className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-app-text">
                {user?.user_metadata?.full_name || 'User'}
              </h3>
              <p className="text-sm text-app-text-muted">{user?.email}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t('settings.sign_out')}
            </Button>
          </div>
        </Card>

        {/* Language Selector */}
        <LanguageSelector />

        {/* General Settings */}
        <div>
          <h3 className="text-sm font-medium text-app-text-muted mb-3">
            {t('settings.general')}
          </h3>
          <Card className="bg-app-surface border-app-border divide-y divide-app-border">
            {settingsItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-app-purple rounded-lg">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-app-text font-medium">{item.title}</span>
                  </div>
                  {item.type === 'toggle' ? (
                    <Switch defaultChecked={item.value} />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-app-text-muted" />
                  )}
                </div>
              );
            })}
          </Card>
        </div>

        {/* Customization */}
        <div>
          <h3 className="text-sm font-medium text-app-text-muted mb-3">
            {t('settings.customization')}
          </h3>
          <Card className="bg-app-surface border-app-border divide-y divide-app-border">
            {customizationItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-app-border/50 transition-colors"
                  onClick={item.action}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-app-purple rounded-lg">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-app-text font-medium">{item.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-app-text-muted">{item.value}</span>
                    <ChevronRight className="h-5 w-5 text-app-text-muted" />
                  </div>
                </div>
              );
            })}
          </Card>
        </div>

        {/* Data */}
        <div>
          <h3 className="text-sm font-medium text-app-text-muted mb-3">
            {t('settings.data')}
          </h3>
          <Card className="bg-app-surface border-app-border divide-y divide-app-border">
            {dataItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-app-border/50 transition-colors"
                  onClick={item.action}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-app-purple rounded-lg">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-app-text font-medium">{item.title}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-app-text-muted" />
                </div>
              );
            })}
          </Card>
        </div>

        {/* Theme Dialog */}
        <Dialog open={themeDialogOpen} onOpenChange={setThemeDialogOpen}>
          <DialogContent className="bg-app-surface border-app-border">
            <DialogHeader>
              <DialogTitle className="text-app-text">{t('settings.theme')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div 
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  theme === 'light' ? 'bg-app-purple/20 border border-app-purple' : 'hover:bg-app-border'
                }`}
                onClick={() => handleThemeChange('light')}
              >
                <Sun className="h-5 w-5 text-app-text" />
                <span className="text-app-text font-medium">{t('settings.light_mode')}</span>
                {theme === 'light' && <Check className="h-5 w-5 text-app-purple ml-auto" />}
              </div>
              <div 
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  theme === 'dark' ? 'bg-app-purple/20 border border-app-purple' : 'hover:bg-app-border'
                }`}
                onClick={() => handleThemeChange('dark')}
              >
                <Moon className="h-5 w-5 text-app-text" />
                <span className="text-app-text font-medium">{t('settings.dark_mode')}</span>
                {theme === 'dark' && <Check className="h-5 w-5 text-app-purple ml-auto" />}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Font Size Dialog */}
        <Dialog open={fontSizeDialogOpen} onOpenChange={setFontSizeDialogOpen}>
          <DialogContent className="bg-app-surface border-app-border">
            <DialogHeader>
              <DialogTitle className="text-app-text">{t('settings.font_size')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              {(['small', 'medium', 'large'] as const).map((size) => (
                <div 
                  key={size}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    fontSize === size ? 'bg-app-purple/20 border border-app-purple' : 'hover:bg-app-border'
                  }`}
                  onClick={() => handleFontSizeChange(size)}
                >
                  <Type className="h-5 w-5 text-app-text" />
                  <span className={`text-app-text font-medium ${
                    size === 'small' ? 'text-sm' : size === 'large' ? 'text-lg' : 'text-base'
                  }`}>
                    {t(`settings.font_${size}`)}
                  </span>
                  {fontSize === size && <Check className="h-5 w-5 text-app-purple ml-auto" />}
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* About Dialog */}
        <Dialog open={aboutDialogOpen} onOpenChange={setAboutDialogOpen}>
          <DialogContent className="bg-app-surface border-app-border">
            <DialogHeader>
              <DialogTitle className="text-app-text">{t('settings.about')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-center">
                <div className="p-4 bg-app-purple rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <User className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-app-text mb-2">{t('app.name')}</h3>
                <p className="text-app-text-muted">{t('app.title')}</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-app-border rounded-lg">
                  <span className="text-app-text-muted">{t('settings.app_version')}</span>
                  <span className="text-app-text font-medium">1.0.0</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-app-border rounded-lg">
                  <span className="text-app-text-muted">{t('settings.developer')}</span>
                  <span className="text-app-text font-medium">{t('settings.team_name')}</span>
                </div>
              </div>

              <div className="text-center pt-4">
                <p className="text-sm text-app-text-muted">
                  {t('settings.app_description')}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Settings;