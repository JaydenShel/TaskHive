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
        const name = prompt("Column name:");
        if (!name) return;

        const res = await fetch(`${API_BASE_URL}/addColumn/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ boardId, name }),
        });

        if (res.ok) {
            const newColumn = await res.json();
            setColumns([...columns, { ...newColumn, tasks: [] }]);
        }
    };

    const handleAddTask = async (columnId) => {
        const title = prompt("Task title:");
        if (!title) return;

        let priority = prompt("Priority (Low, Medium, High):", "Medium");
        priority = priority?.charAt(0).toUpperCase() + priority?.slice(1).toLowerCase();
        if (!['Low', 'Medium', 'High'].includes(priority)) {
            alert('Invalid priority. Defaulting to Medium.');
            priority = 'Medium';
        }

        const res = await fetch(`${API_BASE_URL}/addTask`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ boardId, columnId, title, priority }),
        });

        if (res.ok) {
            const newTask = await res.json();
            setColumns(columns.map(col =>
                col.id === columnId
                    ? { ...col, tasks: [...col.tasks, newTask] }
                    : col
            ));
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

    if (loading) return <div className="board-page"><p>Loading...</p></div>;
    if (error) return <div className="board-page"><p>{error}</p></div>;

    return (
        <div className="board-page">
            <h1 className="board-title">{boardData?.name || "Unnamed Board"}</h1>
            <button className="add-column-btn" onClick={handleAddColumn}>+ Add Column</button>
            <div className="board-columns">
                {columns.map(column => (
                    <div className="column" key={column.id}>
                        <h2>{column.name}</h2>
                        {column.tasks.map(task => (
                            <div className={`task ${task.done ? 'done' : ''}`} key={task.id}>
                                <label className="task-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={task.done}
                                        onChange={() => toggleTaskDone(task.id, column.id)}
                                    />
                                    <span>{task.title}</span>
                                </label>
                                <span className={`priority-badge ${task.priority?.toLowerCase()}`}>
                                    {task.priority}
                                </span>
                            </div>
                        ))}
                        <button className="add-task-btn" onClick={() => handleAddTask(column.id)}>+ Add Task</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BoardPage;
