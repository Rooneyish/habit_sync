export interface User {
  id: string;
  email: string;
  name: string;
}

export type HabitType = 'boolean' | 'numeric';

export interface Habit {
  id: string;
  userId: string;
  title: string;
  type: HabitType;
  unit?: string; // e.g., 'pages', 'minutes', null for boolean
  description?: string;
  createdAt: string; // ISO Date
  active: boolean;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  value: number; // 1 for boolean true, specific number for numeric
  completed: boolean; // redundancy for easier boolean checks
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}