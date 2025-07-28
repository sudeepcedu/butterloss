import React, { useState } from 'react';
import { calculateTotalDeficitNeeded } from '../utils/calculations';
import './IterationSetup.css';

interface IterationSetupProps {
  onComplete: (currentWeight: number, targetWeight: number) => void;
  onCancel: () => void;
}

const IterationSetup: React.FC<IterationSetupProps> = ({ onComplete, onCancel }) => {
  const [currentWeight, setCurrentWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];

    const current = parseFloat(currentWeight);
    const target = parseFloat(targetWeight);

    if (!currentWeight || isNaN(current)) {
      errors.push('Please enter a valid current weight');
    }
    if (!targetWeight || isNaN(target)) {
      errors.push('Please enter a valid target weight');
    }
    if (current <= 0) {
      errors.push('Current weight must be greater than 0');
    }
    if (target <= 0) {
      errors.push('Target weight must be greater than 0');
    }
    if (current <= target) {
      errors.push('Target weight must be less than current weight');
    }

    if (errors.length > 0) {
      setErrors(errors);
      return;
    }

    onComplete(current, target);
  };

  const weightToLose = currentWeight && targetWeight 
    ? parseFloat(currentWeight) - parseFloat(targetWeight)
    : 0;

  const totalDeficitNeeded = weightToLose > 0 
    ? calculateTotalDeficitNeeded(weightToLose)
    : 0;

  return (
    <div className="iteration-setup-overlay">
      <div className="iteration-setup-modal">
        <div className="modal-header">
          <h2>🔁 Start New Iteration</h2>
          <p>Begin a new weight loss journey with updated goals</p>
        </div>

        <form onSubmit={handleSubmit} className="iteration-form">
          <div className="form-group">
            <label htmlFor="current-weight">Current Weight (kg)</label>
            <input
              type="number"
              id="current-weight"
              value={currentWeight}
              onChange={(e) => setCurrentWeight(e.target.value)}
              step="0.1"
              min="30"
              max="300"
              placeholder="e.g., 85.5"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="target-weight">Target Weight (kg)</label>
            <input
              type="number"
              id="target-weight"
              value={targetWeight}
              onChange={(e) => setTargetWeight(e.target.value)}
              step="0.1"
              min="30"
              max="300"
              placeholder="e.g., 75.0"
              required
            />
          </div>

          {weightToLose > 0 && (
            <div className="goal-summary">
              <h3>🎯 Your New Goal</h3>
              <div className="goal-details">
                <div className="goal-item">
                  <span className="goal-label">Weight to lose:</span>
                  <span className="goal-value">{weightToLose.toFixed(1)} kg</span>
                </div>
                <div className="goal-item">
                  <span className="goal-label">Total deficit needed:</span>
                  <span className="goal-value">{totalDeficitNeeded.toLocaleString()} calories</span>
                </div>
              </div>
            </div>
          )}

          {errors.length > 0 && (
            <div className="error-messages">
              {errors.map((error, index) => (
                <div key={index} className="error-message">{error}</div>
              ))}
            </div>
          )}

          <div className="modal-actions">
            <button type="button" onClick={onCancel} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="start-btn">
              🔁 Start New Iteration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IterationSetup; 