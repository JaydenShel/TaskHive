import { useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import '../Style/s_home.css';
import homeImage1 from '../img/TaskHive.jpg';
import trashIcon from '../img/TrashIcon.png';
import { Context } from "../states/LoginContext.jsx";
import { API_BASE_URL } from "../config";

const HomePage = () => {
  const [image, setImage] = useState(null);
  const [style, setStyle] = useState('');
  const [modifiedImage, setModifiedImage] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useContext(Context);
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const [boards, setBoards] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  const fetchBoards = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/fetchBoards/`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username })
      });

      if (response.status <= 400) {
        const data = await response.json();
        // Add mock progress and stats for demonstration
        const enhancedBoards = data.boardInfo.map(board => ({
          ...board,
          progress: Math.floor(Math.random() * 100),
          totalTasks: Math.floor(Math.random() * 20) + 5,
          completedTasks: Math.floor(Math.random() * 15),
          priority: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)]
        }));
        setBoards(enhancedBoards);
      } else {
        console.log("Server error: failed to fetch boards.");
      }
    } catch (err) {
      console.log("Failed to fetch board data:", err);
    }
  }, [username]);

  useEffect(() => {
    const verifyAndFetchBoards = async () => {
      const generateMockActivity = () => {
        const activities = [
          { type: 'task_completed', message: 'Completed "Design Review" in Web Project', time: '2 hours ago' },
          { type: 'board_created', message: 'Created new project "Mobile App Development"', time: '1 day ago' },
          { type: 'task_added', message: 'Added 3 new tasks to "Marketing Campaign"', time: '2 days ago' },
          { type: 'milestone_reached', message: 'Reached 75% completion in "Q4 Goals"', time: '3 days ago' }
        ];
        setRecentActivity(activities);
      };

      try {
        const response = await fetch(`${API_BASE_URL}/auth/`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" }
        });

        if (response.status <= 400) {
          setIsLoggedIn(true);
          await fetchBoards();
          generateMockActivity();
        } else {
          setIsLoggedIn(false);
        }
      } catch (e) {
        console.error("Auth check failed:", e);
        setIsLoggedIn(false);
      }
    };

    verifyAndFetchBoards();
  }, [fetchBoards, setIsLoggedIn]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleStyleChange = (e) => setStyle(e.target.value);

  const handleNewBoard = () => navigate('/create-b');

  const handleImageModification = async () => {
    if (!image || !style) {
      alert('Please upload an image and select a style.');
      return;
    }

    const response = await fetch(`${API_BASE_URL}/auth/`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" }
    });

    if (response.status > 400) {
      console.log("Error verifying user");
      setIsLoggedIn(false);
    }

    const newModifiedImage = `${image}?style=${style}`;
    setModifiedImage(newModifiedImage);
  };

  const deleteBoard = useCallback(async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/deleteBoard/`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, username })
      });

      if (response.status <= 400) {
        fetchBoards();
      } else {
        console.log("Server error deleting board.");
      }
    } catch (err) {
      console.log("Failed to delete board data:", err);
    }
  }, [username, fetchBoards]);

  const getProgressColor = (progress) => {
    if (progress >= 80) return '#28a745';
    if (progress >= 60) return '#ffc107';
    if (progress >= 40) return '#fd7e14';
    return '#dc3545';
  };

  return (
    <div className="homepage">
      {isLoggedIn && (
        <>
          <div className="dashboard-header">
            <h1 className="home_header-font">Welcome back, {username}!</h1>
            <p className="dashboard-subtitle">Here&apos;s what&apos;s happening with your projects</p>
          </div>

          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h3>Total Projects</h3>
                <span className="stat-number">{boards.length}</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <h3>Completed</h3>
                <span className="stat-number">
                  {boards.filter(b => b.progress === 100).length}
                </span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🚧</div>
              <div className="stat-content">
                <h3>In Progress</h3>
                <span className="stat-number">
                  {boards.filter(b => b.progress > 0 && b.progress < 100).length}
                </span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📝</div>
              <div className="stat-content">
                <h3>Total Tasks</h3>
                <span className="stat-number">
                  {boards.reduce((sum, b) => sum + b.totalTasks, 0)}
                </span>
              </div>
            </div>
          </div>

          <div className="dashboard-content">
            <div className="projects-section">
              <div className="section-header">
                <h2>My Projects</h2>
                <button className="new-project-btn" onClick={handleNewBoard}>
                  <span>+</span> New Project
                </button>
              </div>

              <div className="board-compartment">
                {boards.map((board) => (
                  <div
                    className="board-card clickable"
                    key={board.id}
                    onClick={() => navigate(`/board/${board.id}`)}
                  >
                    <div className="board-header">
                      <span className={`priority-badge ${board.priority?.toLowerCase()}`}>
                        {board.priority}
                      </span>
                      <img
                        src={trashIcon}
                        alt="Delete"
                        className="trash-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          const confirmed = window.confirm(`Are you sure you want to delete "${board.name}"?`);
                          if (confirmed) deleteBoard(board.id);
                        }}
                      />
                    </div>

                    <div className="board-content">
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

                      <div className="board-stats">
                        <span className="task-count">
                          {board.completedTasks}/{board.totalTasks} tasks
                        </span>
                        <span className="created-date">
                          {new Date(board.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="board-card add-card">
                  <div className="add-card-content">
                    <div className="add-icon">+</div>
                    <h3>Create New Project</h3>
                    <p>Start organizing your next big idea</p>
                    <button className="create-btn" onClick={handleNewBoard}>
                      Get Started
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="activity-section">
              <h2>Recent Activity</h2>
              <div className="activity-list">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-icon">
                      {activity.type === 'task_completed' && '✅'}
                      {activity.type === 'board_created' && '📋'}
                      {activity.type === 'task_added' && '➕'}
                      {activity.type === 'milestone_reached' && '🎯'}
                    </div>
                    <div className="activity-content">
                      <p>{activity.message}</p>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      <div className="home-info">
        <div className="section intro-section">
          <div className="intro-left">
            <h1 className="home_header-font">TaskHive</h1>
            <p className="home_description-font">
              Automate Tasks, Elevate Team Efficiency
            </p>
            <p className="home_description-font">
              Sign up to create and organize task boards tailored to your projects. Personalize your workspace, manage timelines, and keep everything synced in one place. Your boards are saved to your profile and accessible anytime.
            </p>
            {!isLoggedIn && (
              <div className="cta-buttons">
                <button className="submit-button primary" onClick={() => navigate('/account')}>
                  Get Started Free
                </button>
                <button className="submit-button secondary" onClick={() => navigate('/login')}>
                  Sign In
                </button>
              </div>
            )}
          </div>
          <div className="intro-right">
            <img src={homeImage1} alt="TaskHive Intro" className="intro-image" />
          </div>
        </div>

        {isLoggedIn && (
          <div className="section">
            <h2>AI Image Transformation</h2>
            <p>Transform your project images with AI-powered style filters</p>
            <div className="upload-section">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="image-upload"
              />
              {image && <img src={image} alt="Uploaded preview" className="image-preview" />}
            </div>
            <div className="style-selection">
              <label htmlFor="style">Choose a style:</label>
              <select
                id="style"
                value={style}
                onChange={handleStyleChange}
                className="style-dropdown"
              >
                <option value="">Select a style</option>
                <option value="impressionist">Impressionist</option>
                <option value="cubism">Cubism</option>
                <option value="abstract">Abstract</option>
                <option value="realistic">Realistic</option>
              </select>
            </div>
            <button onClick={handleImageModification} className="transform-button">
              Transform Image
            </button>

            {modifiedImage && (
              <div className="modified-image-section">
                <h2>Transformed Image</h2>
                <img src={modifiedImage} alt="Modified" className="modified-image" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
