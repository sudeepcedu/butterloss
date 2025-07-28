import React from 'react';
import { IterationData } from '../types';
import './IterationDetails.css';

interface IterationDetailsProps {
  iteration: IterationData | null;
  onClose: () => void;
}

const IterationDetails: React.FC<IterationDetailsProps> = ({ iteration, onClose }) => {
  if (!iteration) return null;

  const { summary, rewards } = iteration;

  return (
    <div className="iteration-details-overlay" onClick={onClose}>
      <div className="iteration-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📊 Iteration Details</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="iteration-summary">
          <div className="summary-header">
            <span className={`status-badge ${summary.isCompleted ? 'completed' : 'in-progress'}`}>
              {summary.isCompleted ? '✓ COMPLETED' : '🔄 IN PROGRESS'}
            </span>
            <span className="duration">{summary.duration} days</span>
          </div>
          
          <div className="summary-stats">
            <div className="stat-item">
              <span className="stat-label">Starting Weight:</span>
              <span className="stat-value">{summary.startingWeight} kg</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Target Weight:</span>
              <span className="stat-value">{summary.targetWeight} kg</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Final Weight:</span>
              <span className="stat-value">{summary.finalWeight} kg</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Weight Lost:</span>
              <span className="stat-value">{summary.weightLost} kg</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Deficit:</span>
              <span className="stat-value">{summary.totalDeficitBurned.toLocaleString()} cal</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Butter Packs:</span>
              <span className="stat-value">🧈 {summary.butterPacksEarned}</span>
            </div>
          </div>
        </div>

        <div className="rewards-section">
          <h3>🏆 Rewards Earned</h3>
          <div className="rewards-container">
            {rewards && rewards.length > 0 ? (
              <div className="rewards-list">
                {rewards.map((reward, index) => (
                  <div key={index} className="reward-item">
                    <span className="reward-icon">🎁</span>
                    <span className="reward-text">{reward}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-rewards">No rewards were earned during this iteration.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IterationDetails; 