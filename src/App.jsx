import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Dashboard from './Dashboard';
import MockOAuth from './MockOAuth';

// Wrapper component to use hooks inside Router
const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");

  // Form State
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setMessage("");
    setUsername("");
    setPassword("");
    setEmail("");
  };

  const handleSocialLogin = (provider) => {
    // Redirect to the real backend OAuth endpoint
    // The backend will then Redirect to Google/GitHub
    // We add a timestamp to prevent the browser from using a cached 308 redirect with old credentials
    window.location.href = `http://localhost:8000/api/auth/${provider}?ts=${new Date().getTime()}`;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (response.ok) {
        // Success! Redirect to Dashboard
        navigate('/dashboard', { state: { username: data.user } });
      } else {
        setMessage(`Error: ${data.detail || "Login failed"}`);
      }
    } catch (error) {
      setMessage("Error: Could not connect to backend.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password })
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(`Success: ${data.message}`);

        // Auto-login after successful registration
        try {
          const loginResponse = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
          });
          const loginData = await loginResponse.json();

          if (loginResponse.ok) {
            navigate('/dashboard', { state: { username: loginData.user || username } });
          }
        } catch (loginError) {
          console.error("Auto-login error:", loginError);
        }
      } else {
        setMessage(`Error: ${data.detail || "Registration failed"}`);
      }
    } catch (error) {
      setMessage("Error: Could not connect to backend.");
    }
  };

  return (
    <div className="page-center">
      <div className="container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>{isLogin ? "WELCOME !" : "CREATE ACCOUNT"}</h1>
            <p>{isLogin ? "We are glad to see you again." : "Join us and start your journey."}</p>
          </div>

          <div className="auth-body">

            {message && (
              <div style={{ marginBottom: '15px', color: message.startsWith('Success') ? '#4ade80' : '#f87171', textAlign: 'center', fontSize: '0.9rem' }}>
                {message}
              </div>
            )}

            {isLogin ? (
              <form className="auth-form active" onSubmit={handleLogin}>
                <div className="input-group">
                  <i className="fa-regular fa-user input-icon"></i>
                  <input type="text" placeholder="Username" required value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="input-group">
                  <i className="fa-solid fa-lock input-icon"></i>
                  <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit" className="btn-primary">SIGN IN</button>

                <div className="social-divider">Or continue with</div>
                <div className="social-buttons">
                  <button type="button" className="btn-social btn-google" onClick={() => handleSocialLogin('google')}>
                    <i className="fa-brands fa-google"></i> Google
                  </button>
                  <button type="button" className="btn-social btn-github" onClick={() => handleSocialLogin('github')}>
                    <i className="fa-brands fa-github"></i> GitHub
                  </button>
                </div>

                <div className="toggle-box">
                  <p>Don't have an account? <span className="toggle-link" onClick={toggleForm}>Sign Up</span></p>
                </div>
              </form>
            ) : (
              <form className="auth-form active" onSubmit={handleRegister}>
                <div className="input-group">
                  <i className="fa-regular fa-envelope input-icon"></i>
                  <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="input-group">
                  <i className="fa-regular fa-user input-icon"></i>
                  <input type="text" placeholder="Username" required value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="input-group">
                  <i className="fa-solid fa-lock input-icon"></i>
                  <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit" className="btn-primary">SIGN UP</button>

                <div className="social-divider">Or continue with</div>
                <div className="social-buttons">
                  <button type="button" className="btn-social btn-google" onClick={() => handleSocialLogin('google')}>
                    <i className="fa-brands fa-google"></i> Google
                  </button>
                  <button type="button" className="btn-social btn-github" onClick={() => handleSocialLogin('github')}>
                    <i className="fa-brands fa-github"></i> GitHub
                  </button>
                </div>

                <div className="toggle-box">
                  <p>Already have an account? <span className="toggle-link" onClick={toggleForm}>Sign In</span></p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="page-background">
        <div className="code-bg"></div>
      </div>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mock-oauth/:provider" element={<MockOAuth />} />
      </Routes>
    </Router>
  );
}

export default App;
