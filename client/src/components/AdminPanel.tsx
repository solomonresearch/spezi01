import { useState, useEffect } from 'react';
import { useAuth, type UserRole } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Logo } from './Logo';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Shield, Users, BarChart3, FolderKanban, Settings, MessageSquare } from 'lucide-react';
import { feedbackService } from '../services/feedbackService';
import type { Feedback } from '../services/feedbackService';
import { toast, Toaster } from 'sonner';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  username: string;
  university_code: string;
  is_admin: boolean;
  role: UserRole;
  created_at: string;
}

export const AdminPanel = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not admin
    if (profile && !profile.is_admin) {
      navigate('/dashboard');
      return;
    }

    if (profile?.is_admin) {
      fetchUsers();
      fetchFeedback();
    }
  }, [profile, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('user_profiles')
        .select('id, email, name, username, university_code, is_admin, role, created_at')
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;

      setUsers(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      // Find the user being updated
      const user = users.find(u => u.id === userId);
      const userName = user?.name || user?.username || user?.email || 'User';

      console.log(`🔄 Updating role for ${userName} (${userId}) to ${newRole}...`);

      // Update the role using RPC function (bypasses RLS)
      const { data, error: updateError } = await supabase
        .rpc('update_user_role', {
          p_user_id: userId,
          p_new_role: newRole
        });

      if (updateError) {
        console.error('❌ Supabase update error:', updateError);
        throw updateError;
      }

      console.log('✅ Database updated successfully:', data);

      // Update the local state for immediate UI feedback
      setUsers(users.map(user =>
        user.id === userId
          ? { ...user, role: newRole, is_admin: newRole === 'admin' }
          : user
      ));

      // Show success toast
      const roleLabel = newRole === 'admin' ? 'Admin' : newRole === 'moderator' ? 'Moderator' : 'User';
      toast.success(`Rol actualizat cu succes`, {
        description: `${userName} este acum ${roleLabel}.`
      });

      console.log(`✅ Role successfully persisted to Supabase for ${userName}`);
    } catch (err) {
      console.error('❌ Error updating user role:', err);
      const errorMessage = err instanceof Error ? err.message : 'Eroare necunoscută';
      toast.error('Eroare la actualizarea rolului', {
        description: errorMessage
      });
    }
  };

  const fetchFeedback = async () => {
    try {
      setFeedbackLoading(true);
      const { data, error: fetchError } = await feedbackService.getAllFeedback();

      if (fetchError) throw fetchError;

      setFeedback(data || []);
      setFeedbackError(null);
    } catch (err) {
      console.error('Error fetching feedback:', err);
      setFeedbackError('Failed to load feedback');
    } finally {
      setFeedbackLoading(false);
    }
  };

  if (!profile || !profile.is_admin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-prussian-blue-500/10 to-air-blue-500/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Shield className="h-6 w-6" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">You do not have permission to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-prussian-blue-500/10 to-air-blue-500/10">
      <Toaster position="top-right" richColors />
      <header className="bg-background border-b border-border sticky top-0 z-10">
        <div className="container max-w-7xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Logo />
            <Badge variant="outline" className="hidden sm:flex">Beta v0.1</Badge>
            <h1 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Admin Panel
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Users Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Users
              </span>
              <Badge variant="secondary">{users.length} total</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading users...</div>
            ) : error ? (
              <div className="text-center py-8 text-destructive">{error}</div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>University</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.email}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.university_code}</TableCell>
                        <TableCell>
                          <Select
                            value={user.role}
                            onValueChange={(newRole) => updateUserRole(user.id, newRole as UserRole)}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue>
                                <Badge
                                  variant={
                                    user.role === 'admin'
                                      ? 'default'
                                      : user.role === 'moderator'
                                      ? 'outline'
                                      : 'secondary'
                                  }
                                >
                                  {user.role === 'admin' ? 'Admin' : user.role === 'moderator' ? 'Moderator' : 'User'}
                                </Badge>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">
                                <Badge variant="secondary">User</Badge>
                              </SelectItem>
                              <SelectItem value="moderator">
                                <Badge variant="outline">Moderator</Badge>
                              </SelectItem>
                              <SelectItem value="admin">
                                <Badge variant="default">Admin</Badge>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Feedback Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                User Feedback
              </span>
              <Badge variant="secondary">{feedback.length} submissions</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {feedbackLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading feedback...</div>
            ) : feedbackError ? (
              <div className="text-center py-8 text-destructive">{feedbackError}</div>
            ) : feedback.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No feedback submitted yet</div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="max-w-md">Feedback</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feedback.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-muted-foreground whitespace-nowrap">
                          {new Date(item.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.email || <span className="text-muted-foreground italic">Anonymous</span>}
                        </TableCell>
                        <TableCell className="max-w-md">
                          <p className="line-clamp-3">{item.body}</p>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Placeholder Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">Coming soon...</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderKanban className="h-5 w-5" />
                Case Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">Coming soon...</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                System Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">Coming soon...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
