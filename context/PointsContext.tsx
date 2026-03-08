import React, { createContext, ReactNode, useContext, useState } from 'react';

interface PointsContextType {
  totalPoints: number;
  lastPointsGained: number;
  addPoints: (amount: number) => void;
  setPoints: (amount: number) => void;
}

const PointsContext = createContext<PointsContextType | undefined>(undefined);

export const PointsProvider = ({ children }: { children: ReactNode }) => {
  const [totalPoints, setTotalPoints] = useState(0);
  const [lastPointsGained, setLastPointsGained] = useState(0);

  const addPoints = (amount: number) => {
    setLastPointsGained(amount);
    setTotalPoints(prev => prev + amount);
  };
  const setPoints = (amount: number) => {
    setTotalPoints(amount);
  }

  return (
    <PointsContext.Provider value={{ totalPoints, lastPointsGained, addPoints, setPoints }}>
      {children}
    </PointsContext.Provider>
  );
};

export const usePoints = () => {
  const context = useContext(PointsContext);
  if (!context) throw new Error('usePoints must be used within a PointsProvider');
  return context;
};