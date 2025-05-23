import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../config";
import { loadProfileImage } from "../utils/loadProfileImage";

function Account_Info() {
    const [hasImage, setHasImage] = useState(false);
    const [profileUrl, setProfileUrl] = useState("");
    const [err, setErr] = useState("");

    useEffect(() => {
        async function fetchProfileImage() {
            const result = await loadProfileImage();
            if (result.success) {
                setProfileUrl(result.imageUrl);
                setHasImage(true);
            } else {
                setHasImage(false);
            }
        }

        fetchProfileImage();
    }, []);

    const uploadImage = async () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";

        input.onchange = async (e) => {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append("image", file);

            const res = await fetch(`${API_BASE_URL}/upload-image`, {
                method: "POST",
                credentials: "include",
                include: "credentials",
                body: formData,
            });

            if (res.ok) {
                const { imageUrl } = await res.json();
                setProfileUrl(imageUrl);
                setHasImage(true);
            } else {
                setErr("Failed to upload image.");
            }
        };

        input.click();
    };


    return (
        <div className="account-card">
            <div className="profile-image-container">
                {hasImage && profileUrl ? (
                    <img src={profileUrl} alt="Profile" className="profile-circle" />
                ) : (
                    <div className="profile-placeholder">?</div>
                )}
            </div>

            <h2 className="account-heading">Account Settings</h2>

            <button className="btn purple" onClick={uploadImage}>
                {hasImage ? "Change Image" : "Upload Image"}
            </button>

            <p className="account-text"><strong>Username:</strong> {localStorage.getItem("username")}</p>
            <p className="account-text"><strong>Password:</strong> **********</p>

            {err && <div className="error-box">{err}</div>}
        </div>
    );

}

export default Account_Info;

