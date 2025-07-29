import React from 'react';
import { WeightLossData } from '../types';
import './DeficitProgress.css';

interface DeficitProgressProps {
  data: WeightLossData;
}

const DeficitProgress: React.FC<DeficitProgressProps> = ({ data }) => {
  const progressPercentage = data.totalDeficitNeeded > 0 
    ? Math.max(0, Math.min(100, (data.currentDeficit / data.totalDeficitNeeded) * 100))
    : 0;

  return (
    <div className="deficit-progress">
      <h3>🎯 Calorie Deficit Progress</h3>
      
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="progress-labels">
          <span className="current">{data.currentDeficit.toLocaleString()} cal</span>
          <span className="total">{data.totalDeficitNeeded.toLocaleString()} cal</span>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{data.remainingDeficit.toLocaleString()}</div>
          <div className="stat-label">Remaining Deficit</div>
          <div className="stat-unit">calories</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{data.butterPacks}</div>
          <div className="stat-label">Butter Packs</div>
          <div className="stat-unit">collected</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{data.currentStreak}</div>
          <div className="stat-label">Current Streak</div>
          <div className="stat-unit">days</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{progressPercentage.toFixed(1)}%</div>
          <div className="stat-label">Progress</div>
          <div className="stat-unit">complete</div>
        </div>
      </div>
    </div>
  );
};

export default DeficitProgress; 