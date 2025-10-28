import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Mail, School, Calendar, Shield } from 'lucide-react';
import { Logo } from './Logo';

export const UserSettings = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-prussian-blue-500/10 to-air-blue-500/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Loading profile...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-prussian-blue-500/10 to-air-blue-500/10">
      <header className="bg-background border-b border-border sticky top-0 z-10">
        <div className="container max-w-4xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Logo />
            <Badge variant="outline" className="hidden sm:flex">Beta v0.1</Badge>
            <h1 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              Setări Utilizator
            </h1>
          </div>
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Button>
        </div>
      </header>

      <div className="container max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Informații Profil</span>
              {profile.is_admin && (
                <Badge variant="default" className="gap-1">
                  <Shield className="h-3 w-3" />
                  Administrator
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Informații Personale
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Nume Complet
                  </label>
                  <div className="p-3 bg-muted/50 rounded-lg border">
                    <p className="text-foreground font-medium">{profile.name}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Nume de Utilizator
                  </label>
                  <div className="p-3 bg-muted/50 rounded-lg border">
                    <p className="text-foreground font-medium">{profile.username}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Afișat pe clasamente
                    </p>
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </label>
                  <div className="p-3 bg-muted/50 rounded-lg border">
                    <p className="text-foreground font-medium">{profile.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* University Information */}
            {(profile.university_name || profile.university_code) && (
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Informații Universitate
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <School className="h-4 w-4" />
                      Universitate
                    </label>
                    <div className="p-3 bg-muted/50 rounded-lg border">
                      <p className="text-foreground font-medium">
                        {profile.university_name || 'N/A'}
                      </p>
                      {profile.university_code && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Cod: {profile.university_code}
                        </p>
                      )}
                    </div>
                  </div>

                  {profile.university_category && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Categorie
                      </label>
                      <div className="p-3 bg-muted/50 rounded-lg border">
                        <Badge variant="outline" className="font-normal">
                          {profile.university_category}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Account Information */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Informații Cont
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Data Creării
                  </label>
                  <div className="p-3 bg-muted/50 rounded-lg border">
                    <p className="text-foreground font-medium">{formatDate(profile.created_at)}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    ID Utilizator
                  </label>
                  <div className="p-3 bg-muted/50 rounded-lg border">
                    <p className="text-foreground font-mono text-xs break-all">{profile.id}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Message */}
            <div className="pt-4 border-t">
              <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  <strong>Notă:</strong> Aceste informații au fost furnizate la înregistrare și nu pot fi modificate momentan.
                  Pentru actualizări, te rugăm să contactezi administratorii platformei.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
