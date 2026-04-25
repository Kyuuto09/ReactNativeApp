import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export type ProtocolData = {
  id: string;
  timestamp: string; // ISO String
  date: string;
  time: string;
  firstName: string;
  lastName: string;
  dob: string;
  phone: string;
  licensePlate: string;
  licenseNumber: string;
  category: string;
  validUntil: string;
  impactSide: string;
  description: string;
  photoUri?: string | null;
};

type ProtocolContextType = {
  savedProtocols: ProtocolData[];
  draftProtocol: Partial<ProtocolData>;
  updateDraft: (data: Partial<ProtocolData>) => void;
  submitProtocol: (finalData?: Partial<ProtocolData>) => Promise<void>;
  removeProtocol: (id: string) => Promise<void>;
  resetDraft: () => void;
  isLoading: boolean;
};

const ProtocolContext = createContext<ProtocolContextType | undefined>(undefined);

const STORAGE_KEY = "@eu_protocols";

export function ProtocolProvider({ children }: { children: React.ReactNode }) {
  const [savedProtocols, setSavedProtocols] = useState<ProtocolData[]>([]);
  const [draftProtocol, setDraftProtocol] = useState<Partial<ProtocolData>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load persistence
  useEffect(() => {
    const loadProtocols = async () => {
      try {
        const data = await AsyncStorage.getItem(STORAGE_KEY);
        if (data) {
          setSavedProtocols(JSON.parse(data));
        }
      } catch (e) {
        console.error("Failed to load protocols", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadProtocols();
  }, []);

  const updateDraft = (data: Partial<ProtocolData>) => {
    setDraftProtocol((prev) => ({ ...prev, ...data }));
  };

  const resetDraft = () => {
    setDraftProtocol({});
  };

  const removeProtocol = async (id: string) => {
    try {
      const updatedList = savedProtocols.filter((p) => p.id !== id);
      setSavedProtocols(updatedList);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    } catch (e) {
      console.error("Failed to remove protocol", e);
    }
  };

  const submitProtocol = async (finalData?: Partial<ProtocolData>) => {
    try {
      const mergedDraft = { ...draftProtocol, ...finalData };
      const newProtocol = {
        ...mergedDraft,
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString(),
      } as ProtocolData;
      
      const updatedList = [newProtocol, ...savedProtocols];
      setSavedProtocols(updatedList);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      resetDraft();
    } catch (e) {
      console.error("Failed to save protocol", e);
      throw e;
    }
  };

  return (
    <ProtocolContext.Provider
      value={{
        savedProtocols,
        draftProtocol,
        updateDraft,
        submitProtocol,
        removeProtocol,
        resetDraft,
        isLoading,
      }}
    >
      {children}
    </ProtocolContext.Provider>
  );
}

export function useProtocol() {
  const context = useContext(ProtocolContext);
  if (context === undefined) {
    throw new Error("useProtocol must be used within a ProtocolProvider");
  }
  return context;
}
