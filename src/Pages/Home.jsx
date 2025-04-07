import { useState, useContext, useEffect } from 'react';
import {useNavigate} from "react-router-dom";
import '../Style/s_home.css';
import homeImage1 from '../img/TaskHive.jpg'
import plusIcon from '../img/PlusIcon.png'
import {Context} from "../states/LoginContext.jsx";

const HomePage = () => {
    const [image, setImage] = useState(null);
    const [style, setStyle] = useState('');
    const [modifiedImage, setModifiedImage] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useContext(Context);
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    // Upon loading attempt to load user boards
    useEffect(() => {
        // Prevent unnecessary calls
        if(!isLoggedIn) return

        // Returns a list of board names and creation dates
        const fetchBoards = async () =>{
            try{
                const response = await fetch('http://localhost:3000/fetchBoards', {
                    method: "GET",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({username})
                })
                console.log(response.body)

                if(response.status > 400){
                    console.log("Server error failed to fetch boards.")
                }
            }
            catch(err){
                console.log("Failed to fetch board data:", err)
            }
        }
    }, [isLoggedIn])

    // Handle image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle style selection
    const handleStyleChange = (e) => {
        setStyle(e.target.value);
    };

    const handleNewBoard = () => {
        navigate('/create-b')
    }

    //Simulate image modification via a ML model (FastAPI)
    const handleImageModification = async () => {
        if (!image || !style) {
            alert('Please upload an image and select a style.');
            return;
        }

        //Ensure that the user is logged in and cookie is under proper account
        const response = await fetch("http://localhost:3000/auth/", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if(response.status > 400){
            console.log("Error verifying user")
            setIsLoggedIn(false)
        }

        const newModifiedImage = `${image}?style=${style}`;

        setModifiedImage(newModifiedImage);
    };

    return (
        <div className={"homepage"}>

        {isLoggedIn && (<div>
                <div className={"home_header-font"}>My Boards</div>
                <div>
                    <div className={"board-compartment"}>
                        <div className="board-card">
                            <button className={"submit-button"} onClick={handleNewBoard}>Add</button>
                            <div className="board-name">New Board</div>
                            <div src={plusIcon} alt={"plusIcon"}></div>
                            <div className="board-image" style={{backgroundImage: `url(${image})`}}></div>
                        </div>
                    </div>
                </div>
            </div>
        )}

            <div className="home-info">
            <div className={"section"}>
                <div>
                    <h1 className={"home_header-font"}>TaskHive</h1>
                    <h1 className={"home_description-font"}>Automate Tasks, Elevate Team Efficiency</h1>
                </div>
                <div>
                    <img src={homeImage1} alt={"HomeImg1"}></img>
                </div>
                <div className={"home-text-box"}>
                    <p className={"home_description-font"}>Sign up to upload your own images and customize their style
                        using our integrated machine learning techniques. Save your creations to your profile and access
                        them anytime.</p>
                </div>
                {!isLoggedIn && <button className={"submit-button"} onClick={() => {
                    navigate('/account')
                }}>Sign Up</button>}
            </div>

            <div className={"section2"}>
                <div>
                    <img src={""}></img>
                </div>
            </div>

            {isLoggedIn && (
                <div className={"section"}>
                    <div className="upload-section">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="image-upload"
                        />
                        {image && <img src={image} alt="Uploaded preview" className="image-preview"/>}
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
                            <img src={modifiedImage} alt="Modified" className="modified-image"/>
                        </div>
                    )}
                </div>
            )}

        </div>
        </div>
    );
};

export default HomePage;