import React, { useState, useRef, useEffect } from 'react';
import { WeightLossData } from '../types';
import { calculateEstimatedDays, calculateAverageDailyDeficit } from '../utils/calculations';
import './EstimatedCompletion.css';

interface EstimatedCompletionProps {
  data: WeightLossData;
  onUpdateDailyGoal: (newGoal: number) => void;
}

const EstimatedCompletion: React.FC<EstimatedCompletionProps> = ({ data, onUpdateDailyGoal }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editGoal, setEditGoal] = useState(data.user.dailyDeficitGoal.toString());
  const goalInputRef = useRef<HTMLInputElement>(null);
  
  const dailyDeficitGoal = data.user.dailyDeficitGoal;
  const estimatedDays = calculateEstimatedDays(data.remainingDeficit, dailyDeficitGoal);
  const averageDailyDeficit = calculateAverageDailyDeficit(data.logs);

  // Focus the input field when editing starts
  useEffect(() => {
    if (isEditing && goalInputRef.current) {
      setTimeout(() => {
        goalInputRef.current?.focus();
      }, 100);
    }
  }, [isEditing]);

  const handleSaveGoal = () => {
    const newGoal = parseInt(editGoal);
    if (newGoal >= 1 && newGoal <= 7700) {
      onUpdateDailyGoal(newGoal);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditGoal(data.user.dailyDeficitGoal.toString());
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveGoal();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div className="estimated-completion">
      <h3>⏰ Estimated Completion</h3>
      
      <div className="goal-display">
        <label>Your Daily Deficit Goal</label>
        {isEditing ? (
          <div className="goal-edit">
            <input
              ref={goalInputRef}
              type="number"
              value={editGoal}
              onChange={(e) => setEditGoal(e.target.value)}
              onKeyPress={handleKeyPress}
              min="1"
              max="7700"
              step="1"
              className="goal-input"
            />
            <div className="goal-actions">
              <button onClick={handleSaveGoal} className="save-goal-btn">✓</button>
              <button onClick={handleCancelEdit} className="cancel-goal-btn">✕</button>
            </div>
          </div>
        ) : (
          <div className="goal-value-container">
            <div className="goal-value">{dailyDeficitGoal} calories</div>
            <button 
              onClick={() => setIsEditing(true)}
              className="edit-goal-btn"
              title="Edit daily deficit goal"
            >
              (edit)
            </button>
          </div>
        )}
      </div>

      <div className="estimates-grid">
        <div className="estimate-card">
          <div className="estimate-value">
            {estimatedDays === Infinity ? 'N/A' : estimatedDays}
          </div>
          <div className="estimate-label">Days to Goal</div>
          <div className="estimate-unit">at goal deficit</div>
        </div>

        <div className="estimate-card">
          <div className="estimate-value">
            {averageDailyDeficit.toFixed(0)}
          </div>
          <div className="estimate-label">Average Daily Deficit</div>
          <div className="estimate-unit">calories</div>
        </div>
      </div>
    </div>
  );
};

export default EstimatedCompletion; 