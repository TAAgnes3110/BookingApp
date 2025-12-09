import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for existing session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (identifier, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (identifier && password) {
          let mockUser;
          if (identifier === 'admin' || identifier === 'admin@example.com') {
            if (password !== 'admin123') {
              reject(new Error('Mật khẩu admin không chính xác (Gợi ý: admin123)'));
              return;
            }
            mockUser = {
              id: 'admin_1',
              name: 'Super Admin',
              email: 'admin@example.com',
              username: 'admin',
              role: 'admin',
              avatar: 'https://cdn-icons-png.flaticon.com/512/2304/2304226.png'
            };
          } else {
            // Normal User
            mockUser = {
              id: '1',
              name: 'Nguyễn Văn A',
              email: identifier.includes('@') ? identifier : `${identifier}@example.com`,
              username: identifier.includes('@') ? identifier.split('@')[0] : identifier,
              role: 'user',
              rank: 'Thành viên Bạc', // Ranking for normal users
              phone: '0912345678',
              address: '123 Đường ABC, Quận 1, TP.HCM',
              dob: '1995-01-01',
              gender: 'Nam',
              avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=200&h=200&q=80'
            };
          }

          setUser(mockUser);
          localStorage.setItem('user', JSON.stringify(mockUser));
          resolve(mockUser);
        } else {
          reject(new Error('Tên đăng nhập/Email và mật khẩu không được để trống'));
        }
      }, 1000);
    });
  };

  const loginWithFacebook = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = {
          id: 'fb_123',
          name: 'Facebook User',
          email: 'fbuser@example.com',
          username: 'fbuser',
          rank: 'Thành viên Mới',
          avatar: 'https://via.placeholder.com/150'
        };
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        resolve(mockUser);
      }, 1000);
    });
  };

  const loginWithGoogle = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = {
          id: 'gg_123',
          name: 'Google User',
          email: 'googleuser@example.com',
          username: 'googleuser',
          rank: 'Thành viên Mới',
          avatar: 'https://via.placeholder.com/150'
        };
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        resolve(mockUser);
      }, 1000);
    });
  };

  const register = async (name, email, username, password, phone) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password && name && username) {
          const newUser = {
            id: 'new_1',
            name: name,
            email: email,
            username: username,
            phone: phone,
            rank: 'Thành viên Mới',
            avatar: 'https://via.placeholder.com/150'
          };
          // Auto login after register
          setUser(newUser);
          localStorage.setItem('user', JSON.stringify(newUser));
          resolve(newUser);
        } else {
          reject(new Error('Vui lòng điền đầy đủ thông tin'));
        }
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUser = (data) => {
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    login,
    loginWithFacebook,
    loginWithGoogle,
    register,
    logout,
    updateUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
