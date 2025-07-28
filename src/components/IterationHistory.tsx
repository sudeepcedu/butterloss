import React from 'react';
import { IterationData } from '../types';
import './IterationHistory.css';

interface IterationHistoryProps {
  iterations: IterationData[];
  onViewDetails: (iterationId: string) => void;
}

const IterationHistory: React.FC<IterationHistoryProps> = ({ iterations, onViewDetails }) => {
  if (iterations.length === 0) {
    return (
      <div className="iteration-history">
        <h3>Previous Iterations</h3>
        <div className="empty-history">
          <div className="empty-icon">📊</div>
          <h3>No Previous Iterations</h3>
          <p>Complete your first weight loss goal to see your iteration history here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="iteration-history">
      <h3>Previous Iterations</h3>
      <div className="iterations-grid">
        {iterations.map((iteration) => {
          const { summary } = iteration;
          const isCompleted = summary.isCompleted;
          
          return (
            <div 
              key={summary.id} 
              className={`iteration-card ${isCompleted ? 'completed' : 'in-progress'}`}
              onClick={() => onViewDetails(summary.id)}
            >
              <div className="iteration-header">
                <div className="iteration-status">
                  {isCompleted ? (
                    <>
                      <span className="status-icon">✓</span>
                      <span className="status-text">COMPLETED</span>
                    </>
                  ) : (
                    <>
                      <span className="status-icon">🔄</span>
                      <span className="status-text">IN PROGRESS</span>
                    </>
                  )}
                </div>
                <span className="iteration-duration">{summary.duration} DAYS</span>
              </div>
              
              <div className="iteration-dates">
                <span className="date-range">
                  {new Date(summary.startDate).toLocaleDateString()} - {new Date(summary.endDate).toLocaleDateString()}
                </span>
              </div>
              
              <div className="iteration-stats">
                <div className="stat-row">
                  <span className="stat-label">WEIGHT LOST:</span>
                  <span className="stat-value">{summary.weightLost} kg</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">CALORIES BURNED:</span>
                  <span className="stat-value">{summary.totalDeficitBurned.toLocaleString()} cal</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">BUTTER PACKS COLLECTED:</span>
                  <span className="stat-value">🧈 {summary.butterPacksEarned}</span>
                </div>
              </div>
              
              {!isCompleted && (
                <>
                  <div className="iteration-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${Math.min((summary.totalDeficitBurned / summary.totalDeficitBurned) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="progress-text">
                      {summary.totalDeficitBurned.toLocaleString()} / {summary.totalDeficitBurned.toLocaleString()} cal
                    </div>
                  </div>
                </>
              )}
              
              {isCompleted && (
                <div className="completion-message">GOAL ACHIEVED!</div>
              )}
              
              <button className="view-details-btn">
                📋 VIEW DETAILS
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IterationHistory; 