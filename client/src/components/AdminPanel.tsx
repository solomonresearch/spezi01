import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Logo } from './Logo';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  username: string;
  is_admin: boolean;
  created_at: string;
}

export const AdminPanel = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not admin
    if (profile && !profile.is_admin) {
      navigate('/dashboard');
      return;
    }

    if (profile?.is_admin) {
      fetchUsers();
    }
  }, [profile, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('user_profiles')
        .select('id, email, name, username, is_admin, created_at')
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

  if (!profile || !profile.is_admin) {
    return (
      <div className="admin-container">
        <div className="admin-unauthorized">
          <h2>Access Denied</h2>
          <p>You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="header-left">
          <Logo />
          <span className="beta-badge">Beta v0.1</span>
          <span className="admin-title">Admin Panel</span>
        </div>
        <div className="admin-nav">
          <button
            onClick={() => navigate('/case-generator')}
            className="btn-case-generator"
            style={{
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
              marginRight: '12px',
              boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(5, 150, 105, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(5, 150, 105, 0.3)';
            }}
          >
            🤖 GENERATOR DE CAZURI
          </button>
          <button onClick={() => navigate('/dashboard')} className="btn-back">
            Back to Dashboard
          </button>
        </div>
      </header>

      <div className="admin-content">
        {/* Users Section */}
        <section className="admin-section">
          <div className="section-header">
            <h2>Users</h2>
            <span className="user-count">{users.length} total</span>
          </div>

          {loading ? (
            <div className="admin-loading">Loading users...</div>
          ) : error ? (
            <div className="admin-error">{error}</div>
          ) : (
            <div className="users-table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Admin</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.email}</td>
                      <td>{user.name}</td>
                      <td>{user.username}</td>
                      <td>
                        <span className={`admin-badge ${user.is_admin ? 'admin' : ''}`}>
                          {user.is_admin ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Placeholder Sections */}
        <section className="admin-section placeholder">
          <div className="section-header">
            <h2>Analytics</h2>
          </div>
          <div className="placeholder-content">
            <p>Coming soon...</p>
          </div>
        </section>

        <section className="admin-section placeholder">
          <div className="section-header">
            <h2>Case Management</h2>
          </div>
          <div className="placeholder-content">
            <p>Coming soon...</p>
          </div>
        </section>

        <section className="admin-section placeholder">
          <div className="section-header">
            <h2>System Settings</h2>
          </div>
          <div className="placeholder-content">
            <p>Coming soon...</p>
          </div>
        </section>
      </div>
    </div>
  );
};
