// useGlobalContext.ts
import { useContext } from "react";
import { GlobalContext } from "./GlobalContext"; // Import the context

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};
