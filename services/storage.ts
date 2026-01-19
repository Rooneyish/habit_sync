import { Habit, HabitLog, User, HabitType } from '../types';

// Keys for localStorage
const STORAGE_KEYS = {
  USERS: 'habitsync_users',
  HABITS: 'habitsync_habits',
  LOGS: 'habitsync_logs',
  SESSION: 'habitsync_session',
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// --- Auth Services ---

export const mockRegister = async (email: string, password: string, name: string): Promise<User> => {
  await delay(500);
  const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  
  if (users.find(u => u.email === email)) {
    throw new Error('User already exists');
  }

  const newUser: User = {
    id: crypto.randomUUID(),
    email,
    name,
  };

  users.push(newUser);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(newUser));
  return newUser;
};

export const mockLogin = async (email: string): Promise<User> => {
  await delay(500);
  const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  const user = users.find(u => u.email === email);
  
  if (!user) {
    throw new Error('Invalid credentials');
  }

  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
  return user;
};

export const mockLogout = async (): Promise<void> => {
  await delay(200);
  localStorage.removeItem(STORAGE_KEYS.SESSION);
};

export const getSession = (): User | null => {
  const session = localStorage.getItem(STORAGE_KEYS.SESSION);
  return session ? JSON.parse(session) : null;
};

// --- Habit Services ---

export const getHabits = async (userId: string): Promise<Habit[]> => {
  await delay(300);
  const habits: Habit[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.HABITS) || '[]');
  return habits.filter(h => h.userId === userId && h.active);
};

export const getHabit = async (habitId: string): Promise<Habit | undefined> => {
  await delay(200);
  const habits: Habit[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.HABITS) || '[]');
  return habits.find(h => h.id === habitId);
};

export const createHabit = async (userId: string, title: string, type: HabitType, unit?: string): Promise<Habit> => {
  await delay(300);
  const habits: Habit[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.HABITS) || '[]');
  
  const newHabit: Habit = {
    id: crypto.randomUUID(),
    userId,
    title,
    type,
    unit: type === 'numeric' ? unit : undefined,
    createdAt: new Date().toISOString(),
    active: true,
  };

  habits.push(newHabit);
  localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
  return newHabit;
};

export const deleteHabit = async (habitId: string): Promise<void> => {
  await delay(300);
  const habits: Habit[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.HABITS) || '[]');
  const updatedHabits = habits.map(h => h.id === habitId ? { ...h, active: false } : h);
  localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(updatedHabits));
};

// --- Log Services ---

export const getTodayLogs = async (userId: string): Promise<HabitLog[]> => {
  const habits = await getHabits(userId);
  const logs: HabitLog[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOGS) || '[]');
  const today = new Date().toISOString().split('T')[0];
  
  const habitIds = new Set(habits.map(h => h.id));
  return logs.filter(l => habitIds.has(l.habitId) && l.date === today);
};

export const getAllLogsForUser = async (userId: string): Promise<HabitLog[]> => {
  const habits = await getHabits(userId);
  const logs: HabitLog[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOGS) || '[]');
  const habitIds = new Set(habits.map(h => h.id));
  return logs.filter(l => habitIds.has(l.habitId));
};

export const getHabitLogs = async (habitId: string): Promise<HabitLog[]> => {
    // No delay for faster UI on detail pages
    const logs: HabitLog[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOGS) || '[]');
    return logs.filter(l => l.habitId === habitId);
}

export const logHabit = async (habitId: string, date: string, value: number, isBoolean: boolean): Promise<HabitLog | null> => {
  await delay(200);
  const logs: HabitLog[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOGS) || '[]');
  const existingIndex = logs.findIndex(l => l.habitId === habitId && l.date === date);

  if (isBoolean) {
    // Toggle logic for boolean
    if (existingIndex > -1) {
      logs.splice(existingIndex, 1);
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
      return null;
    } else {
      const newLog: HabitLog = {
        id: crypto.randomUUID(),
        habitId,
        date,
        value: 1,
        completed: true,
      };
      logs.push(newLog);
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
      return newLog;
    }
  } else {
    // Upsert logic for numeric
    let log: HabitLog;
    if (existingIndex > -1) {
      logs[existingIndex].value = value;
      logs[existingIndex].completed = value > 0;
      log = logs[existingIndex];
    } else {
      log = {
        id: crypto.randomUUID(),
        habitId,
        date,
        value,
        completed: value > 0,
      };
      logs.push(log);
    }
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
    return log;
  }
};