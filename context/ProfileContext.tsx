import React, { createContext, ReactNode, useContext, useState } from 'react';
import USER_DB from '../constants/userDB.json';

export interface Quest {
  id: number;
  title: string;
  points: number;
  description: string;
  icon: string;
  length: string;
}

export interface CustomAvatar {
  skinColor: string;
  hat?: string;
  shirt?: string;
}

// Mock names and icons for deterministic mapping
export const MOCK_NAMES = ['Alex', 'Jordan', 'Taylor', 'Casey', 'Morgan', 'Riley', 'Jamie', 'Skylar', 'Charlie', 'Quinn', 'Parker', 'Rowan'];
export const MOCK_ICONS = ['flash', 'barbell', 'water', 'body', 'cafe', 'leaf', 'bicycle', 'walk', 'heart', 'star', 'trophy', 'medal'];

// Helper to get deterministic index from string ID
export const getDeterministicIndex = (id: string, arrayLength: number) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % arrayLength;
};

// Deterministic variance based on ID string
// Returns a value between -0.15 and +0.15
export const getDeterministicVariance = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const val = (Math.abs(hash) % 10000) / 10000;
  return (val * 0.3) - 0.15;
};

export const parseLengthToSeconds = (lengthStr: string) => {
  const num = parseInt(lengthStr.replace(/[^0-9]/g, '')) || 0;
  const lower = lengthStr.toLowerCase();
  if (lower.includes('hour') || lower.includes('hr')) return num * 3600;
  if (lower.includes('second') || lower.includes('sec')) return num;
  return num * 60; // default to minutes
};

export const formatSeconds = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
};

export const getCompetitorFromDB = (id: string) => {
  const user = USER_DB.find(u => u.id === id);
  if (user) return user;

  // Fallback for random/old IDs using deterministic mapping
  const nameIndex = getDeterministicIndex(id, MOCK_NAMES.length);
  const iconIndex = getDeterministicIndex(id, MOCK_ICONS.length);
  return {
    id,
    name: MOCK_NAMES[nameIndex],
    icon: MOCK_ICONS[iconIndex]
  };
};

export const getRandomCompetitors = (count: number) => {
  const shuffled = [...USER_DB].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map(u => u.id);
};

interface ProfileContextType {
  name: string;
  username: string;
  dob: string;
  userId: string;
  activeQuest: Quest | null;
  totalPoints: number;
  lastPointsGained: number;
  currentBracket: string[];
  setName: (name: string) => void;
  setUsername: (username: string) => void;
  setDob: (dob: string) => void;
  setUserId: (id: string) => void;
  setActiveQuest: (quest: Quest | null) => void;
  addPoints: (amount: number) => void;
  setTotalPoints: (amount: number) => void;
  setBracket: (ids: string[]) => void;
  eliminateFromBracket: (id: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  friendIDs: string[];
  isFriendRoyale: boolean;
  challengesWon: number;
  setIsFriendRoyale: (value: boolean) => void;
  setFriendIDs: (ids: string[]) => void;
  incrementChallengesWon: () => void;
  customAvatar: CustomAvatar;
  updateCustomAvatar: (attrs: Partial<CustomAvatar>) => void;
  unlockedItems: string[];
  unlockItem: (itemId: string, cost: number) => boolean;
  logout: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [name, setName] = useState("Krishna Bhatia");
  const [username, setUsername] = useState("KBhatia94");
  const [dob, setDob] = useState("1999-01-01");
  const [userId, setUserId] = useState("24681012");
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const [lastPointsGained, setLastPointsGained] = useState(0);
  const [currentBracket, setCurrentBracket] = useState<string[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFriendRoyale, setIsFriendRoyale] = useState(false);
  const [friendIDs, setFriendIDs] = useState<string[]>(USER_DB.slice(0, 9).map(u => u.id));
  const [challengesWon, setChallengesWon] = useState(0);
  const [customAvatar, setCustomAvatar] = useState<CustomAvatar>({
    skinColor: '#3b82f6' // Default to Blue
  });
  const [unlockedItems, setUnlockedItems] = useState<string[]>([
    '#3b82f6', '#FFDBAC', '#8D5524', '#F1C27D', '#C68642'
  ]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const addPoints = (amount: number) => {
    setLastPointsGained(amount);
    setTotalPoints(prev => prev + amount);
  };

  const setBracket = (ids: string[]) => {
    setCurrentBracket(ids);
  };

  const eliminateFromBracket = (id: string) => {
    setCurrentBracket(prev => prev.filter(compId => compId !== id));
  };

  const incrementChallengesWon = () => {
    setChallengesWon(prev => prev + 1);
  };

  const updateCustomAvatar = (attrs: Partial<CustomAvatar>) => {
    setCustomAvatar(prev => ({ ...prev, ...attrs }));
  };

  const unlockItem = (itemId: string, cost: number) => {
    if (totalPoints >= cost) {
      setTotalPoints(prev => prev - cost);
      setUnlockedItems(prev => [...prev, itemId]);
      return true;
    }
    return false;
  };

  const logout = () => {
    setTotalPoints(0);
    setChallengesWon(0);
    setCustomAvatar({ skinColor: '#3b82f6' });
    setUnlockedItems(['#3b82f6', '#FFDBAC', '#8D5524', '#F1C27D', '#C68642']);
    setName('');
    setUsername('');
    setActiveQuest(null);
    setCurrentBracket([]);
    setIsFriendRoyale(false);
  };

  return (
    <ProfileContext.Provider
      value={{
        name,
        username,
        dob,
        userId,
        activeQuest,
        totalPoints,
        lastPointsGained,
        setName,
        setUsername,
        setDob,
        setUserId,
        setActiveQuest,
        addPoints,
        setTotalPoints,
        currentBracket,
        setBracket,
        eliminateFromBracket,
        isDarkMode,
        toggleDarkMode,
        friendIDs,
        isFriendRoyale,
        setIsFriendRoyale,
        setFriendIDs,
        challengesWon,
        incrementChallengesWon,
        customAvatar,
        updateCustomAvatar,
        unlockedItems,
        unlockItem,
        logout
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
