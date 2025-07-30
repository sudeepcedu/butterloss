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
  syncedFoodEaten?: number | null;
  onExerciseChange?: (exercise: number) => void;
}

const DailyBurnTracker: React.FC<DailyBurnTrackerProps> = ({ user, currentWeight, onUpdateDeficit, onAutoFillDeficit, syncedDeficit, syncedFoodEaten, onExerciseChange }) => {
  const [exerciseCalories, setExerciseCalories] = useState('0');
  const [foodCalories, setFoodCalories] = useState('0');

  // Helper function to get current date
  const getCurrentDate = () => new Date().toLocaleDateString('en-CA');
  
  // Load saved values for today
  useEffect(() => {
    const today = getCurrentDate();
    const savedExercise = localStorage.getItem(`butterloss_exercise_${today}`);
    const savedFood = localStorage.getItem(`butterloss_food_${today}`);
    
    if (savedExercise) {
      setExerciseCalories(savedExercise);
    }
    if (savedFood) {
      setFoodCalories(savedFood);
    }
  }, []);

  // Save exercise calories to localStorage
  const saveExerciseCalories = (value: string) => {
    const today = getCurrentDate();
    localStorage.setItem(`butterloss_exercise_${today}`, value);
  };

  // Save food calories to localStorage
  const saveFoodCalories = (value: string) => {
    const today = getCurrentDate();
    localStorage.setItem(`butterloss_food_${today}`, value);
  };

  // Calculate TDEE based on user's current weight
  const sedentaryCalories = calculateTDEE(currentWeight, user.height, user.age, user.sex);
  const exerciseCaloriesNum = parseInt(exerciseCalories) || 0;
  const foodCaloriesNum = parseInt(foodCalories) || 0;
  const totalBurn = sedentaryCalories + exerciseCaloriesNum;
  const deficit = totalBurn - foodCaloriesNum;

  // Update deficit when values change
  useEffect(() => {
    if (onUpdateDeficit) {
      onUpdateDeficit(deficit);
    }
  }, [deficit, onUpdateDeficit]);

  // Update food calories when synced from deficit input
  useEffect(() => {
    if (syncedFoodEaten !== null && syncedFoodEaten !== undefined) {
      console.log('🔄 DailyBurnTracker - Updating food calories from sync:', syncedFoodEaten);
      setFoodCalories(syncedFoodEaten.toString());
      saveFoodCalories(syncedFoodEaten.toString());
    }
  }, [syncedFoodEaten]);

  // Notify parent when exercise calories change
  useEffect(() => {
    if (onExerciseChange) {
      onExerciseChange(exerciseCaloriesNum);
    }
  }, [exerciseCaloriesNum, onExerciseChange]);



  const handleExerciseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Exercise change:', e.target.value);
    setExerciseCalories(e.target.value);
    saveExerciseCalories(e.target.value);
  };

  const handleExerciseKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      console.log('🔄 DailyBurnTracker - Exercise updated, recalculating deficit:', {
        sedentaryCalories,
        exerciseCalories: exerciseCaloriesNum,
        foodCalories: foodCaloriesNum,
        totalBurn,
        deficit
      });
      if (onAutoFillDeficit) {
        onAutoFillDeficit(deficit);
      }
    }
  };

  const handleExerciseBlur = () => {
    console.log('🔄 DailyBurnTracker - Exercise blur, recalculating deficit:', {
      sedentaryCalories,
      exerciseCalories: exerciseCaloriesNum,
      foodCalories: foodCaloriesNum,
      totalBurn,
      deficit
    });
    if (onAutoFillDeficit) {
      onAutoFillDeficit(deficit);
    }
  };

  const handleFoodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Food change:', e.target.value);
    setFoodCalories(e.target.value);
    saveFoodCalories(e.target.value);
  };

  const handleFoodKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      console.log('🔄 DailyBurnTracker - Calculating deficit:', {
        sedentaryCalories,
        exerciseCalories: exerciseCaloriesNum,
        foodCalories: foodCaloriesNum,
        totalBurn,
        deficit
      });
      if (onAutoFillDeficit) {
        onAutoFillDeficit(deficit);
      }
    }
  };

  const handleFoodBlur = () => {
    console.log('🔄 DailyBurnTracker - Food blur, recalculating deficit:', {
      sedentaryCalories,
      exerciseCalories: exerciseCaloriesNum,
      foodCalories: foodCaloriesNum,
      totalBurn,
      deficit
    });
    if (onAutoFillDeficit) {
      onAutoFillDeficit(deficit);
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
          className="inline-input exercise-input"
          value={exerciseCalories}
          onChange={handleExerciseChange}
          onKeyPress={handleExerciseKeyPress}
          onBlur={handleExerciseBlur}
          pattern="[0-9]*"
          inputMode="numeric"
        />
        <span className="burn-unit">(exercise)</span>
        <span className="burn-separator">=</span>
        <span className="burn-label">Total:</span>
        <span className="total-calories">{totalBurn} cal</span>
      </div>
      <div className="food-summary">
        <span className="food-label">🍽️ Food Eaten:</span>
        <input
          type="text"
          className="inline-input food-input"
          value={foodCalories}
          onChange={handleFoodChange}
          onKeyPress={handleFoodKeyPress}
          onBlur={handleFoodBlur}
          pattern="[0-9]*"
          inputMode="numeric"
        />
        <span className="food-unit">cal</span>
      </div>
    </div>
  );
};

export default DailyBurnTracker; 