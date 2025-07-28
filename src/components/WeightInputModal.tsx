import React, { useState } from 'react';
import './WeightInputModal.css';

interface WeightInputModalProps {
  startingWeight: number;
  lastLoggedWeight?: number | null;
  onComplete: (currentWeight: number) => void;
  onSkip: () => void;
}

const WeightInputModal: React.FC<WeightInputModalProps> = ({ 
  startingWeight, 
  lastLoggedWeight,
  onComplete, 
  onSkip
}) => {
  console.log('🎉 WeightInputModal rendering with startingWeight:', startingWeight, 'lastLoggedWeight:', lastLoggedWeight);
  
  const [currentWeight, setCurrentWeight] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];

    const weight = parseFloat(currentWeight);

    if (!currentWeight || isNaN(weight)) {
      errors.push('Please enter a valid current weight');
    }
    if (weight <= 0) {
      errors.push('Weight must be greater than 0');
    }
    if (weight > startingWeight + 10) {
      errors.push('Current weight seems unusually high compared to starting weight');
    }
    if (weight < startingWeight - 50) {
      errors.push('Current weight seems unusually low compared to starting weight');
    }

    if (errors.length > 0) {
      setErrors(errors);
      return;
    }

    onComplete(weight);
  };

  const handleSkip = () => {
    if (lastLoggedWeight) {
      onSkip();
    } else {
      // If no last logged weight, use starting weight (no weight loss)
      onComplete(startingWeight);
    }
  };

  const weightLost = currentWeight 
    ? startingWeight - parseFloat(currentWeight)
    : 0;

  const skipWeightLost = lastLoggedWeight 
    ? startingWeight - lastLoggedWeight
    : 0;

  return (
    <div className="weight-input-overlay">
      <div className="weight-input-modal">
        <div className="modal-header">
          <h2>🎉 Goal Achieved!</h2>
          <p>Congratulations! You've completed your calorie deficit goal. Please enter your current weight to calculate your weight loss.</p>
        </div>

        <form onSubmit={handleSubmit} className="weight-form">
          <div className="weight-summary">
            <h3>📊 Weight Loss Summary</h3>
            <div className="summary-details">
              <div className="summary-item">
                <span className="summary-label">Starting Weight:</span>
                <span className="summary-value">{startingWeight} kg</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Current Weight:</span>
                <span className="summary-value">
                  <input
                    type="number"
                    value={currentWeight}
                    onChange={(e) => setCurrentWeight(e.target.value)}
                    step="0.1"
                    min="30"
                    max="300"
                    placeholder="Enter your current weight"
                    className="weight-input"
                    required
                  />
                  kg
                </span>
              </div>
              {weightLost !== 0 && (
                <div className="summary-item">
                  <span className="summary-label">Weight Lost:</span>
                  <span className={`summary-value ${weightLost > 0 ? 'positive' : 'negative'}`}>
                    {weightLost > 0 ? '+' : ''}{weightLost.toFixed(1)} kg
                  </span>
                </div>
              )}
            </div>
          </div>

          {lastLoggedWeight && (
            <div className="skip-option">
              <p className="skip-text">
                💡 <strong>Skip option:</strong> Use your last logged weight ({lastLoggedWeight} kg) 
                for a weight loss of {skipWeightLost > 0 ? '+' : ''}{skipWeightLost.toFixed(1)} kg
              </p>
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
            {lastLoggedWeight && (
              <button type="button" className="skip-btn" onClick={handleSkip}>
                ⏭️ Skip
              </button>
            )}
            <button type="submit" className="complete-btn">
              ✅ Done
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WeightInputModal; 