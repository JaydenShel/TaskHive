import { useState, useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import '../Style/s_home.css';
import homeImage1 from '../img/TaskHive.jpg';
import trashIcon from '../img/TrashIcon.png';
import plusIcon from '../img/PlusIcon.png';
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
    const [boardDeleted, setBoardDeleted] = useState();

    useEffect(() => {
        const verifyAndFetchBoards = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/auth/`, {
                    method: "GET",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" }
                });

                if (response.status <= 400) {
                    setIsLoggedIn(true);
                    fetchBoards();
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                setIsLoggedIn(false);
            }
        };

        verifyAndFetchBoards();
    }, []);


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

    const fetchBoards = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/fetchBoards/`, {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ username })
            });

            if (response.status <= 400) {
                const data = await response.json();
                setBoards(data.boardInfo);
            } else {
                console.log("Server error: failed to fetch boards.");
            }
        } catch (err) {
            console.log("Failed to fetch board data:", err);
        }
    };

    const deleteBoard = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/deleteBoard/`, {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ id, username })
            });

            if (response.status <= 400) {
                // Re-fetch boards to update UI after deletion
                fetchBoards();
            } else {
                console.log("Server error deleting board.");
            }
        } catch (err) {
            console.log("Failed to delete board data:", err);
        }
    };


    return (
        <div className="homepage">
            <h1 className="home_header-font">My Boards</h1>

            {isLoggedIn && (
                <div className="board-compartment">
                    {boards.map((board) => (
                        <div className="board-card" key={board.id}>
                            <div className="board-name">{board.name}</div>
                            <img
                                src={trashIcon}
                                alt="Delete"
                                className="trash-icon"
                                onClick={() => deleteBoard(board.id)} // ← now using ID
                            />
                            <div className="board-created-at">
                                {new Date(board.created_at).toLocaleDateString()}
                            </div>
                            <div className="board-image" style={{ backgroundColor: "#f0f0f0" }}></div>
                        </div>
                    ))}


                    <div className="board-card add-card">
                        <button className="submit-button" onClick={handleNewBoard}>Add</button>
                        <div className="board-name">New Board</div>
                        <div className="board-image" style={{ backgroundImage: `url(${image})` }}></div>
                    </div>
                </div>
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
                            <button className="submit-button" onClick={() => navigate('/account')}>
                                Sign Up
                            </button>
                        )}
                    </div>
                    <div className="intro-right">
                        <img src={homeImage1} alt="TaskHive Intro" className="intro-image" />
                    </div>
                </div>

                {isLoggedIn && (
                    <div className="section">
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
