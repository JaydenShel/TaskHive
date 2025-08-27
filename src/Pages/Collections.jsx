import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../states/LoginContext';
import { API_BASE_URL } from '../config';
import '../Style/s_collections.css';

function Collections() {
    const [isLoggedIn, setIsLoggedIn] = useContext(Context);
    const [boards, setBoards] = useState([]);
    const [filteredBoards, setFilteredBoards] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('created_at');
    const [sortOrder, setSortOrder] = useState('desc');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    const categories = [
        { id: 'all', name: 'All Projects', color: '#6c757d' },
        { id: 'work', name: 'Work', color: '#007bff' },
        { id: 'personal', name: 'Personal', color: '#28a745' },
        { id: 'study', name: 'Study', color: '#ffc107' },
        { id: 'health', name: 'Health & Fitness', color: '#dc3545' },
        { id: 'finance', name: 'Finance', color: '#17a2b8' }
    ];

    useEffect(() => {
        if (isLoggedIn) {
            fetchBoards();
        }
    }, [isLoggedIn]);

    useEffect(() => {
        filterAndSortBoards();
    }, [boards, searchTerm, selectedCategory, sortBy, sortOrder]);

    const fetchBoards = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/fetchBoards/`, {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ username })
            });

            if (response.status <= 400) {
                const data = await response.json();
                // Add mock categories and progress for demonstration
                const enhancedBoards = data.boardInfo.map(board => ({
                    ...board,
                    category: categories[Math.floor(Math.random() * (categories.length - 1)) + 1].id,
                    progress: Math.floor(Math.random() * 100),
                    totalTasks: Math.floor(Math.random() * 20) + 5,
                    completedTasks: Math.floor(Math.random() * 15)
                }));
                setBoards(enhancedBoards);
            }
        } catch (err) {
            console.log("Failed to fetch board data:", err);
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortBoards = () => {
        let filtered = boards;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(board =>
                board.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(board => board.category === selectedCategory);
        }

        // Sort boards
        filtered.sort((a, b) => {
            let aValue, bValue;
            
            switch (sortBy) {
                case 'name':
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
                case 'progress':
                    aValue = a.progress;
                    bValue = b.progress;
                    break;
                case 'created_at':
                    aValue = new Date(a.created_at);
                    bValue = new Date(b.created_at);
                    break;
                default:
                    aValue = a[sortBy];
                    bValue = b[sortBy];
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        setFilteredBoards(filtered);
    };

    const getCategoryInfo = (categoryId) => {
        return categories.find(cat => cat.id === categoryId) || categories[0];
    };

    const getProgressColor = (progress) => {
        if (progress >= 80) return '#28a745';
        if (progress >= 60) return '#ffc107';
        if (progress >= 40) return '#fd7e14';
        return '#dc3545';
    };

    if (!isLoggedIn) {
        return (
            <div className="collections-container">
                <div className="login-prompt">
                    <h2>Please log in to view your collections</h2>
                    <button onClick={() => navigate('/login')} className="login-btn">
                        Login
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="collections-container">
                <div className="loading">Loading your collections...</div>
            </div>
        );
    }

    return (
        <div className="collections-container">
            <div className="collections-header">
                <h1>Project Collections</h1>
                <p>Organize and manage all your projects in one place</p>
            </div>

            <div className="collections-controls">
                <div className="search-section">
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="filters-section">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="category-filter"
                    >
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="sort-filter"
                    >
                        <option value="created_at">Date Created</option>
                        <option value="name">Name</option>
                        <option value="progress">Progress</option>
                    </select>

                    <button
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="sort-order-btn"
                    >
                        {sortOrder === 'asc' ? '↑' : '↓'}
                    </button>
                </div>
            </div>

            <div className="collections-stats">
                <div className="stat-card">
                    <h3>Total Projects</h3>
                    <span className="stat-number">{boards.length}</span>
                </div>
                <div className="stat-card">
                    <h3>In Progress</h3>
                    <span className="stat-number">
                        {boards.filter(b => b.progress > 0 && b.progress < 100).length}
                    </span>
                </div>
                <div className="stat-card">
                    <h3>Completed</h3>
                    <span className="stat-number">
                        {boards.filter(b => b.progress === 100).length}
                    </span>
                </div>
                <div className="stat-card">
                    <h3>Total Tasks</h3>
                    <span className="stat-number">
                        {boards.reduce((sum, b) => sum + b.totalTasks, 0)}
                    </span>
                </div>
            </div>

            <div className="collections-grid">
                {filteredBoards.map((board) => (
                    <div
                        key={board.id}
                        className="collection-card"
                        onClick={() => navigate(`/board/${board.id}`)}
                    >
                        <div className="card-header">
                            <span className={`category-badge ${board.category}`}>
                                {getCategoryInfo(board.category).name}
                            </span>
                            <span className="created-date">
                                {new Date(board.created_at).toLocaleDateString()}
                            </span>
                        </div>
                        
                        <h3 className="board-name">{board.name}</h3>
                        
                        <div className="progress-section">
                            <div className="progress-bar">
                                <div 
                                    className="progress-fill"
                                    style={{ 
                                        width: `${board.progress}%`,
                                        backgroundColor: getProgressColor(board.progress)
                                    }}
                                ></div>
                            </div>
                            <span className="progress-text">{board.progress}%</span>
                        </div>
                        
                        <div className="task-stats">
                            <span className="task-count">
                                {board.completedTasks}/{board.totalTasks} tasks completed
                            </span>
                        </div>
                        
                        <div className="card-actions">
                            <button 
                                className="view-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/board/${board.id}`);
                                }}
                            >
                                View Project
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredBoards.length === 0 && (
                <div className="empty-state">
                    <h3>No projects found</h3>
                    <p>Try adjusting your search or filters</p>
                    <button onClick={() => navigate('/create-b')} className="create-project-btn">
                        Create New Project
                    </button>
                </div>
            )}
        </div>
    );
}

export default Collections;