import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Logo } from './Logo';
import { Mail } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yinmn-blue-500 to-air-superiority-blue-500 p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Logo and Welcome Section */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Logo size="xl" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Spezi01</h1>
            <Badge variant="outline" className="bg-white/10 text-white border-white/30">
              Versiune experimentală
            </Badge>
          </div>
          <div className="max-w-lg mx-auto space-y-3 text-white/90">
            <p className="text-lg font-medium">
              Platformă AI pentru studenții la drept
            </p>
            <p className="text-sm leading-relaxed">
              Te ajutăm să devii un jurist mai bun, să treci examenele cu succes și să acumulezi
              cunoștințele necesare pentru a-i ajuta pe alții. Învățăm împreună, creștem împreună.
            </p>
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = 'mailto:ro.victorsolomon@gmail.com?subject=Feedback Spezi01'}
                className="gap-2 bg-white/10 hover:bg-white/20 text-white border-white/30"
              >
                <Mail className="h-4 w-4" />
                Trimite Feedback
              </Button>
            </div>
            <p className="text-xs text-white/70 italic">
              Orice feedback este binevenit și ne ajută să îmbunătățim platforma! 🙏
            </p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="w-full max-w-md mx-auto shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Intră în cont pentru a continua studiul
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  disabled={loading}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  disabled={loading}
                  className="w-full"
                />
              </div>
              {error && (
                <div className="bg-destructive/15 border border-destructive text-destructive px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Se încarcă...' : 'Login'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Nu ai cont?{' '}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Înregistrează-te
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
