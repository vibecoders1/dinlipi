import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import "./i18n";
import { AuthProvider } from "./contexts/AuthContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import AuthForm from "./components/auth/AuthForm";
import { useAuth } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Stories from "./pages/Stories";
import Calendar from "./pages/Calendar";
import Mood from "./pages/Mood";
import Settings from "./pages/Settings";
import PracticeForm from "./pages/PracticeForm";
import NewDiaryForm from "./pages/NewDiaryForm";
import DiaryView from "./pages/DiaryView";
import DiaryEdit from "./pages/DiaryEdit";
import MoodPractice from "./pages/MoodPractice";
import WordCloudPractice from "./pages/WordCloudPractice";
import LovePractice from "./pages/LovePractice";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  console.log('AppContent rendering...');
  const { user, loading } = useAuth();
  console.log('AppContent - user:', user, 'loading:', loading);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  if (loading) {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center">
        <div className="text-app-text">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <AuthForm 
        mode={authMode} 
        onToggleMode={() => setAuthMode(prev => prev === 'signin' ? 'signup' : 'signin')}
      />
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/mood" element={<Mood />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/practice" element={<PracticeForm />} />
        
        <Route path="/diary/new" element={<NewDiaryForm />} />
        <Route path="/diary/:id" element={<DiaryView />} />
        <Route path="/diary/:id/edit" element={<DiaryEdit />} />
        <Route path="/mood-practice" element={<MoodPractice />} />
        <Route path="/word-cloud" element={<WordCloudPractice />} />
        <Route path="/love-practice" element={<LovePractice />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => {
  useEffect(() => {
    // Set dark mode by default
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <SettingsProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </SettingsProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
