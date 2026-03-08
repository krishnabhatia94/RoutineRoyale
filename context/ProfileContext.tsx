import React, { createContext, ReactNode, useContext, useState } from 'react';

export interface Quest {
  id: number;
  title: string;
  points: number;
  description: string;
  icon: string;
  length: string;
}

interface ProfileContextType {
  name: string;
  username: string;
  dob: string;
  userId: string;
  activeQuest: Quest | null;
  setName: (name: string) => void;
  setUsername: (username: string) => void;
  setDob: (dob: string) => void;
  setUserId: (id: string) => void;
  setActiveQuest: (quest: Quest | null) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [name, setName] = useState("Krishna Bhatia");
  const [username, setUsername] = useState("Elite Competitor");
  const [dob, setDob] = useState("1999-01-01");
  const [userId, setUserId] = useState("24681012");
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);

  return (
    <ProfileContext.Provider 
      value={{ 
        name, 
        username, 
        dob, 
        userId, 
        activeQuest,
        setName,
        setUsername,
        setDob,
        setUserId,
        setActiveQuest
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) throw new Error('useProfile must be used within a ProfileProvider');
  return context;
};
