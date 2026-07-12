import { createContext, useContext, useState } from 'react';

// 1. Create the Context
const GlobalContext = createContext();

// 2. Create the Provider Component
export function GlobalProvider({ children }) {
  // Mock Logged-in User State
  const [user, setUser] = useState({
    id: 'emp_001',
    name: 'Kunal Maithani',
    department: 'Manufacturing',
    role: 'Employee',
    xpBalance: 3250,
  });

  // Global Notification State (Great for the Action Queue)
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Your Tree Plantation CSR was approved!', read: false },
  ]);

  // A quick helper function to deduct XP when a reward is redeemed
  const deductXP = (amount) => {
    if (user.xpBalance >= amount) {
      setUser((prev) => ({ ...prev, xpBalance: prev.xpBalance - amount }));
      return true;
    }
    return false;
  };

  return (
    <GlobalContext.Provider value={{ user, setUser, notifications, deductXP }}>
      {children}
    </GlobalContext.Provider>
  );
}

// 3. Create a Custom Hook for easy access
export function useGlobal() {
  return useContext(GlobalContext);
}
