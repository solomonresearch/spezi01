import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { universities, universitiesByCategory } from '../data/universities';
import { supabase } from '../lib/supabase';

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
    <div className="auth-container">
      <div className="auth-card">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">
              Username <span className="field-hint">(displayed on leaderboard)</span>
            </label>
            <input
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
              className={usernameAvailable === false ? 'input-error' : usernameAvailable === true ? 'input-success' : ''}
            />
            {usernameChecking && <p className="field-hint">Checking availability...</p>}
            {usernameAvailable === true && <p className="field-success">✓ Username available</p>}
            {usernameAvailable === false && <p className="field-error">✗ Username already taken</p>}
            <p className="field-hint-small">This will be visible to other users on leaderboards and interactions</p>
          </div>

          <div className="form-group">
            <label htmlFor="university">University</label>
            <select
              id="university"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              disabled={loading}
            >
              <option value="">Select your university</option>
              <optgroup label="Public Universities">
                {universitiesByCategory.Public.map((uni) => (
                  <option key={uni.code} value={uni.code}>
                    {uni.code} - {uni.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Private Universities">
                {universitiesByCategory.Private.map((uni) => (
                  <option key={uni.code} value={uni.code}>
                    {uni.code} - {uni.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Other">
                {universitiesByCategory.Other.map((uni) => (
                  <option key={uni.code} value={uni.code}>
                    {uni.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && (
            <div className="success-message">
              Account created successfully! Check your email to confirm. Redirecting to login...
            </div>
          )}
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};
