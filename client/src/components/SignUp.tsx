import { useState } from 'react';
import type { FormEvent } from 'react';
import { Check, X as XIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { universities, universitiesByCategory } from '../data/universities';
import { supabase } from '../lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';

export const SignUp = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [university, setUniversity] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  // Check username availability
  const checkUsernameAvailability = async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    setUsernameChecking(true);
    try {
      const { data, error } = await supabase.rpc('is_username_available', {
        p_username: username
      });

      if (error) {
        // If function doesn't exist yet, check manually (case-insensitive)
        const { data: profiles } = await supabase
          .from('user_profiles')
          .select('username')
          .ilike('username', username)
          .maybeSingle();

        setUsernameAvailable(!profiles);
      } else {
        setUsernameAvailable(data);
      }
    } catch (error) {
      setUsernameAvailable(null);
    } finally {
      setUsernameChecking(false);
    }
  };

  const validateForm = () => {
    if (!name || !username || !email || !password || !confirmPassword || !university) {
      setError('Please fill in all fields');
      return false;
    }
    if (name.length < 2) {
      setError('Name must be at least 2 characters');
      return false;
    }
    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return false;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only contain letters, numbers, and underscores');
      return false;
    }
    if (usernameAvailable === false) {
      setError('Username is already taken');
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
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!validateForm()) return;

    setLoading(true);

    // Find selected university details
    const selectedUniversity = universities.find(u => u.code === university);
    if (!selectedUniversity) {
      setError('Please select a university');
      setLoading(false);
      return;
    }

    // Sign up with additional profile data
    const { error } = await signUp(email, password, {
      name,
      username,
      university_code: selectedUniversity.code,
      university_category: selectedUniversity.category,
      university_name: selectedUniversity.name
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-prussian-blue-500 to-air-blue-500 p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign Up</CardTitle>
          <CardDescription className="text-center">
            Create your account to start practicing Romanian law cases
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">
                  Username{' '}
                  <span className="text-xs text-muted-foreground font-normal">(displayed on leaderboard)</span>
                </Label>
                <div className="relative">
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => {
                      const val = e.target.value;
                      setUsername(val);
                      if (val.length >= 3) {
                        checkUsernameAvailability(val);
                      } else {
                        setUsernameAvailable(null);
                      }
                    }}
                    placeholder="johndoe123"
                    disabled={loading}
                    className={
                      usernameAvailable === false
                        ? 'border-destructive'
                        : usernameAvailable === true
                        ? 'border-green-500'
                        : ''
                    }
                  />
                  {usernameChecking && (
                    <p className="text-xs text-muted-foreground mt-1">Checking availability...</p>
                  )}
                  {usernameAvailable === true && (
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      Username available
                    </p>
                  )}
                  {usernameAvailable === false && (
                    <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                      <XIcon className="h-3 w-3" />
                      Username already taken
                    </p>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Visible to other users on leaderboards
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="university">University</Label>
              <Select value={university} onValueChange={setUniversity} disabled={loading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your university" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Public Universities</SelectLabel>
                    {universitiesByCategory.Public.map((uni) => (
                      <SelectItem key={uni.code} value={uni.code}>
                        {uni.code} - {uni.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Private Universities</SelectLabel>
                    {universitiesByCategory.Private.map((uni) => (
                      <SelectItem key={uni.code} value={uni.code}>
                        {uni.code} - {uni.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Other</SelectLabel>
                    {universitiesByCategory.Other.map((uni) => (
                      <SelectItem key={uni.code} value={uni.code}>
                        {uni.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={loading}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <div className="bg-destructive/15 border border-destructive text-destructive px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-500 text-green-700 px-4 py-3 rounded-lg text-sm">
                Account created successfully! Check your email to confirm. Redirecting to login...
              </div>
            )}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
