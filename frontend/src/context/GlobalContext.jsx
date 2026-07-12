import { createContext, useContext, useEffect, useState } from 'react';
import { esgService, getStoredToken, setAuthToken } from '../services/api';

// 1. Create the Context
const GlobalContext = createContext();

// 2. Create the Provider Component
export function GlobalProvider({ children }) {
  const fallbackUser = {
    id: 'emp_001',
    name: 'Kunal Maithani',
    department: 'Manufacturing',
    role: 'Employee',
    xpBalance: 3250,
  };

  const [user, setUser] = useState(fallbackUser);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Your Tree Plantation CSR was approved!', read: false },
  ]);
  const [isReady, setIsReady] = useState(false);
  const [authToken, setAuthTokenState] = useState(getStoredToken() ?? '');

  const mapUser = (profile) => ({
    id: profile.id,
    name: profile.full_name ?? profile.name ?? fallbackUser.name,
    department: profile.department ?? fallbackUser.department,
    role: profile.role ?? fallbackUser.role,
    xpBalance: profile.xp ?? profile.xp_balance ?? fallbackUser.xpBalance,
  });

  useEffect(() => {
    const bootstrap = async () => {
      if (!authToken) {
        setIsReady(true);
        return;
      }

      try {
        setAuthToken(authToken);
        const [profile, notificationList] = await Promise.allSettled([
          esgService.getCurrentUser(),
          esgService.getNotifications(),
        ]);

        if (profile.status === 'fulfilled') {
          setUser(mapUser(profile.value));
        }

        if (notificationList.status === 'fulfilled') {
          setNotifications(notificationList.value);
        }
      } catch (error) {
        console.error('Failed to load current session', error);
      } finally {
        setIsReady(true);
      }
    };

    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async ({ email, password, fullName }) => {
    const response = await esgService.signIn({
      email,
      password,
      full_name: fullName,
    });

    if (response?.token) {
      setAuthTokenState(response.token);
      setAuthToken(response.token);
      if (response.user) {
        setUser(mapUser(response.user));
      }
    }

    return response;
  };

  const logout = () => {
    setAuthTokenState('');
    setAuthToken('');
    setUser(fallbackUser);
    setNotifications([
      { id: 1, message: 'Your Tree Plantation CSR was approved!', read: false },
    ]);
  };

  const refreshNotifications = async () => {
    const notificationList = await esgService.getNotifications();
    setNotifications(notificationList);
  };

  const markNotificationRead = async (notificationId) => {
    await esgService.markNotificationRead(notificationId);
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === notificationId ? { ...notification, read: true } : notification
      )
    );
  };

  const deductXP = (amount) => {
    if (user.xpBalance >= amount) {
      setUser((prev) => ({ ...prev, xpBalance: prev.xpBalance - amount }));
      return true;
    }
    return false;
  };

  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser,
        notifications,
        setNotifications,
        isReady,
        authToken,
        login,
        logout,
        refreshNotifications,
        markNotificationRead,
        deductXP,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

// 3. Create a Custom Hook for easy access
export function useGlobal() {
  return useContext(GlobalContext);
}
