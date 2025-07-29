import React, { useState, useEffect } from 'react';
import './ResetIterationModal.css';

interface ResetIterationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: (currentWeight: number, targetWeight: number) => void;
  lastLoggedWeight: number;
  previousTargetWeight: number;
}

const ResetIterationModal: React.FC<ResetIterationModalProps> = ({ 
  isOpen, 
  onClose, 
  onReset, 
  lastLoggedWeight,
  previousTargetWeight
}) => {
  const [currentWeight, setCurrentWeight] = useState(lastLoggedWeight);
  const [targetWeight, setTargetWeight] = useState(previousTargetWeight);

  useEffect(() => {
    setCurrentWeight(lastLoggedWeight);
    setTargetWeight(previousTargetWeight);
  }, [lastLoggedWeight, previousTargetWeight]);

  const handleReset = () => {
    onReset(currentWeight, targetWeight);
  };

  if (!isOpen) return null;

  return (
    <div className="reset-iteration-modal-overlay">
      <div className="reset-iteration-modal">
        <div className="reset-iteration-modal-header">
          <h2>Reset Iteration</h2>
        </div>
        
        <div className="reset-iteration-modal-content">
          <p>
            Are you sure you want to reset the current iteration? This will remove all calorie deficit entries and weight log entries from the current iteration. This cannot be undone.
          </p>
          
          <div className="weight-input-section">
            <label htmlFor="current-weight">Current Weight (kg):</label>
            <input
              type="number"
              id="current-weight"
              value={currentWeight}
              onChange={(e) => setCurrentWeight(parseFloat(e.target.value) || 0)}
              step="0.1"
              min="0"
              max="500"
            />
          </div>
          
          <div className="weight-input-section">
            <label htmlFor="target-weight">Target Weight (kg):</label>
            <input
              type="number"
              id="target-weight"
              value={targetWeight}
              onChange={(e) => setTargetWeight(parseFloat(e.target.value) || 0)}
              step="0.1"
              min="0"
              max="500"
            />
          </div>
        </div>
        
        <div className="reset-iteration-modal-actions">
          <button onClick={onClose} className="cancel-btn">
            Cancel
          </button>
          <button onClick={handleReset} className="reset-btn">
            Reset Iteration
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetIterationModal; 