import { useState, useContext } from 'react';
import '../Style/s_home.css';
import {Context} from "../states/LoginContext.jsx";

const HomePage = () => {
    const [image, setImage] = useState(null);
    const [style, setStyle] = useState('');
    const [modifiedImage, setModifiedImage] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useContext(Context);

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
        <div className="homepage">
            <div className={"section"}>
                <h1 className={"home_header-font"}>SynthAI: Transform Your Images</h1>
                <p className={"home_description-font"}>Sign up to upload your own images and customize their style
                    using our integrated machine learning techniques. Save your creations to your profile and access
                    them anytime.</p>
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
    );
};

export default HomePage;