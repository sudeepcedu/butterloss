import React from 'react';
import { WeightLossData } from '../types';
import './ButterCollection.css';

interface ButterCollectionProps {
  data: WeightLossData;
}

const ButterCollection: React.FC<ButterCollectionProps> = ({ data }) => {
  return (
    <div className="butter-collection">
      <h3>🧈 Butter and Ghee Collection</h3>
      
      <div className="collection-stats">
        <div className="stat-item">
          <div className="stat-text"><span className="number">{data.butterPacks}</span> Butter Packs Collected</div>
        </div>
        <div className="stat-item">
          <div className="stat-text"><span className="number">{data.gheePacks}</span> Ghee Packs Earned</div>
        </div>
      </div>

      <div className="butter-display">
        <h4>Your Butter Packs</h4>
        <div className="butter-grid">
          {Array.from({ length: data.butterPacks }, (_, index) => (
            <div key={index} className="butter-pack">
              🧈
            </div>
          ))}
          {data.butterPacks === 0 && (
            <div className="empty-collection">
              <div className="empty-icon">🧈</div>
              <p>No butter packs yet. Start logging your deficit to collect them!</p>
            </div>
          )}
        </div>
      </div>

      <div className="ghee-collection">
        <h4>Your Ghee Packs</h4>

        <div className="ghee-display">
          <div className="ghee-grid">
            {Array.from({ length: data.gheePacks }, (_, index) => (
              <div key={index} className="ghee-pack">
                🍯
              </div>
            ))}
            {data.gheePacks === 0 && (
              <div className="empty-ghee">
                <div className="empty-icon">🍯</div>
                <p>No ghee packs yet. Keep working towards your deficit goal!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="collection-tips">
        <h4>💡 Collection Rules</h4>
        <ul>
          <li>Every 770 calorie deficit = 1 butter pack (100g fat)</li>
          <li>Every 7700 calorie deficit = 1 premium ghee pack (1kg fat)</li>
        </ul>
      </div>
    </div>
  );
};

export default ButterCollection; 