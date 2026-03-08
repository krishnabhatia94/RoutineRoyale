import React, { createContext, ReactNode, useContext, useState } from 'react';

// Define the shape of a Task based on your Task_List structure
export interface Task {
  id: number;
  name: string;
  length: string;
  description: string;
  icon: string;
  completed: boolean;
}

interface TaskContextType {
  tasks: Task[];
  // 1. Added setTasks to the type definition
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  addTask: () => number;
  updateTask: (id: number, field: keyof Task, value: string) => void;
  deleteTask: (id: number) => void;
  toggleTask: (id: number) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskListProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, name: 'Drink Water', length: '2 mins', description: 'Hydrate', icon: 'water', completed: false },
    { id: 2, name: 'Morning Stretch', length: '5 mins', description: 'Mobility', icon: 'body', completed: false },
  ]);

  const addTask = () => {
    const newId = Date.now();
    setTasks([...tasks, { id: newId, name: '', length: '', description: '', icon: 'flash', completed: false }]);
    return newId; // Return ID so Task_List can expand it
  };

  const updateTask = (id: number, field: keyof Task, value: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const deleteTask = (id: number) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    // 2. Included setTasks in the Provider value
    <TaskContext.Provider value={{ tasks, setTasks, addTask, updateTask, deleteTask, toggleTask }}>
      {children}
    </TaskContext.Provider>
  );
};

// Custom hook for easy access
export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used within a TaskListProvider');
  return context;
};