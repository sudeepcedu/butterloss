import React, { useState, useEffect, useRef } from 'react';
import { DailyLog } from '../types';
import { format } from 'date-fns';
import './DailyLogForm.css';

interface DailyLogFormProps {
  onLogSubmit: (log: DailyLog) => void;
  currentWeight: number;
  todayLog?: DailyLog | null;
  logsLength?: number;
  resetFlag?: number;
  autoFillDeficit?: number | null;
  currentDeficitCalculation?: number | null;
  onDeficitChange?: (deficit: number | null) => void;
  onDeficitInputChange?: (deficit: number | null) => void;
  onDeficitManuallySubmitted?: (deficit: number) => void;
  isDeficitManuallyEntered?: boolean;
  originalAutoCalculatedDeficit?: number | null;
}

const DailyLogForm: React.FC<DailyLogFormProps> = ({ onLogSubmit, currentWeight, todayLog, logsLength = 0, resetFlag = 0, autoFillDeficit, currentDeficitCalculation, onDeficitChange, onDeficitInputChange, onDeficitManuallySubmitted, isDeficitManuallyEntered = false, originalAutoCalculatedDeficit = null }) => {
  const [deficit, setDeficit] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(!!todayLog);
  const [loggedDeficit, setLoggedDeficit] = useState<number | null>(todayLog?.deficit || null);
  const [isSubmittingManually, setIsSubmittingManually] = useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [pendingDeficitValue, setPendingDeficitValue] = useState('');
  const [originalDeficitValue, setOriginalDeficitValue] = useState<number | null>(null);
  const [isSubmittingViaButton, setIsSubmittingViaButton] = useState(false);
  const deficitInputRef = useRef<HTMLInputElement>(null);

  // Reset state when todayLog changes (e.g., after restart journey)
  useEffect(() => {
    console.log('DailyLogForm useEffect - todayLog:', todayLog, 'logsLength:', logsLength, 'resetFlag:', resetFlag);
    
    // Only show confirmation if there's a valid log for today
    const hasValidLog = todayLog && todayLog.deficit !== null && todayLog.deficit !== undefined;
    console.log('Has valid log for today:', hasValidLog);
    
    if (hasValidLog) {
      console.log('Setting confirmation to true with deficit:', todayLog.deficit);
      setShowConfirmation(true);
      setLoggedDeficit(todayLog.deficit);
    } else {
      console.log('Setting confirmation to false - no valid log');
      setShowConfirmation(false);
      setLoggedDeficit(null);
    }
    setDeficit('');
  }, [todayLog, logsLength, resetFlag]);

  // Handle auto-fill deficit
  useEffect(() => {
    if (autoFillDeficit !== null && autoFillDeficit !== undefined) {
      setDeficit(autoFillDeficit.toString());
      setShowConfirmation(false);
      // Focus on the deficit input field
      setTimeout(() => {
        deficitInputRef.current?.focus();
        // Auto-submit after autofill
        if (deficitInputRef.current && autoFillDeficit !== null && autoFillDeficit !== undefined && !isNaN(autoFillDeficit)) {
          // Auto-submit using the autoFillDeficit value directly
          const today = format(new Date(), 'yyyy-MM-dd');
          const log: DailyLog = {
            date: today,
            deficit: autoFillDeficit,
            weight: null
          };
          onLogSubmit(log);
          setLoggedDeficit(autoFillDeficit);
          setShowConfirmation(true);
        }
      }, 100);
    }
  }, [autoFillDeficit, onLogSubmit]);

  // Food Eaten is purely user input - no calculations
  // Removed useEffect that was calling onDeficitChange

  // Update deficit field when calculation changes (but only if user hasn't manually entered a deficit)
  useEffect(() => {
    if (currentDeficitCalculation !== null && currentDeficitCalculation !== undefined && !showConfirmation) {
      // Only update if the deficit field is empty or has the default value
      if (!deficit || deficit === '0') {
        setDeficit(currentDeficitCalculation.toString());
      }
    }
  }, [currentDeficitCalculation, showConfirmation]);



  // Only update deficit input when autoFillDeficit is triggered (Enter key in food field)
  useEffect(() => {
    if (autoFillDeficit !== null && autoFillDeficit !== undefined) {
      setDeficit(autoFillDeficit.toString());
      setShowConfirmation(false);
      // Focus on the deficit input field
      setTimeout(() => {
        deficitInputRef.current?.focus();
        // Auto-submit after autofill
        if (deficitInputRef.current && autoFillDeficit !== null && autoFillDeficit !== undefined && !isNaN(autoFillDeficit)) {
          // Auto-submit using the autoFillDeficit value directly
          const today = format(new Date(), 'yyyy-MM-dd');
          const log: DailyLog = {
            date: today,
            deficit: autoFillDeficit,
            weight: null
          };
          onLogSubmit(log);
          setLoggedDeficit(autoFillDeficit);
          setShowConfirmation(true);
        }
      }, 100);
    }
  }, [autoFillDeficit, onLogSubmit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const deficitValue = parseInt(deficit);
    
    // Validate that we have a valid number
    if (isNaN(deficitValue)) {
      console.error('Invalid deficit value:', deficit);
      return;
    }
    
    console.log('🔄 DailyLogForm handleSubmit - Setting isSubmittingManually to true');
    // Set flag to prevent onDeficitChange from firing during submission
    setIsSubmittingManually(true);
    // Set flag to indicate this is a button submission (not blur)
    setIsSubmittingViaButton(true);
    
    // Check if the value was actually changed from the original auto-calculated value
    const wasValueChanged = originalAutoCalculatedDeficit !== null && deficitValue !== originalAutoCalculatedDeficit;
    
    console.log('🔄 DailyLogForm handleSubmit - Value comparison:', {
      currentValue: deficitValue,
      originalAutoCalculated: originalAutoCalculatedDeficit,
      wasValueChanged
    });
    
    // Only notify parent that deficit was manually submitted if the value was actually changed
    if (wasValueChanged && onDeficitManuallySubmitted) {
      console.log('🔄 DailyLogForm handleSubmit - Value changed, calling onDeficitManuallySubmitted with:', deficitValue);
      onDeficitManuallySubmitted(deficitValue);
    } else {
      console.log('🔄 DailyLogForm handleSubmit - Value unchanged, not calling onDeficitManuallySubmitted');
    }
    
    // Don't trigger food eaten update when deficit is manually submitted
    // This prevents bidirectional sync when user explicitly enters a deficit
    
    const today = format(new Date(), 'yyyy-MM-dd');
    const log: DailyLog = {
      date: today,
      deficit: deficitValue,
      weight: null
    };
    onLogSubmit(log);
    setLoggedDeficit(deficitValue);
    setShowConfirmation(true);
    
    // Reset the flags after a short delay to allow state updates to complete
    setTimeout(() => {
      console.log('🔄 DailyLogForm handleSubmit - Resetting flags to false');
      setIsSubmittingManually(false);
      setIsSubmittingViaButton(false);
    }, 100);
  };

  // Handle deficit input blur
  const handleDeficitBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Check if the related target (what we're clicking on) is the submit button
    const relatedTarget = e.relatedTarget as HTMLButtonElement;
    if (relatedTarget && relatedTarget.type === 'submit') {
      console.log('🔄 DailyLogForm handleDeficitBlur - Submit button clicked, ignoring blur');
      return;
    }
    
    // If submitting via button, don't show popup
    if (isSubmittingViaButton) {
      console.log('🔄 DailyLogForm handleDeficitBlur - Button submission in progress, ignoring blur');
      return;
    }
    
    const currentValue = parseInt(deficit) || 0;
    
    // If not in edit mode (originalDeficitValue is null), this is a first-time entry
    if (!originalDeficitValue) {
      // Only show popup if user entered a value
      if (currentValue > 0) {
        console.log('🔄 DailyLogForm handleDeficitBlur - First-time entry with value, showing popup');
        setPendingDeficitValue(currentValue.toString());
        setShowUpdatePopup(true);
      }
      return;
    }
    
    // In edit mode - compare with original value
    const originalValue = originalDeficitValue;
    
    console.log('🔄 DailyLogForm handleDeficitBlur - Value comparison:', {
      currentValue,
      originalValue,
      isChanged: currentValue !== originalValue
    });
    
    if (currentValue === originalValue) {
      // No change - auto-log the same value
      console.log('🔄 DailyLogForm handleDeficitBlur - No change, auto-logging same value');
      const today = format(new Date(), 'yyyy-MM-dd');
      const log: DailyLog = {
        date: today,
        deficit: currentValue,
        weight: null
      };
      onLogSubmit(log);
      setLoggedDeficit(currentValue);
      setShowConfirmation(true);
      setOriginalDeficitValue(null); // Clear original value
    } else {
      // Value changed - show popup
      console.log('🔄 DailyLogForm handleDeficitBlur - Value changed, showing popup');
      setPendingDeficitValue(currentValue.toString());
      setShowUpdatePopup(true);
    }
  };

  const handleEdit = () => {
    setShowConfirmation(false);
    // Store the original value for comparison
    setOriginalDeficitValue(loggedDeficit);
    // Restore the previously entered deficit value
    if (loggedDeficit !== null) {
      setDeficit(loggedDeficit.toString());
    }
    // Focus on the deficit input field after a short delay to ensure the form is rendered
    setTimeout(() => {
      deficitInputRef.current?.focus();
    }, 100);
  };

  // Handle popup confirmation
  const handleUpdateConfirm = () => {
    const newValue = parseInt(pendingDeficitValue) || 0;
    console.log('🔄 DailyLogForm handleUpdateConfirm - Logging new value:', newValue);
    
    // Always treat popup confirmation as manual entry
    if (onDeficitManuallySubmitted) {
      console.log('🔄 DailyLogForm handleUpdateConfirm - Calling onDeficitManuallySubmitted for popup confirmation');
      onDeficitManuallySubmitted(newValue);
    }
    
    const today = format(new Date(), 'yyyy-MM-dd');
    const log: DailyLog = {
      date: today,
      deficit: newValue,
      weight: null
    };
    onLogSubmit(log);
    setLoggedDeficit(newValue);
    setShowConfirmation(true);
    setShowUpdatePopup(false);
    setPendingDeficitValue('');
    setOriginalDeficitValue(null);
  };

  // Handle popup cancellation
  const handleUpdateCancel = () => {
    console.log('🔄 DailyLogForm handleUpdateCancel - Reverting to original value');
    if (originalDeficitValue !== null) {
      // In edit mode - revert to original value and auto-log it
      setDeficit(originalDeficitValue.toString());
      
      // Auto-log the original value
      const today = format(new Date(), 'yyyy-MM-dd');
      const log: DailyLog = {
        date: today,
        deficit: originalDeficitValue,
        weight: null
      };
      onLogSubmit(log);
      setLoggedDeficit(originalDeficitValue);
      setShowConfirmation(true);
    } else {
      // In first-time entry mode - clear the field
      setDeficit('');
    }
    setShowUpdatePopup(false);
    setPendingDeficitValue('');
    setOriginalDeficitValue(null);
  };



  return (
    <div className="daily-log-form">
      <h3>📝 Log Today's Progress</h3>
      
      {!showConfirmation ? (
        <form onSubmit={handleSubmit} className="log-form">
          <div className="form-group">
            <label htmlFor="deficit">Calorie Deficit</label>
            <input
              ref={deficitInputRef}
              type="number"
              id="deficit"
              value={deficit}
              onChange={(e) => setDeficit(e.target.value)}
              onBlur={handleDeficitBlur}
              required
              placeholder="Enter today's deficit"
            />
            <small>calories (negative if you ate more than burned)</small>
          </div>

          <button 
            type="submit" 
            className="log-btn"
            onMouseDown={() => setIsSubmittingViaButton(true)}
          >
            Log Progress ✅
          </button>
        </form>
      ) : (
        <div className="log-confirmation">
          <div className="confirmation-message">
            <div className="confirmation-icon">🧈</div>
            <div className="confirmation-text">
              {loggedDeficit && loggedDeficit < 0 ? (
                <>
                  <p>🍫 You've logged a surplus of <strong className="negative-calories">{Math.abs(loggedDeficit)}</strong> calories today.</p>
                  <p>It happens! Let's bounce back strong tomorrow! 💪</p>
                </>
              ) : (
                <>
                  <p>You've logged <strong>{loggedDeficit}</strong> calories deficit for today.</p>
                  <p>Come back tomorrow to keep the streak going! 🔥</p>
                </>
              )}
            </div>
          </div>
          <div className="confirmation-actions">
            <button 
              type="button" 
              className="edit-btn"
              onClick={handleEdit}
            >
              Edit
            </button>
          </div>
        </div>
      )}
      
      {/* Update confirmation popup */}
      {showUpdatePopup && (
        <div className="update-popup-overlay">
          <div className="update-popup">
            <div className="update-popup-content">
              <p>
                {originalDeficitValue !== null 
                  ? <>You've updated today's deficit to <strong>{pendingDeficitValue}</strong> cal, but haven't logged it.</>
                  : <>You've entered <strong>{pendingDeficitValue}</strong> cal deficit, but haven't logged it.</>
                }
              </p>
              <p>Do you want to save it?</p>
              <div className="update-popup-buttons">
                <button 
                  type="button" 
                  className="update-confirm-btn"
                  onClick={handleUpdateConfirm}
                >
                  Yes
                </button>
                <button 
                  type="button" 
                  className="update-cancel-btn"
                  onClick={handleUpdateCancel}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyLogForm; 