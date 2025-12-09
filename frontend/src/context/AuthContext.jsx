import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Init User from LocalStorage + Logic to enhance Role
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // --- MOCK AUTH FUNCTIONS (To be replaced with Real API calls) ---

  const login = async (identifier, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!identifier || !password) {
          reject(new Error('Vui lòng nhập đầy đủ email và mật khẩu.'));
          return;
        }

        // SIMULATE ADMIN LOGIN
        if (identifier === 'admin' || identifier === 'admin@booking.com') {
          if (password === '123456') { // Matches seed data password
            const adminUser = {
              id: 'c5e109f5-82a8-4678-b6b8-1a4714e75699', // From seed
              email: 'admin@booking.com',
              first_name: 'Admin',
              last_name: 'Super',
              role: 'super_admin', // Important: Matches Role Name in DB
              role_id: 1,
              avatar_url: 'https://ui-avatars.com/api/?name=Admin+Super&background=0D8ABC&color=fff'
            };
            saveUserSession(adminUser);
            resolve(adminUser);
            return;
          } else {
            reject(new Error('Mật khẩu không chính xác (Thử: 123456)'));
            return;
          }
        }

        // SIMULATE HOST LOGIN
        if (identifier === 'host' || identifier === 'host@booking.com') {
          if (password === '123456') {
            const hostUser = {
              id: 'd6a4dd59-3fc2-4189-a3bc-222b21ccfd03', // From seed
              email: 'host@booking.com',
              first_name: 'Chu',
              last_name: 'Nha',
              role: 'host',
              role_id: 4,
              avatar_url: 'https://ui-avatars.com/api/?name=Chu+Nha&background=random'
            };
            saveUserSession(hostUser);
            resolve(hostUser);
            return;
          }
        }

        // SIMULATE REGULAR USER LOGIN
        const regularUser = {
          id: '3af419cf-6323-4110-96c6-6923ce5a2b37', // From seed
          email: identifier,
          first_name: 'Khach',
          last_name: 'Hang',
          role: 'guest',
          role_id: 5,
          avatar_url: 'https://ui-avatars.com/api/?name=Khach+Hang'
        };
        saveUserSession(regularUser);
        resolve(regularUser);

      }, 800);
    });
  };

  const saveUserSession = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    // In real app, we would also save the JWT token here
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const register = async (userData) => {
    // Eliminate mock register logic for now, standard register flow
    return new Promise(resolve => {
      setTimeout(() => {
        const newUser = {
          ...userData,
          id: 'new-user-id',
          role: 'guest',
          role_id: 5,
          avatar_url: `https://ui-avatars.com/api/?name=${userData.firstName}+${userData.lastName}`
        };
        saveUserSession(newUser);
        resolve(newUser);
      }, 1000);
    });
  };

  // --- Helper to check permissions ---
  const isAdmin = () => user?.role === 'super_admin' || user?.role_id === 1;
  const isHost = () => user?.role === 'host' || user?.role === 'hotel_manager' || user?.role_id === 4;

  const value = {
    user,
    login,
    logout,
    register,
    loading,
    isAdmin,
    isHost
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
