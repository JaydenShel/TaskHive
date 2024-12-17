import { useState } from 'react';
import '../Style/s_home.css';

// A simple functional component for the homepage
const HomePage = () => {
    const [image, setImage] = useState(null);
    const [style, setStyle] = useState('');
    const [modifiedImage, setModifiedImage] = useState(null);

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

    // Simulate image modification via a ML model (e.g., call to API)
    const handleImageModification = async () => {
        if (!image || !style) {
            alert('Please upload an image and select a style.');
            return;
        }

        // This is where you would call your machine learning API to modify the image.
        // For demonstration purposes, we'll just "fake" a modified image URL.
        // Replace this with the actual API call to your ML model.
        const newModifiedImage = `${image}?style=${style}`;

        setModifiedImage(newModifiedImage);
    };

    return (
        <div className="homepage">
            <h1>SynthAI: Transform Your Images</h1>
            <p>Upload an image and choose a style to transform it using machine learning.</p>

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
    );
};

export default HomePage;