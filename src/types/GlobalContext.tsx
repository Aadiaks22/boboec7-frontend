// GlobalContext.tsx
import React, { createContext, useState, ReactNode } from "react";

// Define the context type
interface GlobalContextType {
  globalVariable: string; // Add globalVariable
  setGlobalVariable: (value: string) => void;
}

// Create context with a default value
export const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// Provider component
export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [globalVariable, setGlobalVariable] = useState<string>("initial value");

  return (
    <GlobalContext.Provider value={{ globalVariable, setGlobalVariable }}>
      {children}
    </GlobalContext.Provider>
  );
};
