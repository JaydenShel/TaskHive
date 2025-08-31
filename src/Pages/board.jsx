import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import '../Style/s_board.css';
import { API_BASE_URL } from '../config';
import Column from '../Components/Column';
import TaskFilter from '../Components/TaskFilter';

const BoardPage = () => {
    const { boardId } = useParams();
    const [boardData, setBoardData] = useState(null);
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddColumnModal, setShowAddColumnModal] = useState(false);
    const [newColumnData, setNewColumnData] = useState({ name: '' });
    const [filters, setFilters] = useState({
        priority: 'all',
        assignee: 'all',
        dueDate: 'all',
        status: 'all'
    });
    const [sortBy, setSortBy] = useState('priority');
    const [dragOverColumn, setDragOverColumn] = useState(null);

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



    const handleAddTask = async (columnId, taskData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/addTask`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    boardId, 
                    columnId, 
                    title: taskData.title,
                    description: taskData.description,
                    priority: taskData.priority,
                    dueDate: taskData.dueDate,
                    assignee: taskData.assignee
                }),
            });

            if (response.ok) {
                const newTask = await response.json();
                setColumns(columns.map(col =>
                    col.id === columnId
                        ? { ...col, tasks: [...col.tasks, newTask] }
                        : col
                ));
                return newTask;
            } else {
                throw new Error('Failed to add task');
            }
        } catch (error) {
            console.error('Error adding task:', error);
            throw error;
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



    const deleteColumn = async (columnId) => {
        if (!window.confirm('Are you sure you want to delete this column? All tasks will be lost.')) return;

        // Mock deletion for now - you'll need to implement the backend endpoint
        setColumns(columns.filter(col => col.id !== columnId));
    };

    const updateTask = async (taskId, taskData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/updateTask`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    taskId,
                    title: taskData.title,
                    description: taskData.description,
                    priority: taskData.priority,
                    dueDate: taskData.dueDate,
                    assignee: taskData.assignee
                }),
            });

            if (response.ok) {
                const updatedTask = await response.json();
                setColumns(columns.map(col => ({
                    ...col,
                    tasks: col.tasks.map(task =>
                        task.id === taskId ? { ...task, ...updatedTask } : task
                    )
                })));
                return updatedTask;
            } else {
                throw new Error('Failed to update task');
            }
        } catch (error) {
            console.error('Error updating task:', error);
            throw error;
        }
    };

    const deleteTask = async (taskId) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;

        try {
            const response = await fetch(`${API_BASE_URL}/deleteTask`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ taskId }),
            });

            if (response.ok) {
                setColumns(columns.map(col => ({
                    ...col,
                    tasks: col.tasks.filter(task => task.id !== taskId)
                })));
            } else {
                throw new Error('Failed to delete task');
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const handleDragStart = (e, task) => {
        e.dataTransfer.setData('taskId', task.id);
        e.dataTransfer.setData('sourceColumnId', task.column_id);
    };

    const handleDrop = async (taskId, newColumnId, newPosition) => {
        try {
            const response = await fetch(`${API_BASE_URL}/updateTaskPosition`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ taskId, newColumnId, newPosition }),
            });

            if (response.ok) {
                // Refresh the board data to get updated positions
                const colRes = await fetch(`${API_BASE_URL}/getColumnsAndTasks`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ boardId }),
                });

                if (colRes.ok) {
                    const colData = await colRes.json();
                    setColumns(colData);
                }
            } else {
                throw new Error('Failed to update task position');
            }
        } catch (error) {
            console.error('Error updating task position:', error);
        }
    };

    const handleDragOver = (columnId) => {
        setDragOverColumn(columnId);
    };

    const handleDragLeave = () => {
        setDragOverColumn(null);
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const handleSortChange = (newSortBy) => {
        setSortBy(newSortBy);
    };

    const getFilteredAndSortedColumns = () => {
        let filteredColumns = columns.map(col => ({
            ...col,
            tasks: col.tasks.filter(task => {
                // Apply filters
                if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
                if (filters.status !== 'all') {
                    if (filters.status === 'completed' && !task.done) return false;
                    if (filters.status === 'pending' && task.done) return false;
                }
                if (filters.assignee !== 'all') {
                    if (filters.assignee === 'unassigned' && task.assigned_to) return false;
                    if (filters.assignee === 'me' && task.assigned_to !== localStorage.getItem('username')) return false;
                }
                if (filters.dueDate !== 'all') {
                    if (!task.due_date) {
                        if (filters.dueDate !== 'no-due-date') return false;
                    } else {
                        const today = new Date();
                        const due = new Date(task.due_date);
                        const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
                        
                        if (filters.dueDate === 'overdue' && diffDays >= 0) return false;
                        if (filters.dueDate === 'due-today' && diffDays !== 0) return false;
                        if (filters.dueDate === 'due-week' && (diffDays < 0 || diffDays > 7)) return false;
                    }
                }
                return true;
            })
        }));

        // Apply sorting
        filteredColumns.forEach(col => {
            col.tasks.sort((a, b) => {
                switch (sortBy) {
                    case 'priority':
                        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
                        return priorityOrder[b.priority] - priorityOrder[a.priority];
                    case 'dueDate':
                        if (!a.due_date && !b.due_date) return 0;
                        if (!a.due_date) return 1;
                        if (!b.due_date) return -1;
                        return new Date(a.due_date) - new Date(b.due_date);
                    case 'created':
                        return new Date(b.created_at) - new Date(a.created_at);
                    case 'assignee':
                        return (a.assigned_to || '').localeCompare(b.assigned_to || '');
                    default:
                        return 0;
                }
            });
        });

        return filteredColumns;
    };

    const getTotalTasks = () => columns.reduce((sum, col) => sum + col.tasks.length, 0);
    const getCompletedTasks = () => columns.reduce((sum, col) => sum + col.tasks.filter(task => task.done).length, 0);



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
                </div>
            </div>

            <TaskFilter
                onFilterChange={handleFilterChange}
                onSortChange={handleSortChange}
                totalTasks={getTotalTasks()}
                completedTasks={getCompletedTasks()}
            />

            <div className="board-columns">
                {getFilteredAndSortedColumns().map(column => (
                    <Column
                        key={column.id}
                        column={column}
                        onAddTask={handleAddTask}
                        onDeleteColumn={deleteColumn}
                        onToggleTaskDone={toggleTaskDone}
                        onDeleteTask={deleteTask}
                        onUpdateTask={updateTask}
                        onDragStart={handleDragStart}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                    />
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


        </div>
    );
};

export default BoardPage;
