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
  onFoodLogged?: (foodEaten: number) => void;
}

const DailyBurnTracker: React.FC<DailyBurnTrackerProps> = ({ user, currentWeight, onUpdateDeficit, onAutoFillDeficit, syncedDeficit, syncedFoodEaten, onExerciseChange, onFoodLogged }) => {
  const [exerciseCalories, setExerciseCalories] = useState('');
  const [foodCalories, setFoodCalories] = useState('');
  const [isFoodLogged, setIsFoodLogged] = useState(false);
  const [showFoodConfirmPopup, setShowFoodConfirmPopup] = useState(false);
  const [pendingFoodValue, setPendingFoodValue] = useState('');
  const [isEnterPressed, setIsEnterPressed] = useState(false);

  // Helper function to get current date
  const getCurrentDate = () => new Date().toLocaleDateString('en-CA');
  
  // Load saved values for today
  useEffect(() => {
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
      console.log('🔄 DailyBurnTracker - Found logged deficit for today, setting isFoodLogged to true');
      setIsFoodLogged(true);
    }
  }, []);

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



  // Update food calories when synced from deficit input
  useEffect(() => {
    if (syncedFoodEaten !== null && syncedFoodEaten !== undefined) {
      console.log('🔄 DailyBurnTracker - Updating food calories from sync:', syncedFoodEaten);
      setFoodCalories(syncedFoodEaten.toString());
      saveFoodCalories(syncedFoodEaten.toString());
      // Don't automatically mark as logged - let user decide via tick button or Enter key
      // setIsFoodLogged(true);
    }
  }, [syncedFoodEaten]);

  // Notify parent when exercise calories change
  useEffect(() => {
    if (onExerciseChange) {
      onExerciseChange(exerciseCaloriesNum);
    }
  }, [exerciseCaloriesNum, onExerciseChange]);



  const handleExerciseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
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
      
      // Case 1: If Food eaten is logged, recalculate today's calorie deficit
      console.log('🔄 DailyBurnTracker - Exercise change detected. isFoodLogged:', isFoodLogged, 'foodCaloriesNum:', foodCaloriesNum);
      if (isFoodLogged && onAutoFillDeficit) {
        const newDeficit = newTotalBurn - foodCaloriesNum;
        console.log('🔄 DailyBurnTracker - Food is logged, updating deficit:', newDeficit);
        console.log('🔄 DailyBurnTracker - Calling onAutoFillDeficit with deficit:', newDeficit);
        onAutoFillDeficit(newDeficit);
      } else {
        console.log('🔄 DailyBurnTracker - Food is NOT logged or onAutoFillDeficit is not available');
        console.log('🔄 DailyBurnTracker - isFoodLogged:', isFoodLogged, 'onAutoFillDeficit:', !!onAutoFillDeficit);
      }
      // Case 2: If Food eaten is NOT logged, just update total calories (do nothing to deficit)
      
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
    
    // Case 1: If Food eaten is logged, recalculate today's calorie deficit
    console.log('🔄 DailyBurnTracker - Exercise blur detected. isFoodLogged:', isFoodLogged, 'foodCaloriesNum:', foodCaloriesNum);
    if (isFoodLogged && onAutoFillDeficit) {
      const newDeficit = newTotalBurn - foodCaloriesNum;
      console.log('🔄 DailyBurnTracker - Food is logged, updating deficit:', newDeficit);
      console.log('🔄 DailyBurnTracker - Calling onAutoFillDeficit with deficit:', newDeficit);
      onAutoFillDeficit(newDeficit);
    } else {
      console.log('🔄 DailyBurnTracker - Food is NOT logged or onAutoFillDeficit is not available');
      console.log('🔄 DailyBurnTracker - isFoodLogged:', isFoodLogged, 'onAutoFillDeficit:', !!onAutoFillDeficit);
    }
    // Case 2: If Food eaten is NOT logged, just update total calories (do nothing to deficit)
  };

  const handleFoodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
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
      console.log('🔄 DailyBurnTracker - Food logged with Enter key:', foodCaloriesNum);
      
      // Set flag to prevent popup on blur
      setIsEnterPressed(true);
      
      // Log the food (same as clicking tick button)
      if (foodCalories.trim() !== '' && foodCalories.trim() !== '0') {
        setIsFoodLogged(true);
        console.log('🔄 DailyBurnTracker - Setting isFoodLogged to true');
        if (onFoodLogged) {
          onFoodLogged(foodCaloriesNum);
        }
      }
      
      // Remove focus from the input field
      e.currentTarget.blur();
    }
  };



  const handleFoodTick = () => {
    console.log('🔄 DailyBurnTracker - Food logged with tick:', foodCaloriesNum);
    setIsFoodLogged(true);
    console.log('🔄 DailyBurnTracker - Setting isFoodLogged to true');
    if (onFoodLogged) {
      onFoodLogged(foodCaloriesNum);
    }
  };

  const handleFoodCross = () => {
    console.log('🔄 DailyBurnTracker - Food cancelled with cross');
    setFoodCalories('');
    setIsFoodLogged(false);
    saveFoodCalories('');
    // Prevent any deficit logging when cancelling
  };

  // Handle food edit button click
  const handleFoodEdit = () => {
    console.log('🔄 DailyBurnTracker - Food edit clicked');
    setIsFoodLogged(false);
  };

  // Handle food input blur (when user clicks outside)
  const handleFoodBlur = () => {
    // Don't show popup if Enter was pressed (food was already logged)
    if (isEnterPressed) {
      setIsEnterPressed(false);
      return;
    }
    
    if (!isFoodLogged && foodCalories.trim() && foodCalories.trim() !== '0') {
      console.log('🔄 DailyBurnTracker - Food blur with value, showing confirmation popup');
      setPendingFoodValue(foodCalories);
      setShowFoodConfirmPopup(true);
    }
  };

  // Handle food confirmation popup
  const handleFoodConfirmYes = () => {
    console.log('🔄 DailyBurnTracker - User confirmed food logging:', pendingFoodValue);
    setFoodCalories(pendingFoodValue);
    setIsFoodLogged(true);
    if (onFoodLogged) {
      onFoodLogged(parseInt(pendingFoodValue) || 0);
    }
    setShowFoodConfirmPopup(false);
    setPendingFoodValue('');
  };

  const handleFoodConfirmNo = () => {
    console.log('🔄 DailyBurnTracker - User cancelled food logging');
    setFoodCalories('');
    setShowFoodConfirmPopup(false);
    setPendingFoodValue('');
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
          placeholder="0"
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
          placeholder="0"
          disabled={isFoodLogged}
        />
        <span className="food-unit">cal</span>
        {!isFoodLogged && foodCalories.trim() && (
          <div className="food-actions">
            <button 
              type="button" 
              className="food-tick-btn"
              onClick={handleFoodTick}
              title="Save"
            >
              ✓
            </button>
            <button 
              type="button" 
              className="food-cross-btn"
              onClick={handleFoodCross}
              title="Clear"
            >
              ✕
            </button>
          </div>
        )}
        {isFoodLogged && (
          <button 
            type="button" 
            className="food-edit-btn"
            onClick={handleFoodEdit}
            title="Edit food eaten"
          >
            edit
          </button>
        )}
      </div>
      
      {/* Food confirmation popup */}
      {showFoodConfirmPopup && (
        <div className="food-confirm-popup-overlay">
          <div className="food-confirm-popup">
            <div className="food-confirm-content">
              <p>Do you want to log {pendingFoodValue} calories in Food Eaten?</p>
              <div className="food-confirm-buttons">
                <button 
                  type="button" 
                  className="food-confirm-yes-btn"
                  onClick={handleFoodConfirmYes}
                >
                  Yes
                </button>
                <button 
                  type="button" 
                  className="food-confirm-no-btn"
                  onClick={handleFoodConfirmNo}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyBurnTracker; 