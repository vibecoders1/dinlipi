import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

const languages = [
  { code: 'bn', name: 'বাংলা', nativeName: 'বাংলা' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
];

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language);

  return (
    <div className="flex items-center gap-3 p-4 bg-app-surface rounded-lg border border-app-border">
      <Globe className="h-5 w-5 text-app-purple" />
      <div className="flex-1">
        <p className="text-sm font-medium text-app-text">Language</p>
        <Select value={i18n.language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-full mt-1 bg-app-bg border-app-border text-app-text">
            <SelectValue>
              {currentLanguage?.nativeName || currentLanguage?.name}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-app-surface border-app-border">
            {languages.map((language) => (
              <SelectItem
                key={language.code}
                value={language.code}
                className="text-app-text hover:bg-app-bg"
              >
                <div className="flex items-center gap-2">
                  <span>{language.nativeName}</span>
                  <span className="text-sm text-app-text-muted">({language.name})</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default LanguageSelector;