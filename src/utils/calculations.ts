import { DailyLog } from '../types';
import { isSameDay } from 'date-fns';

// Constants
const CALORIES_PER_KG_FAT = 7716.17; // calories needed to lose 1kg of fat
const CALORIES_PER_BUTTER_PACK = 770; // 770 calories = 1 butter pack (100g fat)
const CALORIES_PER_GHEE_PACK = 7700; // 7700 calories = 1 ghee pack (1kg fat)

export const calculateTotalDeficitNeeded = (targetLoss: number): number => {
  const exactDeficit = targetLoss * CALORIES_PER_KG_FAT;
  // Round to nearest 100 calories for a nice round number
  return Math.round(exactDeficit / 100) * 100;
};

export const calculateCurrentDeficit = (logs: DailyLog[]): number => {
  return logs.reduce((total, log) => total + (log.deficit || 0), 0);
};

export const calculateRemainingDeficit = (totalNeeded: number, current: number): number => {
  return Math.max(0, totalNeeded - current);
};

export const calculateButterPacks = (logs: DailyLog[]): number => {
  // Only count positive deficits for butter packs
  const positiveDeficit = logs.reduce((total, log) => total + Math.max(0, log.deficit || 0), 0);
  return Math.floor(positiveDeficit / CALORIES_PER_BUTTER_PACK);
};

export const calculateGheePacks = (logs: DailyLog[]): number => {
  // Only count positive deficits for ghee packs
  const positiveDeficit = logs.reduce((total, log) => total + Math.max(0, log.deficit || 0), 0);
  return Math.floor(positiveDeficit / CALORIES_PER_GHEE_PACK);
};

export const calculateCurrentStreak = (logs: DailyLog[]): number => {
  // Sort logs by date in descending order (most recent first)
  const sortedLogs = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  if (sortedLogs.length === 0) return 0;
  
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Check if we have an entry for today
  const todayLog = sortedLogs.find(log => isSameDay(new Date(log.date), today));
  const yesterdayLog = sortedLogs.find(log => isSameDay(new Date(log.date), yesterday));
  
  // If no entry for today, check if yesterday had a positive deficit
  if (!todayLog) {
    if (!yesterdayLog || (yesterdayLog.deficit || 0) <= 0) {
      return 0; // No streak if yesterday is missing or had non-positive deficit
    }
    // Yesterday had positive deficit but no today entry - streak is 1
    return 1;
  }
  
  // If today's entry exists but is not positive, no streak
  if ((todayLog.deficit || 0) <= 0) {
    return 0;
  }
  
  // Start counting from today
  let streak = 1;
  let currentDate = new Date(todayLog.date);
  
  // Check consecutive days backwards
  for (let i = 1; i < sortedLogs.length; i++) {
    const log = sortedLogs[i];
    const logDate = new Date(log.date);
    const daysDiff = Math.floor((currentDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 1 && (log.deficit || 0) > 0) {
      streak++;
      currentDate = logDate;
    } else {
      break; // Gap in days or non-positive deficit, streak broken
    }
  }
  
  return streak;
};

export const calculateEstimatedDays = (remainingDeficit: number, dailyDeficit: number): number => {
  if (dailyDeficit <= 0) return Infinity;
  return Math.ceil(remainingDeficit / dailyDeficit);
};

export const calculateAverageDailyDeficit = (logs: DailyLog[]): number => {
  if (logs.length === 0) return 0;
  const totalDeficit = logs.reduce((sum, log) => sum + (log.deficit || 0), 0);
  return totalDeficit / logs.length;
};

export const calculateBMI = (weight: number, height: number): number => {
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
};

export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}; 