import { createClient } from "@supabase/supabase-js";
import { Habit, HabitLog, User, HabitType } from "../types";

const SUPABASE_URL = "https://thecbbpymxleyapwjfoa.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoZWNiYnB5bXhsZXlhcHdqZm9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4MzM5NzgsImV4cCI6MjA4NDQwOTk3OH0.61Y7RBO33eVgDwjz_M6vs7v7DBmbq1MCOcYniL8IpFU";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
// A constant ID so all devices sync to the same "user"
const MY_ID = "00000000-0000-0000-0000-000000000000";

export const getHabits = async (): Promise<Habit[]> => {
  const { data } = await supabase
    .from("habits")
    .select("*")
    .eq("active", true)
    .order('created_at', { ascending: false });
  return (data || []) as Habit[];
};

export const createHabit = async (title: string, type: HabitType, unit?: string): Promise<Habit> => {
  const { data, error } = await supabase
    .from("habits")
    .insert([{ user_id: MY_ID, title, type, unit, active: true }])
    .select()
    .single();
  if (error) throw error;
  return data as Habit;
};

export const logHabit = async (habitId: string, date: string, value: number, isBoolean: boolean) => {
  if (isBoolean && value === 0) {
    await supabase.from("logs").delete().match({ habit_id: habitId, date });
    return null;
  }

  const { data, error: upsertError } = await supabase
    .from("logs")
    .upsert(
      {
        habit_id: habitId,
        user_id: MY_ID,
        date,
        value,
        completed: value > 0,
      },
      { onConflict: "habit_id, date" }
    )
    .select()
    .single();

  if (upsertError) console.error("Upsert Error:", upsertError);
  return data;
};

export const getTodayLogs = async (): Promise<HabitLog[]> => {
  const today = new Date().toISOString().split("T")[0];
  const { data } = await supabase
    .from("logs")
    .select("*")
    .eq("user_id", MY_ID)
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

export const deleteHabit = async (id: string) => {
  await supabase.from("habits").update({ active: false }).eq("id", id);
};

// Dummy exports to prevent errors in other files
export const mockLogin = async () => ({ id: MY_ID });
export const mockRegister = async () => ({ id: MY_ID });
export const mockLogout = () => {};
export const getSession = () => ({ id: MY_ID, name: "Admin" });