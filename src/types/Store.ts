import { create } from "zustand";

// Define the store's state and actions
interface GlobalState {
  globalValue: string;
  setGlobalValue: (value: string) => void;
}

// Create the store
export const useGlobalStore = create<GlobalState>((set) => ({
  globalValue: "OEC-7",
  setGlobalValue: (value) => set({ globalValue: value }),
}));
