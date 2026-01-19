import { createClient } from "@supabase/supabase-js";
import { Habit, HabitLog, User, HabitType } from "../types";

const SUPABASE_URL = "https://thecbbpymxleyapwjfoa.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoZWNiYnB5bXhsZXlhcHdqZm9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4MzM5NzgsImV4cCI6MjA4NDQwOTk3OH0.61Y7RBO33eVgDwjz_M6vs7v7DBmbq1MCOcYniL8IpFU";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- Auth Services ---

export const mockRegister = async (
  email: string,
  pass: string,
  name: string,
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password: "password123", // Keeping it simple for personal use
    options: { data: { name } },
  });
  if (error) throw error;
  return { id: data.user!.id, email: data.user!.email!, name };
};

export const mockLogin = async (email: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: "password123",
  });
  if (error) throw error;
  return {
    id: data.user!.id,
    email: data.user!.email!,
    name: data.user!.user_metadata.name,
  };
};

export const mockLogout = () => supabase.auth.signOut();

export const getSession = () => {
  const session = localStorage.getItem(
    "sb-" + SUPABASE_URL.split("//")[1].split(".")[0] + "-auth-token",
  );
  if (!session) return null;
  const parsed = JSON.parse(session);
  return {
    id: parsed.user.id,
    email: parsed.user.email,
    name: parsed.user.user_metadata.name,
  };
};

// --- Habit Services ---

export const getHabits = async (userId: string): Promise<Habit[]> => {
  const { data } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", userId)
    .eq("active", true);
  return (data || []) as Habit[];
};

export const createHabit = async (
  userId: string,
  title: string,
  type: HabitType,
  unit?: string,
): Promise<Habit> => {
  const { data, error } = await supabase
    .from("habits")
    .insert([{ user_id: userId, title, type, unit, active: true }])
    .select()
    .single();
  if (error) throw error;
  return data as Habit;
};

export const logHabit = async (
  habitId: string,
  date: string,
  value: number,
  isBoolean: boolean,
) => {
  // Get the actual user session from Supabase first
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No active session found");

  if (isBoolean && value === 0) {
    await supabase.from("logs").delete().match({ habit_id: habitId, date });
    return null;
  }

  const { data, error: upsertError } = await supabase
    .from("logs")
    .upsert(
      {
        habit_id: habitId,
        user_id: user.id, // Fixed: correctly using session user id
        date,
        value,
        completed: value > 0,
      },
      { onConflict: "habit_id, date" },
    )
    .select()
    .single();

  if (upsertError) console.error("Upsert Error:", upsertError);
  return data;
};

export const getTodayLogs = async (userId: string): Promise<HabitLog[]> => {
  const today = new Date().toISOString().split("T")[0];
  const { data } = await supabase
    .from("logs")
    .select("*")
    .eq("user_id", userId)
    .eq("date", today);
  return (data || []) as HabitLog[];
};

export const getHabitLogs = async (habitId: string): Promise<HabitLog[]> => {
  const { data } = await supabase
    .from("logs")
    .select("*")
    .eq("habit_id", habitId);
  return (data || []) as HabitLog[];
};

export const getHabit = async (id: string): Promise<Habit | undefined> => {
  const { data } = await supabase
    .from("habits")
    .select("*")
    .eq("id", id)
    .single();
  return data;
};

export const deleteHabit = async (id: string) => {
  await supabase.from("habits").update({ active: false }).eq("id", id);
};
