import React, { useState, useRef, useEffect } from 'react';
import { DailyLog } from '../types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, parseISO } from 'date-fns';
import './Calendar.css';

interface CalendarProps {
  logs: DailyLog[];
  onLogSubmit: (log: DailyLog) => void;
  currentWeight: number;
}

const Calendar: React.FC<CalendarProps> = ({ logs, onLogSubmit, currentWeight }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showLogForm, setShowLogForm] = useState(false);
  const [deficit, setDeficit] = useState('');
  const deficitInputRef = useRef<HTMLInputElement>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getLogForDate = (date: Date) => {
    return logs.find(log => isSameDay(parseISO(log.date), date));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const existingLog = getLogForDate(date);
    if (existingLog && existingLog.deficit !== null) {
      setDeficit(existingLog.deficit.toString());
    } else {
      setDeficit('');
    }
    setShowLogForm(true);
  };

  const handleRemoveEntry = (date: Date, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the form
    const logToRemove = getLogForDate(date);
    if (logToRemove) {
      // Create a removal log with null deficit
      const removeLog: DailyLog = {
        date: format(date, 'yyyy-MM-dd'),
        deficit: null,
        weight: null
      };
      onLogSubmit(removeLog);
    }
  };

  // Focus the input field when the form is shown
  useEffect(() => {
    if (showLogForm && deficitInputRef.current) {
      // Small delay to ensure the form is rendered
      setTimeout(() => {
        deficitInputRef.current?.focus();
      }, 100);
    }
  }, [showLogForm, selectedDate]);

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate) {
      const log: DailyLog = {
        date: format(selectedDate, 'yyyy-MM-dd'),
        deficit: parseInt(deficit),
        weight: null
      };
      onLogSubmit(log);
      setShowLogForm(false);
      setSelectedDate(null);
      setDeficit('');
    }
  };

  const handleCancel = () => {
    setShowLogForm(false);
    setSelectedDate(null);
    setDeficit('');
  };

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const getDayClass = (date: Date) => {
    const log = getLogForDate(date);
    const isToday = isSameDay(date, new Date());
    const isCurrentMonth = isSameMonth(date, currentDate);
    const isSelected = selectedDate && isSameDay(date, selectedDate);
    
    let className = 'calendar-day';
    if (!isCurrentMonth) className += ' other-month';
    if (isToday) className += ' today';
    if (isSelected) className += ' selected';
    if (log && log.deficit !== null && log.deficit !== 0) className += ' has-log';
    if (log && log.deficit !== null && log.deficit < 0) className += ' negative-deficit';
    
    return className;
  };

  return (
    <div className="calendar">
      <h3>📅 Calendar Log</h3>
      
      <div className="calendar-header">
        <button onClick={handlePreviousMonth} className="month-nav-btn">
          ←
        </button>
        <h4>{format(currentDate, 'MMMM yyyy')}</h4>
        <button onClick={handleNextMonth} className="month-nav-btn">
          →
        </button>
      </div>

      <div className="calendar-grid">
        <div className="calendar-weekdays">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>
        
        <div className="calendar-days">
          {days.map((day, index) => {
            const log = getLogForDate(day);
            const isToday = isSameDay(day, new Date());
            return (
              <div
                key={index}
                className={getDayClass(day)}
                onClick={() => handleDateClick(day)}
              >
                <span className="day-number">
                  {format(day, 'd')}
                  {isToday && <span className="today-marker">●</span>}
                </span>
                {log && log.deficit !== null && log.deficit !== 0 && (
                  <div className="day-log">
                    <div className={`log-deficit ${log.deficit < 0 ? 'negative' : ''}`}>
                      {log.deficit} cal
                    </div>
                    <button 
                      className="remove-entry-btn"
                      onClick={(e) => handleRemoveEntry(day, e)}
                      title="Remove entry"
                    >
                      ➖
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showLogForm && selectedDate && (
        <div className="calendar-log-form">
          <h4>Log Entry for {format(selectedDate, 'MMMM d, yyyy')}</h4>
          <form onSubmit={handleLogSubmit}>
            <div className="form-group">
              <label htmlFor="calendar-deficit">Calorie Deficit</label>
              <input
                ref={deficitInputRef}
                type="number"
                id="calendar-deficit"
                value={deficit}
                onChange={(e) => setDeficit(e.target.value)}
                required
                placeholder="Enter deficit"
              />
              <small>calories (negative if you ate more than burned)</small>
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn">
                Save Entry
              </button>
              <button 
                type="button" 
                className="cancel-btn"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="calendar-legend">
        <div className="legend-item">
          <div className="legend-color has-log"></div>
          <span>Positive Deficit</span>
        </div>
        <div className="legend-item">
          <div className="legend-color negative-deficit"></div>
          <span>Negative Deficit</span>
        </div>
        <div className="legend-item">
          <div className="legend-color other-month"></div>
          <span>Other Month</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar; 