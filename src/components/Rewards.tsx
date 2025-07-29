import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { WeightLossData } from '../types';
import './Rewards.css';

interface RewardsProps {
  data: WeightLossData;
  onUpdateRewards: (rewards: string[]) => void;
}

const Rewards: React.FC<RewardsProps> = ({ data, onUpdateRewards }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingRewards, setEditingRewards] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState<boolean[]>([]);
  const confettiRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Get rewards from localStorage or use defaults
  const getRewards = (): string[] => {
    const saved = localStorage.getItem('butterloss_rewards');
    return saved ? JSON.parse(saved) : [
      'Buy a new outfit',
      'Go for a spa day',
      'Take a weekend trip',
      'Buy something expensive'
    ];
  };

  const [rewards, setRewards] = useState<string[]>(getRewards);
  
  const totalDeficitNeeded = data.totalDeficitNeeded;
  const currentDeficit = data.currentDeficit;
  const progressPercentage = totalDeficitNeeded > 0 
    ? Math.max(0, Math.min(100, (currentDeficit / totalDeficitNeeded) * 100))
    : 0;
  
  const milestones = useMemo(() => [
    { 
      fraction: 0.25, 
      label: 'The Beginning', 
      percentage: '25%',
      deficit: totalDeficitNeeded * 0.25 
    },
    { 
      fraction: 0.5, 
      label: 'The Climb', 
      percentage: '50%',
      deficit: totalDeficitNeeded * 0.5 
    },
    { 
      fraction: 0.75, 
      label: 'Breakthrough', 
      percentage: '75%',
      deficit: totalDeficitNeeded * 0.75 
    },
    { 
      fraction: 1, 
      label: 'Transformation', 
      percentage: '100%',
      deficit: totalDeficitNeeded 
    }
  ], [totalDeficitNeeded]);

  const isMilestoneAchieved = useCallback((milestoneDeficit: number, index: number): boolean => {
    if (totalDeficitNeeded <= 0) return false;
    const sliceSize = totalDeficitNeeded / 4;
    const sliceEnd = (index + 1) * sliceSize;
    return currentDeficit >= sliceEnd;
  }, [currentDeficit, totalDeficitNeeded]);

  const isMilestoneInProgress = useCallback((milestoneDeficit: number, index: number): boolean => {
    if (totalDeficitNeeded <= 0) return false;
    const sliceSize = totalDeficitNeeded / 4;
    const sliceStart = index * sliceSize;
    const sliceEnd = (index + 1) * sliceSize;
    return currentDeficit > sliceStart && currentDeficit < sliceEnd;
  }, [currentDeficit, totalDeficitNeeded]);

  const isMilestoneNotStarted = useCallback((milestoneDeficit: number, index: number): boolean => {
    if (totalDeficitNeeded <= 0) return true;
    const sliceSize = totalDeficitNeeded / 4;
    const sliceStart = index * sliceSize;
    return currentDeficit <= sliceStart;
  }, [currentDeficit, totalDeficitNeeded]);

  // Trigger confetti for completed milestones every time page is opened
  useEffect(() => {
    const newShowConfetti = milestones.map((milestone, index) => {
      const isAchieved = isMilestoneAchieved(milestone.deficit, index);
      
      // Show confetti for all achieved milestones every time page opens
      if (isAchieved) {
        console.log(`🎉 Confetti triggered for milestone ${index}: ${milestone.label}`);
        return true;
      }
      return false;
    });
    
    // Check if there are any achieved milestones to show confetti
    const hasAchievements = newShowConfetti.some(show => show);
    if (hasAchievements) {
      console.log('🎉 Setting confetti states:', newShowConfetti);
      setShowConfetti(newShowConfetti);
      
      // Hide confetti after 5 seconds
      const timer = setTimeout(() => {
        console.log('🎉 Hiding confetti');
        setShowConfetti(new Array(4).fill(false));
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [currentDeficit, totalDeficitNeeded, milestones, isMilestoneAchieved]);



  const handleEditStart = () => {
    setEditingRewards([...rewards]);
    setIsEditing(true);
  };

  const handleSaveRewards = () => {
    setRewards(editingRewards);
    onUpdateRewards(editingRewards);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditingRewards([...rewards]);
    setIsEditing(false);
  };

  const handleRewardChange = (index: number, value: string) => {
    const newRewards = [...editingRewards];
    newRewards[index] = value;
    setEditingRewards(newRewards);
  };

  const createConfetti = () => {
    const colors = ['#667eea', '#28a745', '#ffc107', '#dc3545', '#17a2b8', '#fd7e14', '#6f42c1', '#e83e8c'];
    const confetti: JSX.Element[] = [];
    
    for (let i = 0; i < 30; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const left = Math.random() * 100;
      const animationDelay = Math.random() * 1.5;
      const animationDuration = 2.5 + Math.random() * 2;
      const size = 6 + Math.random() * 8; // Random size between 6-14px
      const isSquare = Math.random() > 0.5; // 50% chance of square vs circle
      
      confetti.push(
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: `${left}%`,
            backgroundColor: color,
            animationDelay: `${animationDelay}s`,
            animationDuration: `${animationDuration}s`,
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: isSquare ? '2px' : '50%'
          }}
        />
      );
    }
    
    return confetti;
  };

  const getMilestoneProgress = (milestoneDeficit: number, index: number) => {
    if (totalDeficitNeeded <= 0) {
      return {
        current: 0,
        target: 0,
        percentage: 0
      };
    }
    
    const sliceSize = totalDeficitNeeded / 4; // Each milestone represents 1/4 of total goal
    const sliceStart = index * sliceSize;
    const sliceEnd = (index + 1) * sliceSize;
    
    // Calculate progress within this specific slice
    let progressInSlice = 0;
    
    if (currentDeficit >= sliceEnd) {
      // Milestone is completed - show full slice
      progressInSlice = sliceSize;
    } else if (currentDeficit > sliceStart) {
      // Milestone is in progress - show partial slice
      progressInSlice = Math.max(0, currentDeficit - sliceStart);
    } else {
      // Milestone hasn't started - show 0
      progressInSlice = 0;
    }
    
    return {
      current: progressInSlice,
      target: sliceSize,
      percentage: sliceSize > 0 ? Math.max(0, Math.min(100, (progressInSlice / sliceSize) * 100)) : 0
    };
  };

  return (
    <div className="rewards">
      <div className="rewards-header">
        <h2>🏆 Your Weight Loss Rewards</h2>
        <p>Set personal rewards for each milestone to stay motivated on your journey!</p>
      </div>

      <div className="overall-progress-section">
        <h3>Overall Progress</h3>
        <div className="progress-info">
          <span>Progress: {progressPercentage.toFixed(1)}%</span>
          <span>{currentDeficit.toFixed(0)} / {totalDeficitNeeded.toFixed(0)} calories</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="milestones-grid">
        {milestones.map((milestone, index) => {
          const isAchieved = isMilestoneAchieved(milestone.deficit, index);
          const isInProgress = isMilestoneInProgress(milestone.deficit, index);
          const isNotStarted = isMilestoneNotStarted(milestone.deficit, index);
          const reward = isEditing ? editingRewards[index] : rewards[index];
          const milestoneProgress = getMilestoneProgress(milestone.deficit, index);
          
          return (
            <div 
              key={index} 
              className={`milestone-card ${isAchieved ? 'achieved' : ''} ${isInProgress ? 'in-progress' : ''} ${isNotStarted ? 'not-started' : ''}`}
              ref={el => confettiRefs.current[index] = el}
            >
              {showConfetti[index] && (
                <div className="confetti-container">
                  {createConfetti()}
                </div>
              )}
              
              <div className="milestone-header">
                <div className="milestone-title">
                  <div className="milestone-label">{milestone.label}</div>
                  <div className="milestone-percentage">({milestone.percentage})</div>
                </div>
                {isAchieved && <div className="achievement-tick">✓</div>}
              </div>
              
              <div className="milestone-progress">
                <div className="milestone-bar">
                  <div 
                    className={`milestone-fill ${isAchieved ? 'achieved' : ''} ${isInProgress ? 'in-progress' : ''} ${isNotStarted ? 'not-started' : ''}`}
                    style={{ width: `${milestoneProgress.percentage}%` }}
                  ></div>
                </div>
                <span className="milestone-text">
                  {milestoneProgress.current.toFixed(0)} / {milestoneProgress.target.toFixed(0)} cal
                </span>
              </div>

              <div className="reward-section">
                <div className="reward-label">Your Reward:</div>
                {isEditing ? (
                  <input
                    type="text"
                    value={reward}
                    onChange={(e) => handleRewardChange(index, e.target.value)}
                    className="reward-input"
                    placeholder="Enter your reward"
                  />
                ) : (
                  <div className="reward-text">{reward}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="rewards-actions">
        {!isEditing ? (
          <div className="action-buttons">
            <button onClick={handleEditStart} className="edit-rewards-btn">
              ✏️ Edit Rewards
            </button>
          </div>
        ) : (
          <div className="edit-actions">
            <button onClick={handleSaveRewards} className="save-rewards-btn">
              Save Rewards
            </button>
            <button onClick={handleCancelEdit} className="cancel-rewards-btn">
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rewards; 