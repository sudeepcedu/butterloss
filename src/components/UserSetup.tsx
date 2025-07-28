import React, { useState, useEffect } from 'react';
import { User } from '../types';
import './UserSetup.css';

interface UserSetupProps {
  onComplete: (user: User) => void;
}

const UserSetup: React.FC<UserSetupProps> = ({ onComplete }) => {
  // Check for pre-filled information from restart
  const getPrefilledData = () => {
    try {
      const restartInfo = localStorage.getItem('butterloss_restart_info');
      if (restartInfo) {
        const parsedInfo = JSON.parse(restartInfo);
        return {
          name: parsedInfo.name || '',
          age: parsedInfo.age?.toString() || '',
          height: parsedInfo.height?.toString() || '',
          weight: '',
          targetWeight: '',
          dailyDeficitGoal: '500'
        };
      }
    } catch (error) {
      console.error('Error parsing restart info:', error);
    }
    return {
      name: '',
      age: '',
      height: '',
      weight: '',
      targetWeight: '',
      dailyDeficitGoal: '500'
    };
  };

  const [formData, setFormData] = useState(getPrefilledData());

  // Clear restart info after it's used
  useEffect(() => {
    const restartInfo = localStorage.getItem('butterloss_restart_info');
    if (restartInfo) {
      localStorage.removeItem('butterloss_restart_info');
      console.log('🧹 Cleared restart info after pre-filling form');
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user: User = {
      name: formData.name,
      age: parseInt(formData.age),
      height: parseFloat(formData.height),
      weight: parseFloat(formData.weight),
      targetWeight: parseFloat(formData.targetWeight),
      targetLoss: parseFloat(formData.weight) - parseFloat(formData.targetWeight),
      dailyDeficitGoal: parseInt(formData.dailyDeficitGoal)
    };
    onComplete(user);
  };

  return (
    <div className="user-setup">
      <div className="setup-card">
        <h1>🎯 Welcome to ButterLoss</h1>
        <p className="subtitle">Let's start your weight loss journey!</p>
        
        <form onSubmit={handleSubmit} className="setup-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              min="1"
              max="120"
              placeholder="Enter your age"
            />
          </div>

          <div className="form-group">
            <label htmlFor="height">Height (cm)</label>
            <input
              type="number"
              id="height"
              name="height"
              value={formData.height}
              onChange={handleChange}
              required
              min="100"
              max="250"
              placeholder="Enter your height in cm"
            />
          </div>

          <div className="form-group">
            <label htmlFor="weight">Current Weight (kg)</label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              required
              min="30"
              max="300"
              step="0.1"
              placeholder="Enter your current weight"
            />
          </div>

          <div className="form-group">
            <label htmlFor="targetWeight">Target Weight (kg)</label>
            <input
              type="number"
              id="targetWeight"
              name="targetWeight"
              value={formData.targetWeight}
              onChange={handleChange}
              required
              min="30"
              max="300"
              step="0.1"
              placeholder="Enter your target weight"
            />
          </div>

          <div className="form-group">
            <label htmlFor="dailyDeficitGoal">Daily Deficit Goal (calories)</label>
            <input
              type="number"
              id="dailyDeficitGoal"
              name="dailyDeficitGoal"
              value={formData.dailyDeficitGoal}
              onChange={handleChange}
              required
              min="100"
              max="2000"
              step="100"
              placeholder="Enter your daily deficit goal"
            />
            <small>Recommended: 300-700 calories for sustainable weight loss</small>
          </div>

          <button type="submit" className="submit-btn">
            Start My Journey 🚀
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserSetup; 