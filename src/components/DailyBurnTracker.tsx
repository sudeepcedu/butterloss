import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { calculateTDEE } from '../utils/calculations';
import './DailyBurnTracker.css';

interface DailyBurnTrackerProps {
  user: User;
  currentWeight: number;
  onUpdateDeficit?: (deficit: number) => void;
  onAutoFillDeficit?: (deficit: number) => void;
  syncedDeficit?: number | null;
  onExerciseChange?: (exercise: number) => void;
  onFoodLogged?: (foodEaten: number) => void;
  isDeficitManuallyEntered?: boolean;
  onUnlockFields?: () => void;
}

const DailyBurnTracker: React.FC<DailyBurnTrackerProps> = ({ user, currentWeight, onUpdateDeficit, onAutoFillDeficit, syncedDeficit, onExerciseChange, onFoodLogged, isDeficitManuallyEntered = false, onUnlockFields }) => {
  const [exerciseCalories, setExerciseCalories] = useState('');
  const [foodCalories, setFoodCalories] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  // Helper function to get current date
  const getCurrentDate = () => new Date().toLocaleDateString('en-CA');
  
  // Load saved values for today
  useEffect(() => {
    if (isInitialized) return; // Don't run if already initialized
    
    const today = getCurrentDate();
    const savedExercise = localStorage.getItem(`butterloss_exercise_${today}`);
    const savedFood = localStorage.getItem(`butterloss_food_${today}`);
    
    if (savedExercise && savedExercise !== '0') {
      setExerciseCalories(savedExercise);
    }
    if (savedFood && savedFood !== '0') {
      setFoodCalories(savedFood);
    }
    
    // Check if there's a deficit logged for today (which means food was logged)
    const logs = JSON.parse(localStorage.getItem('butterloss_logs') || '[]');
    const todayLog = logs.find((log: any) => log.date === today);
    if (todayLog && todayLog.deficit !== null && todayLog.deficit !== undefined) {
      console.log('🔄 DailyBurnTracker - Found logged deficit for today');
    }
    
    setIsInitialized(true);
  }, [isInitialized]); // Only run once on mount

  // Save exercise calories to localStorage
  const saveExerciseCalories = (value: string) => {
    const today = getCurrentDate();
    // Only save if value is not empty
    if (value.trim()) {
      localStorage.setItem(`butterloss_exercise_${today}`, value);
    } else {
      localStorage.removeItem(`butterloss_exercise_${today}`);
    }
  };

  // Save food calories to localStorage
  const saveFoodCalories = (value: string) => {
    const today = getCurrentDate();
    // Only save if value is not empty
    if (value.trim()) {
      localStorage.setItem(`butterloss_food_${today}`, value);
    } else {
      localStorage.removeItem(`butterloss_food_${today}`);
    }
  };

  // Calculate TDEE based on user's current weight
  const sedentaryCalories = calculateTDEE(currentWeight, user.height, user.age, user.sex);
  const exerciseCaloriesNum = parseInt(exerciseCalories) || 0;
  const foodCaloriesNum = parseInt(foodCalories) || 0;
  const totalBurn = sedentaryCalories + exerciseCaloriesNum;
  const deficit = totalBurn - foodCaloriesNum;



  // Food Eaten is purely user input - no calculations
  // Removed useEffect that was syncing food eaten from deficit

  // Notify parent when exercise calories change
  useEffect(() => {
    if (onExerciseChange) {
      onExerciseChange(exerciseCaloriesNum);
    }
  }, [exerciseCaloriesNum, onExerciseChange]);

  // Clear fields when deficit is manually entered
  useEffect(() => {
    if (isDeficitManuallyEntered) {
      console.log('🔄 DailyBurnTracker - Clearing exercise and food fields due to manual deficit entry');
      setExerciseCalories('');
      setFoodCalories('');
    }
  }, [isDeficitManuallyEntered]);



  const handleExerciseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) {
      return; // Don't update if not a number
    }
    
    // Normalize multiple zeros to single zero
    if (value === '00' || value === '000' || value === '0000' || value === '00000') {
      value = '0';
    }
    console.log('Exercise change:', value);
    setExerciseCalories(value);
    saveExerciseCalories(value);
  };

  const handleExerciseKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newExerciseValue = parseInt(e.currentTarget.value) || 0;
      const newTotalBurn = sedentaryCalories + newExerciseValue;
      
      console.log('🔄 DailyBurnTracker - Exercise updated, updating total calories:', {
        sedentaryCalories,
        exerciseCalories: newExerciseValue,
        totalBurn: newTotalBurn
      });
      
      // 1. Update Total Burn immediately (already calculated above)
      // 2. Recalculate and update Calorie Deficit if Food Eaten is already inputted by the user and is not clear
      if (foodCalories.trim() !== '' && foodCaloriesNum > 0 && onAutoFillDeficit) {
        const newDeficit = newTotalBurn - foodCaloriesNum;
        console.log('🔄 DailyBurnTracker - Food Eaten exists, recalculating deficit:', newDeficit);
        onAutoFillDeficit(newDeficit);
      } else {
        console.log('🔄 DailyBurnTracker - Food Eaten is empty or 0, not updating deficit');
      }
      
      // Remove focus from the input field
      e.currentTarget.blur();
    }
  };

  const handleExerciseBlur = () => {
    const newExerciseValue = parseInt(exerciseCalories) || 0;
    const newTotalBurn = sedentaryCalories + newExerciseValue;
    
    console.log('🔄 DailyBurnTracker - Exercise blur, updating total calories:', {
      sedentaryCalories,
      exerciseCalories: newExerciseValue,
      totalBurn: newTotalBurn
    });
    
    // 1. Update Total Burn immediately (already calculated above)
    // 2. Recalculate and update Calorie Deficit if Food Eaten is already inputted by the user and is not clear
    if (foodCalories.trim() !== '' && foodCaloriesNum > 0 && onAutoFillDeficit) {
      const newDeficit = newTotalBurn - foodCaloriesNum;
      console.log('🔄 DailyBurnTracker - Food Eaten exists, recalculating deficit:', newDeficit);
      onAutoFillDeficit(newDeficit);
    } else {
      console.log('🔄 DailyBurnTracker - Food Eaten is empty or 0, not updating deficit');
    }
  };

  const handleFoodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) {
      return; // Don't update if not a number
    }
    
    // Normalize multiple zeros to single zero
    if (value === '00' || value === '000' || value === '0000' || value === '00000') {
      value = '0';
    }
    console.log('Food change:', value);
    setFoodCalories(value);
    saveFoodCalories(value);
  };

  const handleFoodKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      console.log('🔄 DailyBurnTracker - Food saved with Enter key:', foodCalories);
      
      // Save the food calories
      saveFoodCalories(foodCalories);
      
      // Calculate today's deficit using total - food eaten and auto-log it
      const foodValue = foodCalories.trim() === '' ? 0 : (parseInt(foodCalories) || 0);
      const totalBurn = sedentaryCalories + exerciseCaloriesNum;
      const deficit = totalBurn - foodValue;
      
      console.log('🔄 DailyBurnTracker - Auto-logging deficit:', {
        totalBurn,
        foodValue,
        deficit
      });
      
      // Call onFoodLogged which will auto-log the deficit
      if (onFoodLogged) {
        onFoodLogged(foodValue);
      }
      
      // Remove focus from the input field
      e.currentTarget.blur();
    }
  };



  const handleFoodBlur = () => {
    console.log('🔄 DailyBurnTracker - Food blur triggered');
    
    // Save the food calories
    saveFoodCalories(foodCalories);
    
    // Calculate today's deficit using total - food eaten and auto-log it
    const foodValue = foodCalories.trim() === '' ? 0 : (parseInt(foodCalories) || 0);
    const totalBurn = sedentaryCalories + exerciseCaloriesNum;
    const deficit = totalBurn - foodValue;
    
    console.log('🔄 DailyBurnTracker - Auto-logging deficit from blur:', {
      totalBurn,
      foodValue,
      deficit
    });
    
    // Call onFoodLogged which will auto-log the deficit
    if (onFoodLogged) {
      onFoodLogged(foodValue);
    }
  };



  return (
    <div className="daily-burn-tracker">
      <div className="burn-summary">
        <span className="burn-label">🔥 Today's Burn:</span>
        <span className="burn-value">{sedentaryCalories} (sedentary)</span>
        <span className="burn-separator">+</span>
        <input
          type="text"
          className={`inline-input exercise-input ${isDeficitManuallyEntered ? 'locked' : ''}`}
          value={exerciseCalories}
          onChange={handleExerciseChange}
          onKeyPress={handleExerciseKeyPress}
          onBlur={handleExerciseBlur}
          pattern="[0-9]*"
          inputMode="numeric"
          placeholder="0"
          disabled={isDeficitManuallyEntered}
          title={isDeficitManuallyEntered ? "Locked due to Manual Deficit Entry" : ""}
        />
        <span className="burn-unit">(exercise)</span>
        {isDeficitManuallyEntered && (
          <span className="inline-lock-icon" title="Locked due to Manual Deficit Entry">🔒</span>
        )}
        <span className="burn-separator">=</span>
        <span className="burn-label">Total:</span>
        <span className="total-calories">{totalBurn} cal</span>
      </div>
      <div className="food-summary">
        <span className="food-label">🍽️ Food Eaten:</span>
        <input
          type="text"
          className={`inline-input food-input ${isDeficitManuallyEntered ? 'locked' : ''}`}
          value={foodCalories}
          onChange={handleFoodChange}
          onKeyPress={handleFoodKeyPress}
          onBlur={handleFoodBlur}
          pattern="[0-9]*"
          inputMode="numeric"
          placeholder="0"
          disabled={isDeficitManuallyEntered}
          title={isDeficitManuallyEntered ? "Locked due to Manual Deficit Entry" : ""}
        />
        <span className="food-unit">cal</span>
        {isDeficitManuallyEntered && (
          <span className="inline-lock-icon" title="Locked due to Manual Deficit Entry">🔒</span>
        )}
      </div>
      {isDeficitManuallyEntered && (
        <div className="locked-message">
          <span className="locked-text">Locked due to Manual Deficit Entry</span>
          <button 
            type="button" 
            className="unlock-btn"
            onClick={onUnlockFields}
            title="Click Unlock to reset manual deficit and enter values using food and exercise"
          >
            Unlock
          </button>
        </div>
      )}
      

    </div>
  );
};

export default DailyBurnTracker; 