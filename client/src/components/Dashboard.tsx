import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button onClick={handleSignOut} className="signout-button">
          Sign Out
        </button>
      </div>
      <div className="dashboard-content">
        <div className="welcome-card">
          <h2>Welcome to Spezi01!</h2>
          <p>You are successfully logged in.</p>
          <div className="user-info">
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <p>
              <strong>User ID:</strong> {user?.id}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
