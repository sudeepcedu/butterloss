import React from 'react';
import './TipsForSuccess.css';

const TipsForSuccess: React.FC = () => {
  return (
    <div className="tips-for-success">
      <h3>💡 Tips for Success</h3>
      
      <div className="tips-grid">
        <div className="tip-card">
          <div className="tip-icon">🎯</div>
          <div className="tip-content">
            <h4>Consistency &gt; Perfection</h4>
            <p>Logging daily — even imperfect days — builds the habit that drives success.</p>
          </div>
        </div>

        <div className="tip-card">
          <div className="tip-icon">🥦</div>
          <div className="tip-content">
            <h4>Eat More, Not Less</h4>
            <p>Fill your plate with high-volume, low-calorie foods like veggies and lean protein to stay full.</p>
          </div>
        </div>

        <div className="tip-card">
          <div className="tip-icon">🚶‍♂️</div>
          <div className="tip-content">
            <h4>Move Often, Not Just in the Gym</h4>
            <p>Walking, chores, and stretching all burn calories — every step counts!</p>
          </div>
        </div>

        <div className="tip-card">
          <div className="tip-icon">📉</div>
          <div className="tip-content">
            <h4>The Scale Isn't Everything</h4>
            <p>Fat loss isn't linear. Track trends, not days. Use butter packs and deficit tracker for real wins.</p>
          </div>
        </div>

        <div className="tip-card">
          <div className="tip-icon">🧠</div>
          <div className="tip-content">
            <h4>Mindset is Muscle</h4>
            <p>Progress is mental too. Be kind, stay focused, and celebrate every small win.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TipsForSuccess; 