import { getCurrentUser } from '@/lib/appwrite/api';
import { IContextType, IUser } from '@/types';
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const INITIAL_USER = {
    id: '',
    name: '',
    username: '',
    email: '',
    imageUrl: '',
    bio: ''
};

const INITIAL_STATE = {
    user: INITIAL_USER,
    isLoading: false,
    setUser: () => {},
    isAuthenticated: false,
    setIsAuthenticated: () => {},
    checkAuthUser: async () => false as boolean
}

const AuthContext = createContext<IContextType>(INITIAL_STATE);
 

const AuthProvider = ({ children } : { children: React.ReactNode }) => {

  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const checkAuthUser = async () => {
    try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
            setUser({
                id: currentUser.$id,
                name: currentUser.name,
                username: currentUser.username,
                email: currentUser.email,
                imageUrl: currentUser.imageUrl,
                bio: currentUser.bio
            });
            setIsAuthenticated(true);
            return true;
        }
        return false;
    }
    catch (error) {
        console.log(error);
        return false;
    }
    finally {
        setIsLoading(false);
    }
  }

  useEffect(() => {
    if (localStorage.getItem('cookieFallback')==='[]' || localStorage.getItem('cookieFallback')===null) {
      navigate('/sign-in');
    }
    checkAuthUser();
  }, []);

  const values = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser
  }

  return (
    <AuthContext.Provider value={values}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;

export const useUserContext = () => useContext(AuthContext);