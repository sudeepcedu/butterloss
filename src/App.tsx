import React, { useState, useEffect, useCallback } from 'react';
import UserSetup from './components/UserSetup';
import DailyLogForm from './components/DailyLogForm';
import DeficitProgress from './components/DeficitProgress';
import ButterCollection from './components/ButterCollection';
import EstimatedCompletion from './components/EstimatedCompletion';
import Calendar from './components/Calendar';
import WeightLoss from './components/WeightLoss';
import TipsForSuccess from './components/TipsForSuccess';
import Rewards from './components/Rewards';
import IterationSetup from './components/IterationSetup';
import IterationHistory from './components/IterationHistory';
import IterationDetails from './components/IterationDetails';
import WeightInputModal from './components/WeightInputModal';
import { 
  calculateTotalDeficitNeeded, 
  calculateCurrentDeficit, 
  calculateRemainingDeficit, 
  calculateButterPacks,
  calculateGheePacks, 
  calculateCurrentStreak 
} from './utils/calculations';
import { User, DailyLog, WeightLossData, IterationData, IterationSummary } from './types';
import './App.css';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [currentView, setCurrentView] = useState<'setup' | 'dashboard' | 'calendar' | 'butter' | 'weight' | 'rewards'>('setup');
  const [showIterationSetup, setShowIterationSetup] = useState(false);
  const [showWeightInput, setShowWeightInput] = useState(false);
  const [goalCompletedHandled, setGoalCompletedHandled] = useState(false);
  const [iterations, setIterations] = useState<IterationData[]>([]);
  const [currentIterationStartDate, setCurrentIterationStartDate] = useState<string>('');
  const [selectedIteration, setSelectedIteration] = useState<IterationData | null>(null);

  // Helper function to get current date in YYYY-MM-DD format
  const getCurrentDate = () => new Date().toLocaleDateString('en-CA');

  // Custom setUser function to prevent accidental null resets
  const setUserSafely = useCallback((newUser: User | null) => {
    if (newUser === null && user !== null) {
      console.log('Preventing user reset to null - user already exists');
      return;
    }
    console.log('Setting user safely:', newUser);
    setUser(newUser);
  }, [user]);

  useEffect(() => {
    console.log('Current view changed:', currentView);
  }, [currentView]);

  useEffect(() => {
    console.log('Weight input modal state:', showWeightInput);
  }, [showWeightInput]);

  useEffect(() => {
    const savedUser = localStorage.getItem('butterloss_user');
    const savedLogs = localStorage.getItem('butterloss_logs');
    const savedIterations = localStorage.getItem('butterloss_iterations');
    const savedIterationStartDate = localStorage.getItem('butterloss_iteration_start_date');
    
    console.log('Loading from localStorage:', { 
      savedUser: savedUser ? JSON.parse(savedUser) : null, 
      savedLogs: savedLogs ? JSON.parse(savedLogs) : null, 
      savedIterations, 
      savedIterationStartDate 
    });
    
    try {
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        console.log('Setting user from localStorage:', parsedUser);
        setUserSafely(parsedUser);
        // Always set to dashboard if user exists
        setCurrentView('dashboard'); 
      } else {
        console.log('No saved user found, staying on setup');
        setCurrentView('setup');
      }
      
      if (savedLogs) {
        const parsedLogs = JSON.parse(savedLogs);
        console.log('Setting logs from localStorage:', parsedLogs);
        if (Array.isArray(parsedLogs)) {
          setLogs(parsedLogs);
          console.log('Logs loaded successfully:', parsedLogs.length, 'entries');
        } else {
          console.error('Invalid logs format:', parsedLogs);
        }
      } else {
        console.log('No saved logs found');
      }
      
      if (savedIterations) {
        setIterations(JSON.parse(savedIterations));
      }
      
      if (savedIterationStartDate) {
        setCurrentIterationStartDate(savedIterationStartDate);
      } else {
        // Set current date as iteration start date if not set
        const today = getCurrentDate();
        setCurrentIterationStartDate(today);
        localStorage.setItem('butterloss_iteration_start_date', today);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }, []);

  useEffect(() => {
    console.log('Saving to localStorage:', { user, logs, iterations, currentIterationStartDate });
    try {
      // Only save user if it's not null and actually exists
      if (user && user.name) {
        localStorage.setItem('butterloss_user', JSON.stringify(user));
        console.log('User saved successfully');
      } else {
        console.log('Not saving user - user is null or invalid');
      }
      
      // Only save logs if they exist and user exists
      if (user && logs.length >= 0) {
        localStorage.setItem('butterloss_logs', JSON.stringify(logs));
        console.log('Logs saved successfully:', logs.length, 'entries');
      } else {
        console.log('Not saving logs - user is null or logs invalid');
      }
      
      localStorage.setItem('butterloss_iterations', JSON.stringify(iterations));
      localStorage.setItem('butterloss_iteration_start_date', currentIterationStartDate);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [user, logs, iterations, currentIterationStartDate, setUserSafely]);

  useEffect(() => {
    console.log('User state changed:', user);
  }, [user]);

  useEffect(() => {
    console.log('Logs state changed:', logs);
  }, [logs]);

  // Auto-trigger weight input modal when goal is completed
  useEffect(() => {
    if (user && logs.length > 0) {
      const totalDeficitNeeded = calculateTotalDeficitNeeded(user.targetLoss);
      const currentDeficit = calculateCurrentDeficit(logs);
      
      // Check if goal is completed and weight input modal is not already shown
      if (currentDeficit >= totalDeficitNeeded && !showWeightInput && !showIterationSetup && !goalCompletedHandled) {
        console.log('🎉 Goal completed! Auto-triggering weight input modal');
        setShowWeightInput(true);
      }
    }
  }, [logs, user, showWeightInput, showIterationSetup, goalCompletedHandled]);

  const handleUserSetup = (newUser: User) => {
    console.log('Setting up new user:', newUser);
    
    // Guard against calling this when user already exists
    if (user) {
      console.log('User already exists, ignoring setup call');
      return;
    }
    
    setUserSafely(newUser);
    
    // Only create initial weight log if no logs exist
    if (logs.length === 0) {
      const today = new Date().toISOString().split('T')[0];
      const initialWeightLog: DailyLog = {
        date: today,
        deficit: null,
        weight: newUser.weight
      };
      console.log('Creating initial weight log:', initialWeightLog);
      setLogs([initialWeightLog]);
    } else {
      console.log('User already has logs, not overwriting:', logs);
    }
    
    setCurrentView('dashboard');
  };

  const handleLogSubmit = (log: DailyLog) => {
    console.log('Submitting log:', log);
    
    // Special case: if deficit is null, remove the entry
    if (log.deficit === null) {
      setLogs(prev => prev.filter(l => l.date !== log.date));
      return;
    }
    
    const existingLogIndex = logs.findIndex(l => l.date === log.date);
    if (existingLogIndex >= 0) {
      const updatedLogs = [...logs];
      const existingLog = updatedLogs[existingLogIndex];
      
      // Preserve existing weight if the new log doesn't have weight data
      const mergedLog: DailyLog = {
        date: log.date,
        deficit: log.deficit,
        weight: log.weight !== null ? log.weight : existingLog.weight
      };
      
      updatedLogs[existingLogIndex] = mergedLog;
      console.log('Updating existing log with preserved weight, new logs:', updatedLogs);
      setLogs(updatedLogs);
    } else {
      const newLogs = [...logs, log];
      console.log('Adding new log, new logs:', newLogs);
      setLogs(newLogs);
    }
  };

  const handleUpdateDailyGoal = (newGoal: number) => {
    if (user) {
      const updatedUser = { ...user, dailyDeficitGoal: newGoal };
      setUserSafely(updatedUser);
    }
  };

  const handleUpdateRewards = (rewards: string[]) => {
    localStorage.setItem('butterloss_rewards', JSON.stringify(rewards));
  };

  const handleStartNewIteration = () => {
    if (!user) return;
    console.log('🔄 Starting new iteration setup');
    
    // If goal was completed, create iteration summary from current data
    if (goalCompletedHandled) {
      const currentDeficit = calculateCurrentDeficit(logs);
      const butterPacks = calculateButterPacks(logs);
      const endDate = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD format
      const startDate = currentIterationStartDate || new Date().toISOString().split('T')[0];
      const duration = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));

      // Calculate weight lost based on the starting weight of this iteration
      const finalWeight = getCurrentWeight();
      const weightLost = user.weight - finalWeight;

          // Calculate which rewards were earned during this iteration
    const totalDeficitNeeded = calculateTotalDeficitNeeded(user.targetLoss);
    const earnedRewards: string[] = [];
    
    // Get current rewards from localStorage
    const currentRewards = JSON.parse(localStorage.getItem('butterloss_rewards') || '[]');
    const defaultRewards = [
      'Buy a new outfit',
      'Go for a spa day', 
      'Take a weekend trip',
      'Buy something expensive'
    ];
    const rewards = currentRewards.length > 0 ? currentRewards : defaultRewards;

    // Check which milestones were achieved based on current deficit
    const sliceSize = totalDeficitNeeded / 4;
    for (let i = 0; i < 4; i++) {
      const sliceEnd = (i + 1) * sliceSize;
      if (currentDeficit >= sliceEnd) {
        earnedRewards.push(rewards[i] || defaultRewards[i]);
      }
    }

    // Create iteration summary (unused but kept for future use)
    const _iterationSummary: IterationSummary = {
      id: `iteration_${Date.now()}`,
      startDate: currentIterationStartDate || getCurrentDate(),
      endDate: endDate,
      startingWeight: user.weight,
      targetWeight: user.targetWeight,
      finalWeight: finalWeight,
      weightLost: weightLost,
      totalDeficitBurned: currentDeficit,
      butterPacksEarned: butterPacks,
      duration: duration,
      isCompleted: true
    };

      const iterationData: IterationData = {
        summary: _iterationSummary,
        logs: [...logs],
        rewards: earnedRewards,
        milestoneAchievements: [false, false, false, false]
      };

      setIterations(prev => [iterationData, ...prev]);
    }
    
    setShowIterationSetup(true);
  };

  const handleWeightInputComplete = (currentWeight: number) => {
    if (!user) return;
    console.log('⚖️ Weight input completed with weight:', currentWeight);

    // Add weight log entry for today's date
    const today = getCurrentDate();
    const weightLogEntry: DailyLog = {
      date: today,
      deficit: null,
      weight: currentWeight
    };
    
    // Add to logs if it doesn't already exist for today
    const existingLogIndex = logs.findIndex(log => log.date === today);
    if (existingLogIndex >= 0) {
      // Update existing log with weight
      const updatedLogs = [...logs];
      updatedLogs[existingLogIndex] = {
        ...updatedLogs[existingLogIndex],
        weight: currentWeight
      };
      setLogs(updatedLogs);
    } else {
      // Add new weight log entry
      setLogs(prev => [...prev, weightLogEntry]);
    }

    const currentDeficit = calculateCurrentDeficit(logs);
    const butterPacks = calculateButterPacks(logs);
    const endDate = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD format
    const startDate = currentIterationStartDate || new Date().toLocaleDateString('en-CA');
    const duration = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));

    // Calculate weight lost based on the starting weight of this iteration
    const weightLost = user.weight - currentWeight;

    // Calculate which rewards were earned during this iteration
    const totalDeficitNeeded = calculateTotalDeficitNeeded(user.targetLoss);
    const earnedRewards: string[] = [];
    
    // Get current rewards from localStorage
    const currentRewards = JSON.parse(localStorage.getItem('butterloss_rewards') || '[]');
    const defaultRewards = [
      'Buy a new outfit',
      'Go for a spa day', 
      'Take a weekend trip',
      'Buy something expensive'
    ];
    const rewards = currentRewards.length > 0 ? currentRewards : defaultRewards;

    // Check which milestones were achieved based on current deficit
    const sliceSize = totalDeficitNeeded / 4;
    for (let i = 0; i < 4; i++) {
      const sliceEnd = (i + 1) * sliceSize;
      if (currentDeficit >= sliceEnd) {
        earnedRewards.push(rewards[i] || defaultRewards[i]);
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // Create iteration summary (unused but kept for future use)
    const _iterationSummary2: IterationSummary = {
      id: `iteration_${Date.now()}`,
      startDate: currentIterationStartDate || getCurrentDate(),
      endDate: endDate,
      startingWeight: user.weight,
      targetWeight: user.targetWeight,
      finalWeight: currentWeight,
      weightLost: weightLost,
      totalDeficitBurned: currentDeficit,
      butterPacksEarned: butterPacks,
      duration: duration,
      isCompleted: true
    };

    // Don't add to iterations yet - only when user starts new iteration
    setShowWeightInput(false);
    setGoalCompletedHandled(true);
    // Don't automatically start new iteration - let user decide when to start
  };

  const handleWeightInputSkip = () => {
    if (!user) return;
    
    // Get the last logged weight
    const weightLogs = logs.filter(log => log.weight !== null).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const lastLoggedWeight = weightLogs.length > 0 ? weightLogs[0].weight! : user.weight;
    
    console.log('⏭️ Weight input skipped, using last logged weight:', lastLoggedWeight);

    // Add weight log entry for today's date using last logged weight
    const today = getCurrentDate();
    const weightLogEntry: DailyLog = {
      date: today,
      deficit: null,
      weight: lastLoggedWeight
    };
    
    // Add to logs if it doesn't already exist for today
    const existingLogIndex = logs.findIndex(log => log.date === today);
    if (existingLogIndex >= 0) {
      // Update existing log with weight
      const updatedLogs = [...logs];
      updatedLogs[existingLogIndex] = {
        ...updatedLogs[existingLogIndex],
        weight: lastLoggedWeight
      };
      setLogs(updatedLogs);
    } else {
      // Add new weight log entry
      setLogs(prev => [...prev, weightLogEntry]);
    }
    
    const currentDeficit = calculateCurrentDeficit(logs);
    const butterPacks = calculateButterPacks(logs);
    const endDate = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD format
    const startDate = currentIterationStartDate || new Date().toLocaleDateString('en-CA');
    const duration = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));

    // Calculate weight lost based on the starting weight of this iteration
    const weightLost = user.weight - lastLoggedWeight;

    // Calculate which rewards were earned during this iteration
    const totalDeficitNeeded = calculateTotalDeficitNeeded(user.targetLoss);
    const earnedRewards: string[] = [];
    
    // Get current rewards from localStorage
    const currentRewards = JSON.parse(localStorage.getItem('butterloss_rewards') || '[]');
    const defaultRewards = [
      'Buy a new outfit',
      'Go for a spa day', 
      'Take a weekend trip',
      'Buy something expensive'
    ];
    const rewards = currentRewards.length > 0 ? currentRewards : defaultRewards;

    // Check which milestones were achieved based on current deficit
    const sliceSize = totalDeficitNeeded / 4;
    for (let i = 0; i < 4; i++) {
      const sliceEnd = (i + 1) * sliceSize;
      if (currentDeficit >= sliceEnd) {
        earnedRewards.push(rewards[i] || defaultRewards[i]);
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const iterationSummary: IterationSummary = {
      id: `iteration_${Date.now()}`,
      startDate: currentIterationStartDate || getCurrentDate(),
      endDate: endDate,
      startingWeight: user.weight,
      targetWeight: user.targetWeight,
      finalWeight: lastLoggedWeight,
      weightLost: weightLost,
      totalDeficitBurned: currentDeficit,
      butterPacksEarned: butterPacks,
      duration: duration,
      isCompleted: true
    };

    // Don't add to iterations yet - only when user starts new iteration
    setShowWeightInput(false);
    setGoalCompletedHandled(true);
    // Don't automatically start new iteration - let user decide when to start
  };

  const handleNewIteration = (currentWeight: number, targetWeight: number) => {
    if (!user) return;

    // Calculate new target loss
    const newTargetLoss = currentWeight - targetWeight;

    // Update user with new weights and target loss
    const updatedUser = {
      ...user,
      weight: currentWeight,
      targetWeight: targetWeight,
      targetLoss: newTargetLoss
    };
    setUserSafely(updatedUser);

    // Add weight log entry for today's date
    const today = getCurrentDate();
    const weightLogEntry: DailyLog = {
      date: today,
      deficit: null,
      weight: currentWeight
    };

    // Reset all tracking data and add initial weight log
    setLogs([weightLogEntry]);
    setCurrentIterationStartDate(getCurrentDate());
    setGoalCompletedHandled(false);
    
    // Clear localStorage for current iteration
    localStorage.removeItem('butterloss_logs');
    localStorage.removeItem('butterloss_rewards');
    for (let i = 0; i < 4; i++) {
      localStorage.removeItem(`milestone_${i}_achieved`);
    }

    setShowIterationSetup(false);
  };

  const handleViewIterationDetails = (iterationId: string) => {
    const iteration = iterations.find(iter => iter.summary.id === iterationId);
    if (iteration) {
      setSelectedIteration(iteration);
    }
  };

  const getCurrentWeight = (): number => {
    const weightLogs = logs.filter(log => log.weight !== null).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return weightLogs.length > 0 ? weightLogs[0].weight! : user!.weight;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const resetData = () => {
    if (window.confirm('Are you sure you want to reset all your data? This cannot be undone.')) {
      localStorage.removeItem('butterloss_user');
      localStorage.removeItem('butterloss_logs');
      localStorage.removeItem('butterloss_rewards');
      localStorage.removeItem('butterloss_iterations');
      localStorage.removeItem('butterloss_iteration_start_date');
      for (let i = 0; i < 4; i++) {
        localStorage.removeItem(`milestone_${i}_achieved`);
      }
      setUserSafely(null);
      setLogs([]);
      setIterations([]);
      setCurrentIterationStartDate('');
      setCurrentView('setup');
    }
  };

  const resetIteration = () => {
    if (window.confirm('Are you sure you want to reset the current iteration? This will remove all calorie deficit entries and weight log entries from the current iteration. This cannot be undone.')) {
      // Find the initial weight log (the first weight entry from the current iteration)
      const initialWeightLog = logs.find(log => 
        log.weight !== null && 
        new Date(log.date) >= new Date(currentIterationStartDate)
      );
      
      // Clear all logs but preserve the initial weight if it exists
      const preservedLogs = initialWeightLog ? [initialWeightLog] : [];
      setLogs(preservedLogs);
      
      // Reset iteration start date to today
      const today = new Date().toISOString().split('T')[0];
      setCurrentIterationStartDate(today);
      // Reset goal completion flag
      setGoalCompletedHandled(false);
      // Clear localStorage for current iteration
      localStorage.removeItem('butterloss_logs');
      localStorage.removeItem('butterloss_rewards');
      for (let i = 0; i < 4; i++) {
        localStorage.removeItem(`milestone_${i}_achieved`);
      }
      console.log('🔄 Current iteration reset successfully');
    }
  };

  const restartJourney = () => {
    if (!user) return;
    
    if (window.confirm('Are you sure you want to restart your journey? This will clear all current progress and take you back to the welcome screen. Your name, age, and height will be pre-filled with your current information.')) {
      // Save current user info for pre-filling
      const userInfo = {
        name: user.name,
        age: user.age,
        height: user.height
      };
      
      // Clear all progress data
      localStorage.removeItem('butterloss_logs');
      localStorage.removeItem('butterloss_rewards');
      localStorage.removeItem('butterloss_iterations');
      localStorage.removeItem('butterloss_iteration_start_date');
      for (let i = 0; i < 4; i++) {
        localStorage.removeItem(`milestone_${i}_achieved`);
      }
      
      // Clear user data but keep the basic info for pre-filling
      localStorage.removeItem('butterloss_user');
      
      // Store user info for pre-filling
      localStorage.setItem('butterloss_restart_info', JSON.stringify(userInfo));
      
      // Reset all state
      setUser(null);
      setLogs([]);
      setIterations([]);
      setCurrentIterationStartDate('');
      setShowWeightInput(false);
      setShowIterationSetup(false);
      setSelectedIteration(null);
      setGoalCompletedHandled(false);
      setCurrentView('setup');
      
      console.log('🔄 Journey restarted successfully');
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const clearCacheAndRestart = () => {
    if (window.confirm('This will clear all localStorage and restart the app. Continue?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  if (!user) {
    console.log('No user found, showing UserSetup');
    return <UserSetup onComplete={handleUserSetup} />;
  }

  console.log('User exists, showing dashboard. User:', user, 'Logs:', logs.length);

  // Get current weight from the most recent weight entry, or use initial weight
  const weightLogs = logs.filter(log => log.weight !== null).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const currentWeight = weightLogs.length > 0 ? weightLogs[0].weight! : user.weight;

  const totalDeficitNeeded = calculateTotalDeficitNeeded(user.targetLoss);
  const currentDeficit = calculateCurrentDeficit(logs);
  const remainingDeficit = calculateRemainingDeficit(totalDeficitNeeded, currentDeficit);
  const butterPacks = calculateButterPacks(logs);
  const gheePacks = calculateGheePacks(logs);
  const currentStreak = calculateCurrentStreak(logs);

  const weightLossData: WeightLossData = {
    user,
    logs,
    totalDeficitNeeded,
    currentDeficit,
    remainingDeficit,
    butterPacks,
    gheePacks,
    currentStreak
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🧈 ButterLoss</h1>
        <nav className="nav-tabs">
          <button 
            className={`nav-tab ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentView('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className={`nav-tab ${currentView === 'calendar' ? 'active' : ''}`}
            onClick={() => setCurrentView('calendar')}
          >
            📅 Calendar
          </button>
          <button 
            className={`nav-tab ${currentView === 'butter' ? 'active' : ''}`}
            onClick={() => setCurrentView('butter')}
          >
            🧈 Butter Collection
          </button>
          <button 
            className={`nav-tab ${currentView === 'weight' ? 'active' : ''}`}
            onClick={() => setCurrentView('weight')}
          >
            ⚖️ Weight Loss
          </button>
          <button 
            className={`nav-tab ${currentView === 'rewards' ? 'active' : ''}`}
            onClick={() => setCurrentView('rewards')}
          >
            🏆 Rewards
          </button>
        </nav>

      </header>

      <main className="app-main">
        <div className="user-info">
          <h2>Welcome back, {user.name}! 👋</h2>
          <p>Current Weight: {currentWeight} kg | Target: {user.targetWeight} kg</p>
        </div>

        {currentView === 'dashboard' && (
          <div className="dashboard">
            <DailyLogForm onLogSubmit={handleLogSubmit} currentWeight={currentWeight} />
            <DeficitProgress data={weightLossData} />
            <EstimatedCompletion data={weightLossData} onUpdateDailyGoal={handleUpdateDailyGoal} />
            <TipsForSuccess />
            <IterationHistory 
              iterations={iterations} 
              onViewDetails={handleViewIterationDetails} 
            />
            <div className="dashboard-actions">
              {currentDeficit >= totalDeficitNeeded && (
                <button onClick={handleStartNewIteration} className="complete-iteration-btn">
                  🔁 Start New Iteration
                </button>
              )}
              <button onClick={resetIteration} className="reset-iteration-btn">
                🔄 Reset Iteration
              </button>
              <button onClick={restartJourney} className="restart-journey-btn">
                🚀 Restart Journey
              </button>
            </div>
          </div>
        )}

        {currentView === 'calendar' && (
          <div className="calendar-view">
            <Calendar logs={logs} onLogSubmit={handleLogSubmit} currentWeight={currentWeight} />
          </div>
        )}

        {currentView === 'butter' && (
          <div className="butter-view">
            <ButterCollection data={weightLossData} />
          </div>
        )}

        {currentView === 'weight' && (
          <div className="weight-view">
            <WeightLoss logs={logs} targetWeight={user.targetWeight} onLogSubmit={handleLogSubmit} currentWeight={currentWeight} />
          </div>
        )}

        {currentView === 'rewards' && (
          <div className="rewards-view">
            <Rewards data={weightLossData} onUpdateRewards={handleUpdateRewards} />
          </div>
        )}
      </main>

      {showIterationSetup && (
        <IterationSetup
          onComplete={handleNewIteration}
          onCancel={() => setShowIterationSetup(false)}
        />
      )}

      {selectedIteration && (
        <IterationDetails
          iteration={selectedIteration}
          onClose={() => setSelectedIteration(null)}
        />
      )}

      {showWeightInput && (
        <WeightInputModal
          startingWeight={user!.weight}
          lastLoggedWeight={getCurrentWeight()}
          onComplete={handleWeightInputComplete}
          onSkip={handleWeightInputSkip}
        />
      )}
    </div>
  );
};

export default App; 