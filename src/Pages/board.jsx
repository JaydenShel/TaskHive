import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../Style/s_board.css';
import { API_BASE_URL } from '../config';

const BoardPage = () => {
    const { boardId } = useParams();
    const [boardData, setBoardData] = useState(null);
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    const [showAddColumnModal, setShowAddColumnModal] = useState(false);
    const [selectedColumn, setSelectedColumn] = useState(null);
    const [newTaskData, setNewTaskData] = useState({
        title: '',
        description: '',
        priority: 'Medium',
        dueDate: '',
        assignee: ''
    });
    const [newColumnData, setNewColumnData] = useState({ name: '' });

    useEffect(() => {
        const fetchBoard = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/getBoard`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ boardId }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setBoardData(data);
                }

                const colRes = await fetch(`${API_BASE_URL}/getColumnsAndTasks`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ boardId }),
                });

                if (colRes.ok) {
                    const colData = await colRes.json();
                    setColumns(colData);
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load board data.');
            } finally {
                setLoading(false);
            }
        };

        fetchBoard();
    }, [boardId]);

    const handleAddColumn = async () => {
        if (!newColumnData.name.trim()) return;

        const res = await fetch(`${API_BASE_URL}/addColumn/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ boardId, name: newColumnData.name }),
        });

        if (res.ok) {
            const newColumn = await res.json();
            setColumns([...columns, { ...newColumn, tasks: [] }]);
            setNewColumnData({ name: '' });
            setShowAddColumnModal(false);
        }
    };

    const handleAddTask = async () => {
        if (!newTaskData.title.trim() || !selectedColumn) return;

        const res = await fetch(`${API_BASE_URL}/addTask`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                boardId, 
                columnId: selectedColumn, 
                title: newTaskData.title,
                description: newTaskData.description,
                priority: newTaskData.priority,
                dueDate: newTaskData.dueDate,
                assignee: newTaskData.assignee
            }),
        });

        if (res.ok) {
            const newTask = await res.json();
            setColumns(columns.map(col =>
                col.id === selectedColumn
                    ? { ...col, tasks: [...col.tasks, newTask] }
                    : col
            ));
            setNewTaskData({
                title: '',
                description: '',
                priority: 'Medium',
                dueDate: '',
                assignee: ''
            });
            setShowAddTaskModal(false);
            setSelectedColumn(null);
        }
    };

    const toggleTaskDone = async (taskId, columnId) => {
        const res = await fetch(`${API_BASE_URL}/toggleTaskDone`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taskId }),
        });

        if (res.ok) {
            setColumns(columns.map(col => {
                if (col.id !== columnId) return col;
                return {
                    ...col,
                    tasks: col.tasks.map(task =>
                        task.id === taskId ? { ...task, done: !task.done } : task
                    )
                };
            }));
        }
    };

    const deleteTask = async (taskId, columnId) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;

        // Mock deletion for now - you'll need to implement the backend endpoint
        setColumns(columns.map(col => {
            if (col.id !== columnId) return col;
            return {
                ...col,
                tasks: col.tasks.filter(task => task.id !== taskId)
            };
        }));
    };

    const deleteColumn = async (columnId) => {
        if (!window.confirm('Are you sure you want to delete this column? All tasks will be lost.')) return;

        // Mock deletion for now - you'll need to implement the backend endpoint
        setColumns(columns.filter(col => col.id !== columnId));
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

    if (loading) return (
        <div className="board-page">
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading your board...</p>
            </div>
        </div>
    );
    
    if (error) return (
        <div className="board-page">
            <div className="error-container">
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        </div>
    );

    return (
        <div className="board-page">
            <div className="board-header">
                <div className="board-info">
                    <h1 className="board-title">{boardData?.name || "Unnamed Board"}</h1>
                    <p className="board-description">Manage your tasks and track progress</p>
                </div>
                <div className="board-actions">
                    <button className="add-column-btn" onClick={() => setShowAddColumnModal(true)}>
                        + Add Column
                    </button>
                    <button className="add-task-btn" onClick={() => setShowAddTaskModal(true)}>
                        + Add Task
                    </button>
                </div>
            </div>

            <div className="board-columns">
                {columns.map(column => (
                    <div className="column" key={column.id}>
                        <div className="column-header">
                            <h2>{column.name}</h2>
                            <div className="column-actions">
                                <span className="task-count">{column.tasks.length} tasks</span>
                                <button 
                                    className="delete-column-btn"
                                    onClick={() => deleteColumn(column.id)}
                                    title="Delete column"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                        
                        <div className="column-tasks">
                            {column.tasks.map(task => (
                                <div className={`task ${task.done ? 'done' : ''}`} key={task.id}>
                                    <div className="task-header">
                                        <label className="task-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={task.done}
                                                onChange={() => toggleTaskDone(task.id, column.id)}
                                            />
                                            <span className="checkmark"></span>
                                        </label>
                                        <div className="task-priority">
                                            <span 
                                                className="priority-dot"
                                                style={{ backgroundColor: getPriorityColor(task.priority) }}
                                            ></span>
                                        </div>
                                    </div>
                                    
                                    <div className="task-content">
                                        <h4 className="task-title">{task.title}</h4>
                                        {task.description && (
                                            <p className="task-description">{task.description}</p>
                                        )}
                                        
                                        <div className="task-meta">
                                            {task.assignee && (
                                                <span className="task-assignee">👤 {task.assignee}</span>
                                            )}
                                            {task.dueDate && (
                                                <span className={`task-due-date ${getDueDateStatus(task.dueDate)}`}>
                                                    📅 {new Date(task.dueDate).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <button 
                                        className="delete-task-btn"
                                        onClick={() => deleteTask(task.id, column.id)}
                                        title="Delete task"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            
                            <button 
                                className="add-task-to-column-btn" 
                                onClick={() => {
                                    setSelectedColumn(column.id);
                                    setShowAddTaskModal(true);
                                }}
                            >
                                + Add Task
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Column Modal */}
            {showAddColumnModal && (
                <div className="modal-overlay" onClick={() => setShowAddColumnModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h3>Add New Column</h3>
                        <input
                            type="text"
                            placeholder="Column name"
                            value={newColumnData.name}
                            onChange={(e) => setNewColumnData({ name: e.target.value })}
                            className="modal-input"
                            autoFocus
                        />
                        <div className="modal-actions">
                            <button onClick={() => setShowAddColumnModal(false)} className="cancel-btn">
                                Cancel
                            </button>
                            <button onClick={handleAddColumn} className="confirm-btn">
                                Add Column
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Task Modal */}
            {showAddTaskModal && (
                <div className="modal-overlay" onClick={() => setShowAddTaskModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h3>Add New Task</h3>
                        
                        <div className="form-group">
                            <label>Title *</label>
                            <input
                                type="text"
                                placeholder="Task title"
                                value={newTaskData.title}
                                onChange={(e) => setNewTaskData({...newTaskData, title: e.target.value})}
                                className="modal-input"
                                autoFocus
                            />
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                placeholder="Task description (optional)"
                                value={newTaskData.description}
                                onChange={(e) => setNewTaskData({...newTaskData, description: e.target.value})}
                                className="modal-textarea"
                                rows="3"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Priority</label>
                                <select
                                    value={newTaskData.priority}
                                    onChange={(e) => setNewTaskData({...newTaskData, priority: e.target.value})}
                                    className="modal-select"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Due Date</label>
                                <input
                                    type="date"
                                    value={newTaskData.dueDate}
                                    onChange={(e) => setNewTaskData({...newTaskData, dueDate: e.target.value})}
                                    className="modal-input"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Assignee</label>
                            <input
                                type="text"
                                placeholder="Who should do this task?"
                                value={newTaskData.assignee}
                                onChange={(e) => setNewTaskData({...newTaskData, assignee: e.target.value})}
                                className="modal-input"
                            />
                        </div>

                        <div className="modal-actions">
                            <button onClick={() => setShowAddTaskModal(false)} className="cancel-btn">
                                Cancel
                            </button>
                            <button 
                                onClick={handleAddTask} 
                                className="confirm-btn"
                                disabled={!newTaskData.title.trim()}
                            >
                                Add Task
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BoardPage;
