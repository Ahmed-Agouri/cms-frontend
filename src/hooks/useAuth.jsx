import { createContext, useContext, useEffect, useState } from 'react';
import { login as loginApi} from '../api/authApi';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const stored = localStorage.getItem('auth');

    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed.user);
      setToken(parsed.token);
    }
    setLoading(false);
  }, []); 

  const login = async (email, password) => {
    const result = await loginApi(email, password);


    setUser(result.user);
    setToken(result.token);
    
    localStorage.setItem(
      'auth',
      JSON.stringify({
        user: result.user,
        token: result.token,
      })
    );

    return result.user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
