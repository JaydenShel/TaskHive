import React, { useState } from 'react';
import '../Style/TaskFilter.css';

const TaskFilter = ({ onFilterChange, onSortChange, totalTasks, completedTasks }) => {
  const [filters, setFilters] = useState({
    priority: 'all',
    assignee: 'all',
    dueDate: 'all',
    status: 'all'
  });

  const [sortBy, setSortBy] = useState('priority');

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (sortType) => {
    setSortBy(sortType);
    onSortChange(sortType);
  };

  const getProgressPercentage = () => {
    if (totalTasks === 0) return 0;
    return Math.round((completedTasks / totalTasks) * 100);
  };

  return (
    <div className="task-filter">
      <div className="filter-header">
        <h3>Task Management</h3>
        <div className="progress-summary">
          <span className="progress-text">
            {completedTasks} of {totalTasks} tasks completed
          </span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
          <span className="progress-percentage">{getProgressPercentage()}%</span>
        </div>
      </div>

      <div className="filter-controls">
        <div className="filter-group">
          <label>Priority:</label>
          <select 
            value={filters.priority} 
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Assignee:</label>
          <select 
            value={filters.assignee} 
            onChange={(e) => handleFilterChange('assignee', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Assignees</option>
            <option value="unassigned">Unassigned</option>
            <option value="me">Assigned to Me</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Due Date:</label>
          <select 
            value={filters.dueDate} 
            onChange={(e) => handleFilterChange('dueDate', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Dates</option>
            <option value="overdue">Overdue</option>
            <option value="due-today">Due Today</option>
            <option value="due-week">Due This Week</option>
            <option value="no-due-date">No Due Date</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Status:</label>
          <select 
            value={filters.status} 
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="sort-controls">
        <label>Sort by:</label>
        <div className="sort-buttons">
          <button 
            className={`sort-btn ${sortBy === 'priority' ? 'active' : ''}`}
            onClick={() => handleSortChange('priority')}
          >
            Priority
          </button>
          <button 
            className={`sort-btn ${sortBy === 'dueDate' ? 'active' : ''}`}
            onClick={() => handleSortChange('dueDate')}
          >
            Due Date
          </button>
          <button 
            className={`sort-btn ${sortBy === 'created' ? 'active' : ''}`}
            onClick={() => handleSortChange('created')}
          >
            Created Date
          </button>
          <button 
            className={`sort-btn ${sortBy === 'assignee' ? 'active' : ''}`}
            onClick={() => handleSortChange('assignee')}
          >
            Assignee
          </button>
        </div>
      </div>

      <div className="filter-actions">
        <button 
          className="clear-filters-btn"
          onClick={() => {
            const defaultFilters = {
              priority: 'all',
              assignee: 'all',
              dueDate: 'all',
              status: 'all'
            };
            setFilters(defaultFilters);
            onFilterChange(defaultFilters);
            setSortBy('priority');
            onSortChange('priority');
          }}
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
};

export default TaskFilter;
