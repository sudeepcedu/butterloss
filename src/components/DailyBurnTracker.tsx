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
}

const DailyBurnTracker: React.FC<DailyBurnTrackerProps> = ({ user, currentWeight, onUpdateDeficit, onAutoFillDeficit, syncedDeficit }) => {
  const [exerciseCalories, setExerciseCalories] = useState(0);
  const [foodCalories, setFoodCalories] = useState(0);

  // Calculate TDEE based on user's current weight
  const sedentaryCalories = calculateTDEE(currentWeight, user.height, user.age, user.sex);
  const totalBurn = sedentaryCalories + exerciseCalories;
  const deficit = totalBurn - foodCalories;

  // Update deficit when values change
  useEffect(() => {
    if (onUpdateDeficit) {
      onUpdateDeficit(deficit);
    }
  }, [deficit, onUpdateDeficit]);

  // Sync food calories when deficit is updated from outside
  useEffect(() => {
    if (syncedDeficit !== null && syncedDeficit !== undefined) {
      // Calculate food calories based on synced deficit
      // deficit = totalBurn - foodCalories
      // foodCalories = totalBurn - deficit
      const calculatedFoodCalories = totalBurn - syncedDeficit;
      setFoodCalories(Math.max(0, calculatedFoodCalories));
    }
  }, [syncedDeficit, totalBurn]);

  const handleExerciseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setExerciseCalories(value);
  };

  const handleFoodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setFoodCalories(value);
  };

  const handleFoodKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      console.log('🔄 DailyBurnTracker - Calculating deficit:', {
        sedentaryCalories,
        exerciseCalories,
        foodCalories,
        totalBurn,
        deficit
      });
      if (onAutoFillDeficit) {
        onAutoFillDeficit(deficit);
      }
    }
  };

  return (
    <div className="daily-burn-tracker">
      <p>
        🔥 <span className="total-calories">{totalBurn} cal</span> 🔥 Today's Burn: {sedentaryCalories} (sedentary) + 
        <input
          type="number"
          className="inline-input exercise-input"
          value={exerciseCalories}
          onChange={handleExerciseChange}
          min="0"
          max="5000"
          placeholder="0"
        />
        (exercise) cal | 🍽️ Food Eaten: 
        <input
          type="number"
          className="inline-input food-input"
          value={foodCalories}
          onChange={handleFoodChange}
          onKeyPress={handleFoodKeyPress}
          min="0"
          max="5000"
          placeholder="0"
        />
        cal
      </p>
    </div>
  );
};

export default DailyBurnTracker; 