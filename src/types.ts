export interface User {
  name: string;
  age: number;
  height: number; // in cm
  weight: number; // in kg
  targetWeight: number; // in kg
  targetLoss: number; // in kg
  dailyDeficitGoal: number; // calories
  sex: 'male' | 'female'; // for BMR calculation
}

export interface DailyLog {
  date: string;
  deficit: number | null; // calories (can be negative, null for removal)
  weight: number | null; // in kg (optional)
}

export interface WeightLossData {
  user: User;
  logs: DailyLog[];
  totalDeficitNeeded: number;
  currentDeficit: number;
  remainingDeficit: number;
  butterPacks: number; // 770 calories = 1 butter pack (100g fat)
  gheePacks: number; // 7700 calories = 1 ghee pack (1kg fat)
  currentStreak: number; // consecutive days with > 0 deficit
}

export interface IterationSummary {
  id: string;
  startDate: string;
  endDate: string;
  startingWeight: number;
  targetWeight: number;
  finalWeight: number;
  weightLost: number;
  totalDeficitBurned: number;
  butterPacksEarned: number;
  duration: number; // in days
  isCompleted: boolean;
}

export interface IterationData {
  summary: IterationSummary;
  logs: DailyLog[];
  rewards: string[];
  milestoneAchievements: boolean[]; // Track which milestones were achieved
} 