import React, { useState } from 'react';
import Task from './Task';
import '../Style/Column.css';

const Column = ({ 
  column, 
  onAddTask, 
  onDeleteColumn, 
  onToggleTaskDone, 
  onDeleteTask, 
  onUpdateTask,
  onDragStart,
  onDrop,
  onDragOver,
  onDragLeave
}) => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskData, setNewTaskData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: '',
    assignee: ''
  });

  const handleAddTask = async () => {
    if (!newTaskData.title.trim()) return;

    try {
      await onAddTask(column.id, newTaskData);
      setNewTaskData({
        title: '',
        description: '',
        priority: 'Medium',
        dueDate: '',
        assignee: ''
      });
      setShowAddTask(false);
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const sourceColumnId = e.dataTransfer.getData('sourceColumnId');
    
    if (taskId && sourceColumnId !== column.id) {
      onDrop(taskId, column.id, column.tasks.length);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    onDragOver(column.id);
  };

  const handleDragLeave = () => {
    onDragLeave(column.id);
  };

  return (
    <div 
      className="column"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className="column-header">
        <h2 className="column-title">{column.name}</h2>
        <div className="column-actions">
          <span className="task-count">{column.tasks.length} tasks</span>
          <button 
            className="delete-column-btn"
            onClick={() => onDeleteColumn(column.id)}
            title="Delete column"
          >
            🗑️
          </button>
        </div>
      </div>
      
      <div className="column-tasks">
        {column.tasks.map((task, index) => (
          <Task
            key={task.id}
            task={task}
            onToggleDone={onToggleTaskDone}
            onDelete={onDeleteTask}
            onUpdate={onUpdateTask}
            onDragStart={onDragStart}
          />
        ))}
        
        {showAddTask ? (
          <div className="add-task-form">
            <input
              type="text"
              placeholder="Task title"
              value={newTaskData.title}
              onChange={(e) => setNewTaskData({...newTaskData, title: e.target.value})}
              className="task-title-input"
              autoFocus
            />
            
            <textarea
              placeholder="Description (optional)"
              value={newTaskData.description}
              onChange={(e) => setNewTaskData({...newTaskData, description: e.target.value})}
              className="task-description-input"
              rows="2"
            />
            
            <div className="task-meta-inputs">
              <select
                value={newTaskData.priority}
                onChange={(e) => setNewTaskData({...newTaskData, priority: e.target.value})}
                className="priority-select"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              
              <input
                type="date"
                value={newTaskData.dueDate}
                onChange={(e) => setNewTaskData({...newTaskData, dueDate: e.target.value})}
                className="date-input"
              />
              
              <input
                type="text"
                placeholder="Assignee"
                value={newTaskData.assignee}
                onChange={(e) => setNewTaskData({...newTaskData, assignee: e.target.value})}
                className="assignee-input"
              />
            </div>
            
            <div className="add-task-actions">
              <button 
                onClick={handleAddTask} 
                className="add-btn"
                disabled={!newTaskData.title.trim()}
              >
                Add Task
              </button>
              <button 
                onClick={() => setShowAddTask(false)} 
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button 
            className="add-task-to-column-btn" 
            onClick={() => setShowAddTask(true)}
          >
            + Add Task
          </button>
        )}
      </div>
    </div>
  );
};

export default Column;
