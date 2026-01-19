import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext<any>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Hardcoded user state
  const [user] = useState({ id: "00000000-0000-0000-0000-000000000000", name: "Admin" });

  return (
    <AuthContext.Provider value={{ 
        user, 
        login: async () => {}, 
        register: async () => {}, 
        logout: () => {} 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);