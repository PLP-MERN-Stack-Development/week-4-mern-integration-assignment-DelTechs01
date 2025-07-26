import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Configure Axios base URL
axios.defaults.baseURL = 'http://localhost:5000/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.get('/auth/me').then(({ data }) => setUser(data)).catch(() => localStorage.removeItem('token'));
    }
  }, []);

  const login = async ({ email, password }) => {
    try {
      const { data } = await axios.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data.user);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  const register = async ({ username, email, password }) => {
    try {
      const { data } = await axios.post('/auth/register', { username, email, password });
      localStorage.setItem('token', data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data.user);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);