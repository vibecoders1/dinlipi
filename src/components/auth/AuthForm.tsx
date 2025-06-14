import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from '../../hooks/use-toast';

interface AuthFormProps {
  mode: 'signin' | 'signup';
  onToggleMode: () => void;
}

const AuthForm = ({ mode, onToggleMode }: AuthFormProps) => {
  const { t } = useTranslation();
  const { signIn, signUp, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'signup' && formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords don't match",
        variant: "destructive",
      });
      return;
    }

    try {
      if (mode === 'signin') {
        await signIn(formData.email, formData.password);
        toast({
          title: "Success",
          description: "Welcome back!",
        });
      } else {
        await signUp(formData.email, formData.password, formData.fullName);
        toast({
          title: "Success",
          description: "Account created successfully! Please check your email for verification.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-app-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-app-surface border-app-border">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-app-text">
            {t('app.name')}
          </CardTitle>
          <CardDescription className="text-app-text-muted">
            {mode === 'signin' ? 'Sign in to your account' : 'Create a new account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-app-text">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="bg-app-bg border-app-border text-app-text"
                  placeholder="Enter your full name"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-app-text">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="bg-app-bg border-app-border text-app-text"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-app-text">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="bg-app-bg border-app-border text-app-text pr-10"
                  placeholder="Enter your password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 text-app-text-muted hover:text-app-text"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-app-text">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="bg-app-bg border-app-border text-app-text"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-app-purple hover:bg-app-purple-dark text-white"
              disabled={loading}
            >
              {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={onToggleMode}
              className="text-app-purple hover:text-app-purple-light"
            >
              {mode === 'signin' 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"
              }
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;