import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../config";

function Account_Info() {
    const navigate = useNavigate();
    const [hasImage, setHasImage] = useState(false);
    const [profileUrl, setProfileUrl] = useState("");
    const [err, setErr] = useState("");

    useEffect(() => {
        loadImage();
    }, []);

    const handlePasswordReset = async () => {
        const res = await fetch(`${API_BASE_URL}/auth/`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });

        if (res.ok) {
            navigate("/reset");
        } else {
            setErr("Not authenticated.");
        }
    };

    const loadImage = async () => {
        const res = await fetch(`${API_BASE_URL}/load-image/`, {
            credentials: "include"
        });

        if (res.ok) {
            const blob = await res.blob();
            setProfileUrl(URL.createObjectURL(blob));
            setHasImage(true);
        } else {
            setHasImage(false);
        }
    };

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
                {hasImage ? (
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

            <button className="btn blue" onClick={handlePasswordReset}>
                Reset Password
            </button>

            {err && <div className="error-box">{err}</div>}
        </div>
    );
}

export default Account_Info;

