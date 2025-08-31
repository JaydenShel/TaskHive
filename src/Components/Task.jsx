import React, { useState } from 'react';
import '../Style/Task.css';

const Task = ({ 
  task, 
  onToggleDone, 
  onDelete, 
  onUpdate, 
  onDragStart,
  isDragging = false 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description || '',
    priority: task.priority || 'Medium',
    dueDate: task.due_date ? task.due_date.split('T')[0] : '',
    assignee: task.assigned_to || ''
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await onUpdate(task.id, editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleCancel = () => {
    setEditData({
      title: task.title,
      description: task.description || '',
      priority: task.priority || 'Medium',
      dueDate: task.due_date ? task.due_date.split('T')[0] : '',
      assignee: task.assigned_to || ''
    });
    setIsEditing(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#dc3545';
      case 'Medium': return '#ffc107';
      case 'Low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getDueDateStatus = (dueDate) => {
    if (!dueDate) return 'no-due-date';
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'overdue';
    if (diffDays <= 3) return 'due-soon';
    return 'on-time';
  };

  const formatDueDate = (dueDate) => {
    if (!dueDate) return '';
    const date = new Date(dueDate);
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    return `In ${diffDays} days`;
  };

  if (isEditing) {
    return (
      <div className={`task editing ${isDragging ? 'dragging' : ''}`}>
        <div className="task-edit-form">
          <input
            type="text"
            value={editData.title}
            onChange={(e) => setEditData({...editData, title: e.target.value})}
            className="edit-title-input"
            placeholder="Task title"
            autoFocus
          />
          
          <textarea
            value={editData.description}
            onChange={(e) => setEditData({...editData, description: e.target.value})}
            className="edit-description-input"
            placeholder="Description (optional)"
            rows="2"
          />
          
          <div className="edit-meta">
            <select
              value={editData.priority}
              onChange={(e) => setEditData({...editData, priority: e.target.value})}
              className="edit-priority-select"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            
            <input
              type="date"
              value={editData.dueDate}
              onChange={(e) => setEditData({...editData, dueDate: e.target.value})}
              className="edit-date-input"
            />
            
            <input
              type="text"
              value={editData.assignee}
              onChange={(e) => setEditData({...editData, assignee: e.target.value})}
              className="edit-assignee-input"
              placeholder="Assignee"
            />
          </div>
          
          <div className="edit-actions">
            <button onClick={handleSave} className="save-btn" disabled={!editData.title.trim()}>
              Save
            </button>
            <button onClick={handleCancel} className="cancel-btn">
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`task ${task.done ? 'done' : ''} ${isDragging ? 'dragging' : ''}`}
      draggable
      onDragStart={(e) => onDragStart(e, task)}
    >
      <div className="task-header">
        <label className="task-checkbox">
          <input
            type="checkbox"
            checked={task.done}
            onChange={() => onToggleDone(task.id)}
          />
          <span className="checkmark"></span>
        </label>
        
        <div className="task-priority">
          <span 
            className="priority-dot"
            style={{ backgroundColor: getPriorityColor(task.priority) }}
            title={task.priority}
          ></span>
        </div>
        
        <div className="task-actions">
          <button 
            className="edit-task-btn"
            onClick={handleEdit}
            title="Edit task"
          >
            ✏️
          </button>
          <button 
            className="delete-task-btn"
            onClick={() => onDelete(task.id)}
            title="Delete task"
          >
            ×
          </button>
        </div>
      </div>
      
      <div className="task-content" onClick={handleEdit}>
        <h4 className="task-title">{task.title}</h4>
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
        
        <div className="task-meta">
          {task.assigned_to && (
            <span className="task-assignee" title={`Assigned to: ${task.assigned_to}`}>
              👤 {task.assigned_to}
            </span>
          )}
          {task.due_date && (
            <span 
              className={`task-due-date ${getDueDateStatus(task.due_date)}`}
              title={`Due: ${new Date(task.due_date).toLocaleDateString()}`}
            >
              📅 {formatDueDate(task.due_date)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Task;
