import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Logo } from './Logo';
import { supabase } from '../lib/supabase';

export const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a valid session (user clicked the reset link)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Link-ul de resetare este invalid sau a expirat. Te rog solicită un nou link.');
      }
    };
    checkSession();
  }, []);

  const validateForm = () => {
    if (!password || !confirmPassword) {
      setError('Te rog completează ambele câmpuri');
      return false;
    }
    if (password.length < 6) {
      setError('Parola trebuie să aibă cel puțin 6 caractere');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Parolele nu se potrivesc');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    // Update the user's password
    const { error: updateError } = await supabase.auth.updateUser({
      password: password
    });

    if (updateError) {
      setError('A apărut o eroare. Te rog încearcă din nou.');
      setLoading(false);
      return;
    }

    // Password updated successfully
    setSuccess(true);
    setLoading(false);

    // Wait 2 seconds to show success message, then redirect to dashboard
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Logo size="xl" />
            </div>
            <Badge variant="outline" className="border-primary/30 text-primary">
              versiunea v0.1
            </Badge>
          </div>

          <Card className="shadow-2xl">
            <CardContent className="pt-6">
              <div className="text-center space-y-4 py-8">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-lg font-semibold">Parolă actualizată!</h3>
                <p className="text-sm text-muted-foreground">
                  Parola ta a fost schimbată cu succes. Vei fi redirecționat către dashboard...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Logo size="xl" />
          </div>
          <Badge variant="outline" className="border-primary/30 text-primary">
            versiunea v0.1
          </Badge>
        </div>

        <Card className="shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Resetare Parolă</CardTitle>
            <CardDescription className="text-center">
              Alege o parolă nouă pentru contul tău
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">
                  Parolă nouă <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minim 6 caractere"
                  disabled={loading}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirmă parola <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-scrie parola"
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
                {loading ? 'Se actualizează...' : 'Actualizează Parola'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
