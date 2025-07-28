import React, { useState } from 'react';
import { DailyLog } from '../types';
import { format, parseISO } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './WeightLoss.css';

interface WeightLossProps {
  logs: DailyLog[];
  targetWeight: number;
  onLogSubmit: (log: DailyLog) => void;
  currentWeight: number;
}

const WeightLoss: React.FC<WeightLossProps> = ({ logs, targetWeight, onLogSubmit, currentWeight }) => {
  const [showWeightForm, setShowWeightForm] = useState(false);
  const [weight, setWeight] = useState('');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  // Filter logs that have weight recorded
  const weightLogs = logs.filter(log => log.weight !== null).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const handleWeightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if a log for the selected date already exists
    const existingLogIndex = logs.findIndex(log => log.date === selectedDate);
    
    if (existingLogIndex >= 0) {
      // Update existing log with weight
      const updatedLog: DailyLog = {
        ...logs[existingLogIndex],
        weight: parseFloat(weight)
      };
      onLogSubmit(updatedLog);
    } else {
      // Create new log with weight only
      const newLog: DailyLog = {
        date: selectedDate,
        deficit: 0,
        weight: parseFloat(weight)
      };
      onLogSubmit(newLog);
    }
    
    setWeight('');
    setSelectedDate(format(new Date(), 'yyyy-MM-dd')); // Reset to today
    setShowWeightForm(false);
  };

  const handleDateInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    // Open the date picker
    e.currentTarget.showPicker?.();
  };

  const chartData = weightLogs.map(log => ({
    date: format(parseISO(log.date), 'MMM dd'),
    weight: log.weight,
    deficit: log.deficit
  }));

  // Calculate weight loss statistics
  const totalEntries = weightLogs.length;
  const totalChange = weightLogs.length > 0 
    ? (weightLogs[0].weight! - weightLogs[weightLogs.length - 1].weight!) 
    : 0;
  const progressToGoal = weightLogs.length > 0 
    ? (() => {
        const startingWeight = weightLogs[weightLogs.length - 1].weight!;
        const weightDifference = startingWeight - targetWeight;
        
        // If starting weight equals target weight, no progress needed
        if (weightDifference === 0) {
          return currentWeight === targetWeight ? 100 : 0;
        }
        
        // Calculate how much weight has been lost from starting weight
        const weightLost = startingWeight - currentWeight;
        
        // Calculate progress: weight lost / total weight to lose
        return Math.min(Math.max((weightLost / weightDifference) * 100, 0), 100);
      })()
    : 0;

  if (weightLogs.length === 0) {
    return (
      <div className="weight-loss">
        <h3>⚖️ Weight Loss Tracking</h3>
        
        <div className="weight-log-section">
          <h4>Log Your Weight</h4>
          <p>Start tracking your weight progress by logging your current weight.</p>
          
          {!showWeightForm ? (
            <button 
              className="log-weight-btn"
              onClick={() => setShowWeightForm(true)}
            >
              📝 Log Weight
            </button>
          ) : (
            <form onSubmit={handleWeightSubmit} className="weight-form">
              <div className="form-group">
                <label htmlFor="weight-date">Date</label>
                <input
                  type="date"
                  id="weight-date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  onClick={handleDateInputClick}
                  max={format(new Date(), 'yyyy-MM-dd')} // Can't log future dates
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="weight">Weight (kg)</label>
                <input
                  type="number"
                  id="weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                  min="30"
                  max="300"
                  step="0.1"
                  placeholder="Enter weight"
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" className="save-btn">
                  Save Weight
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowWeightForm(false);
                    setWeight('');
                    setSelectedDate(format(new Date(), 'yyyy-MM-dd'));
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="empty-state">
          <div className="empty-icon">📈</div>
          <p>No weight entries recorded yet. Start logging your weight to see your progress chart!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="weight-loss">
      <h3>⚖️ Weight Loss Tracking</h3>
      
      <div className="weight-log-section">
        <h4>Log Your Weight</h4>
        <p>Keep track of your weight progress by logging regularly.</p>
        
        {!showWeightForm ? (
          <button 
            className="log-weight-btn"
            onClick={() => setShowWeightForm(true)}
          >
            📝 Log Weight
          </button>
        ) : (
          <form onSubmit={handleWeightSubmit} className="weight-form">
            <div className="form-group">
              <label htmlFor="weight-date">Date</label>
              <input
                type="date"
                id="weight-date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                onClick={handleDateInputClick}
                max={format(new Date(), 'yyyy-MM-dd')} // Can't log future dates
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="weight">Weight (kg)</label>
              <input
                type="number"
                id="weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
                min="30"
                max="300"
                step="0.1"
                placeholder="Enter weight"
              />
            </div>
            
            <div className="form-actions">
              <button type="submit" className="save-btn">
                Save Weight
              </button>
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => {
                  setShowWeightForm(false);
                  setWeight('');
                  setSelectedDate(format(new Date(), 'yyyy-MM-dd'));
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="weight-stats">
        <div className="stat-card">
          <div className="stat-value">{totalEntries}</div>
          <div className="stat-label">Weight Entries</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalChange.toFixed(1)}</div>
          <div className="stat-label">Total Change</div>
          <div className="stat-unit">kg</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{progressToGoal.toFixed(1)}%</div>
          <div className="stat-label">Progress to Goal</div>
        </div>
      </div>

      <div className="weight-chart">
        <h4>📊 Weight Progress Chart</h4>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="weight" 
                stroke="#667eea" 
                strokeWidth={3}
                dot={{ fill: '#667eea', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="weight-table">
        <h4>📋 Weight Log</h4>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date Recorded</th>
                <th>Weight (kg)</th>
              </tr>
            </thead>
            <tbody>
              {weightLogs.map((log, index) => (
                <tr key={index}>
                  <td>{format(parseISO(log.date), 'MMM dd, yyyy')}</td>
                  <td>{log.weight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WeightLoss; 