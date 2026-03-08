import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface TaskStatusContextType {
  elapsedSeconds: number;
  completedTaskIds: number[];
  isActive: boolean; // Added
  setIsActive: (active: boolean) => void; // Added
  toggleTaskStatus: (id: number) => void;
  resetSession: () => void;
  formatTime: (seconds: number) => string;
}

const TaskStatusContext = createContext<TaskStatusContextType | undefined>(undefined);

export const TaskStatusProvider = ({ children }: { children: ReactNode }) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [completedTaskIds, setCompletedTaskIds] = useState<number[]>([]);
  const [isActive, setIsActive] = useState(false);

  // Timer Logic
  useEffect(() => {
    let interval: number;
    if (isActive) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const toggleTaskStatus = (id: number) => {
    setCompletedTaskIds(prev => 
      prev.includes(id) ? prev.filter(taskId => taskId !== id) : [...prev, id]
    );
  };

  const resetSession = () => {
    setElapsedSeconds(0);
    setCompletedTaskIds([]);
    setIsActive(true); // Start timer when session resets/starts
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <TaskStatusContext.Provider value={{ 
        elapsedSeconds, 
        completedTaskIds, 
        isActive, 
        setIsActive, 
        toggleTaskStatus, 
        resetSession, 
        formatTime 
    }}>
        {children}
    </TaskStatusContext.Provider>
    );
};

export const useTaskStatus = () => {
  const context = useContext(TaskStatusContext);
  if (!context) throw new Error('useTaskStatus must be used within a TaskStatusProvider');
  return context;
};